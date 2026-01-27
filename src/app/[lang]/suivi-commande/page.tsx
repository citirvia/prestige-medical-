'use client';

import { useState } from 'react';
import { Package, CheckCircle, Truck, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupabaseService } from '@/services/supabase-service';
import { Order } from '@/types/db';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await SupabaseService.getOrder(orderId, phone);
      if (result) {
        setOrder(result);
      } else {
        setError("Commande introuvable. Vérifiez vos informations.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { status: 'pending', label: 'Reçu', icon: Package, description: 'Votre commande a été reçue' },
    { status: 'confirmed', label: 'Validé', icon: CheckCircle, description: 'Commande confirmée par Prestige Medical' },
    { status: 'out_for_delivery', label: 'En Livraison', icon: Truck, description: 'Votre colis est en route' },
    { status: 'completed', label: 'Livré', icon: CheckCircle, description: 'Commande livrée avec succès' },
  ];

  const getCurrentStepIndex = (status: string) => {
    const statusMap: Record<string, number> = {
      'pending': 0,
      'confirmed': 1,
      'in_preparation': 1,
      'out_for_delivery': 2,
      'completed': 3,
      'cancelled': -1
    };
    return statusMap[status] ?? 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Suivi de Commande</h1>
          <p className="text-slate-500">Entrez vos détails pour suivre votre colis</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de Commande</label>
              <input 
                type="text" 
                required
                placeholder="Ex: ord_123..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de Téléphone</label>
              <input 
                type="tel" 
                required
                placeholder="Ex: 50 123 456"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-medical-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  Suivre ma commande
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <div className="text-sm text-slate-500">Commande</div>
                  <div className="font-mono font-bold text-slate-900">#{order.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Total</div>
                  <div className="font-bold text-medical-primary">{order.total_price.toFixed(3)} TND</div>
                </div>
              </div>

              {order.status === 'cancelled' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-red-600 text-lg">Commande Annulée</h3>
                  <p className="text-slate-500 text-sm mt-2">Veuillez nous contacter pour plus d&apos;informations.</p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {steps.map((step, index) => {
                    const currentStepIndex = getCurrentStepIndex(order.status);
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="relative flex gap-4">
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                          isCompleted ? 'bg-medical-primary text-white' : 'bg-slate-100 text-slate-300'
                        }`}>
                          <Icon className="w-6 h-6" />
                          {isCurrent && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-medical-primary opacity-20" />
                          )}
                        </div>
                        <div className="pt-2">
                          <h4 className={`font-bold transition-colors ${
                            isCompleted ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </h4>
                          <p className="text-xs text-slate-500">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
