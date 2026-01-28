'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import VariantSelector from '@/components/product/VariantSelector';
import StockBadge from '@/components/product/StockBadge';
import { ShoppingCart, FileText, Download, ShieldCheck, Truck, Activity, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Product, Variant } from '@/types/db';
import { generateDatasheetPDF } from '@/lib/pdf-generator';
import { supabase } from '@/lib/supabase/client';

export default function ProductDetail({ product }: { product: Product & { variants: Variant[] } }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(product.variants[0]);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'docs'>('description');
  const [activeImage, setActiveImage] = useState<number>(0);
  const addItem = useCartStore((state) => state.addItem);
  const t = useTranslations('Product'); 

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name.fr,
      variantName: selectedVariant.size_name,
      price: selectedVariant.price,
      quantity: 1,
      image: product.image_url_list?.[0]
    });
  };

  // Realtime stock updates
  React.useEffect(() => {
    if (!selectedVariant) return;
    const channel = supabase
      .channel('variants-stock')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'variants', filter: `product_id=eq.${product.id}` },
        (payload) => {
          const updated = payload.new as Variant;
          setSelectedVariant((s) => (s && updated.id === s.id ? { ...s, stock_quantity: updated.stock_quantity, price: updated.price } : s));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id, selectedVariant?.id]);
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        
        {/* Left Column: Image & Brand */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="glass-card rounded-2xl p-8 bg-white relative overflow-hidden space-y-4">
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.brand}
              </span>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              {product.image_url_list?.[activeImage] ? (
                <img
                  src={product.image_url_list[activeImage]}
                  alt={product.name.fr}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">🩺</div>
              )}
            </div>
            <div className="flex gap-3">
              {(product.image_url_list || []).map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={clsx(
                    "w-16 h-16 rounded-lg overflow-hidden border",
                    activeImage === idx ? "border-medical-primary" : "border-slate-200 hover:border-slate-300"
                  )}
                  aria-label={`Image ${idx + 1}`}
                >
                  {url ? (
                    <img src={url} alt={`${product.name.fr} ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">🩺</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-medical-primary mb-2" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Garantie Certifiée</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl">
              <Truck className="w-6 h-6 text-medical-primary mb-2" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Livraison Rapide</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl">
              <Activity className="w-6 h-6 text-medical-primary mb-2" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Service Après-Vente</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Info & Actions */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight font-sans">
              {product.name.fr}
            </h1>
            {selectedVariant ? (
              <div className="flex items-center gap-3">
                <StockBadge 
                  status={(selectedVariant.stock_quantity ?? 0) === 0 ? 'out_of_stock' : (selectedVariant.stock_quantity ?? 0) < 10 ? 'low_stock' : 'in_stock'} 
                  quantity={selectedVariant.stock_quantity}
                />
                <span className="text-sm text-slate-400">Ref: {selectedVariant.sku}</span>
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                Indisponible
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-6">
            {selectedVariant ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-medical-primary">
                    {selectedVariant.price.toFixed(3)}
                  </span>
                  <span className="text-lg text-slate-500 font-medium">TND</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {t('variants')}
                  </label>
                  <VariantSelector 
                    variants={product.variants} 
                    selectedVariantId={selectedVariant.id} 
                    onSelect={(v) => setSelectedVariant(v)} 
                  />
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:block pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={(selectedVariant.stock_quantity ?? 0) === 0}
                    className="w-full bg-medical-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t('add_to_quote')}
                  </button>
                  <a
                    href={`https://wa.me/21656890908?text=${encodeURIComponent(`Bonjour Prestige Medical, je souhaite commander ${product.name.fr} (${selectedVariant.size_name}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Commander via WhatsApp
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">Ce produit n'a pas de variantes disponibles pour le moment.</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-t border-slate-200 pt-8">
            <div className="flex gap-8 border-b border-slate-200 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={clsx(
                  "pb-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                  activeTab === 'description' ? "text-medical-primary border-b-2 border-medical-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t('description')}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={clsx(
                  "pb-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                  activeTab === 'specs' ? "text-medical-primary border-b-2 border-medical-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t('tech_specs')}
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={clsx(
                  "pb-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                  activeTab === 'docs' ? "text-medical-primary border-b-2 border-medical-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Centre de Ressources
              </button>
            </div>

            <div className="min-h-[200px]">
              {activeTab === 'description' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-slate max-w-none text-slate-600">
                  <p>{product.description.fr}</p>
                  <ul>
                    <li>Qualité médicale certifiée</li>
                    <li>Utilisé par les professionnels de santé à Sfax</li>
                    <li>Garantie constructeur incluse</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.technical_specs || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-slate-600">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => generateDatasheetPDF(product, selectedVariant)}
                    className="mt-6 flex items-center gap-2 text-medical-primary font-bold hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    {t('download_sheet')}
                  </button>
                </motion.div>
              )}

              {activeTab === 'docs' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Downloads */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-slate-900 mb-2">Documents à Télécharger</h3>
                      <a href="#" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-medical-primary transition-colors group">
                        <div className="p-3 bg-white rounded-lg shadow-sm text-red-500 group-hover:text-red-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Manuel d&apos;utilisation</div>
                          <div className="text-xs text-slate-500">PDF • 2.4 MB</div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 ml-auto group-hover:text-medical-primary" />
                      </a>
                      
                      <a href="#" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-medical-primary transition-colors group">
                        <div className="p-3 bg-white rounded-lg shadow-sm text-blue-500 group-hover:text-blue-600">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Certificat de Conformité</div>
                          <div className="text-xs text-slate-500">PDF • 1.1 MB</div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 ml-auto group-hover:text-medical-primary" />
                      </a>
                    </div>

                    {/* Video Mockup */}
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4">Vidéo de Démonstration</h3>
                      <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white font-bold text-sm">
                          Comment utiliser le {product.name.fr}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Sticky CTA */}
      {selectedVariant && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40 glass-panel m-0 rounded-none shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-bold uppercase">Total</span>
              <span className="text-lg font-bold text-medical-primary">{selectedVariant.price.toFixed(3)} TND</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={(selectedVariant.stock_quantity ?? 0) === 0}
              className="flex-1 bg-medical-primary text-white py-3 rounded-xl font-bold text-sm shadow-md disabled:opacity-50"
            >
              {t('add_to_quote')}
            </button>
            <a
              href={`https://wa.me/21656890908?text=${encodeURIComponent(`Bonjour Prestige Medical, je souhaite commander ${product.name.fr} (${selectedVariant.size_name}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-md text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
