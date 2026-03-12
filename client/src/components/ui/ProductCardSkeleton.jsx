/** Skeleton placeholder for ProductCard while loading */
export default function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
            {/* Image placeholder */}
            <div className="w-full h-56" style={{ backgroundColor: 'var(--surface-overlay)' }} />
            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="h-3 rounded-full w-1/3" style={{ backgroundColor: 'var(--surface-overlay)' }} />
                <div className="h-5 rounded-full w-3/4" style={{ backgroundColor: 'var(--surface-overlay)' }} />
                <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: 'var(--surface-overlay)' }} />
                <div className="flex justify-between mt-4">
                    <div className="h-6 rounded-full w-1/4" style={{ backgroundColor: 'var(--surface-overlay)' }} />
                    <div className="h-8 w-8 rounded-full" style={{ backgroundColor: 'var(--surface-overlay)' }} />
                </div>
            </div>
        </div>
    );
}

/** Skeleton rows for admin table */
export function TableRowSkeleton({ cols = 6 }) {
    return (
        <tr>
            {Array.from({ length: cols }, (_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 rounded-full animate-pulse" style={{ backgroundColor: 'var(--surface-overlay)', width: i === 0 ? '70%' : '50%' }} />
                </td>
            ))}
        </tr>
    );
}
