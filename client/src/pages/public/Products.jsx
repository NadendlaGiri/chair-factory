import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import { getProducts, getAllContent } from '../../services/api';
import ProductCard from '../../components/public/ProductCard';
import ProductCardSkeleton from '../../components/ui/ProductCardSkeleton';



export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const [categories, setCategories] = useState(['All']);
    const [materials, setMaterials] = useState(['All']);

    // Autocomplete state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        getAllContent().then(data => {
            if (Array.isArray(data?.productCategories) && data.productCategories.length > 0)
                setCategories(['All', ...data.productCategories]);
            if (Array.isArray(data?.productMaterials) && data.productMaterials.length > 0)
                setMaterials(['All', ...data.productMaterials]);
        }).catch(() => {});
    }, []);

    const category = searchParams.get('category') || 'All';
    const material = searchParams.get('material') || 'All';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (category !== 'All') params.category = category;
            if (material !== 'All') params.material = material;
            if (search) params.search = search;
            const data = await getProducts(params);
            setProducts(data.products || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [category, material, search, page]);

    useEffect(() => {
        fetchProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchProducts]);

    // Search autocomplete debounce
    useEffect(() => {
        if (!search || search.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await getProducts({ search, limit: 5 });
                setSuggestions(res.products || []);
                setShowSuggestions(true);
            } catch { }
            finally { setSearching(false); }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const setParam = (key, value) => {
        const p = new URLSearchParams(searchParams);
        if (value && value !== 'All') p.set(key, value); else p.delete(key);
        p.delete('page');
        setSearchParams(p);
    };

    const hasFilters = material !== 'All' || search;

    return (
        <>
            <Helmet>
                <title>Products – {document.title.split('–')[1]?.trim() || 'Our Store'}</title>
                <meta name="description" content="Browse our full product catalog. Filter by category or search for what you need." />
            </Helmet>

            {/* ── Hero band ── */}
            <div className="py-14 text-center" style={{ background: 'var(--hero-gradient)' }}>
                <h1 className="section-title mb-2">Our Products</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Factory-direct quality · {total > 0 ? `${total} items available` : 'Loading…'}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ── Category pill tabs ── */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setParam('category', cat)}
                            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                            style={{
                                backgroundColor: category === cat ? 'var(--accent)' : 'var(--surface-overlay)',
                                color: category === cat ? '#fff' : 'var(--text-secondary)',
                                border: '1.5px solid',
                                borderColor: category === cat ? 'var(--accent)' : 'transparent',
                                transform: category === cat ? 'scale(1.05)' : 'scale(1)',
                            }}>
                            {cat === 'All' ? 'All Products' : cat}
                        </button>
                    ))}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Filter toggle */}
                    <button
                        onClick={() => setFilterOpen(o => !o)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                        style={{
                            backgroundColor: filterOpen || hasFilters ? 'var(--accent)' : 'var(--surface-overlay)',
                            color: filterOpen || hasFilters ? '#fff' : 'var(--text-secondary)',
                            border: '1.5px solid',
                            borderColor: filterOpen || hasFilters ? 'var(--accent)' : 'transparent',
                        }}>
                        <SlidersHorizontal size={15} />
                        Filters
                        {hasFilters && <span className="w-2 h-2 rounded-full bg-white opacity-80" />}
                        <ChevronDown size={14} style={{ transform: filterOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                </div>

                {/* ── Expandable filter bar ── */}
                {filterOpen && (
                    <div className="mb-8 p-5 rounded-2xl flex flex-wrap gap-6 items-end animate-fade-in"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)' }}>

                        {/* Search + Autocomplete */}
                        <div className="flex-1 min-w-[200px] relative">
                            <label className="label">Search</label>
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search products…"
                                    value={search}
                                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onChange={e => setParam('search', e.target.value)}
                                    className="input pl-9" />
                                {searching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />}
                            </div>

                            {/* Autocomplete Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl py-2 shadow-xl animate-fade-in border"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                                    {suggestions.map(s => (
                                        <button
                                            key={s.id}
                                            onMouseDown={() => { setParam('search', s.name); setShowSuggestions(false); }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                                            {s.images?.[0] ? (
                                                <img src={s.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                                            ) : <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700" />}
                                            <span className="text-sm font-medium flex-1 truncate">{s.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Material */}
                        <div className="min-w-[200px]">
                            <label className="label">Material</label>
                            <select value={material} onChange={e => setParam('material', e.target.value)} className="input text-sm">
                                {materials.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        {/* Clear */}
                        {hasFilters && (
                            <button
                                onClick={() => { setSearchParams({}); }}
                                className="flex items-center gap-1.5 text-sm font-medium pb-1"
                                style={{ color: 'var(--text-muted)' }}>
                                <X size={14} /> Clear all
                            </button>
                        )}
                    </div>
                )}

                {/* ── Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 space-y-3">
                        <p className="text-6xl">📦</p>
                        <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>No products found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                        </div>

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-14">
                                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => {
                                            const ps = new URLSearchParams(searchParams);
                                            ps.set('page', p);
                                            setSearchParams(ps);
                                        }}
                                        className="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200"
                                        style={{
                                            backgroundColor: page === p ? 'var(--accent)' : 'var(--surface-overlay)',
                                            color: page === p ? '#fff' : 'var(--text-secondary)',
                                            transform: page === p ? 'scale(1.1)' : 'scale(1)',
                                        }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
