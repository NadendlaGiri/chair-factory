import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs — pass an array of { label, to } objects.
 * The last item is current page (no link).
 * Example: [{ label: 'Products', to: '/products' }, { label: 'Chair Name' }]
 */
export default function Breadcrumbs({ crumbs = [] }) {
    const all = [{ label: 'Home', to: '/' }, ...crumbs];

    return (
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm py-3">
            {all.map((crumb, i) => {
                const isLast = i === all.length - 1;
                return (
                    <span key={i} className="flex items-center gap-1">
                        {i === 0
                            ? <Home size={13} style={{ color: 'var(--text-muted)' }} />
                            : <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
                        }
                        {isLast || !crumb.to
                            ? <span className="font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{crumb.label}</span>
                            : <Link to={crumb.to} className="hover:underline transition-colors truncate max-w-[160px]"
                                style={{ color: 'var(--text-muted)' }}>{crumb.label}</Link>
                        }
                    </span>
                );
            })}
        </nav>
    );
}
