'use client';

import { useState, useEffect } from 'react';
import { SupabaseService } from '@/services/supabase-service';
import { Product, Variant } from '@/types/db';
import { Save, Search, AlertTriangle, Plus, Edit, Trash2 } from 'lucide-react';
import ProductModal from '@/components/admin/ProductModal';
import clsx from 'clsx';

export default function InventoryPage() {
  const [products, setProducts] = useState<(Product & { variants: Variant[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(Product & { variants: Variant[] }) | undefined>(undefined);

  async function loadData() {
    setLoading(true);
    const data = await SupabaseService.getProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    const id = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  

  const handleStockChange = (variantId: string, newStock: string) => {
    const stock = parseInt(newStock);
    if (isNaN(stock)) return;

    setProducts(products.map(p => ({
      ...p,
      variants: p.variants.map(v => 
        v.id === variantId ? { ...v, stock_quantity: stock } : v
      )
    })));
    setHasChanges(true);
  };

  const saveChanges = async () => {
    // In a real app, we would batch update. 
    // Here we just simulate saving each changed item.
    for (const product of products) {
      for (const variant of product.variants) {
        await SupabaseService.updateStock(variant.id, variant.stock_quantity);
      }
    }
    setHasChanges(false);
    alert('Stock updated successfully!');
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product & { variants: Variant[] }) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? All variants will be deleted.')) {
      await SupabaseService.deleteProduct(id);
      loadData();
    }
  };

  const filteredProducts = products.filter(p => {
    const nameFr = p.name.fr?.toLowerCase() || '';
    const nameEn = p.name.en?.toLowerCase() || '';
    const brand = p.brand?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return nameFr.includes(q) || nameEn.includes(q) || brand.includes(q);
  });

  if (loading) return <div className="p-8">Loading inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button 
            onClick={saveChanges}
            disabled={!hasChanges}
            className={clsx(
              "flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all",
              hasChanges 
                ? "bg-medical-blue text-white shadow-md hover:bg-blue-700" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            Save Stock
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input 
          type="text"
          placeholder="Search products by name or brand..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-blue focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Variant</th>
              <th className="px-6 py-4 font-semibold">SKU</th>
              <th className="px-6 py-4 font-semibold text-right">Price (TND)</th>
              <th className="px-6 py-4 font-semibold w-48">Stock Level</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredProducts.map(product => (
              product.variants.length > 0 ? (
                product.variants.map((variant, index) => (
                  <tr key={variant.id} className="hover:bg-slate-50 transition-colors">
                    {index === 0 && (
                      <td rowSpan={product.variants.length} className="px-6 py-4 align-top border-r border-slate-100 bg-slate-50/50">
                        <div className="font-bold text-slate-900">{product.name.en || product.name.fr}</div>
                        <div className="text-xs text-medical-blue">{product.brand}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {variant.size_name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {variant.sku}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-900">
                      {Number.isFinite(variant.price) ? variant.price.toFixed(3) : '--'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="number"
                          min="0"
                          value={Number.isFinite(variant.stock_quantity) ? variant.stock_quantity : 0}
                          onChange={(e) => handleStockChange(variant.id, e.target.value)}
                          className={clsx(
                            "w-24 px-3 py-1 border rounded-md focus:outline-none focus:ring-2",
                            variant.stock_quantity === 0 ? "border-red-300 bg-red-50 text-red-700 focus:ring-red-500" :
                            variant.stock_quantity < 10 ? "border-yellow-300 bg-yellow-50 text-yellow-700 focus:ring-yellow-500" :
                            "border-slate-200 focus:ring-medical-blue"
                          )}
                        />
                        {variant.stock_quantity < 10 && (
                          <div className="text-yellow-600" title="Low Stock">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    {index === 0 && (
                      <td rowSpan={product.variants.length} className="px-6 py-4 align-top border-l border-slate-100 bg-slate-50/50 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 border-r border-slate-100 bg-slate-50/50">
                    <div className="font-bold text-slate-900">{product.name.en}</div>
                    <div className="text-xs text-medical-blue">{product.brand}</div>
                  </td>
                  <td colSpan={4} className="px-6 py-4 text-center text-slate-400 italic">
                    No variants added
                  </td>
                  <td className="px-6 py-4 text-right border-l border-slate-100 bg-slate-50/50">
                     <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={loadData}
        product={editingProduct}
      />
    </div>
  );
}
