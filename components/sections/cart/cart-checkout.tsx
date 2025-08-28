"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/sbClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { AuthAlert } from "@/components/alerts/auth-alert";
import { CartResponse } from "@/lib/types";
import { CartItem } from "@/components/sections/profile/user-cart";

export const CheckoutSection = () => {
  const params = useParams();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<any>(null);

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowAlert(false);
      setTimeout(() => setAlertMessage(null), 300);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      setUser(user);

      if (authError || !user) {
        showAlertMessage("Giriş yapmanız gerekmektedir.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("get_user_cart");

      if (error) {
        console.error("Cart fetch error:", error);
        showAlertMessage("Sepet ürünleri yüklenemedi.");
      } else {
        setCart(data);
      }
      setLoading(false);
    };
    fetchCart();
  }, [supabase]);

  const handleRemove = async (cart_item_id: string) => {
    setItemLoading(cart_item_id);
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cart_item_id);

      if (error) {
        console.error("Remove error:", error);
        showAlertMessage("Ürün sepetten kaldırılamadı.");
        return;
      }

      setCart((prev) => {
        if (!prev) return prev;

        const removedItem = prev.cart_items.find(
          (item) => item.cart_item_id === cart_item_id
        );
        if (!removedItem) return prev;

        const newCartItems = prev.cart_items.filter(
          (item) => item.cart_item_id !== cart_item_id
        );
        const newSubtotal = newCartItems.reduce((sum, item) => sum + item.line_total, 0);
        const newTax = newSubtotal * 0.2; // 20% tax
        const newShipping = newSubtotal > 50 ? 0 : 9.99;

        return {
          ...prev,
          cart_items: newCartItems,
          summary: {
            ...prev.summary,
            items_count: prev.summary.items_count - 1,
            total_quantity: prev.summary.total_quantity - removedItem.quantity,
            subtotal: newSubtotal,
            estimated_tax: newTax,
            shipping_cost: newShipping,
          },
          total: newSubtotal + newTax + newShipping,
        };
      });

      showAlertMessage("Ürün sepetten kaldırıldı.");
    } catch (err) {
      console.error("Unexpected error:", err);
      showAlertMessage("Beklenmeyen bir hata oluştu.");
    } finally {
      setItemLoading(null);
    }
  };

  const handleUpdateQuantity = async (cart_item_id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setItemLoading(cart_item_id);

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cart_item_id);

      if (error) {
        console.error("Update quantity error:", error);
        showAlertMessage("Adet güncellenemedi.");
        return;
      }

      setCart((prev) => {
        if (!prev) return prev;

        const updatedItems = prev.cart_items.map((item) => {
          if (item.cart_item_id === cart_item_id) {
            const updatedItem = { ...item, quantity: newQuantity, line_total: item.unit_price * newQuantity };
            return updatedItem;
          }
          return item;
        });

        const newSubtotal = updatedItems.reduce((sum, item) => sum + item.line_total, 0);
        const newTax = newSubtotal * 0.08;
        const newShipping = newSubtotal > 50 ? 0 : 9.99;
        const newTotalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          ...prev,
          cart_items: updatedItems,
          summary: {
            ...prev.summary,
            total_quantity: newTotalQuantity,
            subtotal: newSubtotal,
            estimated_tax: newTax,
            shipping_cost: newShipping,
          },
          total: newSubtotal + newTax + newShipping,
        };
      });

      showAlertMessage("Adet güncellendi.");
    } catch (err) {
      console.error("Unexpected error:", err);
      showAlertMessage("Beklenmeyen bir hata oluştu.");
    } finally {
      setItemLoading(null);
    }
  };

  const handleCreateOrder = async () => {
    if (!cart || cart.cart_items.length === 0) {
      showAlertMessage("Sepetiniz boş.");
      return;
    }

    setCheckoutLoading(true);

    try {
      const { data, error } = await supabase.rpc("create_order_from_cart");

      if (error) {
        console.error("Order creation error:", error);
        showAlertMessage("Sipariş oluşturulamadı.");
        return;
      }

      if (data.error) {
        showAlertMessage(data.error);
        return;
      }

      if (data.success) {
        showAlertMessage(
          `Sipariş başarıyla oluşturuldu! Sipariş No: ${data.order_id.slice(0, 8)}`
        );

        setCart({
          cart_items: [],
          summary: {
            items_count: 0,
            total_quantity: 0,
            subtotal: 0,
            estimated_tax: 0,
            shipping_cost: 0,
          },
          total: 0,
        });

        // TODO: Redirect to order confirmation page
      }
    } catch (err) {
      console.error("Unexpected error during checkout:", err);
      showAlertMessage("Sipariş sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatPrice = (price?: number) =>
    `${(price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;

  if (loading) {
    return (
      <section className="container flex flex-col items-center justify-center mx-auto max-w-6xl min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Sepetiniz yükleniyor...</p>
      </section>
    );
  }
  if (!user) {
    return (
      <AuthAlert
        icon={<ShoppingCart />}
        description="Alışveriş sepetinizi görüntülemek için lütfen giriş yapın."
      />
    );
  }
  if (!cart || cart.cart_items.length === 0 || !user) {
    return (
      <section className="container">
        <Alert className="text-center py-12">
          <AlertDescription>
            <div className="flex flex-col justify-center w-full items-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Sepetiniz boş</h3>
              <p className="text-muted-foreground max-w-md">
                Harika ürünleri keşfedin ve alışverişe başlamak için sepetinize ekleyin.
              </p>
              <Link href="/magaza" prefetch={true}>
                <Button className="mt-4">Alışverişe Devam Et</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32 max-w-6xl">
      {/* Alert Message */}
      {alertMessage && (
        <div
          className={`
            fixed left-1/2 bottom-8 z-50
            transform -translate-x-1/2
            transition-all duration-300 ease-in-out
            ${showAlert ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
            w-full max-w-md px-4
          `}
        >
          <Alert className="shadow-lg border-2">
            <AlertDescription className="text-center font-medium">
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Alışveriş Sepeti</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {cart.summary.items_count} ürün sepetinizde
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.cart_items.map((item) => (
            <CartItem
              key={item.cart_item_id}
              item={item}
              itemLoading={itemLoading}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemove}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ara Toplam ({cart.summary.items_count} ürün)
                </span>
                <span>{formatPrice(cart.summary.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">KDV (20%)</span>
                <span>{formatPrice(cart.summary.estimated_tax)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Kargo</span>
                <span>
                  {cart.summary.shipping_cost === 0 ? (
                    <span className="text-green-600 font-medium">ÜCRETSİZ</span>
                  ) : (
                    formatPrice(cart.summary.shipping_cost)
                  )}
                </span>
              </div>

              {cart.summary.subtotal < 50 && cart.summary.shipping_cost > 0 && (
                <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                  💡 Ücretsiz kargo için {formatPrice(50 - cart.summary.subtotal)} daha ekleyin!
                </div>
              )}

              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Toplam</span>
                <span>{formatPrice(cart.total)}</span>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Toplam Ürün:</span>
                  <span>{cart.summary.items_count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Toplam Adet:</span>
                  <span>{cart.summary.total_quantity}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleCreateOrder}
                disabled={checkoutLoading || !cart || cart.cart_items.length === 0}
                aria-label="Siparişi Tamamla"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sipariş Oluşturuluyor...
                  </>
                ) : (
                  "Siparişi Tamamla"
                )}
              </Button>
              <Link href="/magaza" prefetch={true}>
                <Button variant="outline" size="sm" className="w-full" aria-label="Alışverişe Devam Et">
                  Alışverişe Devam Et
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

