"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { CartItem } from "@/lib/checkout-types";

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (itemId: string, newQuantity: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
  isUpdating: boolean;
}

const CartItemComponent = ({ item, onQuantityChange, onRemoveItem, isUpdating }: CartItemProps) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityIncrease = async () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    await onQuantityChange(item.id, newQuantity);
  };

  const handleQuantityDecrease = async () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      await onQuantityChange(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemoveItem(item.id);
  };

  const unitPrice = parseFloat(item.selected_price);
  const totalPrice = unitPrice * localQuantity;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
          {/* Product Image */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 mx-auto sm:mx-0">
            <Image
              src={item.product_image || '/placeholder-product.jpg'}
              alt={item.product_title}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2 w-full">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-base md:text-lg leading-tight">{item.product_title}</h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">{item.time_ago} eklendi</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isRemoving || isUpdating}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 self-center sm:self-start"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Variants */}
            <div className="flex gap-1 md:gap-2 flex-wrap justify-center sm:justify-start">
              <Badge variant="outline" className="text-xs">
                <Package className="w-3 h-3 mr-1" />
                {item.selected_price} ₺
              </Badge>
              {item.selected_size && (
                <Badge variant="outline" className="text-xs">
                  Boyut: {item.selected_size}
                </Badge>
              )}
              {item.selected_weight && (
                <Badge variant="outline" className="text-xs">
                  Ağırlık: {item.selected_weight}
                </Badge>
              )}
            </div>

            {/* Quantity Controls and Price */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 md:gap-3 order-2 sm:order-1">
                <span className="text-xs md:text-sm font-medium">Miktar:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleQuantityDecrease}
                    disabled={localQuantity <= 1 || isUpdating}
                    className="h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="px-2 md:px-3 py-1 text-sm font-medium min-w-[1.5rem] md:min-w-[2rem] text-center">
                    {localQuantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleQuantityIncrease}
                    disabled={isUpdating}
                    className="h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="text-center sm:text-right order-1 sm:order-2">
                <div className="text-lg md:text-xl font-bold text-blue-600">
                  {totalPrice.toFixed(2)} ₺
                </div>
                {localQuantity > 1 && (
                  <div className="text-xs text-gray-500">
                    {unitPrice.toFixed(2)} ₺ tanesi
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemComponent;
