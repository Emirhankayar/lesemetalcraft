"use client";
import { useState, useRef, useCallback, memo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from "@/lib/sbClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  User,
  ShoppingCart,
  Package,
  Settings,
  Loader2,
  Trash2,
  Plus,
  Minus,
  Eye,
  CreditCard,
  Clock,
  Image as Pimage,
  Check,
} from "lucide-react";
import { AuthAlert } from "@/components/ui/auth-alert";
import Link from "next/link";
import { UserProfile, CartResponse } from "@/lib/types";
import { avatarOptions } from "@/lib/arrays";

const StatCard = memo(({ icon, value, label, color }: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) => (
  <Card>
    <CardContent className="p-4 text-center">
      <div className={`h-8 w-8 mx-auto mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold" aria-label={label}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
));
StatCard.displayName = "StatCard";

const CartItem = memo(({ 
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
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href={`/magaza/${item.product_id}`} prefetch={false}>
          <Image
            src={item.product_image || "/placeholder-product.jpg"}
            alt={item.product_title}
            width={64}
            height={64}
            className="w-24 h-24 sm:w-16 sm:h-16 object-cover rounded mx-auto"
            loading="lazy"
            sizes="(max-width: 640px) 96px, 64px"
          />
        </Link>
        <div className="flex-1 w-full">
          <h4 className="font-medium text-center sm:text-left" itemProp="name">
            {item.product_title}
          </h4>
          <div className="space-y-1 text-sm text-muted-foreground mb-3">
            <p>Varyete: {item.variant_data.size}</p>
            <p>SKU: {item.variant_data.sku}</p>
          </div>
          <p className="font-medium text-center sm:text-left">
            {item.unit_price.toFixed(2)} ₺
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <span className="font-medium min-w-8 text-center" aria-label="Adet">
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
        <div className="text-right w-full sm:w-auto">
          <div className="font-medium text-center sm:text-right">
            {item.line_total.toFixed(2)} ₺
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveFromCart(item.cart_item_id)}
            disabled={itemLoading === item.cart_item_id}
            className="mt-2 text-red-600 hover:text-red-700 mx-auto sm:mx-0"
            aria-label="Sepetten Kaldır"
          >
            {itemLoading === item.cart_item_id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
));
CartItem.displayName = "CartItem";

const AvatarSelector = memo(({ 
  avatarOptions, 
  editForm, 
  userDetail, 
  onSelectAvatar, 
  onClose 
}: {
  avatarOptions: string[];
  editForm: any;
  userDetail: UserProfile;
  onSelectAvatar: (avatar: string) => void;
  onClose: () => void;
}) => (
  <Card className="p-4">
    <div className="mb-3 flex items-center justify-between">
      <h4 className="font-medium">Avatar Seç</h4>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        aria-label="Kapat"
      >
        ✕
      </Button>
    </div>
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {avatarOptions.map((avatar, index) => (
        <div
          key={index}
          className="group relative flex flex-col sm:flex-row items-center justify-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 cursor-pointer"
          onClick={() => onSelectAvatar(avatar)}
          aria-label="Avatar Seçenekleri"
        >
          <div
            className={`
              relative w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center transition-all
              ${
                editForm.avatar_url === avatar
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300"
              }
            `}
          >
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage
                src={avatar}
                alt={userDetail.profile?.full_name}
                loading="lazy"
              />
              <AvatarFallback>
                {userDetail.profile?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "K"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black bg-opacity-10 rounded-full transition-all opacity-0 group-hover:opacity-100 pointer-events-none" />
            {userDetail.profile.avatar_url === avatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-20 rounded-full">
                <Check className="h-6 w-6 text-blue-600 bg-white rounded-full p-1" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    <p className="text-xs text-muted-foreground mt-3 text-center">
      Bir avatar seçmek için üzerine tıklayın, ardından değişiklikleri kaydedin.
    </p>
  </Card>
));
AvatarSelector.displayName = "AvatarSelector";

export const ProfileSection = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    full_name: "",
    avatar_url: "",
  });
  const [itemLoading, setItemLoading] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const showAlertMessage = useCallback((message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowAlert(false);
      setTimeout(() => setAlertMessage(null), 300);
    }, 4000);
  }, []);

  const {
    data: userDetail,
    isLoading: loading,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<UserProfile> => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Giriş yapmanız gerekmektedir.");
      }

      const { data, error } = await supabase.rpc("get_user_profile");

      if (error) {
        throw new Error("Profil yüklenemedi.");
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userDetail) {
      setEditForm({
        username: userDetail.profile.username || "",
        full_name: userDetail.profile.full_name || "",
        avatar_url: userDetail.profile.avatar_url || "",
      });
    }
  }, [userDetail]);

  const {
    data: cartData,
    isLoading: cartLoading,
  } = useQuery({
    queryKey: ['userCart'],
    queryFn: async (): Promise<CartResponse> => {
      const { data, error } = await supabase.rpc("get_user_cart");
      if (error) throw new Error("Sepet yüklenemedi.");
      return data;
    },
    enabled: activeTab === 'cart',
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: typeof editForm) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userDetail?.profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEditing(false);
      setShowAvatarSelector(false);
      showAlertMessage("Profil başarıyla güncellendi.");
    },
    onError: () => {
      showAlertMessage("Profil güncellenemedi.");
    }
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
      showAlertMessage("Ürün sepetten kaldırıldı.");
    },
    onError: () => {
      showAlertMessage("Ürün sepetten kaldırılamadı.");
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
      showAlertMessage("Adet güncellendi.");
    },
    onError: () => {
      showAlertMessage("Adet güncellenemedi.");
    }
  });

  const handleSaveProfile = useCallback(() => {
    updateProfileMutation.mutate(editForm);
  }, [editForm, updateProfileMutation]);

  const handleSelectAvatar = useCallback((avatarUrl: string) => {
    setEditForm((prev) => ({ ...prev, avatar_url: avatarUrl }));
    setShowAvatarSelector(false);
    showAlertMessage("Avatar seçildi! Değişiklikleri kaydetmeyi unutmayın.");
  }, [showAlertMessage]);

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

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  useEffect(() => {
    if (profileError) {
      showAlertMessage(profileError.message);
    }
  }, [profileError, showAlertMessage]);

  if (loading && !userDetail) {
    return (
      <section className="container flex flex-col items-center justify-center mx-auto max-w-6xl min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Profiliniz yükleniyor...</p>
      </section>
    );
  }

  if (!userDetail) {
    return (
      <AuthAlert
        icon={<User />}
        description="Profilinizi görüntülemek için lütfen giriş yapın."
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Alert Message */}
      {alertMessage && (
        <div
          className={`
            fixed left-1/2 bottom-8 z-50
            transform -translate-x-1/2
            transition-all duration-300 ease-in-out
            ${
              showAlert
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }
            w-full max-w-md px-4
          `}
          role="alert"
          aria-live="assertive"
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
            <AlertDescription className="text-center font-medium">
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Profil</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Kullanıcı bilgilerinizi güncellemek veya görüntülemek için aşağıdaki
          alanları kullanabilirsiniz.
        </p>
      </div>
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full h-full w-full flex justify-center items-center overflow-hidden bg-gray-200 mx-auto">
            {userDetail.profile.avatar_url ? (
              <div className="w-36 h-36 flex flex-col items-center justify-center">
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={userDetail.profile.avatar_url}
                    alt={userDetail.profile.username}
                    loading="eager"
                    fetchPriority="high"
                  />
                  <AvatarFallback>
                    {userDetail.profile?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "K"}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        <h1 className="text-xl md:text-2xl font-bold mb-2" itemProp="username">
          {userDetail.profile.username}
        </h1>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" itemProp="name">
          {userDetail.profile.full_name}
        </h1>
        <p className="text-muted-foreground" itemProp="email">
          {userDetail.profile.email}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Üyelik başlangıcı: {formatDate(userDetail.profile.profile_created_at)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Package className="h-8 w-8" />}
          value={userDetail.order_stats.total_orders}
          label="Toplam Sipariş"
          color="text-blue-600"
        />
        <StatCard
          icon={<ShoppingCart className="h-8 w-8" />}
          value={userDetail.cart_summary.items_count}
          label="Sepetteki Ürünler"
          color="text-green-600"
        />
        <StatCard
          icon={<CreditCard className="h-8 w-8" />}
          value={`${userDetail.order_stats.lifetime_value.toFixed(0)} ₺`}
          label="Toplam Harcama"
          color="text-purple-600"
        />
        <StatCard
          icon={<Clock className="h-8 w-8" />}
          value={userDetail.order_stats.pending_orders}
          label="Bekleyen Siparişler"
          color="text-orange-600"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Genel Bakış</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Siparişler</span>
          </TabsTrigger>
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Sepet</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Ayarlar</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tamamlanan Siparişler:</span>
                  <span className="font-medium">
                    {userDetail.order_stats.completed_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kargoya Verilen Siparişler:</span>
                  <span className="font-medium">
                    {userDetail.order_stats.shipped_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ortalama Sipariş Tutarı:</span>
                  <span className="font-medium">
                    {userDetail.order_stats.avg_order_value.toFixed(2)} ₺
                  </span>
                </div>
                {userDetail.order_stats.last_order_date && (
                  <div className="flex justify-between">
                    <span>Son Sipariş:</span>
                    <span className="font-medium">
                      {formatDate(userDetail.order_stats.last_order_date)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sepet Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sepetteki Ürün Sayısı:</span>
                  <span className="font-medium">
                    {userDetail.cart_summary.items_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Toplam Adet:</span>
                  <span className="font-medium">
                    {userDetail.cart_summary.total_quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sepet Tutarı:</span>
                  <span className="font-medium">
                    {userDetail.cart_summary.cart_value?.toFixed(2) || "0.00"} ₺
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Son Siparişler</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetail.recent_orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Henüz siparişiniz yok</h3>
                  <p className="text-muted-foreground">
                    Sipariş geçmişiniz burada görünecek.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userDetail.recent_orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium" aria-label="Sipariş Numarası">
                            Sipariş #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)} • {order.items_count} ürün
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {order.total_amount.toFixed(2)} ₺
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status === "completed"
                              ? "Tamamlandı"
                              : order.status === "shipped"
                              ? "Kargoya Verildi"
                              : order.status === "pending"
                              ? "Bekliyor"
                              : order.status === "cancelled"
                              ? "İptal Edildi"
                              : order.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          <span aria-label="Siparişi Görüntüle">Görüntüle</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart" className="space-y-6">
          {cartLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !cartData || cartData.cart_items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sepetiniz boş</h3>
                <p className="text-muted-foreground">
                  Sepetinize ürün eklediğinizde burada görebilirsiniz.
                </p>
              </CardContent>
            </Card>
          ) : (
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

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Toplam: {cartData.total.toFixed(2)} ₺
                    </span>
                    <Link href="/sepet" prefetch={false} className="inline-block">
                      <Button aria-label="Ödeme Adımına Geç">Ödeme Yap</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profil Ayarları</CardTitle>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => {
                  if (isEditing) {
                    setEditForm({
                      username: userDetail.profile.username || "",
                      full_name: userDetail.profile.full_name || "",
                      avatar_url: userDetail.profile.avatar_url || "",
                    });
                  }
                  setIsEditing(!isEditing);
                }}
                aria-label={isEditing ? "İptal Et" : "Profili Düzenle"}
              >
                {isEditing ? "İptal Et" : "Profili Düzenle"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-22 h-22 rounded-full overflow-hidden bg-gray-200">
                    {editForm.avatar_url ? (
                      <Avatar className="h-full w-full">
                        <AvatarImage src={editForm.avatar_url} alt="Avatar" loading="lazy" />
                        <AvatarFallback>
                          {userDetail.profile?.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "K"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-6 flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setShowAvatarSelector(!showAvatarSelector)
                        }
                        title="Galeriden Seç"
                        aria-label="Avatar Seç"
                      >
                        <Pimage className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Selector */}
              {isEditing && showAvatarSelector && (
                <AvatarSelector
                  avatarOptions={avatarOptions}
                  editForm={editForm}
                  userDetail={userDetail}
                  onSelectAvatar={handleSelectAvatar}
                  onClose={() => setShowAvatarSelector(false)}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Input
                    id="username"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Ad Soyad</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    value={userDetail.profile.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setShowAvatarSelector(false);
                      setEditForm({
                        username: userDetail.profile.username || "",
                        full_name: userDetail.profile.full_name || "",
                        avatar_url: userDetail.profile.avatar_url || "",
                      });
                    }}
                    aria-label="İptal Et"
                  >
                    İptal Et
                  </Button>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={updateProfileMutation.isPending} 
                    aria-label="Kaydet"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      "Değişiklikleri Kaydet"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};