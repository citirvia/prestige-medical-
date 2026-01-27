'use client';

import React, { useState, useEffect } from 'react';
import { SupabaseService } from '@/services/supabase-service';
import { Order } from '@/types/db';
import { Eye, Download, Printer, MessageCircle, Phone } from 'lucide-react';
import clsx from 'clsx';
import { generateQuotePDF } from '@/lib/pdf-generator';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpandedOrderId(expandedOrderId === id ? null : id);

  const handleDownloadPDF = (order: Order) => {
    const cartItems = order.items.map(item => ({
      id: item.variant_id,
      productId: item.variant_id,
      name: item.product_name,
      variantName: item.variant_name,
      price: item.price_at_time_of_order,
      quantity: item.quantity,
      image: ''
    }));
    
    const doc = generateQuotePDF(cartItems, order.customer_details, order.id);
    doc.save(`Devis_${order.id}.pdf`);
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await SupabaseService.getOrders();
        setOrders(data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await SupabaseService.updateStatus(orderId, newStatus);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filteredOrders = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setStatusFilter('all')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            statusFilter === 'all' ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          All Orders
        </button>
        <button 
          onClick={() => setStatusFilter('pending')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            statusFilter === 'pending' ? "bg-yellow-500 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          Pending
        </button>
        <button 
          onClick={() => setStatusFilter('confirmed')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            statusFilter === 'confirmed' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          Confirmed
        </button>
        <button 
          onClick={() => setStatusFilter('completed')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            statusFilter === 'completed' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          Completed
        </button>
      </div>

      {filteredOrders.length === 0 && !loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          Aucune commande trouvée
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Items</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleExpand(order.id)}>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{order.customer_details.name}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span>{order.customer_details.phone}</span>
                      <a 
                        href={`https://wa.me/${order.customer_details.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                        title="WhatsApp"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <a 
                        href={`tel:${order.customer_details.phone}`} 
                        className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        title="Call"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                  <div className="text-sm text-slate-900">{(order.items || []).length} items</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">
                      {(order.items || []).map(i => i.product_name).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {order.total_price.toFixed(3)} TND
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={clsx(
                        "px-3 py-1 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-offset-1 cursor-pointer",
                        order.status === 'pending' ? "bg-yellow-100 text-yellow-700 focus:ring-yellow-500" :
                        order.status === 'confirmed' ? "bg-blue-100 text-blue-700 focus:ring-blue-500" :
                        order.status === 'completed' ? "bg-green-100 text-green-700 focus:ring-green-500" :
                        "bg-slate-100 text-slate-700"
                      )}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_preparation">In Prep</option>
                      <option value="out_for_delivery">Delivering</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleExpand(order.id); }}
                      className="p-2 text-slate-400 hover:text-medical-blue transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Customer Info */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            Customer Details
                          </h4>
                          <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Name:</span>
                              <span className="font-medium">{order.customer_details.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Phone:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{order.customer_details.phone}</span>
                                <div className="flex gap-1">
                                    <a 
                                        href={`https://wa.me/21656890908`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                        title="WhatsApp"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </a>
                                    <a 
                                        href={`tel:${order.customer_details.phone}`} 
                                        className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                        title="Call"
                                    >
                                        <Phone className="w-4 h-4" />
                                    </a>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Address:</span>
                              <span className="font-medium text-right max-w-[200px]">{order.customer_details.address || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">City:</span>
                              <span className="font-medium">{order.customer_details.city || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Logistics:</span>
                              <span className="font-medium capitalize">{order.logistics_type}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleDownloadPDF(order)}
                            className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-medical-primary text-white rounded-lg font-bold hover:bg-medical-secondary transition-colors shadow-sm"
                          >
                            <Printer className="w-4 h-4" />
                            Générer Devis Officiel
                          </button>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-900">Order Items</h4>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                  <th className="px-4 py-2 text-left">Product</th>
                                  <th className="px-4 py-2 text-center">Qty</th>
                                  <th className="px-4 py-2 text-right">Price</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {order.items.map((item) => (
                                  <tr key={item.id}>
                                    <td className="px-4 py-2">
                                      <div className="font-medium text-slate-900">{item.product_name}</div>
                                      <div className="text-xs text-slate-500">{item.variant_name}</div>
                                    </td>
                                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                                    <td className="px-4 py-2 text-right">{(item.price_at_time_of_order * item.quantity).toFixed(3)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
