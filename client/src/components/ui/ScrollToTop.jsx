import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 320);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-24 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
                backgroundColor: 'var(--accent)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(var(--accent-rgb), 0.45)',
                animation: 'fadeSlideIn 0.3s ease',
            }}
        >
            <ChevronUp size={20} strokeWidth={2.5} />
        </button>
    );
}
