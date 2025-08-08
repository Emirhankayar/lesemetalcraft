"use client";
import { useState, useCallback, memo } from "react";
import { useQuery, useQueryClient, useMutation, keepPreviousData } from '@tanstack/react-query';
import { supabase } from "@/lib/sbClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Loader2,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { CartResponse } from "@/lib/types";
import { PriceSection } from "@/components/sections/product/price-section";
import OptimizedImage from "@/components/ui/optimized-image";

export const CartItem = memo(({
  item,
  itemLoading,
  onUpdateQuantity,
  onRemoveFromCart
}: {
  item: any;
  itemLoading: string | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
}) => (
  <Card key={item.cart_item_id}>
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <Link href={`/magaza/${item.product_id}`} prefetch={true}>
            <OptimizedImage
              src={item.product_image}
              alt={item.product_title}
              className="object-cover rounded sm:w-64 sm:h-64"
              isLCP={false}
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 justify-between flex flex-col gap-4">
          {/* Title and Remove Button Row */}
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-medium text-sm sm:text-base flex-1" itemProp="name">
              {item.product_title}
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveFromCart(item.cart_item_id)}
              disabled={itemLoading === item.cart_item_id}
              className="text-red-600 hover:text-red-700 flex-shrink-0"
              aria-label="Sepetten Kaldır"
            >
              {itemLoading === item.cart_item_id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Variant Info */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Varyete: {item.variant_data.size}</p>
            <p>SKU: {item.variant_data.sku}</p>
          </div>

          {/* Quantity Controls and Price */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium mr-2">Adet:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                disabled={item.quantity <= 1 || itemLoading === item.cart_item_id}
                className="h-8 w-8 p-0"
                aria-label="Adet Azalt"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium min-w-8 text-center text-sm" aria-label="Adet">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                disabled={
                  item.quantity >= item.variant_stock ||
                  itemLoading === item.cart_item_id
                }
                className="h-8 w-8 p-0"
                aria-label="Adet Arttır"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

          </div>
            {/* Price Section */}
            <div className="">
              <PriceSection 
                collapsedByDefault={true} 
                selectedVariant={item.variant_data} 
                quantity={item.quantity} 
              />
            </div>
        </div>
      </div>
    </CardContent>
  </Card>
));
CartItem.displayName = "CartItem";

interface UserCartProps {
  showAlertMessage?: (message: string) => void;
  showOrderSummary?: boolean;
  showContinueShopping?: boolean;
}

export const UserCart = ({ 
  showAlertMessage, 
  showOrderSummary = true, 
  showContinueShopping = true 
}: UserCartProps) => {
  const [itemLoading, setItemLoading] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading: cartLoading,
  } = useQuery({
    queryKey: ['userCart'],
    queryFn: async (): Promise<CartResponse> => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("AUTH_ERROR: Giriş yapmanız gerekmektedir.");
      }

      const { data, error } = await supabase.rpc("get_user_cart");
      if (error) throw new Error("Sepet yüklenemedi.");
      return data;
    },
    placeholderData: keepPreviousData, 
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000, 
    retry: (failureCount, error) => {
      if (error.message.startsWith('AUTH_ERROR:')) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: 'always'
  });

  const removeCartItemMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCart'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      if (showAlertMessage) {
        showAlertMessage("Ürün sepetten kaldırıldı.");
      }
    },
    onError: () => {
      if (showAlertMessage) {
        showAlertMessage("Ürün sepetten kaldırılamadı.");
      }
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCart'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      if (showAlertMessage) {
        showAlertMessage("Adet güncellendi.");
      }
    },
    onError: () => {
      if (showAlertMessage) {
        showAlertMessage("Adet güncellenemedi.");
      }
    }
  });

  const handleRemoveFromCart = useCallback((cart_item_id: string) => {
    setItemLoading(cart_item_id);
    removeCartItemMutation.mutate(cart_item_id, {
      onSettled: () => setItemLoading(null)
    });
  }, [removeCartItemMutation]);

  const handleUpdateQuantity = useCallback((cart_item_id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setItemLoading(cart_item_id);
    updateQuantityMutation.mutate({ cartItemId: cart_item_id, quantity: newQuantity }, {
      onSettled: () => setItemLoading(null)
    });
  }, [updateQuantityMutation]);

  if (cartLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!cartData || cartData.cart_items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sepetiniz boş</h3>
          <p className="text-muted-foreground">
            Sepetinize ürün eklediğinizde burada görebilirsiniz.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cartData.cart_items.map((item) => (
        <CartItem
          key={item.cart_item_id}
          item={item}
          itemLoading={itemLoading}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
        />
      ))}
      
      {(showOrderSummary || showContinueShopping) && (
        <div className="lg:col-span-1">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Order Summary Card */}
            {showOrderSummary && (
              <Card className="top-4 flex-1">
                <CardHeader>
                  <CardTitle>Sipariş Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Ara Toplam ({cartData.summary.items_count} ürün)
                    </span>
                    <span>{cartData.summary.subtotal.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KDV (20%)</span>
                    <span>{cartData.summary.estimated_tax.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo</span>
                    <span>
                      {cartData.summary.shipping_cost === 0 ? (
                        <span className="text-green-600 font-medium">ÜCRETSİZ</span>
                      ) : (
                        `${cartData.summary.shipping_cost.toFixed(2)} ₺`
                      )}
                    </span>
                  </div>
                  {cartData.summary.subtotal < 50 && cartData.summary.shipping_cost > 0 && (
                    <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                      💡 Ücretsiz kargo için {(50 - cartData.summary.subtotal).toFixed(2)} ₺ daha ekleyin!
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span>{cartData.total.toFixed(2)} ₺</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Toplam Ürün:</span>
                      <span>{cartData.summary.items_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Toplam Adet:</span>
                      <span>{cartData.summary.total_quantity}</span>
                    </div>
                  </div>
                  <CardFooter className="flex flex-col justify-center w-full px-0">
                    <Link href="/sepet" prefetch={true} className="flex w-full">
                      <Button aria-label="Ödeme Adımına Geç" className="w-full">
                        Sepeti Görüntüle
                      </Button>
                    </Link>
                  </CardFooter>
                </CardContent>
              </Card>
            )}

            {/* Continue Shopping Card */}
            {showContinueShopping && (
              <Card className="bg-pink-50 border-pink-400 hover:bg-pink-100 transition-colors top-4 flex-1 md:max-w-sm">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-10 h-full">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm">
                    <ShoppingCart className="w-12 h-12 text-pink-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Alışverişe Devam Et</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Daha fazla ürün keşfedin ve favori ürünlerinizi bulun!
                    </p>
                  </div>
                  <CardFooter>
                    <Link href="/magaza" prefetch={true} className="w-full mt-auto">
                      <Button
                        variant="outline"
                        className="w-full shadow-xs text-pink-700 mt-2 hover:bg-pink-50 hover:text-pink-800 hover:border-pink-400 transition-colors"
                        aria-label="Alışverişe Devam Et"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Mağazaya Dön
                    </Button>
                  </Link>
                  </CardFooter>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};