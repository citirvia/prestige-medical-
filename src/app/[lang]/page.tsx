'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const t = useTranslations('Home');
  const common = useTranslations('Common');

  return (
    <div className="flex flex-col gap-12 pb-12 bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-primary"></span>
              </span>
              Leader à Sfax & Sud Tunisien
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                {t('heroTitle')}
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="group relative inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
              >
                {t('browseCatalog')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
              >
                Demander un Devis
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto">
          {/* Main Feature - Large */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-medical-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Qualité Certifiée</h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                Nous distribuons exclusivement des équipements médicaux certifiés ISO & CE. 
                Garantie constructeur et service après-vente assuré à Sfax.
              </p>
            </div>
            
            <div className="mt-8 relative h-48 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
              <div className="text-slate-300 font-bold text-6xl opacity-20 select-none">ISO 9001</div>
            </div>
          </motion.div>

          {/* Secondary Feature */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col justify-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <Truck className="w-10 h-10 text-medical-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Livraison Express</h3>
            <p className="text-slate-400 text-sm">Partout en Tunisie sous 24/48h.</p>
          </motion.div>

          {/* Tertiary Feature */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-center"
          >
            <Award className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Service Pro</h3>
            <p className="text-slate-600 text-sm">Devis rapide et facturation conforme.</p>
          </motion.div>
        </div>
      </section>
      
      {/* Sfax Presence */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-4xl mx-auto shadow-sm">
           <MapPin className="w-12 h-12 text-medical-primary mx-auto mb-6" />
           <h2 className="text-3xl font-bold text-slate-900 mb-4">Basé à Sfax, au service de la Tunisie</h2>
           <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
             Notre showroom est situé Route Manzel Chaker. Venez découvrir nos équipements et échanger avec nos conseillers techniques.
           </p>
           <div className="flex justify-center gap-4">
             <button className="flex items-center gap-2 text-slate-900 font-bold hover:text-medical-primary transition-colors">
               <Phone className="w-5 h-5" />
               +216 56 890 908
             </button>
           </div>
        </div>
      </section>
    </div>
  );
}
