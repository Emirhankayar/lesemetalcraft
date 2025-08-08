import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/lib/sbClient";
import { ProductsResponse } from "@/lib/types";

interface UseShopProductsParams {
  currentPage: number;
  pageSize: number;
}

export const useShopProducts = ({
  currentPage,
  pageSize,
}: UseShopProductsParams) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", currentPage, pageSize],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_shop_products", {
        page_limit: pageSize,
        page_offset: currentPage * pageSize,
      });
      if (error) throw error;
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

interface UsePopularProductsParams {
  maxResults?: number;
}

export const usePopularProducts = ({
  maxResults = 8,
}: UsePopularProductsParams) => {
  return useQuery<any[]>({
    queryKey: ["popularProducts", maxResults],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_popular_simple", {
        max_results: maxResults,
      });
      return data?.products || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

interface UseProductDetailParams {
  productId?: string;
}

export const useProductDetail = ({ productId }: UseProductDetailParams) => {
  return useQuery({
    queryKey: ["productDetail", productId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_product_detail", {
        product_uuid: productId,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
  });
};

interface UseProductLikeParams {
  productId?: string;
  onSuccess?: (liked: boolean) => void;
  onError?: () => void;
}

export const useProductLike = ({
  productId,
  onSuccess,
  onError,
}: UseProductLikeParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (like: boolean) => {
      const { error } = await supabase.rpc(
        like ? "like_product" : "unlike_product",
        {
          product_uuid: productId,
        }
      );
      if (error) throw error;
      return like;
    },
    onSuccess: (like) => {
      queryClient.invalidateQueries({ queryKey: ["productDetail", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.(like);
    },
    onError: (error) => {
      console.error("Like mutation error:", error);
      onError?.();
    },
  });
};

interface UseAddToCartParams {
  productId?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export const useAddToCart = ({
  productId,
  onSuccess,
  onError,
}: UseAddToCartParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      variantId,
      quantity,
    }: {
      variantId?: string | number;
      quantity: number;
    }) => {
      
      if (!variantId) {
        throw new Error("Variant ID is required");
      }
      
      const { data, error } = await supabase.rpc("add_to_cart", {
        product_uuid: productId,
        variant_id_param: variantId,
        quantity_param: quantity,
      });
      
      
      if (error || !data?.success) {
        throw error || new Error(data?.error || "Unknown error occurred");
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productDetail", productId] });
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
      onError?.();
    },
  });
};

export async function getGlobalPageMetadata() {
  return {
    title: "LESE Metalcraft - Kaliteli Metal İşçiliği ve Tasarım",
    description:
      "LESE Metalcraft ile kaliteli metal ürünler keşfedin. Özel tasarım metal işçiliği, metal objeler ve endüstriyel çözümler.",
  };
}

export async function getShopPageMetadata(page?: number, limit?: number) {
  const pageInfo = page && page > 1 ? ` - Sayfa ${page}` : "";

  return {
    title: `Mağaza${pageInfo} - LESE Metalcraft`,
    description:
      "LESE Metalcraft mağazasında kaliteli metal ürünleri keşfedin. Özel tasarım metal işçiliği, dekoratif objeler ve endüstriyel çözümler.",
    keywords: [
      "metal mağaza",
      "metal ürünler",
      "metalcraft",
      "online alışveriş",
      "metal aksesuar",
    ],
  };
}

export async function getProductMetadata(productId: string) {

  try {
    const { data, error } = await supabase.rpc("get_product_detail", {
      product_uuid: productId,
    });



    if (error) {
      console.error("Supabase error:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    const product = data.product;

    if (!product) {
      return null;
    }

    const productName = product.title || product.name || "Ürün";
    const price =
      product?.variants?.variants?.[0]?.price || product?.base_price;
    const priceText = price ? ` - ₺${price}` : "";

    const result = {
      title: `${productName}${priceText} - LESE Metalcraft`,
      description:
        product.description ||
        `${productName} ürünü LESE Metalcraft kalitesiyle. Detaylı bilgi ve satın alma için tıklayın.`,
      keywords: [
        productName,
        "metal ürün",
        "LESE Metalcraft",
        ...(product.categories?.map((cat: any) => cat.name) || []),
      ],
      images:
        product.images?.length > 0
          ? product.images.map((img: any) => ({
              url: img.image_url,
              alt: productName,
              width: 800,
              height: 600,
            }))
          : [],
      price: price,
      currency: "TRY",
      availability: product.variants?.variants?.some((v: any) => v.stock > 0)
        ? "in_stock"
        : "out_of_stock",
    };

    return result;
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return null;
  }
}
