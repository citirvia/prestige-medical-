'use client';

import { useEffect, useState } from 'react';
import { SupabaseService } from '@/services/supabase-service';
import { Order, Product, Variant } from '@/types/db';
import { Clock, CheckCircle, Truck, Package, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import clsx from 'clsx';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<(Product & { variants: Variant[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [o, p] = await Promise.all([
          SupabaseService.getOrders(),
          SupabaseService.getProducts()
        ]);
        setOrders(o || []);
        setProducts(p || []);
      } catch {
        setOrders([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'in_preparation').length,
    completed: orders.filter(o => o.status === 'completed').length,
    total: orders.length,
    lowStock: products.reduce((acc, p) => acc + p.variants.filter(v => v.stock_quantity < 5).length, 0)
  };

  // Mock Top Products
  const topProducts = [
    { name: 'Rossmax X5', count: 12 },
    { name: 'Omron M3', count: 8 },
    { name: 'Accu-Chek Instant', count: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Dernière mise à jour: —</p>
      </div>
      
      {loading && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">Chargement du tableau de bord...</div>
      )}
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Volume de Devis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Volume de Devis (Aujourd&apos;hui)</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Alerte Rupture */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Alerte Rupture (&lt; 5 unités)</p>
              <h3 className="text-2xl font-bold text-red-600">{stats.lowStock}</h3>
            </div>
          </div>
          <div className="text-xs text-red-500 font-medium">Action requise immédiate</div>
        </div>

        {/* Top Produits */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Produits les plus demandés</p>
            </div>
          </div>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-700">{p.name}</span>
                <span className="font-bold text-slate-900">{p.count} devis</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Status Grid */}
      <h2 className="text-xl font-bold text-slate-900 mt-8">État des Commandes</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Requests</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Processing</p>
              <h3 className="text-2xl font-bold">{stats.processing}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold">{stats.completed}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Truck className="w-6 h-6" />
                </div>
                <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
                </div>
            </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Recent Quote Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{order.customer_details.name}</div>
                    <div className="text-sm text-slate-500">{order.customer_details.city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      order.customer_type === 'clinic' ? "bg-blue-100 text-blue-700" :
                      order.customer_type === 'pharmacy' ? "bg-green-100 text-green-700" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {order.customer_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      order.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                      order.status === 'confirmed' ? "bg-blue-100 text-blue-700" :
                      order.status === 'completed' ? "bg-green-100 text-green-700" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {order.total_price.toFixed(3)} TND
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
