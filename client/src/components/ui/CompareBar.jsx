import { X, ArrowRight, GitCompareArrows } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompareStore } from '../../store/compareStore';

export default function CompareBar() {
    const { items, clear } = useCompareStore();
    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
            style={{
                backgroundColor: 'var(--surface-raised)',
                borderTop: '1px solid var(--border)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
            }}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <GitCompareArrows size={18} style={{ color: 'var(--accent)' }} />
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Compare ({items.length}/3)
                    </span>
                </div>

                <div className="flex items-center gap-3 flex-1 flex-wrap">
                    {items.map(p => (
                        <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-primary)' }}>
                            {p.images?.[0] && (
                                <img src={p.images[0]} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0" loading="lazy" />
                            )}
                            <span className="max-w-[120px] truncate">{p.name}</span>
                            <button onClick={() => useCompareStore.getState().toggle(p)} className="hover:opacity-70 flex-shrink-0">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {items.length < 3 && (
                        <span className="text-xs px-3 py-1.5 rounded-lg border border-dashed"
                            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                            + Add up to {3 - items.length} more
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {items.length >= 2 && (
                        <Link
                            to={`/compare?ids=${items.map(p => p.id).join(',')}`}
                            className="btn-primary text-sm py-2 px-4">
                            <GitCompareArrows size={14} /> Compare Now
                        </Link>
                    )}
                    <button onClick={clear} className="btn-outline text-sm py-2 px-3" title="Clear comparison">
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
