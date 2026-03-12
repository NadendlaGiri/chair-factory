import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ClipboardList, Clock, CheckCircle, ArrowRight, TrendingUp, Eye, Activity } from 'lucide-react';
import { getDashboardStats, getTopProducts, getActivityLogs } from '../../services/api';
import { TableRowSkeleton } from '../../components/ui/ProductCardSkeleton';

const STATUS_COLORS = {
    NEW: { bg: '#dbeafe', text: '#1e40af', label: 'New' },
    IN_PROGRESS: { bg: '#fef3c7', text: '#92400e', label: 'In Progress' },
    COMPLETED: { bg: '#dcfce7', text: '#166534', label: 'Completed' },
    CANCELLED: { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' },
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getDashboardStats().catch(() => null),
            getTopProducts().catch(() => []),
            getActivityLogs(5).catch(() => [])
        ]).then(([dStats, dTop, dLogs]) => {
            if (dStats) setStats(dStats);
            setTopProducts(dTop);
            setLogs(dLogs);
        }).finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ClipboardList, color: '#2563eb', bg: '#dbeafe' },
        { label: 'Pending (New)', value: stats?.newOrders ?? 0, icon: Clock, color: '#d97706', bg: '#fef3c7' },
        { label: 'In Progress', value: stats?.inProgress ?? 0, icon: TrendingUp, color: '#7c3aed', bg: '#ede9fe' },
        { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, color: '#16a34a', bg: '#dcfce7' },
    ];

    return (
        <>
            <Helmet><title>Dashboard – Chair Factory Admin</title></Helmet>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {loading ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card animate-pulse h-[104px]" style={{ backgroundColor: 'var(--surface-raised)' }}>
                            <div className="h-4 w-1/2 mb-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                    )) : cards.map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="card group hover:shadow-card-hover">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                    <p className="text-4xl font-bold" style={{ color, fontFamily: "'Playfair Display', serif" }}>{value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: bg }}>
                                    <Icon size={22} style={{ color }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="card">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Orders</h2>
                        <Link to="/admin/orders" className="text-sm font-medium flex items-center gap-1 hover:underline" style={{ color: 'var(--accent)' }}>
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    {!stats?.recentOrders?.length && !loading ? (
                        <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#ID</th>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <>
                                            <TableRowSkeleton cols={5} />
                                            <TableRowSkeleton cols={5} />
                                            <TableRowSkeleton cols={5} />
                                        </>
                                    ) : stats.recentOrders.map(order => {
                                        const s = STATUS_COLORS[order.status] || STATUS_COLORS.NEW;
                                        return (
                                            <tr key={order.id}>
                                                <td className="font-mono text-xs">#{order.id}</td>
                                                <td className="font-medium">{order.customerName}</td>
                                                <td style={{ color: 'var(--text-muted)' }}>{order.productName}</td>
                                                <td>
                                                    <span className="badge" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { to: '/admin/products', label: 'Manage Products', icon: Package, desc: 'Add, edit, or remove products' },
                        { to: '/admin/orders', label: 'Manage Orders', icon: ClipboardList, desc: 'View and update order status' },
                        { to: '/admin/content', label: 'Edit Content', icon: CheckCircle, desc: "Update homepage & company info" },
                    ].map(({ to, label, icon: Icon, desc }) => (
                        <Link key={to} to={to} className="card group flex items-start gap-4 hover:border-current" style={{ borderColor: 'var(--border)' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                style={{ backgroundColor: 'var(--surface-overlay)' }}>
                                <Icon size={18} style={{ color: 'var(--accent)' }} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Products */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-5">
                            <Eye size={18} style={{ color: 'var(--accent)' }} />
                            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Top 10 Viewed Products</h2>
                        </div>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
                            </div>
                        ) : topProducts.length === 0 ? (
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No product views yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {topProducts.map((p, i) => (
                                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--surface-overlay)' }}>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg w-5 text-center" style={{ color: i < 3 ? 'var(--accent)' : 'var(--text-muted)' }}>{i + 1}</span>
                                            <div>
                                                <p className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
                                            <Eye size={12} /> {p.views.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Activity Log */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-5">
                            <Activity size={18} style={{ color: 'var(--accent)' }} />
                            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Admin Activity</h2>
                        </div>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
                            </div>
                        ) : logs.length === 0 ? (
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity.</p>
                        ) : (
                            <div className="space-y-3">
                                {logs.map(log => (
                                    <div key={log.id} className="flex flex-col p-3 rounded-xl border border-transparent hover:border-gray-200 transition-colors" style={{ backgroundColor: 'var(--surface-overlay)' }}>
                                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{log.action}</p>
                                        <div className="flex items-center justify-between mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                            <span>By: {log.adminName}</span>
                                            <span>{new Date(log.createdAt).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
