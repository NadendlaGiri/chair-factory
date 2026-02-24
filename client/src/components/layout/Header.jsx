import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Armchair } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useCompanyStore } from '../../store/companyStore';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/orders', label: 'Bulk Orders' },
    { to: '/contact', label: 'Contact' },
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleDark } = useThemeStore();
    const location = useLocation();
    const { name: companyName, logo: companyLogo, fetch: fetchCompany } = useCompanyStore();

    useEffect(() => { fetchCompany(); }, []);

    // Sync favicon with uploaded logo
    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = companyLogo || '/vite.svg';
    }, [companyLogo]);


    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setOpen(false), [location]);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'nav-glass shadow-md' : ''}`}
            style={{ backgroundColor: scrolled ? undefined : 'var(--surface)', borderBottom: `1px solid var(--border)` }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: 'var(--accent)' }}>
                        {companyLogo
                            ? <img src={companyLogo} alt={companyName} className="h-9 w-auto object-contain max-w-[120px]" />
                            : <Armchair size={28} />}
                        <span className="font-display hidden sm:block">{companyName}</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <NavLink key={link.to} to={link.to} end={link.to === '/'}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'font-semibold'
                                        : 'hover:opacity-80'
                                    }`
                                }
                                style={({ isActive }) => ({
                                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                    backgroundColor: isActive ? 'var(--surface-overlay)' : 'transparent',
                                })}>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button onClick={toggleDark} className="btn-ghost p-2.5 rounded-lg"
                            aria-label="Toggle theme" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <Link to="/orders" className="btn-primary hidden sm:flex text-sm py-2 px-4">
                            Get a Quote
                        </Link>
                        <button onClick={() => setOpen(!open)} className="btn-ghost p-2.5 rounded-lg md:hidden"
                            aria-label="Toggle menu">
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden border-t animate-fade-in" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                    <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
                        {navLinks.map(link => (
                            <NavLink key={link.to} to={link.to} end={link.to === '/'}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'font-semibold' : ''}`
                                }
                                style={({ isActive }) => ({
                                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                    backgroundColor: isActive ? 'var(--surface-overlay)' : 'transparent',
                                })}>
                                {link.label}
                            </NavLink>
                        ))}
                        <Link to="/orders" className="btn-primary text-sm py-2.5 mt-2 text-center">
                            Get a Quote
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
