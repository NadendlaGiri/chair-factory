import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ClipboardList, FileText,
    Palette, LogOut, Menu, X, Armchair, ChevronRight, Settings2, MessageCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCompanyStore } from '../../store/companyStore';
import toast from 'react-hot-toast';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/admin/inquiries', icon: MessageCircle, label: 'Inquiries' },
    { to: '/admin/content', icon: FileText, label: 'Content' },
    { to: '/admin/themes', icon: Palette, label: 'Themes' },
    { to: '/admin/settings', icon: Settings2, label: 'Settings' },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { admin, logout } = useAuthStore();
    const { name: companyName, logo, fetch: fetchCompany } = useCompanyStore();
    const navigate = useNavigate();

    useEffect(() => { fetchCompany(); }, []);

    // Sync favicon with uploaded logo
    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = logo || '/vite.svg';
    }, [logo]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    const Sidebar = () => (
        <aside className="flex flex-col h-full w-64"
            style={{ backgroundColor: 'var(--surface-raised)', borderRight: '1px solid var(--border)' }}>
            {/* Logo */}
            <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: logo ? 'transparent' : 'var(--accent)' }}>
                    {logo
                        ? <img src={logo} alt={companyName} className="w-full h-full object-contain" />
                        : <Armchair size={20} className="text-white" />}
                </div>
                <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{companyName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                    <NavLink key={to} to={to} end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'text-white font-semibold shadow-sm' : 'hover:shadow-sm'
                            }`
                        }
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                        })}
                        onClick={() => setSidebarOpen(false)}>
                        <Icon size={18} />
                        {label}
                        <ChevronRight size={14} className="ml-auto opacity-50" />
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: 'var(--accent)' }}>
                        {admin?.name?.[0] || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{admin?.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{admin?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600"
                    style={{ color: 'var(--text-muted)' }}>
                    <LogOut size={16} /> Log Out
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
            {/* Desktop sidebar */}
            <div className="hidden md:block flex-shrink-0">
                <div className="h-full" style={{ width: 256 }}>
                    <Sidebar />
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar (mobile) */}
                <div className="md:hidden flex items-center justify-between px-4 py-3"
                    style={{ backgroundColor: 'var(--surface-raised)', borderBottom: '1px solid var(--border)' }}>
                    <button onClick={() => setSidebarOpen(true)} className="btn-ghost p-2 rounded-lg">
                        <Menu size={20} />
                    </button>
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>{companyName} Admin</span>
                    <div className="w-9" />
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 page-enter">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
