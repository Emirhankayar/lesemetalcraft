import Link from "next/link";
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

export const ProductCard = ({ product, userAuthenticated }: ProductCardProps) => (
  <Card
    id={`product-card-${product.id}`}
    key={product.id}
    className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
  >
    <div className="relative aspect-square overflow-hidden">
      {/* Product Image */}
      {product.images?.[0] ? (
        <Link href={`/magaza/${product.id}`} className="w-full h-full block">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <Eye className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {/* Featured Badge */}
      {product.featured && (
        <Badge className="absolute top-3 left-3 bg-yellow-500 hover:bg-yellow-600">
          Öne Çıkan
        </Badge>
      )}

      {/* Price Badge */}
      <Badge
        variant="secondary"
        className="absolute top-3 right-3 text-lg font-bold"
      >
        {product.min_price} ₺
      </Badge>

      {/* User Status Badges - bottom left */}
      {userAuthenticated && (
        <div className="absolute left-3 bottom-3 flex flex-row gap-2 z-10">
          {product.user_has_liked && (
            <Badge
              variant="outline"
              className="text-red-500 border-red-200"
            >
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Beğenildi
            </Badge>
          )}
        {product.user_cart_quantity && product.user_cart_quantity > 0 && (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <ShoppingCart className="h-3 w-3 mr-1" />
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
      {product.ratings_average > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">
              {product.ratings_average.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.ratings_count} yorum)
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{product.likes_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{product.comments_count}</span>
        </div>
      </div>

      {/* Categories with truncation indicator */}
      {product.category?.length > 0 && (
        <div className="relative">
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {product.category
              .slice(0, 2)
              .map((cat: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs"
                >
                  {cat}
                </Badge>
              ))}
          </div>
          {/* Gradient fade overlay when there are more than 3 categories */}
          {product.category.length > 2 && (
            <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-end pr-1">
              <span className="text-xs text-muted-foreground font-medium">
                +{product.category.length - 2}
              </span>
            </div>
          )}
        </div>
      )}
    </CardContent>

    <CardFooter>
      <Link href={`/magaza/${product.id}`} className="w-full">
        <Button className="w-full group-hover:bg-primary/90 transition-colors">
          <Eye className="h-4 w-4 mr-2" />
          Detayları Gör
        </Button>
      </Link>
    </CardFooter>
  </Card>
);