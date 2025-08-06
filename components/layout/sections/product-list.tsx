"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/sbClient";
import { ProductCard } from "@/components/ui/product-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, TrendingUp } from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ProductsResponse } from "@/lib/types";
import Link from "next/link";
import Autoplay from 'embla-carousel-autoplay';

const Carousel = dynamic(() => import("@/components/ui/carousel").then(mod => ({ 
  default: mod.Carousel 
})), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const CarouselContent = dynamic(() => import("@/components/ui/carousel").then(mod => ({ 
  default: mod.CarouselContent 
})));
const CarouselItem = dynamic(() => import("@/components/ui/carousel").then(mod => ({ 
  default: mod.CarouselItem 
})));
const CarouselNext = dynamic(() => import("@/components/ui/carousel").then(mod => ({ 
  default: mod.CarouselNext 
})));
const CarouselPrevious = dynamic(() => import("@/components/ui/carousel").then(mod => ({ 
  default: mod.CarouselPrevious 
})));

interface OptimizedImageProps {
  src: string;
  alt: string;
  isLCP?: boolean;
  className?: string;
  dimensions?: string;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  isLCP = false, 
  className = "",
  dimensions = "400x400"
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError || !src) {
    return (
      <div
        className={`flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800 ${className}`}
        aria-label="Resim Yok"
        role="img"
      >
        <span className="text-xs">Resim Yok</span>
      </div>
    );
  }

  return (
    <img
      src={`${src}?w=400&h=400&fit=crop&q=80`}
      srcSet={`
        ${src}?w=200&h=200&fit=crop&q=80 200w,
        ${src}?w=400&h=400&fit=crop&q=80 400w,
        ${src}?w=600&h=600&fit=crop&q=80 600w
      `}
      sizes="(max-width: 640px) 186px, (max-width: 1024px) 300px, 400px"
      alt={alt}
      loading={isLCP ? "eager" : "lazy"}
      fetchPriority={isLCP ? "high" : "auto"}
      className={className}
      onError={() => setImageError(true)}
      aria-label={alt}
    />
  );
};

export const ProductList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoplay = Autoplay
  const currentPage = useMemo(
    () => Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
    [searchParams]
  );
  const pageSize = useMemo(
    () => parseInt(searchParams.get("limit") || "12"),
    [searchParams]
  );

  const {
    data: products,
    isLoading: loading,
  } = useQuery<ProductsResponse>({
    queryKey: ["products", currentPage, pageSize],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_shop_products", {
        page_limit: pageSize,
        page_offset: currentPage * pageSize,
      });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const pagination = products?.pagination ?? (products as any)?.pagination;
  const productsList = products?.products ?? (products as any)?.products;
  const userAuthenticated = products?.user_authenticated ?? (products as any)?.user_authenticated;

  const totalPages = useMemo(
    () =>
      pagination
        ? Math.ceil(pagination.total_count / pageSize)
        : 0,
    [pagination, pageSize]
  );

  const updateURL = useCallback(
    (newPage: number, newPageSize?: number) => {
      const params = new URLSearchParams(searchParams);
      if (newPage === 0) {
        params.delete("page");
      } else {
        params.set("page", (newPage + 1).toString());
      }
      if (newPageSize !== undefined) {
        if (newPageSize === 10) {
          params.delete("limit");
        } else {
          params.set("limit", newPageSize.toString());
        }
      }
      const newUrl = params.toString()
        ? `/magaza?${params.toString()}`
        : "/magaza?page=1&limit=12";
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  const {
    data: popular = [],
    isLoading: loadingPopular,
  } = useQuery<any[]>({
    queryKey: ["popularProducts"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_popular_simple", {
        max_results: 8,
      });
      return data?.products || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const handleNextPage = useCallback(() => {
    if (products?.pagination?.has_next) {
      updateURL(currentPage + 1);
    }
  }, [products?.pagination?.has_next, currentPage, updateURL]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      updateURL(currentPage - 1);
    }
  }, [currentPage, updateURL]);

  const handlePageSizeChange = useCallback(
    (newSize: string) => {
      const newPageSize = Number(newSize);
      updateURL(0, newPageSize);
    },
    [updateURL]
  );

  const handlePageJump = useCallback(
    (pageNumber: number) => {
      updateURL(pageNumber);
    },
    [updateURL]
  );

  if (loading || !products) {
    return (
      <section
        className="container flex flex-col items-center justify-center mx-auto min-h-screen"
        aria-busy="true"
        aria-live="polite"
        aria-label="Ürün Listesi Yükleniyor"
      >
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Ürün listesi yükleniyor...</p>
      </section>
    );
  }

  return (
    <section
      id="product"
      className="container"
      aria-label="Ürünlerimiz"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ürünlerimiz</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Kalite ve değer açısından özenle seçilmiş, özel ürün koleksiyonumuzu keşfedin.
        </p>
      </div>

      {popular.length > 0 && (
        <div className="mb-8" aria-label="Popüler Ürünler">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" aria-hidden="true" />
            <h3 className="text-xl font-semibold">Popüler Ürünler</h3>
          </div>
          
          <div>
            <Carousel
              plugins={autoplay ? [autoplay({ delay: 3000, stopOnInteraction: true })] : []}
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              className="w-full"
              aria-label="Popüler Ürünler Karuseli"
              role="region"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {popular.map((product, index) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4"
                    aria-label={`Popüler ürün: ${product.title}`}
                  >
                    <div className="group cursor-pointer">
                      <Link 
                        href={`/magaza/${product.id}`}
                        prefetch={true}
                        aria-label={`${product.title} ürün detayına git`}
                      >
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-2">
                          <OptimizedImage
                            src={product.image}
                            alt={product.title}
                            isLCP={index === 0}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                      <p
                        className="text-sm font-medium truncate"
                        title={product.title}
                      >
                        {product.title}
                      </p>
                      <p className="text-sm text-muted-foreground font-semibold">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 lg:hidden" aria-label="Önceki ürünler" />
              <CarouselNext className="hidden sm:flex -right-4 lg:hidden" aria-label="Sonraki ürünler" />
            </Carousel>
            <div className="flex justify-center mt-2 sm:hidden">
              <p className="text-xs text-muted-foreground" aria-hidden="true">
                ← Kaydırarak daha fazla ürün görebilirsiniz →
              </p>
            </div>
          </div>
        </div>
      )}

      {pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={pagination.total_count}
          hasNextPage={pagination.has_next}
          loading={loading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
          aria-label="Sayfa Kontrolleri"
        />
      )}

      {productsList && productsList.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          aria-label="Ürün Listesi"
        >
          {productsList.map((product: any, index: number) => (
            <ProductCard
              key={product.id}
              product={product}
              userAuthenticated={userAuthenticated}
              aria-label={`${product.title} ürün kartı`}
            />
          ))}
        </div>
      ) : (
        <Alert className="my-8" role="alert" aria-live="polite">
          <AlertDescription className="text-center py-8">
            <div className="text-6xl mb-4" aria-hidden="true">🛍️</div>
            <h3 className="text-lg font-semibold mb-2">Ürün bulunamadı</h3>
            <p className="text-muted-foreground">
              Aramanızı değiştirin veya daha sonra tekrar kontrol edin.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={pagination.total_count}
          hasNextPage={pagination.has_next}
          loading={loading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
          aria-label="Sayfa Kontrolleri"
        />
      )}
    </section>
  );
};