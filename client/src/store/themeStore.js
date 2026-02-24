import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const THEMES = ['light', 'dark', 'industrial', 'wood', 'modern'];

export const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: 'light',
            setTheme: (theme) => {
                if (!THEMES.includes(theme)) return;
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                set({ theme });
            },
            toggleDark: () => {
                const { theme, setTheme } = get();
                setTheme(theme === 'dark' ? 'light' : 'dark');
            },
        }),
        { name: 'chair-theme' }
    )
);

export { THEMES };
