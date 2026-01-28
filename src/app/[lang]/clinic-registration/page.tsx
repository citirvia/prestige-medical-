'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Phone, MapPin, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { SupabaseService } from '@/services/supabase-service';

export default function ClinicRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: '',
    licenseId: '',
    specialty: '',
    contactName: '',
    phone: '',
    email: '',
    city: 'Sfax',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SupabaseService.createClinicRegistration({
        clinic_name: formData.clinicName,
        doctor_name: formData.contactName,
        specialty: formData.specialty,
        license_number: formData.licenseId,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city
      });
    } catch {
      alert('Échec de l’envoi. Réessayez.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 max-w-lg w-full text-center shadow-xl border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Demande Envoyée !</h2>
          <p className="text-slate-600 mb-8">
            Votre dossier a été transmis à notre équipe commerciale. Un conseiller vous contactera sous 24h pour valider votre compte professionnel.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-medical-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Retour à l&apos;accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Value Prop */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                Espace Professionnel
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Équipez votre clinique avec l&apos;excellence médicale.
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Rejoignez plus de 500 établissements de santé en Tunisie qui font confiance à Prestige Medical.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-medical-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Tarifs Préférentiels</h3>
                  <p className="text-slate-500">Accédez à notre grille tarifaire grossiste réservée aux professionnels.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-medical-primary">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Conseiller Dédié</h3>
                  <p className="text-slate-500">Un expert biomédical vous accompagne dans vos choix d&apos;équipement.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-medical-primary">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Installation & Formation</h3>
                  <p className="text-slate-500">Service technique qualifié pour l&apos;installation et la maintenance.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Créer un compte professionnel</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nom de la Clinique / Cabinet</label>
                    <div className="relative">
                      <Building2 className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:bg-white transition-all outline-none"
                        placeholder="Ex: Clinique Alyssa"
                        value={formData.clinicName}
                        onChange={e => setFormData({...formData, clinicName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Matricule Fiscale</label>
                    <div className="relative">
                      <FileText className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:bg-white transition-all outline-none"
                        placeholder="Ex: 1234567/A"
                        value={formData.licenseId}
                        onChange={e => setFormData({...formData, licenseId: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Spécialité</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:bg-white transition-all outline-none"
                    value={formData.specialty}
                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                  >
                    <option value="">Sélectionner une spécialité...</option>
                    <option value="general">Clinique Généraliste</option>
                    <option value="dental">Cabinet Dentaire</option>
                    <option value="cardio">Cardiologie</option>
                    <option value="radio">Radiologie</option>
                    <option value="lab">Laboratoire d&apos;Analyses</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nom du Responsable</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:bg-white transition-all outline-none"
                        placeholder="Dr. ..."
                        value={formData.contactName}
                        onChange={e => setFormData({...formData, contactName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Téléphone</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="tel" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:bg-white transition-all outline-none"
                        placeholder="+216 ..."
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Ville</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <select
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:bg-white transition-all outline-none"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    >
                        <option value="Tunis">Tunis</option>
                        <option value="Sfax">Sfax</option>
                        <option value="Sousse">Sousse</option>
                        <option value="Gabes">Gabès</option>
                        <option value="Monastir">Monastir</option>
                        <option value="Nabeul">Nabeul</option>
                        <option value="Other">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Envoyer la demande</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  En cliquant sur envoyer, vous acceptez nos conditions générales de vente pour professionnels.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
