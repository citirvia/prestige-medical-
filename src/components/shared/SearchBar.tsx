'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ChevronRight } from 'lucide-react';
import { SupabaseService } from '@/services/supabase-service';
import { Product, LocalizedString } from '@/types/db';
import { Link } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const allProducts = await SupabaseService.getProducts();
      const filtered = allProducts.filter(p => 
        p.name[locale as keyof LocalizedString].toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, locale]);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className={`flex items-center transition-all duration-300 ${isOpen ? 'w-64 bg-slate-100' : 'w-8 bg-transparent'} rounded-full overflow-hidden`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-medical-primary shrink-0"
        >
          <Search className="w-5 h-5" />
        </button>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            if (next.length < 2) {
              setResults([]);
              setLoading(false);
            }
          }}
          placeholder="Rechercher..."
          className={`bg-transparent border-none outline-none text-sm px-2 w-full text-slate-900 placeholder:text-slate-400 ${!isOpen && 'hidden'}`}
          autoFocus={isOpen}
        />

        {isOpen && query && (
          <button onClick={() => setQuery('')} className="pr-3 text-slate-400 hover:text-slate-600">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
          >
            {loading ? (
              <div className="p-4 text-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                <span className="text-xs">Recherche en cours...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Produits</div>
                {results.map(product => (
                  <Link 
                    key={product.id} 
                    href={`/products/${product.slug || product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                      🩺
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-medical-primary">
                        {product.name[locale as keyof LocalizedString]}
                      </div>
                      <div className="text-xs text-slate-500">{product.brand}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-medical-primary" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 text-sm">
                Aucun produit trouvé.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
