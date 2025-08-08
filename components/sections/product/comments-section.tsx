"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  MessageCircle,
  Send,
  User,
} from "lucide-react";
import { Comment } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/sbClient";

interface ProductCommentsProps {
  productId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  userAuthenticated: boolean;
  ratingsAverage: number;
  onAlert: (message: string) => void;
}

const ProductComments = ({
  productId,
  comments,
  setComments,
  userAuthenticated,
  ratingsAverage,
  onAlert,
}: ProductCommentsProps) => {
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const queryClient = useQueryClient();

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
      onAlert("Yorum başarıyla eklendi!");
    },
    onError: (_, __, context) => {
      setComments((prev) => prev.filter((c) => c.id !== context?.optimisticId));
      onAlert("Yorum eklenemedi. Lütfen tekrar deneyin.");
    },
  });

  const handleSubmitComment = () => {
    if (!userAuthenticated) {
      onAlert("Yorum yazmak için lütfen giriş yapın.");
      return;
    }
    if (!newComment.trim() || newRating === 0) {
      onAlert("Lütfen hem puan hem de yorum girin.");
      return;
    }
    if (newComment.length > 500) {
      onAlert("Yorum en fazla 500 karakter olmalı.");
      return;
    }
    addCommentMutation.mutate({ comment: newComment, rating: newRating });
  };

  return (
    <section
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
          <span>{ratingsAverage?.toFixed(1)} ortalama</span>
          <span>•</span>
          <span>{comments.length} yorum</span>
        </div>
      </div>

      {userAuthenticated && (
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
            {!userAuthenticated && (
              <p className="text-sm text-muted-foreground">
                Yorum yazmak için lütfen giriş yapın.
              </p>
            )}
          </div>
        </Card>
      )}
    </section>
  );
};

export default ProductComments;