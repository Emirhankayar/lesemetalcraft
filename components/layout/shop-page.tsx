"use client";
import { ProductList } from "@/components/layout/sections/product-list";

export default function ShopPage() {
  return (
    <div className="container">
      <div className="flex flex-col py-32 mx-auto max-w-6xl">
        <ProductList />
      </div>
    </div>
  );
}
