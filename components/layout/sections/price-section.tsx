import React from 'react';
import { Calculator, Info } from 'lucide-react';

interface SelectedVariant {
  price?: number;
}

interface PriceSectionProps {
  selectedVariant?: SelectedVariant | null;
  quantity: number;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ selectedVariant, quantity }) => {
  const basePrice = selectedVariant?.price && quantity ? selectedVariant.price * quantity : 0;
  const vatAmount = basePrice * 0.2;
  const totalPrice = basePrice + vatAmount;

  return (
    <div className="space-y-4 p-4 rounded-lg border">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Fiyat Detayı
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-sm">Ara Toplam</span>
            <span className="font-medium">
              {basePrice.toFixed(2)} ₺
            </span>
          </div>
          
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-1">
              <span className="text-sm">KDV</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
                %20
              </span>
            </div>
            <span className="font-medium">
              +{vatAmount.toFixed(2)} ₺
            </span>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">Toplam</span>
              <span className="text-xl font-bold text-green-600">
                {totalPrice.toFixed(2)} ₺
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
              <span className="font-medium">{basePrice.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span>KDV</span>
                <span className="text-xs px-2 py-0.5 rounded-full">
                  %20
                </span>
              </div>
              <span className="font-medium">+{vatAmount.toFixed(2)} ₺</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <div className="text-right">
              <div className="text-sm mb-1">Ödenecek Tutar</div>
              <div className="text-2xl font-bold text-green-600">
                {totalPrice.toFixed(2)} ₺
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
              {quantity} adet × {selectedVariant?.price?.toFixed(2)} ₺ = {basePrice.toFixed(2)} ₺
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
