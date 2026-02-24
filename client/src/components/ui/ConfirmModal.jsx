import { useEffect } from 'react';

export default function ConfirmModal({
    open,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    danger = true,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;
        const h = (e) => { if (e.key === 'Escape') onCancel?.(); };
        document.addEventListener('keydown', h);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <>
            <style>{`
                @keyframes cfIn {
                    from { opacity: 0; transform: scale(0.92) translateY(12px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
                .cf-dialog { animation: cfIn 0.22s ease-out forwards; }
            `}</style>

            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
                onClick={onCancel}
            >
                {/* Card */}
                <div
                    className="cf-dialog relative w-full max-w-sm overflow-hidden"
                    style={{
                        borderRadius: '20px',
                        background: 'var(--surface)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px var(--border)',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Left accent stripe */}
                    <div style={{
                        position: 'absolute',
                        left: 0, top: 0, bottom: 0,
                        width: '5px',
                        background: danger
                            ? 'linear-gradient(180deg,#f87171,#ef4444)'
                            : 'linear-gradient(180deg,var(--accent),var(--accent-hover))',
                        borderRadius: '20px 0 0 20px',
                    }} />

                    <div className="px-8 pt-8 pb-7" style={{ paddingLeft: '36px' }}>
                        {/* Title */}
                        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2"
                            style={{ color: danger ? '#ef4444' : 'var(--accent)' }}>
                            {danger ? 'Warning' : 'Confirm'}
                        </p>
                        <h2 className="text-xl font-bold mb-3 leading-snug"
                            style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {title}
                        </h2>
                        {message && (
                            <p className="text-sm leading-relaxed"
                                style={{ color: 'var(--text-muted)' }}>
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'var(--border)' }} />

                    {/* Footer */}
                    <div className="flex items-center px-7 py-4 gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                            style={{
                                background: 'var(--surface-overlay)',
                                color: 'var(--text-secondary)',
                            }}>
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:brightness-110 active:scale-95"
                            style={{
                                background: danger
                                    ? '#ef4444'
                                    : 'var(--accent)',
                                letterSpacing: '0.02em',
                            }}>
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
