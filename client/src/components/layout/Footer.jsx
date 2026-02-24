import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useCompanyStore } from '../../store/companyStore';
import { getAllContent } from '../../services/api';

export default function Footer() {
    const year = new Date().getFullYear();
    const { name: companyName, logo: companyLogo, tagline, footerText, fetch: fetchCompany } = useCompanyStore();
    const [contact, setContact] = useState({});

    useEffect(() => {
        fetchCompany();
        getAllContent().then(data => setContact(data.contact || {})).catch(() => { });
    }, []);

    const phone = contact.phone || '+91 98765 43210';
    const email = contact.email || 'info@chairfactory.com';
    const address = contact.address || '123 Industrial Park, Manufacturing District, City - 400001';
    const whatsapp = contact.whatsapp || '919876543210';
    const phoneHref = 'tel:' + phone.replace(/\s+/g, '');

    return (
        <footer style={{ backgroundColor: 'var(--surface-raised)', borderTop: '1px solid var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3" style={{ color: 'var(--accent)' }}>
                            {companyLogo
                                ? <img src={companyLogo} alt={companyName} className="h-10 w-auto object-contain max-w-[140px]" />
                                : <Armchair size={24} />}
                            {companyName}
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            {tagline || 'Premium handcrafted chairs and benches since 1998. Factory-direct quality for homes, offices, and commercial spaces.'}
                        </p>
                        <a
                            href={`https://wa.me/${whatsapp}?text=Hi, I'm interested in ordering from ${companyName}.`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:opacity-90"
                            style={{ backgroundColor: '#25D366' }}>
                            <MessageCircle size={18} />
                            WhatsApp Us
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {[['/', 'Home'], ['/products', 'Products'], ['/about', 'About Us'], ['/orders', 'Bulk Orders'], ['/contact', 'Contact']].map(([to, label]) => (
                                <li key={to}>
                                    <Link to={to} className="text-sm transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                            Categories
                        </h3>
                        <ul className="space-y-2">
                            {['Office Chairs', 'Dining Chairs', 'Garden Chairs', 'Benches', 'Custom Orders', 'Bulk Orders'].map(c => (
                                <li key={c}>
                                    <Link to={`/products?category=${c.split(' ')[0].toLowerCase()}`}
                                        className="text-sm transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}>
                                        {c}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                            Contact
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                                {address}
                            </li>
                            <li>
                                <a href={phoneHref} className="flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                                    <Phone size={14} style={{ color: 'var(--accent)' }} />
                                    {phone}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                                    <Mail size={14} style={{ color: 'var(--accent)' }} />
                                    {email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {footerText || `© ${year} ${companyName}. All rights reserved.`}
                    </p>
                    <Link to="/admin/login" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>
                        Admin Portal
                    </Link>
                </div>
            </div>
        </footer>
    );
}
