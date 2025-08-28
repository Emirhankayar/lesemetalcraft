import React, { useState } from "react";
import { Calculator, Info, ChevronDown, ChevronUp } from "lucide-react";

interface SelectedVariant {
  price?: number;
}

interface PriceSectionProps {
  selectedVariant?: SelectedVariant | null;
  quantity: number;
  collapsedByDefault?: boolean;
}

export const PriceSection: React.FC<PriceSectionProps> = ({
  selectedVariant,
  quantity,
  collapsedByDefault = false,
}) => {
  const [collapsed, setCollapsed] = useState(collapsedByDefault);

  const basePrice =
    selectedVariant?.price && quantity ? selectedVariant.price * quantity : 0;
  const vatAmount = basePrice * 0.2;
  const totalPrice = basePrice + vatAmount;

  const formattedBasePrice = `${basePrice.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
  const formattedVatAmount = `${vatAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
  const formattedTotalPrice = `${totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
  const formattedUnitPrice = `${(selectedVariant?.price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;

  return (
    <div className="rounded-lg border overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 transition rounded-t-lg"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="price-section-details"
      >
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          <span className="font-semibold">Fiyat</span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`font-bold text-green-600 text-lg transition-all duration-300
              ${!collapsed ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"}
            `}
          >
            {formattedTotalPrice}
          </span>

          <span className="flex items-center gap-1 text-primary font-medium">
            {collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </span>
        </div>
      </button>
      <div
        id="price-section-details"
        className={`
          transition-all duration-300 overflow-hidden
          ${collapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}
        `}
        style={{ willChange: "max-height, opacity" }}
      >
        {!collapsed && (
          <div className="space-y-4 p-4 border-t">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm">Ara Toplam</span>
                  <span className="font-medium">{formattedBasePrice}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">KDV</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
                      %20
                    </span>
                  </div>
                  <span className="font-medium">+{formattedVatAmount}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Toplam</span>
                    <span className="text-xl font-bold text-green-600">
                      {formattedTotalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span className="font-medium">{formattedBasePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span>KDV</span>
                      <span className="text-xs px-2 py-0.5 rounded-full">
                        %20
                      </span>
                    </div>
                    <span className="font-medium">+{formattedVatAmount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <div className="text-right">
                    <div className="text-sm mb-1">Toplam</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formattedTotalPrice}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {quantity > 1 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center gap-2 text-xs">
                  <Info className="h-3 w-3" />
                  <span>
                    {quantity} adet × {formattedUnitPrice} ={" "}
                    {formattedBasePrice}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
