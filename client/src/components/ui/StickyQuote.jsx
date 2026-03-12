import { Link, useLocation } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';

// Don't show on admin pages or the orders page itself
const HIDDEN_PATHS = ['/orders', '/admin'];

export default function StickyQuote() {
    const location = useLocation();
    const hidden = HIDDEN_PATHS.some(p => location.pathname.startsWith(p));
    if (hidden) return null;

    return (
        <Link
            to="/orders"
            aria-label="Get a Quote"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
            style={{
                backgroundColor: 'var(--accent)',
                color: '#fff',
                boxShadow: '0 6px 28px rgba(var(--accent-rgb), 0.5)',
            }}
        >
            <MessageSquarePlus size={18} className="transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden sm:inline">Get a Quote</span>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ backgroundColor: 'var(--accent)' }} />
        </Link>
    );
}
