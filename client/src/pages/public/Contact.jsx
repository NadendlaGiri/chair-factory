import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { getAllContent } from '../../services/api';
import { useCompanyStore } from '../../store/companyStore';

export default function Contact() {
    const [contact, setContact] = useState(null);
    const { name: companyName } = useCompanyStore();

    useEffect(() => {
        getAllContent().then(data => setContact(data.contact || {})).catch(console.error);
    }, []);

    const phone = contact?.phone || '+91 98765 43210';
    const phoneHref = 'tel:' + phone.replace(/\s+/g, '');
    const email = contact?.email || 'info@chairfactory.com';
    const whatsapp = contact?.whatsapp || '919876543210';
    const whatsappLink = `https://wa.me/${whatsapp}`;
    const hours = contact?.hours || 'Mon–Sat: 9 AM – 6 PM IST';
    const address = contact?.address || '123 Industrial Park, Manufacturing District\nCity - 400001, India';

    const cards = [
        { icon: Phone, label: 'Phone', value: phone, href: phoneHref, color: '#2563eb' },
        { icon: Mail, label: 'Email', value: email, href: `mailto:${email}`, color: '#7c3aed' },
        { icon: MessageCircle, label: 'WhatsApp', value: phone, href: whatsappLink, color: '#16a34a' },
        { icon: Clock, label: 'Business Hours', value: hours, href: null, color: 'var(--accent)' },
    ];

    return (
        <>
            <Helmet>
                <title>Contact – {companyName}</title>
                <meta name="description" content={`Get in touch with ${companyName}. Phone, email, WhatsApp, and address details.`} />
            </Helmet>

            <section className="py-20" style={{ background: 'var(--hero-gradient)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="section-title text-5xl mb-4">Get In Touch</h1>
                    <p className="section-subtitle">We'd love to hear from you. Reach out via any channel below.</p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {cards.map(({ icon: Icon, label, value, href, color }) => (
                            <div key={label} className="card flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: color + '20' }}>
                                    <Icon size={22} style={{ color }} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                    {href ? (
                                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                                            className="font-semibold hover:underline" style={{ color: 'var(--text-primary)' }}>{value}</a>
                                    ) : (
                                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Address */}
                    <div className="card mt-8 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--surface-overlay)' }}>
                            <MapPin size={22} style={{ color: 'var(--accent)' }} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Factory Address</p>
                            <p className="font-semibold" style={{ color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                                {address}
                            </p>
                        </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="text-center mt-12">
                        <a href={`${whatsappLink}?text=Hi, I'm interested in ordering from ${companyName}.`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                            style={{ backgroundColor: '#25D366' }}>
                            <MessageCircle size={24} />
                            Chat with Us on WhatsApp
                        </a>
                        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                            We typically respond within 1 hour during business hours
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
