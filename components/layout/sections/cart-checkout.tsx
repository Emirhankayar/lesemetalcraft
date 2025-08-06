"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/sbClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Loader2, ShoppingCart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { AuthAlert } from "@/components/ui/auth-alert";
import { CartResponse } from "@/lib/types";
import Image from "next/image";
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
        .from('cart_items')
        .delete()
        .eq('id', cart_item_id);

      if (error) {
        console.error("Remove error:", error);
        showAlertMessage("Ürün sepetten kaldırılamadı.");
        return;
      }

      setCart((prev) => {
        if (!prev) return prev;
        
        const removedItem = prev.cart_items.find(item => item.cart_item_id === cart_item_id);
        if (!removedItem) return prev;

        const newCartItems = prev.cart_items.filter(item => item.cart_item_id !== cart_item_id);
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
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cart_item_id);

      if (error) {
        console.error("Update quantity error:", error);
        showAlertMessage("Adet güncellenemedi.");
        return;
      }

  
      setCart((prev) => {
        if (!prev) return prev;
        
        const updatedItems = prev.cart_items.map(item => {
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
        showAlertMessage(`Sipariş başarıyla oluşturuldu! Sipariş No: ${data.order_id.slice(0, 8)}`);
        
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
        // router.push(`/orders/${data.order_id}`);
      }
    } catch (err) {
      console.error("Unexpected error during checkout:", err);
      showAlertMessage("Sipariş sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container flex flex-col items-center justify-center mx-auto max-w-6xl min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Sepetiniz yükleniyor...</p>
      </section>
    );
  }
  if (!user) {
    return <AuthAlert icon={<ShoppingCart/>} description="Alışveriş sepetinizi görüntülemek için lütfen giriş yapın." />;
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
              <Link href="/magaza"  prefetch={true}>
                <Button className="mt-4">
                  Alışverişe Devam Et
                </Button>
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
            <Card key={item.cart_item_id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="sm:w-32 sm:h-32 w-full h-48 relative overflow-hidden">
                                          <Link href={`/magaza/${item.product_id}`}  prefetch={true}>

                    <Image
                      src={item.product_image || "/placeholder-product.jpg"}
                      alt={item.product_title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      />
                      </Link>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2" itemProp="name">
                          {item.product_title}
                        </h3>
                        
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <p>Varyete: {item.variant_data.size}</p>
                          <p>SKU: {item.variant_data.sku}</p>
                          {item.variant_stock <= 5 && (
                            <p className="text-amber-600 font-medium">
                              Sadece {item.variant_stock} adet kaldı!
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || itemLoading === item.cart_item_id}
                              className="h-8 w-8 p-0"
                              aria-label="Adet Azalt"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="font-medium min-w-8 text-center" aria-label="Adet">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                              disabled={item.quantity >= item.variant_stock || itemLoading === item.cart_item_id}
                              className="h-8 w-8 p-0"
                              aria-label="Adet Arttır"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemove(item.cart_item_id)}
                            disabled={itemLoading === item.cart_item_id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            aria-label="Sepetten Kaldır"
                          >
                            {itemLoading === item.cart_item_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Kaldır</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="text-right sm:ml-4">
                        <div className="text-lg font-bold" aria-label="Toplam Fiyat">
                          {item.line_total.toFixed(2)} ₺
                        </div>
                        <div className="text-sm text-muted-foreground" aria-label="Birim Fiyat">
                          {item.unit_price.toFixed(2)} ₺ / adet
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <span className="text-muted-foreground">Ara Toplam ({cart.summary.items_count} ürün)</span>
                <span>{cart.summary.subtotal.toFixed(2)} ₺</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">KDV (20%)</span>
                <span>{cart.summary.estimated_tax.toFixed(2)} ₺</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kargo</span>
                <span>
                  {cart.summary.shipping_cost === 0 ? (
                    <span className="text-green-600 font-medium">ÜCRETSİZ</span>
                  ) : (
                    `${cart.summary.shipping_cost.toFixed(2)} ₺`
                  )}
                </span>
              </div>

              {cart.summary.subtotal < 50 && cart.summary.shipping_cost > 0 && (
                <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                  💡 Ücretsiz kargo için {(50 - cart.summary.subtotal).toFixed(2)} ₺ daha ekleyin!
                </div>
              )}
              
              <hr />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Toplam</span>
                <span>{cart.total.toFixed(2)} ₺</span>
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
              <Link href="/magaza"  prefetch={true}>
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