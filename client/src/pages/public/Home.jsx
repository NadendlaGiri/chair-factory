import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Award, Clock, Users, Globe, ChevronDown } from 'lucide-react';
import { getProducts, getAllContent } from '../../services/api';
import { STAT_ICONS } from '../admin/AdminContent';
import ProductCard from '../../components/public/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useCompanyStore } from '../../store/companyStore';
import { useThemeStore } from '../../store/themeStore';

const FALLBACK_ICON_MAP = [Clock, Award, Users, Globe];

const DEFAULT_STATS = [
    { label: 'Years of Experience', value: '25+' },
    { label: 'Products Made', value: '50K+' },
    { label: 'Happy Clients', value: '2,000+' },
    { label: 'Countries Served', value: '15+' },
];
const DEFAULT_FEATURES = [
    { icon: '🏭', title: 'Factory Direct', desc: 'No middlemen. Buy directly from manufacturer at best prices.' },
    { icon: '🪵', title: 'Premium Materials', desc: 'FSC-certified wood, commercial-grade steel, and premium upholstery.' },
    { icon: '📦', title: 'Bulk Capability', desc: 'From single pieces to 10,000+ units. Custom specs available.' },
    { icon: '🔧', title: '5-Year Warranty', desc: 'Structural warranty on all products with free repair service.' },
    { icon: '🚚', title: 'Pan-India Delivery', desc: 'Fast logistics with safe packaging to any location in India.' },
    { icon: '✏️', title: 'Custom Design', desc: 'Design your own — dimensions, material, finish, and upholstery.' },
];

