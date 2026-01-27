'use client';

import { useState, useEffect } from 'react';
import { ClinicService } from '@/services/mock';
import { ClinicRegistration } from '@/types/db';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<ClinicRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  async function loadRegistrations() {
    const data = await ClinicService.getRegistrations();
    setRegistrations(data);
    setLoading(false);
  }

  useEffect(() => {
    const id = setTimeout(() => {
      void loadRegistrations();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    await ClinicService.updateStatus(id, status);
    setRegistrations(registrations.map(r => r.id === id ? { ...r, status } : r));
  };

  const filteredRegistrations = registrations.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Clinic Registrations</h1>
        <div className="flex gap-2">
           {/* Stats could go here */}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            filter === 'all' ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            filter === 'pending' ? "bg-yellow-500 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('approved')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            filter === 'approved' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          Approved
        </button>
        <button 
          onClick={() => setFilter('rejected')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            filter === 'rejected' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          Rejected
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading registrations...</div>
      ) : (
        <div className="grid gap-6">
          {filteredRegistrations.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                 <Search className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
               <p className="text-slate-500">There are no registration requests matching your filter.</p>
             </div>
          ) : (
            filteredRegistrations.map((reg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={reg.id} 
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{reg.clinic_name}</h3>
                      <p className="text-slate-500 flex items-center gap-2">
                        Dr. {reg.doctor_name} • {reg.specialty}
                      </p>
                    </div>
                    <div className={clsx(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      reg.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                      reg.status === 'approved' ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {reg.status}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-slate-500">Contact</div>
                      <div className="font-medium">{reg.phone}</div>
                      <div className="text-slate-600">{reg.email}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">Location</div>
                      <div className="font-medium">{reg.address}</div>
                      <div className="text-slate-600">{reg.city}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">License</div>
                      <div className="font-mono bg-slate-100 px-2 py-1 rounded inline-block">{reg.license_number}</div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  {reg.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(reg.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-bold"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {reg.status !== 'pending' && (
                     <div className="text-center text-slate-400 text-sm italic">
                       Processed on {new Date().toLocaleDateString()}
                     </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
