import { Link } from 'react-router-dom';
import { ArrowRight, Star, Package } from 'lucide-react';

const PALETTE = [
    { bg: 'rgba(146,64,14,0.1)',  text: '#92400e' },
    { bg: 'rgba(22,163,74,0.1)',  text: '#15803d' },
    { bg: 'rgba(124,58,237,0.1)', text: '#7c3aed' },
    { bg: 'rgba(37,99,235,0.1)',  text: '#1d4ed8' },
    { bg: 'rgba(219,39,119,0.1)', text: '#be185d' },
    { bg: 'rgba(234,88,12,0.1)',  text: '#c2410c' },
    { bg: 'rgba(13,148,136,0.1)', text: '#0f766e' },
    { bg: 'rgba(101,163,13,0.1)', text: '#4d7c0f' },
];
function catColor(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
    return PALETTE[Math.abs(h) % PALETTE.length];
}

const PLACEHOLDER_BG = ['#e8d5b7', '#d4c5a9', '#c9b99a', '#ddb89e', '#bfa88c'];

export default function ProductCard({ product, index = 0 }) {
    const { name, slug, category, material, price, featured, images } = product;
    const catStyle = catColor(category);
    const placeholderBg = PLACEHOLDER_BG[index % PLACEHOLDER_BG.length];

    return (
        <Link
            to={`/products/${slug}`}
            className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
            style={{
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>

            {/* ── Image ── */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: placeholderBg }}>
                {images && images.length > 0 ? (
                    <img
                        src={images[0].startsWith('http') ? images[0] : images[0]}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <Package size={52} style={{ color: 'rgba(0,0,0,0.22)' }} />
                        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(0,0,0,0.3)' }}>{category}</span>
                    </div>
                )}

                {/* Featured badge */}
                {featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: 'var(--accent)', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
                        <Star size={10} fill="white" />
                        Featured
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 100%)' }}>
                    <span className="flex items-center gap-2 bg-white text-sm font-bold px-5 py-2.5 rounded-full transition-transform duration-300 translate-y-2 group-hover:translate-y-0"
                        style={{ color: 'var(--accent)' }}>
                        View Details <ArrowRight size={14} />
                    </span>
                </div>
            </div>

            {/* ── Info ── */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Category pill */}
                <span className="self-start px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: catStyle.bg, color: catStyle.text }}>
                    {category}
                </span>

                {/* Name + material */}
                <div>
                    <h3 className="font-bold text-base leading-snug mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{material}</p>
                </div>

                {/* Price row */}
                <div className="mt-auto flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid var(--border)' }}>
                    {price ? (
                        <span className="font-extrabold text-lg" style={{ color: 'var(--accent)' }}>
                            ₹{price.toLocaleString()}
                        </span>
                    ) : (
                        <span className="text-xs italic font-medium" style={{ color: 'var(--text-muted)' }}>
                            Request a Quote
                        </span>
                    )}
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--accent)' }}>
                        Order →
                    </span>
                </div>
            </div>
        </Link>
    );
}
