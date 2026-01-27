import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/db';

type ComparisonState = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product) => {
        const items = get().items;
        if (items.find((i) => i.id === product.id)) return;
        if (items.length >= 4) {
          alert("Vous ne pouvez comparer que 4 produits à la fois.");
          return;
        }
        set({ items: [...items, product], isOpen: true });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      clear: () => set({ items: [], isOpen: false }),
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'prestige-medical-compare',
    }
  )
);
