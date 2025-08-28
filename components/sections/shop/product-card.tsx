import Link from "next/link";
import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ShoppingCart, Star, MessageCircle } from "lucide-react";
import { ProductCardProps } from "@/lib/types";
import OptimizedImage from "@/components/ui/optimized-image";

interface OptimizedProductCardProps extends ProductCardProps {
  isLCP?: boolean;
  priority?: boolean;
}

const ProductCard = memo(
  ({
    product,
    userAuthenticated,
    isLCP = false,
    priority = false,
  }: OptimizedProductCardProps) => {
    const formattedPrice = `${(product.min_price ?? 0).toLocaleString("tr-TR")} ₺`;
    const ratingDisplay =
      product.ratings_average > 0
        ? {
            average: product.ratings_average.toFixed(1),
            count: product.ratings_count,
          }
        : null;

    const categoryDisplay =
      product.category?.length > 0
        ? {
            visible: product.category.slice(0, 2),
            remaining: Math.max(0, product.category.length - 2),
          }
        : null;

    return (
      <Card
        id={`product-card-${product.id}`}
        className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
        aria-label={`Ürün kartı: ${product.title}`}
        role="article"
        tabIndex={0}
      >
        <div
          className="relative aspect-square overflow-hidden"
          aria-label={`${product.title} ürün görseli`}
          role="region"
        >
          <Link
            href={`/magaza/${product.id}`}
            prefetch={priority}
            className="w-full h-full block"
            aria-label={`${product.title} ürün detay sayfası`}
          >
            <OptimizedImage
              src={product.images?.[0] || ""}
              alt={product.title}
              isLCP={isLCP}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Featured Badge */}
          {product.featured && (
            <Badge
              className="absolute top-3 left-3 bg-yellow-500 hover:bg-yellow-600"
              aria-label="Öne Çıkan Ürün"
            >
              Öne Çıkan
            </Badge>
          )}

          {/* Price Badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 text-lg font-bold"
            aria-label={`Fiyat: ${formattedPrice}`}
          >
            {formattedPrice}
          </Badge>

          {/* User Status Badges - bottom left */}
          {userAuthenticated && (
            <div className="absolute left-3 bottom-3 flex flex-row gap-2 z-10">
              {product.user_has_liked && (
                <Badge
                  variant="outline"
                  className="text-red-500 border-red-200"
                  aria-label="Beğenildi"
                >
                  <Heart
                    className="h-3 w-3 mr-1 fill-current"
                    aria-hidden="true"
                  />
                  Beğenildi
                </Badge>
              )}
              {product.user_cart_quantity && product.user_cart_quantity > 0 && (
                <Badge
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  aria-label={`Sepette: ${product.user_cart_quantity}`}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" aria-hidden="true" />
                  Sepette: {product.user_cart_quantity}
                </Badge>
              )}
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Rating */}
          {ratingDisplay && (
            <div
              className="flex items-center gap-2"
              aria-label={`Puan: ${ratingDisplay.average} (${ratingDisplay.count} yorum)`}
            >
              <div className="flex items-center">
                <Star
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  aria-hidden="true"
                />
                <span className="ml-1 text-sm font-medium">
                  {ratingDisplay.average}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({ratingDisplay.count} yorum)
              </span>
            </div>
          )}

          {/* Stats */}
          <div
            className="flex items-center justify-between text-sm text-muted-foreground"
            aria-label="Ürün istatistikleri"
          >
            <div
              className="flex items-center gap-1"
              aria-label={`Beğeni: ${product.likes_count}`}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span>{product.likes_count}</span>
            </div>
            <div
              className="flex items-center gap-1"
              aria-label={`Yorum: ${product.comments_count}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>{product.comments_count}</span>
            </div>
          </div>

          {/* Categories with truncation indicator */}
          {categoryDisplay && (
            <div className="relative" aria-label="Ürün kategorileri">
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {categoryDisplay.visible.map((cat: string, idx: number) => (
                  <Badge
                    key={`${product.id}-cat-${idx}`}
                    variant="secondary"
                    className="text-xs"
                    aria-label={`Kategori: ${cat}`}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
              {/* Gradient fade overlay when there are more than 2 categories */}
              {categoryDisplay.remaining > 0 && (
                <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-end pr-1">
                  <span
                    className="text-xs text-muted-foreground font-medium"
                    aria-label={`+${categoryDisplay.remaining} kategori daha`}
                  >
                    +{categoryDisplay.remaining}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Link
            href={`/magaza/${product.id}`}
            prefetch={priority}
            className="w-full"
            aria-label={`${product.title} ürün detay sayfası`}
          >
            <Button
              className="w-full group-hover:bg-primary/90 transition-colors"
              aria-label="Detayları Gör"
            >
              <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
              Detayları Gör
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  },
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
