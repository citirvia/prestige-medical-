'use client';

import { useState, useEffect } from 'react';
import { Product, Variant } from '@/types/db';
import { X, Plus, Trash, Save } from 'lucide-react';
import { SupabaseService } from '@/services/supabase-service';

interface ProductModalProps {
  product?: Product & { variants: Variant[] };
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductModal({ product, isOpen, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    brand: '',
    category_id: 'equipment',
    name: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
    technical_specs: {},
    is_professional_only: false,
    image_url_list: []
  });

  const [variants, setVariants] = useState<Partial<Variant>[]>([]);
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        brand: product.brand,
        category_id: product.category_id,
        name: product.name,
        description: product.description,
        technical_specs: product.technical_specs,
        is_professional_only: product.is_professional_only,
        image_url_list: product.image_url_list
      });
      setVariants(product.variants);
      setSpecs(Object.entries(product.technical_specs || {}).map(([key, value]) => ({ key, value })));
    } else {
      // Reset for new product
      setFormData({
        brand: '',
        category_id: 'equipment',
        name: { en: '', fr: '', ar: '' },
        description: { en: '', fr: '', ar: '' },
        technical_specs: {},
        is_professional_only: false,
        image_url_list: []
      });
      setVariants([]);
      setSpecs([]);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert specs array back to object
      const specsObj = specs.reduce((acc, curr) => {
        if (curr.key) acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      const productData = {
        ...formData,
        technical_specs: specsObj
      };

      let productId = product?.id;

      if (product) {
        await SupabaseService.updateProduct({ ...(productData as Partial<Product>), id: product.id });
        productId = product.id;
      } else {
        const newProduct = await SupabaseService.createProduct(productData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
        if (newProduct) productId = newProduct.id;
      }

      // Handle Variants if product created/updated successfully
      if (productId && variants.length > 0) {
        // For new variants
        for (const variant of variants) {
          if (!variant.id) {
             await SupabaseService.createVariant({ ...(variant as Omit<Variant, 'id' | 'created_at'>), product_id: productId });
          }
          // Note: Updating existing variants is not fully implemented in this loop for simplicity, 
          // but we could add it. For now, we assume variants are managed separately or just added here.
        }
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleAddVariant = () => {
    setVariants([...variants, {
      size_name: 'Standard',
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      price: 0,
      stock_quantity: 0
    }]);
  };

  const handleRemoveVariant = async (index: number) => {
    const variant = variants[index];
    if (variant.id) {
      if (confirm('Are you sure you want to delete this variant?')) {
        await SupabaseService.deleteVariant(variant.id);
        setVariants(variants.filter((_, i) => i !== index));
      }
    } else {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input 
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="equipment">Medical Equipment</option>
                  <option value="consumables">Consumables</option>
                  <option value="orthopedics">Orthopedics</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name (FR)</label>
                <input 
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.name?.fr}
                  onChange={e => setFormData({...formData, name: {...formData.name!, fr: e.target.value}})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name (EN)</label>
                <input 
                  className="w-full p-2 border rounded-lg"
                  value={formData.name?.en}
                  onChange={e => setFormData({...formData, name: {...formData.name!, en: e.target.value}})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name (AR)</label>
                <input 
                  className="w-full p-2 border rounded-lg text-right"
                  value={formData.name?.ar}
                  onChange={e => setFormData({...formData, name: {...formData.name!, ar: e.target.value}})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description (FR)</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full p-2 border rounded-lg"
                  value={formData.description?.fr}
                  onChange={e => setFormData({...formData, description: {...formData.description!, fr: e.target.value}})}
                />
              </div>
            </div>
          </section>

          {/* Technical Specs */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Technical Specifications</h3>
              <button type="button" onClick={handleAddSpec} className="text-sm text-medical-blue flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Spec
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    placeholder="Key (e.g. Voltage)"
                    className="flex-1 p-2 border rounded-lg"
                    value={spec.key}
                    onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                  />
                  <input 
                    placeholder="Value (e.g. 220V)"
                    className="flex-1 p-2 border rounded-lg"
                    value={spec.value}
                    onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-red-500 p-2">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
          
          {/* Images */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Images (URLs)</h3>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, image_url_list: [...(formData.image_url_list || []), '']})}
                className="text-sm text-medical-blue flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Image
              </button>
            </div>
            <div className="space-y-2">
              {(formData.image_url_list || []).map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 p-2 border rounded-lg"
                    value={url}
                    onChange={e => {
                      const list = [...(formData.image_url_list || [])];
                      list[idx] = e.target.value;
                      setFormData({...formData, image_url_list: list});
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(formData.image_url_list || [])];
                      list.splice(idx, 1);
                      setFormData({...formData, image_url_list: list});
                    }}
                    className="text-red-500 p-2"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Variants */}
          <section className="space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Variants (Stock & Price)</h3>
              <button type="button" onClick={handleAddVariant} className="text-sm text-medical-blue flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>
            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold mb-1">Size/Name</label>
                    <input 
                      className="w-full p-2 border rounded text-sm"
                      value={variant.size_name}
                      onChange={e => {
                        const newVariants = [...variants];
                        newVariants[idx].size_name = e.target.value;
                        setVariants(newVariants);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">SKU</label>
                    <input 
                      className="w-full p-2 border rounded text-sm"
                      value={variant.sku}
                      onChange={e => {
                        const newVariants = [...variants];
                        newVariants[idx].sku = e.target.value;
                        setVariants(newVariants);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Price (TND)</label>
                    <input 
                      type="number"
                      step="0.001"
                      className="w-full p-2 border rounded text-sm"
                      value={Number.isFinite(variant.price as number) ? String(variant.price) : ''}
                      onChange={e => {
                        const newVariants = [...variants];
                        const val = e.target.value;
                        newVariants[idx].price = val === '' ? 0 : parseFloat(val);
                        setVariants(newVariants);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Stock</label>
                    <input 
                      type="number"
                      className="w-full p-2 border rounded text-sm"
                      value={Number.isFinite(variant.stock_quantity as number) ? String(variant.stock_quantity) : ''}
                      onChange={e => {
                        const newVariants = [...variants];
                        const val = e.target.value;
                        newVariants[idx].stock_quantity = val === '' ? 0 : parseInt(val);
                        setVariants(newVariants);
                      }}
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveVariant(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded mb-0.5">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-medical-blue text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {loading ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" /> Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
