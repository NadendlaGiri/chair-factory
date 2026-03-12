import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitCompareArrows } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

export default function Compare() {
    const { items, clear } = useCompareStore();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
            <Helmet>
                <title>Compare Products – Factory Direct</title>
                <meta name="description" content="Compare products side-by-side to find the perfect fit." />
            </Helmet>

            <Breadcrumbs crumbs={[{ label: 'Compare' }]} />

            <div className="flex items-center justify-between mt-2 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                        Product Comparison
                    </h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        Compare specs side by side
                    </p>
                </div>
                {items.length > 0 && (
                    <button onClick={clear} className="text-sm hover:underline" style={{ color: '#ef4444' }}>
                        Clear All
                    </button>
                )}
            </div>

            {items.length < 2 ? (
                <div className="py-24 text-center rounded-2xl" style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                        style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-muted)' }}>
                        <GitCompareArrows size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Select products to compare</h3>
                    <p className="mb-6" style={{ color: 'var(--text-muted)' }}>You need at least 2 products to compare.</p>
                    <Link to="/products" className="btn-primary">Browse Products</Link>
                </div>
            ) : (
                <div className="overflow-x-auto w-full pb-8">
                    <table className="w-full min-w-[600px] border-collapse" style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th className="w-32 lg:w-48 p-4 border-b text-left font-bold text-sm uppercase tracking-wider"
                                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                                    Spec
                                </th>
                                {items.map(p => (
                                    <th key={p.id} className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                                        <div className="flex flex-col items-center text-center">
                                            {p.images?.[0] ? (
                                                <img src={p.images[0]} alt="" className="w-32 h-32 object-cover rounded-xl mb-3" />
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">No Image</div>
                                            )}
                                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                                            {p.price && <p className="font-bold mt-1" style={{ color: 'var(--accent)' }}>₹{p.price.toLocaleString()}</p>}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <Row label="Category" items={items} field="category" />
                            <Row label="Material" items={items} field="material" />
                            <Row label="Dimensions" items={items} field="dimensions" />
                            <tr>
                                <td className="p-4 border-b font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Action</td>
                                {items.map(p => (
                                    <td key={`link-${p.id}`} className="p-4 border-b text-center" style={{ borderColor: 'var(--border)' }}>
                                        <Link to={`/products/${p.slug}`} className="btn-outline py-2 px-4 text-xs">View Details</Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function Row({ label, items, field }) {
    return (
        <tr>
            <td className="p-4 border-b font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{label}</td>
            {items.map(p => (
                <td key={p.id} className="p-4 border-b text-center align-middle" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    {p[field] || '-'}
                </td>
            ))}
        </tr>
    );
}
