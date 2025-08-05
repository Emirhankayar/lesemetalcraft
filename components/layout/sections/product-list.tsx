"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/sbClient";
import { ProductCard } from "@/components/ui/product-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ProductsResponse } from "@/lib/types";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const ProductList = () => {
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Math.max(
    0,
    parseInt(searchParams.get("page") || "1") - 1
  );
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const updateURL = (newPage: number, newPageSize?: number) => {
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
  };
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase.rpc("get_shop_products", {
          page_limit: pageSize,
          page_offset: currentPage * pageSize,
        });

        if (data) {
          setProducts(data as ProductsResponse);
        }

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await supabase.rpc("get_popular_simple", {
          max_results: 8,
        });
        if (data?.products) {
          setPopular(data.products);
        }
      } catch (err) {
        console.error("Error fetching popular products:", err);
      }
    };
    fetchPopular();
  }, []);

  const handleNextPage = () => {
    if (products?.pagination?.has_next) {
      updateURL(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      updateURL(currentPage - 1);
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    const newPageSize = Number(newSize);
    updateURL(0, newPageSize);
  };
  const handlePageJump = (pageNumber: number) => {
    updateURL(pageNumber);
  };
  const totalPages = products?.pagination
    ? Math.ceil(products.pagination.total_count / pageSize)
    : 0;

  if (loading || !products) {
    return (
      <section className="container flex flex-col items-center justify-center mx-auto max-w-6xl min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Ürün listesi yükleniyor...</p>
      </section>
    );
  }

  return (
    <section id="product" className="container mx-auto px-4 py-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ürünlerimiz</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Kalite ve değer açısından özenle seçilmiş, özel ürün koleksiyonumuzu keşfedin.
        </p>
      </div>

      {popular.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-semibold">Popüler Ürünler</h3>
          </div>
          {/* Carousel for Popular */}
          <div className="">
            <Carousel
              plugins={[autoplayPlugin.current]}
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              className="w-full"
              onMouseEnter={() => autoplayPlugin.current.stop()}
              onMouseLeave={() => autoplayPlugin.current.reset()}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {popular.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4"
                  >
                    <div className="group cursor-pointer">
                      <Link
                        href={`/magaza/${product.id}`}
                      >

                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-2">
                        {product.image ? (
                          
                          <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs">Resim Yok</span>
                          </div>
                        )}
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
              <CarouselPrevious className="hidden sm:flex -left-4 lg:hidden" />
              <CarouselNext className="hidden sm:flex -right-4 lg:hidden" />
            </Carousel>
            <div className="flex justify-center mt-2 sm:hidden">
              <p className="text-xs text-muted-foreground">
                ← Kaydırarak daha fazla ürün görebilirsiniz →
              </p>
            </div>
          </div>
        </div>
      )}

      {products?.pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={products.pagination.total_count}
          hasNextPage={products.pagination.has_next}
          loading={loading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
        />
      )}

      {/* Products Grid */}
      {products?.products?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.products.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              userAuthenticated={products.user_authenticated}
            />
          ))}
        </div>
      ) : (
        <Alert className="my-8">
          <AlertDescription className="text-center py-8">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-lg font-semibold mb-2">Ürün bulunamadı</h3>
            <p className="text-muted-foreground">
              Aramanızı değiştirin veya daha sonra tekrar kontrol edin.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Pagination */}
      {products?.pagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={products.pagination.total_count}
          hasNextPage={products.pagination.has_next}
          loading={loading}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onPageSizeChange={handlePageSizeChange}
          onPageJump={handlePageJump}
        />
      )}
    </section>
  );
};
