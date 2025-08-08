"use client";
import { memo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/lib/sbClient";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import  OptimizedImage from "@/components/ui/optimized-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PopularProductsSkeleton } from "@/components/alerts/skeletons";
const PopularProductItem = memo(
  ({
    product,
    index,
    isLCP = false,
  }: {
    product: any;
    index: number;
    isLCP?: boolean;
  }) => {
    const formattedPrice = `${product.price.toLocaleString("tr-TR")} ₺`;
    const shouldPrefetch = index < 4;

    return (
      <div className="group cursor-pointer">
        <Link
          href={`/magaza/${product.id}`}
          prefetch={shouldPrefetch}
          aria-label={`${product.title} ürün detayına git`}
        >
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-2">
            < OptimizedImage
              src={product.image}
              alt={product.title}
              isLCP={isLCP}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>
        <p className="text-sm font-medium truncate" title={product.title}>
          {product.title}
        </p>
        <p className="text-sm text-muted-foreground font-semibold">
          {formattedPrice}
        </p>
      </div>
    );
  }
);

PopularProductItem.displayName = "PopularProductItem";

interface PopularProductsProps {
  maxResults?: number;
  autoplayDelay?: number;
}

const PopularProducts = memo(
  ({ maxResults = 8, autoplayDelay = 3000 }: PopularProductsProps) => {
    const autoplayPlugin = Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    });

    const { data: popular = [] } = useQuery<any[]>({
      queryKey: ["popularProducts", maxResults],
      queryFn: async () => {
        const { data } = await supabase.rpc("get_popular_simple", {
          max_results: maxResults,
        });
        return data?.products || [];
      },
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      placeholderData: keepPreviousData, 
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    });


    if (popular.length === 0) {
      return <PopularProductsSkeleton />;
    }

    return (
      <div className="mb-8" aria-label="Popüler Ürünler">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" aria-hidden="true" />
          <h3 className="text-xl font-semibold">Popüler Ürünler</h3>
        </div>

        <div>
          <Carousel
            plugins={[autoplayPlugin]}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: "trimSnaps",
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
                  <PopularProductItem
                    product={product}
                    index={index}
                    isLCP={index === 0}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className="hidden sm:flex -left-4 lg:hidden"
              aria-label="Önceki ürünler"
            />
            <CarouselNext
              className="hidden sm:flex -right-4 lg:hidden"
              aria-label="Sonraki ürünler"
            />
          </Carousel>
          <div className="flex justify-center mt-2 sm:hidden">
            <p className="text-xs text-muted-foreground" aria-hidden="true">
              ← Kaydırarak daha fazla ürün görebilirsiniz →
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PopularProducts.displayName = "PopularProducts";
export default PopularProducts;