'use client';

import { useComparisonStore } from '@/lib/store/compare';
import { X, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComparisonBar() {
  const { items, removeItem, clear, isOpen, setIsOpen } = useComparisonStore();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto">
            <div className="bg-white/90 backdrop-blur-md border border-medical-primary/10 rounded-2xl shadow-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0">
                <span className="font-bold text-slate-900 whitespace-nowrap">
                  Comparer ({items.length})
                </span>
                <div className="flex gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="relative group shrink-0">
                      <img
                        src={item.image_url_list[0]}
                        alt={item.name.fr}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pl-4 border-l border-slate-200 ml-4">
                <button
                  onClick={clear}
                  className="text-sm text-slate-500 hover:text-red-500 whitespace-nowrap"
                >
                  Effacer
                </button>
                <Link
                  href="/compare"
                  className="bg-medical-primary text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Comparer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
