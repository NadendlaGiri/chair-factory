import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [], // [{ id, name, slug, image }]

            toggle: (product) => {
                const { items } = get();
                const exists = items.some(i => i.id === product.id);
                set({
                    items: exists
                        ? items.filter(i => i.id !== product.id)
                        : [...items, { id: product.id, name: product.name, slug: product.slug, image: product.images?.[0] || '' }],
                });
            },

            isWishlisted: (id) => get().items.some(i => i.id === id),

            count: () => get().items.length,

            clear: () => set({ items: [] }),
        }),
        { name: 'wishlist' }
    )
);
