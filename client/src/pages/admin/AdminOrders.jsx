import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, Download } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_OPTS = ['ALL', 'NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const STATUS_COLORS = {
    NEW: { bg: '#dbeafe', text: '#1e40af' },
    IN_PROGRESS: { bg: '#fef3c7', text: '#92400e' },
    COMPLETED: { bg: '#dcfce7', text: '#166534' },
    CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setLoading(true);
        const params = { page, limit: 15 };
        if (filter !== 'ALL') params.status = filter;
        getOrders(params).then(data => {
            setOrders(data.orders || []);
            setTotal(data.total || 0);
        }).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false));
    }, [filter, page]);

    const changeStatus = async (id, status) => {
        try {
            const updated = await updateOrderStatus(id, status);
            setOrders(os => os.map(o => o.id === id ? updated : o));
            if (selected?.id === id) setSelected(updated);
            toast.success('Status updated');
        } catch { toast.error('Update failed'); }
    };

    const exportCSV = () => {
        const rows = [
            ['ID', 'Customer', 'Phone', 'Email', 'Company', 'Location', 'Product', 'Quantity', 'Status', 'Date'],
            ...orders.map(o => [o.id, o.customerName, o.phone, o.email, o.company || '', o.location, o.productName, o.quantity, o.status, new Date(o.createdAt).toLocaleDateString()]),
        ];
        const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
        URL.revokeObjectURL(url);
        toast.success('CSV downloaded!');
    };

    const pages = Math.ceil(total / 15);

    return (
        <>
            <Helmet><title>Orders – Chair Factory Admin</title></Helmet>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Order Requests</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} total requests</p>
                    </div>
                    <button onClick={exportCSV} className="btn-outline text-sm py-2 px-4">
                        <Download size={16} /> Export CSV
                    </button>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                    {STATUS_OPTS.map(s => (
                        <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                                backgroundColor: filter === s ? 'var(--accent)' : 'var(--surface-overlay)',
                                color: filter === s ? 'white' : 'var(--text-secondary)',
                            }}>
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {loading ? <LoadingSpinner /> : (
                    <div className="card overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-8" style={{ color: 'var(--text-muted)' }}>No orders found</td></tr>
                                    ) : orders.map(o => {
                                        const sc = STATUS_COLORS[o.status];
                                        return (
                                            <tr key={o.id}>
                                                <td className="font-mono text-xs">#{o.id}</td>
                                                <td>
                                                    <div>
                                                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{o.customerName}</p>
                                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{o.phone}</p>
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{o.productName}</td>
                                                <td className="font-semibold">{o.quantity}</td>
                                                <td>
                                                    <select
                                                        value={o.status}
                                                        onChange={e => changeStatus(o.id, e.target.value)}
                                                        className="text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer"
                                                        style={{ backgroundColor: sc?.bg, color: sc?.text }}>
                                                        {['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => (
                                                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td>
                                                    <button onClick={() => setSelected(o)} className="btn-ghost p-1.5 rounded-lg" title="View details">
                                                        <Eye size={14} style={{ color: 'var(--accent)' }} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {pages > 1 && (
                            <div className="flex justify-center gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
                                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => setPage(p)}
                                        className="w-9 h-9 rounded-lg text-sm font-medium"
                                        style={{ backgroundColor: page === p ? 'var(--accent)' : 'var(--surface-overlay)', color: page === p ? 'white' : 'var(--text-secondary)' }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="w-full max-w-lg my-8 rounded-2xl shadow-2xl" style={{ backgroundColor: 'var(--surface)' }}>
                        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Order #{selected.id}</h2>
                            <button onClick={() => setSelected(null)} className="btn-ghost p-2 rounded-lg text-lg font-bold">✕</button>
                        </div>
                        <div className="p-5 space-y-4">
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Customer</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {[['Name', selected.customerName], ['Phone', selected.phone], ['Email', selected.email],
                                    ['Company', selected.company || '—'], ['Location', selected.location]].map(([k, v]) => (
                                        <div key={k}><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{k}</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p></div>
                                    ))}
                                </div>
                            </section>
                            <section style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                                <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Order Details</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {[['Product', selected.productName], ['Quantity', selected.quantity], ['Material', selected.material || '—'], ['Timeline', selected.timeline || '—']].map(([k, v]) => (
                                        <div key={k}><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{k}</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p></div>
                                    ))}
                                </div>
                                {selected.notes && (
                                    <div className="mt-3"><p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Notes</p><p className="text-sm p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-secondary)' }}>{selected.notes}</p></div>
                                )}
                            </section>
                            <div className="flex items-center gap-3 pt-2">
                                <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Update Status:</label>
                                <select value={selected.status} onChange={e => changeStatus(selected.id, e.target.value)} className="input text-sm flex-1">
                                    {['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
