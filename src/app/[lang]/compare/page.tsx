'use client';

import { useComparisonStore } from '@/lib/store/compare';
import { Link } from '@/navigation';
import { Check, X, ArrowLeft } from 'lucide-react';

export default function ComparePage() {
  const { items, removeItem } = useComparisonStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Aucun produit à comparer</h1>
          <p className="text-slate-500">Sélectionnez des produits depuis le catalogue pour les comparer.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-medical-primary text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Comparateur Technique</h1>
          <Link
            href="/products"
            className="text-slate-600 hover:text-medical-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
          </Link>
        </div>

        <div className="overflow-x-auto pb-6">
          <table className="w-full bg-white rounded-2xl shadow-xl border-hidden">
            <thead>
              <tr>
                <th className="p-6 text-left w-48 bg-slate-50 border-b border-r border-slate-100 rounded-tl-2xl">
                  Critères
                </th>
                {items.map((item) => (
                  <th key={item.id} className="p-6 w-64 border-b border-r border-slate-100 last:border-r-0 relative group">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <img
                      src={item.image_url_list[0]}
                      alt={item.name.fr}
                      className="w-32 h-32 object-contain mx-auto mb-4"
                    />
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{item.name.fr}</h3>
                    <div className="text-medical-accent font-mono text-sm">{item.brand}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Category */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50 border-r border-slate-100">Catégorie</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-center border-r border-slate-100 last:border-r-0">
                    {item.category_id}
                  </td>
                ))}
              </tr>
              
              {/* Description */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50 border-r border-slate-100">Description</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-sm text-slate-600 border-r border-slate-100 last:border-r-0 min-w-[200px]">
                    {item.description.fr}
                  </td>
                ))}
              </tr>

              {/* Specs Mockup (since we don't have structured specs in basic Product type yet, mimicking logic) */}
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50 border-r border-slate-100">Certification</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-center border-r border-slate-100 last:border-r-0">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      <Check className="w-3 h-3" /> CE / ISO
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50 border-r border-slate-100">Garantie</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-center border-r border-slate-100 last:border-r-0">
                    2 Ans
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 bg-slate-50 border-r border-slate-100 rounded-bl-2xl"></td>
                {items.map((item) => (
                  <td key={item.id} className="p-6 border-r border-slate-100 last:border-r-0 text-center">
                    <Link
                      href={`/products/${item.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-medical-primary transition-colors font-bold text-sm"
                    >
                      Voir Détails
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
