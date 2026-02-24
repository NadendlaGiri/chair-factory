import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { getAllContent } from '../../services/api';
import { useCompanyStore } from '../../store/companyStore';

const DEFAULT_VALUES = [
    { icon: '🪵', title: 'Quality Materials', desc: 'We source only premium FSC-certified woods, commercial-grade metals, and high-quality upholstery materials.' },
    { icon: '🔨', title: 'Expert Craftsmen', desc: 'Our team of 200+ skilled craftsmen brings decades of expertise to every piece we manufacture.' },
    { icon: '🌱', title: 'Sustainability', desc: 'Committed to sustainable manufacturing — from responsible sourcing to eco-friendly finishes.' },
    { icon: '🏆', title: 'Award-Winning', desc: 'Recipient of the National Manufacturing Excellence Award (2019, 2022).' },
];
const DEFAULT_TIMELINE = [
    { year: '1998', event: 'Founded in a small workshop with 5 employees in Mumbai.' },
    { year: '2004', event: 'Expanded to a 50,000 sq.ft. manufacturing facility.' },
    { year: '2010', event: 'Launched commercial export operations to 10+ countries.' },
    { year: '2016', event: 'Opened a showroom and custom design studio.' },
    { year: '2020', event: 'Achieved ISO 9001:2015 quality certification.' },
    { year: '2024', event: 'Serving 2,000+ clients with 300+ dedicated staff.' },
];

export default function About() {
    const [content, setContent] = useState(null);
    const { name: companyName } = useCompanyStore();

    useEffect(() => {
        getAllContent().then(setContent).catch(console.error);
    }, []);

    const about = content?.about || {};
    const heroTitle = about.heroTitle || 'Our Story';
    const heroSubtitle = about.heroSubtitle || "From a small 5-person workshop in 1998 to one of India's leading chair manufacturers, we've built our reputation on quality, craftsmanship, and customer trust.";
    const values = (content?.values && content.values.length > 0) ? content.values : DEFAULT_VALUES;
    const timeline = (content?.timeline && content.timeline.length > 0) ? content.timeline : DEFAULT_TIMELINE;

    return (
        <>
            <Helmet>
                <title>About Us – {companyName}</title>
                <meta name="description" content={`Learn about ${companyName} – 25+ years of premium furniture manufacturing. Our story, values, and team.`} />
            </Helmet>

            {/* Hero */}
            <section className="py-20" style={{ background: 'var(--hero-gradient)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {!content ? (
                        <Loader2 size={24} className="animate-spin mx-auto" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                        <>
                            <h1 className="section-title text-5xl mb-6">{heroTitle}</h1>
                            <p className="section-subtitle text-lg max-w-3xl mx-auto">{heroSubtitle}</p>
                        </>
                    )}
                </div>
            </section>

            {/* Values */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-title text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <div key={i} className="card text-center group">
                                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">{v.icon}</span>
                                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-title text-center mb-12">Our Journey</h2>
                    <div className="relative">
                        <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--border)' }} />
                        <div className="space-y-8">
                            {timeline.map((item, i) => (
                                <div key={i} className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className="flex-1 text-right" style={{ ...(i % 2 !== 0 && { textAlign: 'left' }) }}>
                                        {i % 2 === 0 ? (
                                            <div className="card inline-block max-w-xs text-left">
                                                <p className="text-xs font-bold mb-1" style={{ color: 'var(--accent)' }}>{item.year}</p>
                                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.event}</p>
                                            </div>
                                        ) : <div />}
                                    </div>
                                    <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 z-10"
                                        style={{ backgroundColor: 'var(--accent)' }}>
                                        {item.year?.slice(-2) || ''}
                                    </div>
                                    <div className="flex-1">
                                        {i % 2 !== 0 ? (
                                            <div className="card inline-block max-w-xs">
                                                <p className="text-xs font-bold mb-1" style={{ color: 'var(--accent)' }}>{item.year}</p>
                                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.event}</p>
                                            </div>
                                        ) : <div />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="section-title mb-4">Ready to Work Together?</h2>
                    <p className="section-subtitle mb-8">Contact us today for a custom quote or bulk order.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/orders" className="btn-primary py-3 px-8">Get a Quote <ArrowRight size={18} /></Link>
                        <Link to="/contact" className="btn-outline py-3 px-8">Contact Us</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
