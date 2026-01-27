'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import SearchBar from './SearchBar';

export default function Navbar() {
  const t = useTranslations('Nav');
  const totalItems = useCartStore((state) => state.totalItems());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={clsx(
      "sticky top-0 z-50 transition-all duration-300 border-b",
      scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border-slate-200" : "bg-white border-transparent"
    )}>
      <div className={clsx(
        "container mx-auto px-4 flex items-center justify-between transition-all duration-300",
        scrolled ? "h-16" : "h-24"
      )}>
        {/* Brand */}
        <Link href="/" className="flex flex-col group">
          <span className={clsx(
            "font-bold text-medical-primary tracking-tight font-sans transition-all",
            scrolled ? "text-xl" : "text-2xl"
          )}>
            PRESTIGE MEDICAL
          </span>
          <span className="text-[10px] uppercase tracking-widest text-medical-accent font-semibold group-hover:text-medical-primary transition-colors">
            Sfax, Tunisie
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          <Link href="/" className="text-slate-600 hover:text-medical-primary transition-colors font-medium">
            {t('home')}
          </Link>
          <Link href="/products" className="text-slate-600 hover:text-medical-primary transition-colors font-medium">
            {t('products')}
          </Link>
          <Link href="/clinic-registration" className="text-slate-600 hover:text-medical-primary transition-colors font-medium">
            {t('pro_account')}
          </Link>
          <Link href="/contact" className="text-slate-600 hover:text-medical-primary transition-colors font-medium">
            {t('contact')}
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          
          <Link href="/cart" className="relative p-2 text-slate-600 hover:text-medical-primary transition-colors group">
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="sr-only">{t('cart')}</span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-medical-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
