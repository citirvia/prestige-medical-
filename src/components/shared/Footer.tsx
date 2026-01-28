'use client';
import { Link } from '@/navigation';
import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-sans tracking-tight text-white">PRESTIGE MEDICAL</h3>
              <p className="text-medical-accent text-xs uppercase tracking-widest font-semibold mt-1">Sfax, Tunisie</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leader de la distribution de matériel médical à Sfax. Nous équipons les cliniques, médecins et particuliers avec des dispositifs de pointe certifiés.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/hatem.belhassen.983766?locale=fr_FR" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://wa.me/21656890908" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Navigation Rapide</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/products" className="hover:text-medical-accent transition-colors flex items-center gap-2">Catalogue Général</Link></li>
              <li><Link href="/clinic-registration" className="hover:text-medical-accent transition-colors flex items-center gap-2">Espace Pro / Clinique</Link></li>
              <li><Link href="/track-order" className="hover:text-medical-accent transition-colors flex items-center gap-2">Suivi de Commande</Link></li>
              <li><Link href="/compare" className="hover:text-medical-accent transition-colors flex items-center gap-2">Comparateur Technique</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Sfax */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Contact Sfax</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-slate-400">
                <MapPin className="w-5 h-5 text-medical-accent shrink-0 mt-1" />
                <span className="text-sm leading-relaxed">Route Manzel Chaker km 0.5,<br />Avenue Fardaws,<br />Sfax 3000, Tunisie</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <Phone className="w-5 h-5 text-medical-accent shrink-0" />
                <div className="text-sm">
                  <div className="hover:text-white transition-colors cursor-pointer">+216 56 890 908</div>
                  <div className="hover:text-white transition-colors cursor-pointer">+216 28 307 273</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <Mail className="w-5 h-5 text-medical-accent shrink-0" />
                <span className="text-sm hover:text-white transition-colors cursor-pointer">presmed.sfax@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Status & Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Service Client</h4>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-medical-success" />
                <span className="font-bold text-medical-success">Ouvert 24/7</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Service de garde disponible pour les urgences cliniques sur le Grand Sfax.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Prestige Medical Sfax. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de Confidentialité</Link>
            <Link href="/terms" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
