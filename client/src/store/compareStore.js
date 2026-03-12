import { create } from 'zustand';

export const useCompareStore = create((set, get) => ({
    items: [], // max 3 products

    toggle: (product) => {
        const { items } = get();
        const exists = items.some(i => i.id === product.id);
        if (exists) {
            set({ items: items.filter(i => i.id !== product.id) });
        } else if (items.length < 3) {
            set({ items: [...items, product] });
        }
    },

    isComparing: (id) => get().items.some(i => i.id === id),

    clear: () => set({ items: [] }),

    canAdd: () => get().items.length < 3,
}));
