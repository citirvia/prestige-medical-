'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from '@/navigation';
import { Check, ChevronRight, Building2, User, Truck, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { SupabaseService } from '@/services/supabase-service';

type Step = 'entity' | 'details' | 'logistics' | 'summary';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('entity');
  const [mounted, setMounted] = useState(false);
  
  // Form State
  const [entityType, setEntityType] = useState<'professional' | 'individual' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pickup: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return <div className="p-16 text-center text-slate-500">Your cart is empty.</div>;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const order = await SupabaseService.createOrder({
        customer_type: entityType === 'professional' ? 'clinic' : 'individual',
        status: 'pending',
        total_price: totalPrice(),
        customer_details: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: 'Sfax'
        },
        logistics_type: formData.pickup ? 'pickup' : 'delivery',
        items: items.map(item => ({
          id: '', // placeholder; DB will generate UUID
          order_id: '',
          variant_id: item.id,
          quantity: item.quantity,
          price_at_time_of_order: item.price,
          product_name: item.name,
          variant_name: item.variantName
        }))
      });
      const msg = `Bonjour Prestige Medical, j'ai passé la commande #${order?.id} au nom de ${formData.name}. Merci de confirmer la disponibilité.`;
      const whatsappUrl = `https://wa.me/21656890908?text=${encodeURIComponent(msg)}`;
      clearCart();
      window.open(whatsappUrl, '_blank');
      router.push('/track-order');
    } catch {
      // optionally show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Request Quote</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
          <span className={clsx(step === 'entity' && "text-medical-blue font-bold")}>1. Profile</span>
          <ChevronRight className="w-4 h-4" />
          <span className={clsx(step === 'details' && "text-medical-blue font-bold")}>2. Details</span>
          <ChevronRight className="w-4 h-4" />
          <span className={clsx(step === 'logistics' && "text-medical-blue font-bold")}>3. Logistics</span>
          <ChevronRight className="w-4 h-4" />
          <span className={clsx(step === 'summary' && "text-medical-blue font-bold")}>4. Review</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        
        {/* Step 1: Entity Type */}
        {step === 'entity' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Who are you ordering for?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setEntityType('professional')}
                className={clsx(
                  "flex flex-col items-center p-6 border-2 rounded-xl transition-all",
                  entityType === 'professional' ? "border-medical-blue bg-blue-50" : "border-slate-200 hover:border-slate-300"
                )}
              >
                <Building2 className={clsx("w-12 h-12 mb-4", entityType === 'professional' ? "text-medical-blue" : "text-slate-400")} />
                <span className="font-bold text-lg">Clinic / Pharmacy</span>
                <span className="text-sm text-slate-500 text-center mt-2">I need a formal pro-forma invoice and bulk pricing.</span>
              </button>

              <button
                onClick={() => setEntityType('individual')}
                className={clsx(
                  "flex flex-col items-center p-6 border-2 rounded-xl transition-all",
                  entityType === 'individual' ? "border-medical-blue bg-blue-50" : "border-slate-200 hover:border-slate-300"
                )}
              >
                <User className={clsx("w-12 h-12 mb-4", entityType === 'individual' ? "text-medical-blue" : "text-slate-400")} />
                <span className="font-bold text-lg">Personal Use</span>
                <span className="text-sm text-slate-500 text-center mt-2">I am ordering for myself or a patient.</span>
              </button>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                disabled={!entityType}
                onClick={() => setStep('details')}
                className="bg-medical-blue text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Contact Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:outline-none"
                  placeholder="Dr. Ahmed Ben Ali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:outline-none"
                  placeholder="+216 50 123 456"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Email (Optional)</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:outline-none"
                  placeholder="contact@clinic.com"
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep('entity')} className="text-slate-600 font-medium">Back</button>
              <button 
                disabled={!formData.name || !formData.phone}
                onClick={() => setStep('logistics')}
                className="bg-medical-blue text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Logistics */}
        {step === 'logistics' && (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-slate-900">Delivery Method</h2>
             <div className="grid md:grid-cols-2 gap-4">
               <button
                 onClick={() => setFormData({...formData, pickup: false})}
                 className={clsx(
                   "flex items-center p-4 border-2 rounded-xl transition-all gap-4 text-left",
                   !formData.pickup ? "border-medical-blue bg-blue-50" : "border-slate-200"
                 )}
               >
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100">
                   <Truck className="w-5 h-5 text-slate-700" />
                 </div>
                 <div>
                   <span className="font-bold block">Delivery</span>
                   <span className="text-sm text-slate-500">We ship to your address (24-48h).</span>
                 </div>
               </button>

               <button
                 onClick={() => setFormData({...formData, pickup: true})}
                 className={clsx(
                   "flex items-center p-4 border-2 rounded-xl transition-all gap-4 text-left",
                   formData.pickup ? "border-medical-blue bg-blue-50" : "border-slate-200"
                 )}
               >
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100">
                   <MapPin className="w-5 h-5 text-slate-700" />
                 </div>
                 <div>
                   <span className="font-bold block">Pickup in Sfax</span>
                   <span className="text-sm text-slate-500">Route Manzel Chaker km 0.5</span>
                 </div>
               </button>
             </div>

             {!formData.pickup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Delivery Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:outline-none"
                    placeholder="Full address (City, Street, Building...)"
                    rows={3}
                  />
                </div>
             )}

             <div className="flex justify-between pt-4">
              <button onClick={() => setStep('details')} className="text-slate-600 font-medium">Back</button>
              <button 
                disabled={!formData.pickup && !formData.address}
                onClick={() => setStep('summary')}
                className="bg-medical-blue text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 'summary' && (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-slate-900">Review Request</h2>
             
             <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm text-slate-600">
               <p><span className="font-bold">Name:</span> {formData.name}</p>
               <p><span className="font-bold">Phone:</span> {formData.phone}</p>
               <p><span className="font-bold">Type:</span> {entityType === 'professional' ? 'Clinic / Pharmacy' : 'Individual'}</p>
               <p><span className="font-bold">Method:</span> {formData.pickup ? 'Pickup in Sfax' : `Delivery to: ${formData.address}`}</p>
             </div>

             <div className="border-t border-slate-200 pt-4">
               <h3 className="font-bold mb-2">Items</h3>
               <ul className="space-y-2">
                 {items.map(item => (
                   <li key={item.id} className="flex justify-between text-sm">
                     <span>{item.quantity}x {item.name} ({item.variantName})</span>
                     <span className="font-medium">{(item.price * item.quantity).toFixed(3)} TND</span>
                   </li>
                 ))}
               </ul>
               <div className="flex justify-between font-bold text-lg mt-4 border-t border-slate-200 pt-2">
                 <span>Estimated Total</span>
                 <span>{totalPrice().toFixed(3)} TND</span>
               </div>
             </div>

             <div className="flex justify-between pt-4">
              <button onClick={() => setStep('logistics')} className="text-slate-600 font-medium">Back</button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-medical-blue text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? 'Processing...' : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
