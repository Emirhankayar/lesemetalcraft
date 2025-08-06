"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  X,
  Loader2,
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
  Send,
  User,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductVariant, ProductDetail, Comment } from "@/lib/types";
import { PriceSection } from "@/components/layout/sections/price-section";
import { supabase } from "@/lib/sbClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ProductDetailSection = () => {
  const params = useParams();
  const productId = params?.productId as string | undefined;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const {
    data: productDetail,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_product_detail", {
        product_uuid: productId,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });

  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    setComments(productDetail?.comments || []);
    setIsLiked(productDetail?.product?.user_has_liked || false);
    if (productDetail?.product?.variants?.variants) {
      const defaultVariant = productDetail.product.variants.variants.find(
        (v: ProductVariant) => v.is_default
      );
      setSelectedVariant(
        defaultVariant || productDetail.product.variants.variants[0]
      );
    }
  }, [productDetail]);

  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowAlert(false);
        setTimeout(() => setAlertMessage(null), 300);
      }, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [alertMessage]);

  const likeMutation = useMutation({
    mutationFn: async (like: boolean) => {
      const { error } = await supabase.rpc(
        like ? "like_product" : "unlike_product",
        {
          product_uuid: productId,
        }
      );
      if (error) throw error;
    },
    onSuccess: (_, like) => {
      queryClient.invalidateQueries({ queryKey: ["productDetail", productId] });
      setIsLiked(like);
      setAlertMessage(
        like
          ? "Beğendiğiniz ürünlere eklendi."
          : "Beğendiğiniz ürünlerden kaldırıldı."
      );
    },
    onError: () =>
      setAlertMessage("Beğeni güncellenemedi. Lütfen tekrar deneyin."),
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("add_to_cart", {
        product_uuid: productId,
        variant_id_param: selectedVariant?.id,
        quantity_param: quantity,
      });
      if (error || !data?.success) throw error || new Error(data?.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productDetail", productId] });
      setAlertMessage(`Başarıyla ${quantity} adet ürün sepete eklendi!`);
    },
    onError: () =>
      setAlertMessage("Ürün sepete eklenemedi. Lütfen tekrar deneyin."),
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({
      comment,
      rating,
    }: {
      comment: string;
      rating: number;
    }) => {
      const { data, error } = await supabase.rpc("add_product_review", {
        product_uuid: productId,
        comment_text_param: comment,
        rating_value_param: rating,
      });
      if (error || !data?.success) throw error || new Error(data?.error);
      return data.comment;
    },
    onMutate: async ({ comment, rating }) => {
      const optimisticId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const optimisticComment = {
        id: optimisticId,
        user: "Siz",
        user_avatar: null,
        rating,
        comment,
        date: new Date().toISOString().split("T")[0],
        isOptimistic: true,
      };
      setComments((prev) => [optimisticComment, ...prev]);
      setNewComment("");
      setNewRating(0);
      return { optimisticId };
    },
    onSuccess: (realComment, _, context) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === context?.optimisticId
            ? { ...realComment, isOptimistic: false }
            : c
        )
      );
      queryClient.invalidateQueries({ queryKey: ["productDetail", productId] });
      setAlertMessage("Yorum başarıyla eklendi!");
    },
    onError: (_, __, context) => {
      setComments((prev) => prev.filter((c) => c.id !== context?.optimisticId));
      setAlertMessage("Yorum eklenemedi. Lütfen tekrar deneyin.");
    },
  });

  const handleLike = () => {
    if (!productDetail?.user_authenticated) {
      setAlertMessage("Ürünleri beğenmek için lütfen giriş yapın.");
      return;
    }
    likeMutation.mutate(!isLiked);
  };

  const handleAddToCart = () => {
    if (!productDetail?.user_authenticated) {
      setAlertMessage("Sepete eklemek için lütfen giriş yapın.");
      return;
    }
    if (!selectedVariant) {
      setAlertMessage("Lütfen bir varyant seçin.");
      return;
    }
    addToCartMutation.mutate();
  };

  const handleSubmitComment = () => {
    if (!productDetail?.user_authenticated) {
      setAlertMessage("Yorum yazmak için lütfen giriş yapın.");
      return;
    }
    if (!newComment.trim() || newRating === 0) {
      setAlertMessage("Lütfen hem puan hem de yorum girin.");
      return;
    }
    if (newComment.length > 500) {
      setAlertMessage("Yorum en fazla 500 karakter olmalı.");
      return;
    }
    addCommentMutation.mutate({ comment: newComment, rating: newRating });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (selectedVariant && newQty > selectedVariant.stock)
        return selectedVariant.stock;
      return newQty;
    });
  };

  const product = productDetail?.product;

  if (loading || !product || !productDetail) {
    return (
      <section
        className="container flex flex-col items-center justify-center mx-auto max-w-6xl min-h-screen"
        aria-busy="true"
        aria-live="polite"
        aria-label="Ürün Detayı Yükleniyor"
      >
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Ürün yükleniyor...</p>
      </section>
    );
  }

  return (
    <div className="container" aria-label={`Ürün Detay: ${product.title}`}>
      {alertMessage && (
        <div
          className={`
            fixed left-1/2 bottom-6 z-50
            transform -translate-x-1/2
            transition-all duration-300
            ${showAlert ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            w-full px-4
            sm:max-w-2xl sm:w-1/2
          `}
          role="alert"
          aria-live="polite"
        >
          <Alert
            className={`
              shadow-lg
              text-center
              ${showAlert ? "animate-fade-in" : "animate-fade-out"}
            `}
            style={{
              borderRadius: "0.75rem",
            }}
            aria-label="Bilgilendirme"
          >
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}
            <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ürün Detayları</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4" aria-label="Ürün Görselleri">
          <div
            className="relative aspect-square overflow-hidden rounded-lg bg-muted"
            aria-label="Ana Ürün Görseli"
          >
            <img
              src={
                product.images[selectedImageIndex] || "/placeholder-product.jpg"
              }
              alt={product.title}
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
                  <img
                    src={image || "/placeholder-product.jpg"}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6" aria-label="Ürün Bilgileri">
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
          <div className="text-3xl font-bold" aria-label="Ürün Fiyatı">
            {selectedVariant?.price?.toFixed(2)} ₺
          </div>
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
                    }, Fiyat: ${variant.price.toFixed(2)} ₺, Stok: ${
                      variant.stock
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{variant.size}</div>
                        <div className="text-sm text-muted-foreground">
                          Weight: {variant.weight} • Stock: {variant.stock}
                        </div>
                      </div>
                      <div className="font-bold">
                        {variant.price.toFixed(2)} ₺
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
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
            <PriceSection
              selectedVariant={selectedVariant}
              quantity={quantity}
            />
          </div>
          <div className="flex gap-3" aria-label="Ürün İşlem Butonları">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={loading || !selectedVariant?.stock}
              aria-label="Sepete Ekle"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {loading ? "Ekleniyor..." : "Sepete Ekle"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLike}
              className={isLiked ? "text-red-500 border-red-200" : ""}
              aria-label={isLiked ? "Beğenmekten Vazgeç" : "Beğen"}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>
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
              <RotateCcw
                className="h-4 w-4 text-orange-600"
                aria-hidden="true"
              />
              <span>30 Gün İade</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-16 space-y-8"
        aria-label="Yorumlar ve Değerlendirmeler"
      >
        <div className="flex items-center justify-between sx:justify-start">
          <h2 className="text-2xl font-bold" aria-label="Yorumlar Başlığı">
            Yorumlar & Değerlendirmeler
          </h2>
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            aria-label="Yorumlar İstatistikleri"
          >
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span>{product.ratings_average?.toFixed(1)} ortalama</span>
            <span>•</span>
            <span>{comments.length} yorum</span>
          </div>
        </div>
        {productDetail.user_authenticated && (
          <Card className="p-6" aria-label="Yorum Yazma Alanı">
            <h3 className="text-lg font-semibold mb-4">Yorum Yaz</h3>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Puanınız</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="transition-colors hover:scale-110"
                    aria-label={`${star} yıldız`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground hover:text-yellow-400"
                      }`}
                    />
                  </button>
                ))}
                {newRating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {newRating} yıldız
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Yorumunuz</label>
              <Textarea
                placeholder="Bu ürünle ilgili deneyiminizi paylaşın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="resize-none"
                aria-label="Yorum Metni"
              />
              <div className="text-xs text-muted-foreground text-right">
                {newComment.length}/500 karakter
              </div>
            </div>
            <Button
              onClick={handleSubmitComment}
              disabled={
                addCommentMutation.isPending ||
                !newComment.trim() ||
                newRating === 0
              }
              className="w-full sm:w-auto"
              aria-label="Yorumu Yayınla"
            >
              <Send className="h-4 w-4 mr-2" />
              {addCommentMutation.isPending
                ? "Yayınlanıyor..."
                : "Yorumu Yayınla"}
            </Button>
          </Card>
        )}
        {comments.length > 0 ? (
          <div className="space-y-4" aria-label="Yorum Listesi">
            {comments.map((comment) => (
              <Card
                key={comment.id}
                className="p-4 sm:p-6"
                aria-label={`Yorum: ${comment.user}`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    {comment.user_avatar ? (
                      <img
                        src={comment.user_avatar}
                        alt={comment.user}
                        className="w-8 h-8 shadow-md shadow-gray-400 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="space-y-1">
                        <span className="font-medium text-sm block truncate">
                          {comment.user}
                        </span>
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center gap-0.5"
                            aria-label={`Puan: ${comment.rating}`}
                          >
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < comment.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.date).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{comment.user}</span>
                          <div
                            className="flex items-center gap-1"
                            aria-label={`Puan: ${comment.rating}`}
                          >
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < comment.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.date).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>

                    {/* Comment Text */}
                    <p
                      className="leading-relaxed text-sm sm:text-base mt-2"
                      aria-label="Yorum Metni"
                    >
                      {comment.comment}
                    </p>

                    {/* Action Buttons (Hidden for now) */}
                    <div className="flex items-center gap-4 pt-2 mt-2">
                      <button
                        className="hidden text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Faydalı"
                      >
                        Faydalı
                      </button>
                      <button
                        className="hidden text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Yanıtla"
                      >
                        Yanıtla
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8" aria-label="Yorum Yok">
            <div className="text-center">
              <MessageCircle
                className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold mb-2">Henüz yorum yok</h3>
              <p className="text-muted-foreground mb-4">
                İlk yorumu siz yapın ve diğer müşterilerin bilinçli karar
                vermesine yardımcı olun.
              </p>
              {!productDetail.user_authenticated && (
                <p className="text-sm text-muted-foreground">
                  Yorum yazmak için lütfen giriş yapın.
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
