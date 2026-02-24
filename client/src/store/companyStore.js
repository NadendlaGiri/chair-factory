import { create } from 'zustand';
import { getAllContent } from '../services/api';

export const useCompanyStore = create((set, get) => ({
    name: 'Chair Factory',
    tagline: 'Factory-direct quality furniture since 1998',
    footerText: '',
    logo: '',
    loaded: false,

    fetch: async () => {
        if (get().loaded) return;
        try {
            const data = await getAllContent();
            const company = data.company || {};
            set({
                name: company.name || 'Chair Factory',
                tagline: company.tagline || 'Factory-direct quality furniture since 1998',
                footerText: company.footerText || '',
                logo: company.logo || '',
                loaded: true,
            });
        } catch {
            set({ loaded: true });
        }
    },

    // Called by AdminSettings after a successful save so UI updates instantly
    update: (name, tagline, footerText, logo) => set({ name, tagline, footerText, logo }),
}));
