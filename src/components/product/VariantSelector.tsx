import clsx from 'clsx';
import { Check } from 'lucide-react';
import type { Variant } from '@/types/db';

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string;
  onSelect: (variant: Variant) => void;
}

export default function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => {
        const isSelected = selectedVariantId === variant.id;
        const isOutOfStock = (variant.stock_quantity ?? 0) === 0;

        return (
          <button
            key={variant.id}
            onClick={() => !isOutOfStock && onSelect(variant)}
            disabled={isOutOfStock}
            className={clsx(
              "relative px-4 py-3 rounded-xl border transition-all duration-200 text-left min-w-[120px]",
              isSelected && !isOutOfStock
                ? "border-medical-primary bg-slate-50 ring-1 ring-medical-primary text-medical-primary" 
                : "border-slate-200 hover:border-medical-accent/50 bg-white text-slate-600",
              isOutOfStock && "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sm">{variant.size_name}</span>
              {isSelected && !isOutOfStock && <Check className="w-4 h-4 text-medical-primary" />}
            </div>
            
            <div className="mt-1 flex items-center justify-between gap-4">
              <span className="text-xs font-bold font-mono">
                {Number(variant.price).toFixed(3)} TND
              </span>
              {isOutOfStock && (
                <span className="text-[10px] text-red-500 font-bold uppercase">
                  Rupture
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
