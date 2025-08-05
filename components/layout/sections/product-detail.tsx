"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/sbClient";
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

export const ProductDetailSection = () => {
  const supabase = createClient();
  const params = useParams();
  const productId = params?.productId as string | undefined;
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetail = async () => {
      const { data, error } = await supabase.rpc("get_product_detail", {
        product_uuid: productId,
      });
      if (error) {
        console.error("Error fetching product detail:", error);
      } else {
        setProductDetail(data);
        setComments(data.comments || []);      
      }
    };

    fetchProductDetail();
  }, [productId, supabase]);

  useEffect(() => {
    if (productDetail?.product?.variants?.variants) {
      const defaultVariant = productDetail.product.variants.variants.find(
        (v) => v.is_default
      );
      setSelectedVariant(
        defaultVariant || productDetail.product.variants.variants[0]
      );
    }
    setIsLiked(productDetail?.product?.user_has_liked || false);
  }, [productDetail]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleLike = async () => {
  if (!productDetail || !productDetail.user_authenticated) {
    setAlertMessage("Please log in to like products.");
    return;
  }

  try {
    const { data, error } = await supabase.rpc(
      isLiked ? "unlike_product" : "like_product",
      { product_uuid: productId }
    );

    if (error) {
      console.error("Error updating like:", error);
      setAlertMessage("Failed to update like. Please try again.");
    } else {
      setIsLiked(!isLiked);

      setProductDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          product: {
            ...prev.product,
            likes_count: prev.product.likes_count + (isLiked ? -1 : 1),
            user_has_liked: !isLiked,
          },
          comments: prev.comments,
          user_authenticated: prev.user_authenticated,
        };
      });
      setAlertMessage(
        isLiked
          ? "Removed from your liked products."
          : "Added to your liked products."
      );
    }
  } catch (error) {
    console.error("Error in handleLike:", error);
    setAlertMessage("Failed to update like. Please try again.");
  }
};

  const handleAddToCart = async () => {
    if (!productDetail || !productDetail.user_authenticated) {
     setAlertMessage("Please log in to write a review.");
      return;
    }

    if (!selectedVariant) {
     setAlertMessage("Please select a variant.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("add_to_cart", {
        product_uuid: productId,
        variant_id_param: selectedVariant.id,
        quantity_param: quantity,
      });

      if (error) {
        console.error("Error adding to cart:", error);
       setAlertMessage("Failed to add item to cart. Please try again.");
      } else {
        if (data.success) {
          setAlertMessage(`Successfully ${data.action} ${quantity} item(s) to cart!`)
          setProductDetail((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              product: {
                ...prev.product,
                user_cart_quantity:
                  (prev.product.user_cart_quantity || 0) + quantity,
              },
              comments: prev.comments,
              user_authenticated: prev.user_authenticated,
            };
          });
        } else {
         setAlertMessage(data.error || "Failed to add item to cart.");
        }
      }
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
     setAlertMessage("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!productDetail || !productDetail.user_authenticated) {
     setAlertMessage("Please log in to write a review.");
      return;
    }

    if (!newComment.trim() || newRating === 0) {
     setAlertMessage("Please provide both a rating and a comment.");
      return;
    }

    if (newComment.length > 500) {
     setAlertMessage("Comment must be 500 characters or less.");
      return;
    }

    setCommentLoading(true);

    const originalComment = newComment;
    const originalRating = newRating;
    const optimisticId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const optimisticComment = {
      id: optimisticId,
      user: "You",
      user_avatar: null,
      rating: originalRating,
      comment: originalComment,
      date: new Date().toISOString().split("T")[0],
      isOptimistic: true,
    };
  
    const currentComments = [...comments];
    setComments([optimisticComment, ...currentComments]);

    try {
      const { data, error } = await supabase.rpc("add_product_review", {
        product_uuid: productId,
        comment_text_param: originalComment,
        rating_value_param: originalRating,
      });

      if (error || !data?.success) {
        console.error("Error adding review:", error || data?.error);
        setComments(currentComments);
        setNewComment(originalComment);
        setNewRating(originalRating);
       setAlertMessage(data?.error || "Failed to add review. Please try again.");
        setCommentLoading(false);
        return;
      }

      const realComment = {
        id: data.comment.id,
        user: data.comment.user,
        user_avatar: data.comment.user_avatar,
        rating: data.comment.rating,
        comment: data.comment.comment,
        date: data.comment.date,
        isOptimistic: false,
      };
      
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === optimisticId ? realComment : comment
        )
      );

      setProductDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          product: {
            ...prev.product,
            comments_count: prev.product.comments_count + 1,
            user_rating: originalRating,
            ratings_count: prev.product.user_rating
              ? prev.product.ratings_count
              : prev.product.ratings_count + 1,
            ratings_average: prev.product.user_rating
              ? (prev.product.ratings_average * prev.product.ratings_count -
                  prev.product.user_rating +
                  originalRating) /
                prev.product.ratings_count
              : (prev.product.ratings_average * prev.product.ratings_count +
                  originalRating) /
                (prev.product.ratings_count + 1),
          },
          comments: prev.comments,
          user_authenticated: prev.user_authenticated,
        };
      });

      setNewComment("");
      setNewRating(0);

     setAlertMessage("Review added successfully!");
    } catch (error) {
      console.error("Error in handleSubmitComment:", error);
      setComments(currentComments);
      setNewComment(originalComment);
      setNewRating(originalRating);
     setAlertMessage("Failed to add review. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const product = productDetail?.product;

  if (loading || !product || !productDetail) {
    return (
      <section id="product" className="container flex flex-col items-center justify-center mx-auto max-w-6xl">
            <Loader2 className="h-screen inset-0 w-22 animate-spin" />
      </section>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      {/* Alert Message */}
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
          >
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600">
                Featured
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
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-muted"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category.map((cat, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {product.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {product.description}
            </p>
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center gap-6">
            {product.ratings_average > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">
                    {product.ratings_average.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.ratings_count} reviews)
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{product.likes_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{product.comments_count}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold">
            {selectedVariant?.price?.toFixed(2)} ₺
          </div>

          {/* Variants */}
          {product.variants?.variants && (
            <div className="space-y-3">
              <h3 className="font-semibold">Select Variant:</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantChange(variant)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
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

          {/* Quantity Selector */}
          <div className="space-y-3">
            <h3 className="font-semibold">Quantity:</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium px-4">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= (selectedVariant?.stock || 0)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                {selectedVariant?.stock} available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={loading || !selectedVariant?.stock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLike}
              className={isLiked ? "text-red-500 border-red-200" : ""}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* User Cart Status */}
          {productDetail.user_authenticated &&
            (product.user_cart_quantity ?? 0) > 0 && (
              <Alert>
                <ShoppingCart className="h-4 w-4" />
                <AlertDescription>
                  You already have {product.user_cart_quantity ?? 0} of this
                  item in your cart.
                </AlertDescription>
              </Alert>
            )}

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-orange-600" />
              <span>30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews and Comments Section */}
      <div className="mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reviews & Comments</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.ratings_average?.toFixed(1)} average</span>
            <span>•</span>
            <span>
              {comments.length} review{comments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Add Comment Section */}
        {productDetail.user_authenticated && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            {/* Rating Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="transition-colors hover:scale-110"
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
                    {newRating} star{newRating !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Your Review</label>
              <Textarea
                placeholder="Share your experience with this product..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {newComment.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitComment}
              disabled={commentLoading || !newComment.trim() || newRating === 0}
              className="w-full sm:w-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              {commentLoading ? "Publishing..." : "Publish Review"}
            </Button>
          </Card>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-6">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {comment.user_avatar ? (
                      <img
                        src={comment.user_avatar}
                        alt={comment.user}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{comment.user}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < comment.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Comment Text */}
                    <p className="text-muted-foreground leading-relaxed">
                      {comment.comment}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2">
                      <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Helpful
                      </button>
                      <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to review this product and help other customers
                make informed decisions.
              </p>
              {!productDetail.user_authenticated && (
                <p className="text-sm text-muted-foreground">
                  Please log in to write a review.
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
