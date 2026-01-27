'use client';

import { Link, usePathname } from '@/navigation';
import { Home, ShoppingCart, User, Grid } from 'lucide-react';
import clsx from 'clsx';
import { useCartStore } from '@/lib/store/cart';

export default function MobileNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());

  const links = [
    { href: '/', icon: Home, label: 'Accueil' },
    { href: '/products', icon: Grid, label: 'Catalogue' },
    { href: '/cart', icon: ShoppingCart, label: 'Devis', badge: true },
    { href: '/clinic-registration', icon: User, label: 'Compte Pro' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                isActive ? "text-medical-primary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className="relative">
                <Icon className={clsx("w-6 h-6", isActive && "fill-current/10")} />
                {link.badge && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-medical-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
