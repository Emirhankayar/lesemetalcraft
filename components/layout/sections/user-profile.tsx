"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/sbClient";
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
import { UserProfile, CartResponse } from "@/lib/types" 
import { avatarOptions } from "@/lib/arrays";

export const ProfileSection = () => {
  const supabase = createClient();

  const [userDetail, setUserDetail] = useState<UserProfile | null>(null);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowAlert(false);
      setTimeout(() => setAlertMessage(null), 300);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [supabase]);

  useEffect(() => {
    if (activeTab === "cart") {
      fetchCartData();
    }
  }, [activeTab, supabase]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        showAlertMessage("Authentication required");
        return;
      }

      const { data, error } = await supabase.rpc("get_user_profile");

      if (error) {
        console.error("Profile fetch error:", error);
        showAlertMessage("Failed to load profile");
        return;
      }

      setUserDetail(data);
      setEditForm({
        username: data.profile.username || "",
        full_name: data.profile.full_name || "",
        avatar_url: data.profile.avatar_url || "",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      showAlertMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    try {
      const { data, error } = await supabase.rpc("get_user_cart");

      if (error) {
        console.error("Cart fetch error:", error);
        return;
      }

      setCartData(data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          username: editForm.username,
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userDetail?.profile.id);

      if (error) {
        console.error("Update error:", error);
        showAlertMessage("Failed to update profile");
        return;
      }

      await fetchUserProfile();
      setIsEditing(false);
      setShowAvatarSelector(false);
      showAlertMessage("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      showAlertMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAvatar = (avatarUrl: string) => {
    setEditForm((prev) => ({ ...prev, avatar_url: avatarUrl }));
    setShowAvatarSelector(false);
    showAlertMessage("Avatar selected! Don't forget to save changes.");
  };

  const handleRemoveFromCart = async (cart_item_id: string) => {
    setItemLoading(cart_item_id);

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cart_item_id);

      if (error) {
        console.error("Remove error:", error);
        showAlertMessage("Failed to remove item");
        return;
      }

      await fetchCartData();
      await fetchUserProfile();
      showAlertMessage("Item removed from cart");
    } catch (err) {
      console.error("Remove error:", err);
      showAlertMessage("Failed to remove item");
    } finally {
      setItemLoading(null);
    }
  };

  const handleUpdateQuantity = async (
    cart_item_id: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    setItemLoading(cart_item_id);

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cart_item_id);

      if (error) {
        console.error("Update error:", error);
        showAlertMessage("Failed to update quantity");
        return;
      }

      await fetchCartData();
      await fetchUserProfile();
      showAlertMessage("Quantity updated");
    } catch (err) {
      console.error("Update error:", err);
      showAlertMessage("Failed to update quantity");
    } finally {
      setItemLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !userDetail) {
    return (
      <section className="container flex flex-col items-center justify-center mx-auto max-w-6xl min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </section>
    );
  }

  if (!userDetail) {return <AuthAlert icon={<User/>} description="Please log in to view your profile." />}

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Alert Message */}
      {alertMessage && (
        <div
          className={`
            fixed left-1/2 top-20 z-50
            transform -translate-x-1/2
            transition-all duration-300 ease-in-out
            ${
              showAlert
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }
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

      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full h-full w-full flex justify-center  items-center overflow-hidden bg-gray-200 mx-auto">
            {userDetail.profile.avatar_url ? (
              <div className="w-36 h-36 flex flex-col items-center justify-center">
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={userDetail.profile.avatar_url}
                    alt={userDetail.profile.username}
                  />
                  <AvatarFallback>
                    {userDetail.profile?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
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
        <h1 className="text-xl md:text-2xl font-bold mb-2">
          {userDetail.profile.username}
        </h1>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {userDetail.profile.full_name}
        </h1>
        <p className="text-muted-foreground">{userDetail.profile.email}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Member since {formatDate(userDetail.profile.profile_created_at)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">
              {userDetail.order_stats.total_orders}
            </div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">
              {userDetail.cart_summary.items_count}
            </div>
            <div className="text-sm text-muted-foreground">Cart Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">
              {userDetail.order_stats.lifetime_value.toFixed(0)} ₺
            </div>
            <div className="text-sm text-muted-foreground">Lifetime Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">
              {userDetail.order_stats.pending_orders}
            </div>
            <div className="text-sm text-muted-foreground">Pending Orders</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Completed Orders:</span>
                  <span className="font-medium">
                    {userDetail.order_stats.completed_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipped Orders:</span>
                  <span className="font-medium">
                    {userDetail.order_stats.shipped_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Order Value:</span>
                  <span className="font-medium">
                    {userDetail.order_stats.avg_order_value.toFixed(2)} ₺
                  </span>
                </div>
                {userDetail.order_stats.last_order_date && (
                  <div className="flex justify-between">
                    <span>Last Order:</span>
                    <span className="font-medium">
                      {formatDate(userDetail.order_stats.last_order_date)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cart Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Items in Cart:</span>
                  <span className="font-medium">
                    {userDetail.cart_summary.items_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity:</span>
                  <span className="font-medium">
                    {userDetail.cart_summary.total_quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cart Value:</span>
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
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetail.recent_orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Your order history will appear here.
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
                          <div className="font-medium">
                            Order #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)} • {order.items_count}{" "}
                            items
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {order.total_amount.toFixed(2)} ₺
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
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
          {!cartData ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : cartData.cart_items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground">
                  Add products to your cart to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {cartData.cart_items.map((item) => (
                <Card key={item.cart_item_id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.product_image || "/placeholder-product.jpg"}
                        alt={item.product_title}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.variant_data.size} • SKU:{" "}
                          {item.variant_data.sku}
                        </p>
                        <p className="font-medium">
                          {item.unit_price.toFixed(2)} ₺
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cart_item_id,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1 ||
                            itemLoading === item.cart_item_id
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="font-medium min-w-8 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cart_item_id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >= item.variant_stock ||
                            itemLoading === item.cart_item_id
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.line_total.toFixed(2)} ₺
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRemoveFromCart(item.cart_item_id)
                          }
                          disabled={itemLoading === item.cart_item_id}
                          className="mt-2 text-red-600 hover:text-red-700"
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
              ))}

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Total: {cartData.total.toFixed(2)} ₺
                    </span>
                    <Link href="/sepet" className="inline-block">
                    <Button>Proceed to Checkout</Button>
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
              <CardTitle>Profile Settings</CardTitle>
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
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-22 h-22 rounded-full overflow-hidden bg-gray-200">
                    {editForm.avatar_url ? (
                      <Avatar className="h-full w-full">
                        <AvatarImage src={editForm.avatar_url} alt="Avatar" />
                        <AvatarFallback>
                          {userDetail.profile?.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
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
                        title="Choose from gallery"
                      >
                        <Pimage className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Selector */}
              {isEditing && showAvatarSelector && (
                <Card className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">Choose an Avatar</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAvatarSelector(false)}
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {avatarOptions.map((avatar, index) => (
                      <div
                        key={index}
                        className="group relative flex flex-col sm:flex-row items-center justify-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
                        onClick={() => handleSelectAvatar(avatar)}
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
                          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 cursor-pointer">
                            <AvatarImage
                              src={avatar}
                              alt={userDetail.profile?.full_name}
                            />
                            <AvatarFallback>
                              {userDetail.profile?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {/* Only show overlay on hover */}
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
                    Click on an avatar to select it, then save your changes
                  </p>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
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
                  <Label htmlFor="full_name">Full Name</Label>
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
                  <Label htmlFor="email">Email</Label>
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
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
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