// ── Theme-aware hero loading skeleton ──────────────────────────────────────
function HeroSkeleton({ visible }) {
    const { theme } = useThemeStore();

    const skeletons = {
        // Warm shimmer wave
        light: (
            <div className="absolute inset-0 overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
                <style>{`
                    @keyframes hero-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
                `}</style>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%)', animation: 'hero-shimmer 1.8s ease infinite' }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-20">
                    <div className="h-8 w-64 rounded-lg" style={{ background: 'var(--accent)' }} />
                    <div className="h-4 w-96 rounded-lg" style={{ background: 'var(--accent)' }} />
                    <div className="h-4 w-72 rounded-lg" style={{ background: 'var(--accent)' }} />
                    <div className="flex gap-3 mt-4">
                        <div className="h-10 w-32 rounded-xl" style={{ background: 'var(--accent)' }} />
                        <div className="h-10 w-32 rounded-xl" style={{ background: 'var(--accent)', opacity: 0.5 }} />
                    </div>
                </div>
            </div>
        ),
        // Dark — shimmer sweep (no scan line)
        dark: (
            <div className="absolute inset-0 overflow-hidden" style={{ background: '#0f0f0f' }}>
                <style>{`
                    @keyframes dark-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
                `}</style>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.04) 50%,transparent 100%)', animation: 'dark-shimmer 2s ease infinite' }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    {[72, 96, 80, 0].map((w, i) => w ? (
                        <div key={i} className="rounded" style={{ height: i === 0 ? 28 : 14, width: `${w * 4}px`, background: 'rgba(255,255,255,0.07)', borderRadius: 6 }} />
                    ) : <div key={i} className="h-4" />)}
                </div>
            </div>
        ),
        // Industrial — blinking bars
        industrial: (
            <div className="absolute inset-0 overflow-hidden" style={{ background: '#1a1a18' }}>
                <style>{`
                    @keyframes blink-a { 0%,49%{opacity:1} 50%,100%{opacity:0.2} }
                    @keyframes blink-b { 0%,49%{opacity:0.2} 50%,100%{opacity:1} }
                `}</style>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                    {[1,2,3,4,5,6,7,8].map((_, i) => (
                        <div key={i} style={{
                            width: 6, height: `${40 + (i % 3) * 30}px`,
                            background: 'var(--accent)',
                            borderRadius: 2,
                            animation: `${i % 2 === 0 ? 'blink-a' : 'blink-b'} ${0.6 + i * 0.1}s step-end infinite`,
                        }} />
                    ))}
                </div>
            </div>
        ),
        // Wood — warm shimmer (same as light but sepia toned)
        wood: (
            <div className="absolute inset-0 overflow-hidden" style={{ background: 'linear-gradient(135deg,#3b1f0c 0%,#6b3a1f 100%)' }}>
                <style>{`@keyframes wood-sheen { 0%{transform:translateX(-100%) rotate(15deg)} 100%{transform:translateX(200%) rotate(15deg)} }`}</style>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(205,150,90,0.18) 50%,transparent 60%)', animation: 'wood-sheen 2s ease infinite' }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-25">
                    {[260, 380, 300].map((w, i) => <div key={i} className="rounded-lg" style={{ height: i === 0 ? 28 : 14, width: w, background: '#cd9654' }} />)}
                </div>
            </div>
        ),
        // Modern — rotating arc
        modern: (
            <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }}>
                <style>{`@keyframes arc { to { transform: rotate(360deg); } }`}</style>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div style={{
                        width: 64, height: 64,
                        borderRadius: '50%',
                        border: '4px solid rgba(var(--accent-rgb, 146,64,14),0.15)',
                        borderTopColor: 'var(--accent)',
                        animation: 'arc 0.9s linear infinite',
                    }} />
                </div>
            </div>
        ),
    };

    return (
        <div
            className="absolute inset-0"
            style={{
                zIndex: 10,
                pointerEvents: visible ? 'auto' : 'none',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.6s ease',
            }}
        >
            {skeletons[theme] || skeletons.light}
        </div>
    );
}

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [heroImages, setHeroImages] = useState([]);
    const [slideState, setSlideState] = useState({ curr: 0, prev: null });
    const { name: companyName, fetch: fetchCompany } = useCompanyStore();

    useEffect(() => {
        fetchCompany();
        Promise.all([
            getProducts({ featured: true, limit: 8 }),
            getAllContent(),
        ]).then(([prodData, contentData]) => {
            setFeatured(prodData.products || []);
            setContent(contentData);
            setHeroImages(contentData.heroImages || []);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    // Auto-advance slideshow every 4 seconds
    useEffect(() => {
        if (heroImages.length < 2) return;
        const timer = setInterval(() => {
            setSlideState(s => ({
                curr: (s.curr + 1) % heroImages.length,
                prev: s.curr,
            }));
        }, 4000);
        return () => clearInterval(timer);
    }, [heroImages]);

    const hero = content.hero || {};
    const heroTitle = hero.title || '';
    const heroSubtitle = hero.subtitle || '';
    const heroBadge = hero.badge || '';
    const ctaPrimary = hero.ctaPrimary || '';
    const ctaSecondary = hero.ctaSecondary || '';

    const stats = (content.stats && content.stats.length > 0) ? content.stats : DEFAULT_STATS;
    const features = (content.features && content.features.length > 0) ? content.features : DEFAULT_FEATURES;
    const homeCTA = content.homeCTA || {};
    const ctaTitle = homeCTA.title || 'Ready to Order?';
    const ctaSubtitle = homeCTA.subtitle || 'Submit your bulk order request or contact us for a custom quote. We respond within 24 hours.';

    return (
        <>
            <Helmet>
                <title>{companyName} – Premium Handcrafted Furniture</title>
                <meta name="description" content="Factory-direct premium chairs and benches. Browse our catalog or submit a bulk order request." />
            </Helmet>

            {/* Hero */}
            <section className="relative overflow-hidden min-h-[90vh] h-[90vh] flex items-center">
                {/* Theme-aware loading skeleton — fades out once content loads */}
                <HeroSkeleton visible={loading} />
                {/* ── Background slideshow ── */}
                {heroImages.length > 0 ? (
                    <>
                        {/* Keyframe definitions */}
                        <style>{`
                            @keyframes cf-slide-in  { from { transform: translateX(100%); } to { transform: translateX(0%); } }
                            @keyframes cf-slide-out { from { transform: translateX(0%);   } to { transform: translateX(-100%); } }
                        `}</style>

                        {heroImages.map((url, i) => {
                            const isCurr = i === slideState.curr;
                            const isPrev = i === slideState.prev;
                            if (!isCurr && !isPrev) return null;
                            const anim = isCurr && slideState.prev !== null
                                ? 'cf-slide-in 1s ease forwards'
                                : isPrev
                                    ? 'cf-slide-out 1s ease forwards'
                                    : 'none';
                            return (
                                <img
                                    key={url}
                                    src={url}
                                    alt=""
                                    aria-hidden
                                    className="absolute inset-0 w-full h-full object-contain"
                                    style={{ zIndex: isCurr ? 1 : 0, animation: anim }}
                                />
                            );
                        })}

                        {/* Dark overlay */}
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(135deg,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.35) 60%,rgba(0,0,0,0.2) 100%)',
                            zIndex: 2,
                        }} />

                        {/* Slide dots */}
                        {heroImages.length > 1 && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 3 }}>
                                {heroImages.map((_, i) => (
                                    <button key={i}
                                        onClick={() => setSlideState(s => ({ curr: i, prev: s.curr }))}
                                        aria-label={`Slide ${i + 1}`}
                                        className="rounded-full transition-all duration-300"
                                        style={{
                                            width: i === slideState.curr ? '20px' : '8px',
                                            height: '8px',
                                            backgroundColor: i === slideState.curr ? '#fff' : 'rgba(255,255,255,0.45)',
                                        }} />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)', zIndex: 0 }} />
                        <div className="absolute inset-0 opacity-5 z-[1]"
                            style={{ backgroundImage: 'repeating-linear-gradient(45deg,var(--accent) 0,var(--accent) 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
                    </>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    style={{ zIndex: 2 }}>
                    <div className="animate-slide-up">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-widest"
                            style={{
                                backgroundColor: heroImages.length > 0 ? 'rgba(255,255,255,0.15)' : 'var(--surface-overlay)',
                                color: heroImages.length > 0 ? '#fff' : 'var(--accent)',
                                backdropFilter: 'blur(6px)',
                            }}>
                            {heroBadge}
                        </span>
                        <h1 className="section-title text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                color: heroImages.length > 0 ? '#fff' : undefined,
                                textShadow: heroImages.length > 0 ? '0 2px 12px rgba(0,0,0,0.4)' : undefined,
                            }}>
                            {heroTitle}
                        </h1>
                        <p className="text-lg md:text-xl mb-8 max-w-xl"
                            style={{ color: heroImages.length > 0 ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}>
                            {heroSubtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="btn-primary text-base py-3 px-8">
                                {ctaPrimary} <ArrowRight size={18} />
                            </Link>
                            <Link to="/orders" className="btn-outline text-base py-3 px-8">
                                {ctaSecondary}
                            </Link>
                        </div>
                    </div>

                    {/* Hero visual — hidden (uncomment to restore the emoji chair placeholder)
                    {heroImages.length === 0 && (
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="w-80 h-80 rounded-full flex items-center justify-center animate-float"
                                style={{ backgroundColor: 'var(--surface-overlay)', border: '3px solid var(--border)', boxShadow: '0 0 60px rgba(var(--accent-rgb),0.2)' }}>
                                <span style={{ fontSize: '160px', lineHeight: 1 }}>🪑</span>
                            </div>
                        </div>
                    )}
                    */}
                </div>

                {/* Scroll indicator */}
                <a href="#stats"
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
                    style={{ color: heroImages.length > 0 ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', zIndex: 2 }}>
                    <ChevronDown size={28} />
                </a>
            </section>

            {/* Stats */}
            <section id="stats" className="py-16" style={{ backgroundColor: 'var(--surface-raised)', borderTop: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => {
                            const found = STAT_ICONS.find(s => s.key === stat.icon);
                            const Icon = found?.Icon || FALLBACK_ICON_MAP[i % FALLBACK_ICON_MAP.length];
                            return (
                                <div key={i} className="text-center p-6 rounded-xl card group">
                                    <Icon size={28} className="mx-auto mb-3 transition-transform group-hover:scale-110" style={{ color: 'var(--accent)' }} />
                                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)', fontFamily: "'Playfair Display', serif" }}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Featured Products</h2>
                        <p className="section-subtitle">Handpicked bestsellers from our catalog</p>
                    </div>
                    {loading ? <LoadingSpinner /> : (
                        <>
                            <div className="products-grid">
                                {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                            </div>
                            <div className="text-center mt-12">
                                <Link to="/products" className="btn-outline text-base py-3 px-8">
                                    View All Products <ArrowRight size={18} />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Why Us */}
            <section className="py-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Why Choose Us?</h2>
                        <p className="section-subtitle">Factory quality at competitive prices</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((item, i) => (
                            <div key={i} className="card text-center group hover:border-current" style={{ borderColor: 'var(--border)' }}>
                                <span className="text-4xl mb-4 block transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20" style={{ background: 'var(--hero-gradient)' }}>
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="section-title mb-4">{ctaTitle}</h2>
                    <p className="section-subtitle mb-8">{ctaSubtitle}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/orders" className="btn-primary text-base py-3 px-8">
                            Submit Order Request <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn-outline text-base py-3 px-8">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
