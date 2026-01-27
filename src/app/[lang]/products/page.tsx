'use client';

import { Link } from '@/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, LayoutGrid, List, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { SupabaseService } from '@/services/supabase-service';
import { Product, Variant } from '@/types/db';
import { useComparisonStore } from '@/lib/store/compare';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Mock Synonyms for "Smart Search"
const SYNONYMS: Record<string, string[]> = {
  'tension': ['blood pressure', 'tensiometre', 'sphygmomanometer', 'monitor'],
  'pressure': ['blood pressure', 'tension', 'monitor'],
  'sugar': ['glucose', 'diabetes', 'glucometer'],
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [products, setProducts] = useState<(Product & { variants: Variant[] })[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { addItem, items: comparisonItems } = useComparisonStore();

  useEffect(() => {
    SupabaseService.getProducts().then((data) => setProducts(data || []));
  }, []);

  // Extract unique brands
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [products]);

  // Advanced Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Text Search with Synonyms
      const query = searchQuery.toLowerCase();
      const expandedQuery = [query, ...(SYNONYMS[query] || [])];
      
      const matchesSearch = query === '' || expandedQuery.some(term => 
        product.name.en.toLowerCase().includes(term) ||
        product.name.fr.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)
      );

      // 2. Brand Filter
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;

      // 3. Stock Filter
      const matchesStock = !showInStockOnly || product.variants.some(v => v.stock_quantity > 0);

      return matchesSearch && matchesBrand && matchesStock;
    });
  }, [products, searchQuery, selectedBrand, showInStockOnly]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6 shrink-0">
          <div className="glass-card p-6 rounded-xl sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtres
            </h3>
            
            {/* Search Input */}
            <div className="mb-6 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none text-sm bg-slate-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Mode Toggle (Mobile/Desktop) */}
            <div className="mb-6">
               <h4 className="text-sm font-semibold text-slate-900 mb-3">Affichage</h4>
               <div className="flex bg-slate-100 p-1 rounded-lg">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={clsx("flex-1 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2", viewMode === 'grid' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                 >
                   <LayoutGrid className="w-4 h-4" /> Grille
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={clsx("flex-1 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2", viewMode === 'list' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                 >
                   <List className="w-4 h-4" /> Liste
                 </button>
               </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Marques</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                    <input 
                      type="radio" 
                      name="brand" 
                      checked={selectedBrand === brand}
                      onChange={() => setSelectedBrand(brand)}
                      className="text-medical-primary focus:ring-medical-primary"
                    />
                    <span className="text-sm text-slate-600">{brand}</span>
                  </label>
                ))}
                {selectedBrand && (
                  <button 
                    onClick={() => setSelectedBrand(null)}
                    className="text-xs text-red-500 flex items-center gap-1 mt-2 hover:underline"
                  >
                    <X className="w-3 h-3" /> Effacer
                  </button>
                )}
              </div>
            </div>

            {/* Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="stock-toggle" 
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label htmlFor="stock-toggle" className={clsx("toggle-label block overflow-hidden h-5 rounded-full cursor-pointer", showInStockOnly ? "bg-medical-primary" : "bg-slate-300")}></label>
              </div>
              <span className="text-sm text-slate-600">En stock uniquement</span>
            </label>
          </div>
        </aside>

        {/* Product Grid/List */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Catalogue ({filteredProducts.length})</h1>
          </div>

          <div className={clsx(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  className={clsx(
                    "glass-card rounded-2xl overflow-hidden group relative border border-slate-200/60",
                    viewMode === 'list' && "flex flex-row items-center p-4 gap-6"
                  )}
                >
                  {/* Image */}
                  <div className={clsx(
                    "bg-slate-50 relative overflow-hidden",
                    viewMode === 'grid' ? "h-64" : "h-32 w-32 rounded-xl shrink-0"
                  )}>
                    {(product.image_url_list && product.image_url_list[0]) ? (
                      <img 
                        src={product.image_url_list[0]} 
                        alt={product.name.fr}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">🩺</div>
                    )}
                    {product.variants.some(v => v.stock_quantity === 0) && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        Rupture
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={clsx("flex-1", viewMode === 'grid' ? "p-6" : "")}>
                    <div className="text-xs text-medical-accent font-bold tracking-wider uppercase mb-1">{product.brand}</div>
                    <Link href={`/products/${product.slug || product.id}`} className="block group-hover:text-medical-primary transition-colors">
                      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{product.name.fr}</h3>
                    </Link>
                    
                    {viewMode === 'list' && (
                      <p className="text-sm text-slate-500 mb-2 line-clamp-2">{product.description.fr}</p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="font-mono font-bold text-slate-900">
                        {(() => {
                          const prices = product.variants.map(v => v.price).filter(p => Number.isFinite(p));
                          return prices.length > 0 ? Math.min(...prices).toFixed(3) : '--';
                        })()} <span className="text-xs text-slate-500">TND</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Compare Checkbox */}
                        <button
                          onClick={() => addItem(product)}
                          disabled={comparisonItems.some(i => i.id === product.id)}
                          className={clsx(
                            "p-2 rounded-lg transition-colors",
                            comparisonItems.some(i => i.id === product.id) 
                              ? "bg-green-100 text-green-700" 
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          )}
                          title="Comparer"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>

                        <Link 
                          href={`/products/${product.slug || product.id}`}
                          className="bg-slate-900 text-white p-2 rounded-lg hover:bg-medical-primary transition-colors shadow-md hover:shadow-lg"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Aucun produit trouvé</h3>
              <p className="text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
