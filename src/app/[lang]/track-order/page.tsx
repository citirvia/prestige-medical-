'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { SupabaseService } from '@/services/supabase-service';
import { Order } from '@/types/db';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const found = await SupabaseService.getOrder(orderId, phone);
      if (found) {
        setOrder(found);
      } else {
        setError("Commande introuvable. Vérifiez le numéro de commande et le téléphone.");
      }
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'pending', label: 'Reçu', icon: Clock },
    { id: 'confirmed', label: 'Confirmé', icon: CheckCircle },
    { id: 'processing', label: 'En Préparation', icon: Package },
    { id: 'completed', label: 'Prêt / Livré', icon: Truck },
  ];

  const getCurrentStepIndex = (status: string) => {
    return steps.findIndex(s => s.id === status);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Suivi de Commande</h1>
          <p className="text-slate-500">
            Consultez l&apos;état de votre commande en temps réel sans vous connecter.
          </p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8"
        >
          <form onSubmit={handleTrack} className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Numéro de Commande</label>
              <input
                type="text"
                placeholder="Ex: ORD-1737..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Téléphone</label>
              <input
                type="tel"
                placeholder="Ex: 22 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-medical-primary text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Recherche...' : 'Suivre'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Commande #{order.id}</h2>
                  <p className="text-sm text-slate-500">Passée le {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold capitalize">
                  {order.status}
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Progress Bar */}
              <div className="relative mb-12">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-medical-primary -translate-y-1/2 rounded-full transition-all duration-500"
                  style={{ width: `${(getCurrentStepIndex(order.status) / (steps.length - 1)) * 100}%` }}
                />
                
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const isActive = index <= getCurrentStepIndex(order.status);
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${isActive ? 'bg-medical-primary text-white' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Summary */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Articles</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <div className="font-medium text-slate-900">{item.product_name}</div>
                        <div className="text-xs text-slate-500">{item.variant_name}</div>
                      </div>
                      <div className="text-sm font-mono">x{item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
