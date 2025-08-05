// checkout-types.ts
export interface CartItem {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  quantity: number;
  selected_price: string;
  selected_size?: string;
  selected_weight?: string;
  total_price: number;
  status: string;
  purchase_timestamp: string;
  time_ago: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}