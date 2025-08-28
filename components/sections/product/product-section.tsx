"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Heart,
  Star,
  MessageCircle,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductVariant, ProductDetail } from "@/lib/types";
import { PriceSection } from "@/components/sections/product/price-section";
import OptimizedImage from "@/components/ui/optimized-image";

interface ProductDisplayProps {
  productDetail: ProductDetail;
  selectedVariant: ProductVariant | null;
  setSelectedVariant: (variant: ProductVariant) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  isLiked: boolean;
  onLike: () => void;
  onAddToCart: () => void;
  loading: boolean;
}

const ProductDisplay = ({
  productDetail,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  isLiked,
  onLike,
  onAddToCart,
  loading,
}: ProductDisplayProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const product = productDetail.product;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty < 1) {
      setQuantity(1);
      return;
    }
    if (selectedVariant && newQty > selectedVariant.stock) {
      setQuantity(selectedVariant.stock);
      return;
    }
    setQuantity(newQty);
  };

  const formatPrice = (price?: number) =>
    `${(price || 0).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ₺`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4" aria-label="Ürün Görselleri">
        <div
          className="relative aspect-square overflow-hidden rounded-lg bg-muted"
          aria-label="Ana Ürün Görseli"
        >
          <OptimizedImage
            src={
              product.images[selectedImageIndex] || "/placeholder-product.jpg"
            }
            alt={product.title}
            isLCP={selectedImageIndex === 0}
            className="w-full h-full object-cover"
          />
          {product.featured && (
            <Badge
              className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600"
              aria-label="Öne Çıkan Ürün"
            >
              Öne Çıkan
            </Badge>
          )}
          {product.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex === 0
                      ? product.images.length - 1
                      : selectedImageIndex - 1
                  )
                }
                aria-label="Önceki görsel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex === product.images.length - 1
                      ? 0
                      : selectedImageIndex + 1
                  )
                }
                aria-label="Sonraki görsel"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        {product.images.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto"
            aria-label="Ürün Küçük Görselleri"
          >
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-muted"
                }`}
                aria-label={`Görsel ${index + 1}`}
              >
                <OptimizedImage
                  src={image || "/placeholder-product.jpg"}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="space-y-6" aria-label="Ürün Bilgileri">
        {/* Product Title & Description */}
        <div>
          <div
            className="flex items-center gap-2 mb-2"
            aria-label="Ürün Kategorileri"
          >
            {product.category.map((cat: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs"
                aria-label={`Kategori: ${cat}`}
              >
                {cat}
              </Badge>
            ))}
          </div>
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            aria-label="Ürün Başlığı"
          >
            {product.title}
          </h1>
          <p
            className="text-muted-foreground text-lg"
            aria-label="Ürün Açıklaması"
          >
            {product.description}
          </p>
        </div>

        {/* Rating & Stats */}
        <div
          className="flex items-center gap-6"
          aria-label="Ürün Puan ve İstatistikleri"
        >
          {product.ratings_average > 0 && (
            <div
              className="flex items-center gap-2"
              aria-label={`Puan: ${product.ratings_average.toFixed(1)}`}
            >
              <div className="flex items-center">
                <Star
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  aria-hidden="true"
                />
                <span className="ml-1 font-medium">
                  {product.ratings_average.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.ratings_count} inceleme)
              </span>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div
              className="flex items-center gap-1"
              aria-label={`Beğeni: ${product.likes_count}`}
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
                aria-hidden="true"
              />
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
        </div>

        {/* Price */}
        <div className="text-3xl font-bold" aria-label="Ürün Fiyatı">
          {formatPrice(selectedVariant?.price)}
        </div>

        {/* Variant Selection */}
        {product.variants?.variants && (
          <div className="space-y-3" aria-label="Varyant Seçimi">
            <h3 className="font-semibold">Varyant Seçin:</h3>
            <div className="grid grid-cols-1 gap-2">
              {product.variants.variants.map((variant: ProductVariant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    selectedVariant?.id === variant.id
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                  aria-label={`Varyant: ${
                    variant.size
                  }, Fiyat: ${formatPrice(variant.price)}, Stok: ${
                    variant.stock
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{variant.size}</div>
                      <div className="text-sm text-muted-foreground">
                      Ağırlık: {variant.weight} • Stok: {variant.stock}
                                            </div>
                    </div>
                    <div className="font-bold">
                      {formatPrice(variant.price)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="space-y-3" aria-label="Adet Seçimi">
          <h3 className="font-semibold">Adet:</h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              aria-label="Adet azalt"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium px-4" aria-label="Seçili Adet">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= (selectedVariant?.stock || 0)}
              aria-label="Adet artır"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span
              className="text-sm text-muted-foreground ml-2"
              aria-label="Stok Bilgisi"
            >
              {selectedVariant?.stock} adet mevcut
            </span>
          </div>
          <PriceSection selectedVariant={selectedVariant} quantity={quantity} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3" aria-label="Ürün İşlem Butonları">
          <Button
            className="flex-1"
            onClick={onAddToCart}
            disabled={loading || !selectedVariant?.stock}
            aria-label="Sepete Ekle"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {loading ? "Ekleniyor..." : "Sepete Ekle"}
          </Button>
          <Button
            variant="outline"
            onClick={onLike}
            className={isLiked ? "text-red-500 border-red-200" : ""}
            aria-label={isLiked ? "Beğenmekten Vazgeç" : "Beğen"}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Cart Info Alert */}
        {productDetail.user_authenticated &&
          (product.user_cart_quantity ?? 0) > 0 && (
            <Alert aria-label="Sepet Bilgisi">
              <ShoppingCart className="h-4 w-4" />
              <AlertDescription>
                Bu üründen zaten {product.user_cart_quantity ?? 0} adet
                sepetinizde mevcut.
              </AlertDescription>
            </Alert>
          )}

        {/* Product Features */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t"
          aria-label="Ürün Özellikleri"
        >
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span>Ücretsiz Kargo</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span>1 Yıl Garanti</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RotateCcw className="h-4 w-4 text-orange-600" aria-hidden="true" />
            <span>30 Gün İade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;

