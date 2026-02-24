import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Package, MessageCircle, ShoppingBag, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProduct } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [prevImg, setPrevImg] = useState(null);

    // navigate with crossfade tracking
    const navigate = (newIdx) => {
        setActiveImg(cur => { setPrevImg(cur); return newIdx; });
    };

    useEffect(() => {
        setLoading(true);
        getProduct(slug).then(p => { setProduct(p); setActiveImg(0); setPrevImg(null); }).catch(console.error).finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <LoadingSpinner fullScreen />;
    if (!product) return (
        <div className="text-center py-32">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Product not found</h2>
            <Link to="/products" className="btn-primary">Back to Products</Link>
        </div>
    );

    const { name, category, description, material, dimensions, price, availability, images, tags } = product;

    return (
        <>
            <Helmet>
                <title>{name} – Chair Factory</title>
                <meta name="description" content={description?.slice(0, 155)} />
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link to="/products" className="inline-flex items-center gap-2 text-sm mb-8 hover:underline" style={{ color: 'var(--text-muted)' }}>
                    <ArrowLeft size={16} /> Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <div>
                        <style>{`
                            @keyframes pd-fade-in { from { opacity:0; } to { opacity:1; } }
                            .pd-img-active { animation: pd-fade-in 0.5s ease forwards; }
                        `}</style>

                        {/* Main image — crossfade */}
                        <div
                            className="relative rounded-2xl overflow-hidden mb-4"
                            style={{ backgroundColor: 'var(--surface-overlay)', height: '460px' }}>

                            {images && images.length > 0 ? (
                                <>
                                    {/* Outgoing image fades out */}
                                    {prevImg !== null && prevImg !== activeImg && (
                                        <img
                                            key={`out-${prevImg}`}
                                            src={images[prevImg]}
                                            alt=""
                                            aria-hidden
                                            className="absolute inset-0 w-full h-full object-contain"
                                            style={{ zIndex: 1, opacity: 0, transition: 'opacity 0.4s ease' }}
                                        />
                                    )}
                                    {/* Active image fades in */}
                                    <img
                                        key={`in-${activeImg}`}
                                        src={images[activeImg]}
                                        alt={name}
                                        className="absolute inset-0 w-full h-full object-contain"
                                        style={{
                                            zIndex: 2,
                                            opacity: 0,
                                            animation: 'pd-fade-in 0.4s ease forwards',
                                        }}
                                    />
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#e8d5b7' }}>
                                    <Package size={80} style={{ color: 'rgba(0,0,0,0.2)' }} />
                                    <span className="text-sm" style={{ color: 'rgba(0,0,0,0.3)' }}>No image available</span>
                                </div>
                            )}

                            {/* Left / Right arrow buttons */}
                            {images && images.length > 1 && (
                                <>
                                    <button type="button"
                                        onClick={() => navigate((activeImg - 1 + images.length) % images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                        style={{ zIndex: 10, backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--accent)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button type="button"
                                        onClick={() => navigate((activeImg + 1) % images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                        style={{ zIndex: 10, backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--accent)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* Dot indicators */}
                            {images && images.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex: 10 }}>
                                    {images.map((_, i) => (
                                        <button key={i} type="button"
                                            onClick={() => navigate(i)}
                                            className="rounded-full transition-all duration-300"
                                            style={{
                                                width: i === activeImg ? '20px' : '8px',
                                                height: '8px',
                                                backgroundColor: i === activeImg ? 'var(--accent)' : 'rgba(0,0,0,0.25)',
                                            }} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {images && images.length > 1 && (
                            <div className="flex gap-2 flex-wrap">
                                {images.map((img, i) => (
                                    <button key={i}
                                        type="button"
                                        onClick={() => navigate(i)}
                                        className="rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
                                        style={{
                                            width: '72px', height: '72px',
                                            borderColor: activeImg === i ? 'var(--accent)' : 'var(--border)',
                                            opacity: activeImg === i ? 1 : 0.7,
                                            transform: activeImg === i ? 'scale(1.07)' : 'scale(1)',
                                        }}>
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                            style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--accent)' }}>
                            {category}
                        </span>
                        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                            {name}
                        </h1>
                        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>

                        {/* Specs */}
                        <div className="rounded-xl p-4 mb-6 space-y-3" style={{ backgroundColor: 'var(--surface-overlay)' }}>
                            {[
                                ['Material', material],
                                ['Dimensions', dimensions],
                                ['Price', price ? `₹${price.toLocaleString()}` : 'Contact for quote'],
                                ['Availability', availability ? 'In Stock' : 'Out of Stock'],
                            ].map(([key, val]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                    <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>{key}</span>
                                    <span className={`font-medium ${key === 'Availability' ? (availability ? 'text-green-600' : 'text-red-500') : ''}`}
                                        style={{ color: key === 'Availability' ? undefined : 'var(--text-primary)' }}>
                                        {key === 'Availability' && <CheckCircle size={14} className="inline mr-1" />}
                                        {val}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {tags.map(tag => (
                                    <span key={tag} className="badge badge-primary">#{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to={`/orders?product=${encodeURIComponent(name)}`} className="btn-primary flex-1 text-center py-3">
                                <ShoppingBag size={18} /> Order This Product
                            </Link>
                            <a
                                href={`https://wa.me/919876543210?text=Hi, I'm interested in "${name}"`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: '#25D366', flex: '0 0 auto' }}>
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
