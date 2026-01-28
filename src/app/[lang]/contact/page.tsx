'use client';

import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contactez-nous</h1>
            <p className="text-xl text-slate-600">
              Notre équipe à Sfax est à votre disposition pour toute demande d&apos;information ou devis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Nos Coordonnées</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-medical-primary rounded-xl">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Adresse</h4>
                      <p className="text-slate-600">Route Manzel Chaker km 0.5<br />Avenue Fardaws, Sfax 3000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-medical-primary rounded-xl">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Téléphone</h4>
                      <p className="text-slate-600">+216 56 890 908<br />+216 28 307 273</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-medical-primary rounded-xl">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Email</h4>
                      <p className="text-slate-600">presmed.sfax@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-medical-primary rounded-xl">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Horaires</h4>
                      <p className="text-slate-600">Lun - Sam: 08:00 - 18:00<br />Dimanche: Urgences uniquement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder - Google Maps Sfax */}
              <div className="bg-slate-200 rounded-3xl h-64 w-full overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.291771032688!2d10.7497!3d34.7406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002cda1486c695%3A0x222e7d69280b22c6!2sSfax!5e0!3m2!1sen!2stn!4v1625680000000!5m2!1sen!2stn" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Envoyer un Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Prénom</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Votre prénom" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nom</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Votre nom" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email / Téléphone</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Comment vous contacter ?" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Sujet</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600">
                    <option>Demande de Devis</option>
                    <option>Information Produit</option>
                    <option>Service Après-Vente</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" placeholder="Votre message..." />
                </div>

                <button type="submit" className="w-full py-4 bg-medical-primary text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
                  <Send className="w-5 h-5" />
                  Envoyer le Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
