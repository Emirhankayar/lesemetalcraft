"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ProductVariant, Comment } from "@/lib/types";
import dynamic from "next/dynamic";
import { ProductDisplaySkeleton, ProductCommentsSkeleton } from "@/components/alerts/skeletons";
import { useInView } from 'react-intersection-observer';
import { useProductDetail, useProductLike, useAddToCart } from "@/data/loaders";

const ProductDisplay = dynamic(() => import("@/components/sections/product/product-section"), {
  loading: () => <ProductDisplaySkeleton />,
  ssr: false
});

const ProductComments = dynamic(() => import('@/components/sections/product/comments-section'), {
  loading: () => <ProductCommentsSkeleton />,
  ssr: false
});

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params?.productId as string | undefined;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { ref: commentsRef, inView: commentsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px'
  });

  const {
    data: productDetail,
    isLoading: loading,
    refetch,
  } = useProductDetail({ productId });

  const likeMutation = useProductLike({
    productId,
    onSuccess: (liked) => {
      setIsLiked(liked);
      setAlertMessage(
        liked
          ? "Beğendiğiniz ürünlere eklendi."
          : "Beğendiğiniz ürünlerden kaldırıldı."
      );
    },
    onError: () => setAlertMessage("Beğeni güncellenemedi. Lütfen tekrar deneyin.")
  });

  const addToCartMutation = useAddToCart({
    productId,
    onSuccess: () => {
      setAlertMessage(`Başarıyla ${quantity} adet ürün sepete eklendi!`);
    },
    onError: () => setAlertMessage("Ürün sepete eklenemedi. Lütfen tekrar deneyin.")
  });

  useEffect(() => {
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
    addToCartMutation.mutate({ 
      variantId: Number(selectedVariant.id), 
      quantity 
    });
  };

  const product = productDetail?.product;

  if (loading) {
    return <ProductDisplaySkeleton />;
  }

  if (!productDetail) {
    return (
      <div className="container">
        <Alert>
          <AlertDescription>Ürün bulunamadı.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
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
      
      <ProductDisplay
        productDetail={productDetail}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        quantity={quantity}
        setQuantity={setQuantity}
        isLiked={isLiked}
        onLike={handleLike}
        onAddToCart={handleAddToCart}
        loading={addToCartMutation.isPending}
      />
      
      <div ref={commentsRef}>
        {commentsInView && (
          <ProductComments
            productId={productId!}
            comments={comments}
            setComments={setComments}
            userAuthenticated={productDetail?.user_authenticated || false}
            ratingsAverage={product?.ratings_average}
            onAlert={setAlertMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
