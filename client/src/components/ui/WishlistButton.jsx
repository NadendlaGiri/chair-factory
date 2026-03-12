import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';

export default function WishlistButton({ product, className = '' }) {
    const { toggle, isWishlisted } = useWishlistStore();
    const liked = isWishlisted(product.id);

    return (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
            title={liked ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 active:scale-90 ${className}`}
            style={{
                backgroundColor: liked ? 'rgba(239,68,68,0.12)' : 'var(--surface-overlay)',
                color: liked ? '#ef4444' : 'var(--text-muted)',
                border: liked ? '1.5px solid rgba(239,68,68,0.3)' : '1.5px solid var(--border)',
            }}
        >
            <Heart size={16} fill={liked ? '#ef4444' : 'none'} strokeWidth={2} />
        </button>
    );
}
