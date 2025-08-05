export type Product = {
  title: string;
  description: string;
  category: string[];
  images: string[];
  featured?: boolean;
  variants?: { variants: ProductVariant[] };
  ratings_average: number;
  ratings_count: number;
  likes_count: number;
  comments_count: number;
  user_cart_quantity?: number;
  user_has_liked?: boolean;
  user_rating?: number;
};

export interface ProductCardProps {
  product: Product;
  userAuthenticated: boolean;
}

export interface Pagination {
  total_count: number;
  page_offset: number;
  page_limit: number;
  has_next: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
  user_authenticated: boolean;
}

export type UserProfile = {
  profile: {
    id: string;
    username: string;
    full_name: string;
    email: string;
    avatar_url: string;
    profile_created_at: string;
  };
  order_stats: {
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    shipped_orders: number;
    lifetime_value: number;
    avg_order_value: number;
    last_order_date: string;
  };
  recent_orders: Array<{
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    items_count: number;
  }>;
  cart_summary: {
    items_count: number;
    total_quantity: number;
    cart_value: number;
  };
};

export type CartItem = {
  cart_item_id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  variant_id: string;
  variant_data: {
    id: string;
    sku: string;
    size: string;
    price: number;
    stock: number;
    weight: string;
    is_default: boolean;
  };
  quantity: number;
  unit_price: number;
  line_total: number;
  variant_stock: number;
  product_in_stock: boolean;
  added_at: string;
};

export type CartResponse = {
  total: number;
  summary: {
    subtotal: number;
    items_count: number;
    estimated_tax: number;
    shipping_cost: number;
    total_quantity: number;
  };
  cart_items: CartItem[];
};

export type ProductVariant = {
  id: string;
  size: string;
  weight: string;
  stock: number;
  price: number;
  is_default?: boolean;
};

export type Comment = {
  id: string;
  user: string;
  user_avatar: string | null;
  rating: number;
  comment: string;
  date: string;
  isOptimistic?: boolean;
};

export type ProductDetail = {
  product: Product;
  comments: Comment[];
  user_authenticated: boolean;
};

export interface PaginationControlsProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
  onPageSizeChange: (size: string) => void;
  onPageJump?: (pageNumber: number) => void;
}