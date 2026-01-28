'use client';

import { useCartStore } from '@/lib/store/cart';
import { Link } from '@/navigation';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Your Quote Request is Empty</h1>
        <p className="text-slate-600 mb-8">Browse our catalog to add medical supplies.</p>
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center gap-2 bg-medical-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Request for Quote</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                 {/* Placeholder */}
                 <span className="text-2xl">💊</span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.variantName}</p>
                <div className="mt-1 font-medium text-medical-blue">
                  {item.price.toFixed(3)} TND
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-2 hover:bg-slate-50 text-slate-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-slate-50 text-slate-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quote Summary</h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Estimated)</span>
                <span>{totalPrice().toFixed(3)} TND</span>
              </div>
              <div className="text-xs text-slate-400">
                * Final pricing including bulk discounts and delivery will be confirmed by our team.
              </div>
            </div>

            <Link 
              href="/checkout" 
              className="w-full bg-medical-blue text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Proceed to Request
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
