import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Loader2 } from 'lucide-react';
import { getThemeConfig, setDefaultTheme } from '../../services/api';
import { useThemeStore, THEMES } from '../../store/themeStore';
import toast from 'react-hot-toast';

const THEME_META = {
    light: { label: 'Light', emoji: '☀️', desc: 'Clean white background, warm amber accents', preview: ['#ffffff', '#f9fafb', '#92400e', '#e07a1a'] },
    dark: { label: 'Dark', emoji: '🌙', desc: 'Deep dark background, golden highlights', preview: ['#0f0a05', '#1a1208', '#d99a2d', '#c48822'] },
    industrial: { label: 'Industrial', emoji: '⚙️', desc: 'Dark steel tones with bold orange accent', preview: ['#f9f9f9', '#f0f0f0', '#f97316', '#ea6b0e'] },
    wood: { label: 'Natural Wood', emoji: '🪵', desc: 'Warm wood textures and earthy browns', preview: ['#fef9f2', '#faf0e4', '#5c3d1a', '#8b4f1a'] },
    modern: { label: 'Modern Minimal', emoji: '💎', desc: 'Cool blues and clean minimal styling', preview: ['#f8faff', '#f0f4ff', '#2563a0', '#1d4e8a'] },
};

export default function AdminThemes() {
    const { theme: activeTheme, setTheme } = useThemeStore();
    const [defaultTheme, setDefaultThemeState] = useState('light');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getThemeConfig().then(cfg => setDefaultThemeState(cfg.defaultTheme || 'light')).finally(() => setLoading(false));
    }, []);

    const handleSetDefault = async (t) => {
        setSaving(true);
        try {
            await setDefaultTheme(t);
            setDefaultThemeState(t);
            toast.success(`Default theme set to "${THEME_META[t].label}"`);
        } catch { toast.error('Failed to set default theme'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>Loading themes...</div>;

    return (
        <>
            <Helmet><title>Themes – Chair Factory Admin</title></Helmet>
            <div className="space-y-8 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Theme Management</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        Click a theme to preview it. Set as default to apply for all visitors.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {THEMES.map(t => {
                        const meta = THEME_META[t];
                        const isActive = activeTheme === t;
                        const isDefault = defaultTheme === t;
                        return (
                            <div key={t}
                                className="card cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                                style={{ borderColor: isActive ? 'var(--accent)' : 'var(--border)', borderWidth: isActive ? 2 : 1 }}
                                onClick={() => setTheme(t)}>
                                {/* Color chips */}
                                <div className="flex gap-2 mb-4">
                                    {meta.preview.map((color, i) => (
                                        <div key={i} className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                            {meta.emoji} {meta.label}
                                        </h3>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{meta.desc}</p>
                                    </div>
                                    {isActive && <Check size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    {isDefault ? (
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--accent)' }}>
                                            ✓ Site Default
                                        </span>
                                    ) : (
                                        <button
                                            onClick={e => { e.stopPropagation(); handleSetDefault(t); }}
                                            disabled={saving}
                                            className="text-xs font-semibold px-2 py-1 rounded-full transition-colors disabled:opacity-50"
                                            style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-muted)' }}>
                                            {saving ? <Loader2 size={12} className="animate-spin inline" /> : 'Set as Default'}
                                        </button>
                                    )}
                                    {isActive && (
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-secondary)' }}>
                                            Active Preview
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    💡 Clicking a theme previews it instantly for you. Setting as default applies it for all website visitors.
                </p>
            </div>
        </>
    );
}
