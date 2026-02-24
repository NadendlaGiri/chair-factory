import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Save, Loader2, Plus, Trash2, Home, Info, Phone, ImagePlus, X,
    Clock, Award, Users, Globe, Trophy, Star, Zap, Heart,
    Briefcase, Factory, Truck, Shield, Wrench, Leaf,
    BarChart2, ThumbsUp, MapPin, Package, Smile, Cpu
} from 'lucide-react';
import { getAllContent, upsertContent, uploadImages } from '../../services/api';
import toast from 'react-hot-toast';

/* ── Defaults ─────────────────────────────────────────── */
export const STAT_ICONS = [
    { key: 'Clock', Icon: Clock, label: 'Clock / Time' },
    { key: 'Award', Icon: Award, label: 'Award / Badge' },
    { key: 'Users', Icon: Users, label: 'People / Clients' },
    { key: 'Globe', Icon: Globe, label: 'Globe / Countries' },
    { key: 'Trophy', Icon: Trophy, label: 'Trophy' },
    { key: 'Star', Icon: Star, label: 'Star / Rating' },
    { key: 'Zap', Icon: Zap, label: 'Speed / Power' },
    { key: 'Heart', Icon: Heart, label: 'Heart / Love' },
    { key: 'Briefcase', Icon: Briefcase, label: 'Briefcase / Business' },
    { key: 'Factory', Icon: Factory, label: 'Factory / Plant' },
    { key: 'Truck', Icon: Truck, label: 'Truck / Delivery' },
    { key: 'Shield', Icon: Shield, label: 'Shield / Security' },
    { key: 'Wrench', Icon: Wrench, label: 'Wrench / Service' },
    { key: 'Leaf', Icon: Leaf, label: 'Leaf / Eco' },
    { key: 'BarChart2', Icon: BarChart2, label: 'Chart / Growth' },
    { key: 'ThumbsUp', Icon: ThumbsUp, label: 'Thumbs Up' },
    { key: 'MapPin', Icon: MapPin, label: 'Location / Map' },
    { key: 'Package', Icon: Package, label: 'Package / Product' },
    { key: 'Smile', Icon: Smile, label: 'Happy / Satisfied' },
    { key: 'Cpu', Icon: Cpu, label: 'Tech / Precision' },
];

const DEFAULT_STATS = [
    { icon: 'Clock', value: '25+', label: 'Years of Experience' },
    { icon: 'Award', value: '50K+', label: 'Products Made' },
    { icon: 'Users', value: '2,000+', label: 'Happy Clients' },
    { icon: 'Globe', value: '15+', label: 'Countries Served' },
];
const DEFAULT_FEATURES = [
    { icon: '🏭', title: 'Factory Direct', desc: 'No middlemen. Buy directly from manufacturer at best prices.' },
    { icon: '🪵', title: 'Premium Materials', desc: 'FSC-certified wood, commercial-grade steel, and premium upholstery.' },
    { icon: '📦', title: 'Bulk Capability', desc: 'From single pieces to 10,000+ units. Custom specs available.' },
    { icon: '🔧', title: '5-Year Warranty', desc: 'Structural warranty on all products with free repair service.' },
    { icon: '🚚', title: 'Pan-India Delivery', desc: 'Fast logistics with safe packaging to any location in India.' },
    { icon: '✏️', title: 'Custom Design', desc: 'Design your own — dimensions, material, finish, and upholstery.' },
];
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

/* ── helpers ────────────────────────────────────────────── */
function SectionHeader({ title }) {
    return (
        <h3 className="font-bold text-sm pb-3 mb-4 uppercase tracking-wider"
            style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
            {title}
        </h3>
    );
}
function Field({ label, children, hint }) {
    return (
        <div>
            <label className="label">{label}</label>
            {children}
            {hint && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
        </div>
    );
}
function SaveBtn({ saving, label, onClick }) {
    return (
        <button onClick={onClick} disabled={saving}
            className="btn-primary py-2 px-5 text-sm disabled:opacity-60 flex items-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />{label}</>}
        </button>
    );
}

/* ── Icon picker ─────────────────────────────────────────── */
function IconPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const current = STAT_ICONS.find(s => s.key === value);
    const CurrentIcon = current?.Icon || Clock;
    return (
        <div className="relative">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Icon</p>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--accent)',
                    minWidth: '110px',
                }}>
                <CurrentIcon size={16} />
                <span style={{ color: 'var(--text-secondary)' }}>{current?.label || 'Pick…'}</span>
            </button>
            {open && (
                <div className="absolute z-50 mt-1 p-2 rounded-xl shadow-xl"
                    style={{
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '4px',
                        width: '220px',
                    }}>
                    {STAT_ICONS.map(({ key, Icon, label }) => (
                        <button
                            key={key}
                            type="button"
                            title={label}
                            onClick={() => { onChange(key); setOpen(false); }}
                            className="flex items-center justify-center rounded-lg p-2 transition-all"
                            style={{
                                backgroundColor: value === key ? 'var(--accent)' : 'transparent',
                                color: value === key ? '#fff' : 'var(--accent)',
                                border: value === key ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                            }}>
                            <Icon size={18} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Array row editor ────────────────────────────────────── */
function ArrayEditor({ rows, onChange, fields }) {
    const update = (i, key, val) => {
        const next = rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r);
        onChange(next);
    };
    const add = () => onChange([...rows, Object.fromEntries(fields.map(f => [f.key, f.default ?? '']))]);
    const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));

    return (
        <div className="space-y-3">
            {rows.map((row, i) => (
                <div key={i} className="p-3 rounded-lg flex gap-3 items-start"
                    style={{ backgroundColor: 'var(--surface-overlay)', border: '1px solid var(--border)' }}>
                    <div className="flex-1 flex flex-wrap gap-3">
                        {fields.map(f => (
                            <div key={f.key} style={{ flex: f.flex || '1 1 120px', minWidth: f.minWidth || '100px' }}>
                                {f.type === 'icon'
                                    ? <IconPicker value={row[f.key] || 'Clock'} onChange={val => update(i, f.key, val)} />
                                    : (
                                        <>
                                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                                            {f.multiline
                                                ? <textarea className="input text-sm py-1.5 min-h-[60px] resize-y" value={row[f.key] || ''}
                                                    onChange={e => update(i, f.key, e.target.value)} placeholder={f.placeholder} />
                                                : <input className="input text-sm py-1.5" value={row[f.key] || ''}
                                                    onChange={e => update(i, f.key, e.target.value)} placeholder={f.placeholder} />}
                                        </>
                                    )}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => remove(i)} className="btn-ghost p-1.5 rounded text-red-400 hover:text-red-500 flex-shrink-0 mt-5">
                        <Trash2 size={15} />
                    </button>
                </div>
            ))}
            <button onClick={add} className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                <Plus size={14} /> Add Row
            </button>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════ */
export default function AdminContent() {
    const [tab, setTab] = useState('home');
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [heroImages, setHeroImages] = useState([]);
    const [heroImgUploading, setHeroImgUploading] = useState(false);
    const heroImgInputRef = useRef(null);

    useEffect(() => {
        getAllContent()
            .then(data => {
                setContent({
                    hero: { title: '', subtitle: '', badge: '🪑 Est. 1998 · Factory Direct', ctaPrimary: 'Browse Catalog', ctaSecondary: 'Get a Quote', ...data.hero },
                    stats: data.stats || DEFAULT_STATS,
                    features: data.features || DEFAULT_FEATURES,
                    homeCTA: { title: 'Ready to Order?', subtitle: 'Submit your bulk order request or contact us for a custom quote. We respond within 24 hours.', ...data.homeCTA },
                    about: { heroTitle: 'Our Story', heroSubtitle: "From a small 5-person workshop in 1998 to one of India's leading chair manufacturers.", storyTitle: '', storyText: '', ...data.about },
                    values: data.values || DEFAULT_VALUES,
                    timeline: data.timeline || DEFAULT_TIMELINE,
                    contact: { phone: '', email: '', address: '', whatsapp: '', hours: '', ...data.contact },
                });
                setHeroImages(data.heroImages || []);
            })
            .catch(() => toast.error('Failed to load content'))
            .finally(() => setLoading(false));
    }, []);

    /* ── Hero image upload ── */
    const handleHeroImgUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setHeroImgUploading(true);
        try {
            const { urls } = await uploadImages(files);
            setHeroImages(prev => [...prev, ...urls]);
            toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded!`);
        } catch {
            toast.error('Upload failed');
        } finally {
            setHeroImgUploading(false);
            e.target.value = '';
        }
    };

    const removeHeroImage = (idx) => setHeroImages(prev => prev.filter((_, i) => i !== idx));

    const saveHeroImages = async () => {
        setSaving(s => ({ ...s, heroImages: true }));
        try {
            await upsertContent('heroImages', heroImages);
            toast.success('Slideshow images saved!');
        } catch { toast.error('Save failed'); }
        finally { setSaving(s => ({ ...s, heroImages: false })); }
    };

    const save = async (key) => {
        setSaving(s => ({ ...s, [key]: true }));
        try {
            await upsertContent(key, content[key]);
            toast.success('Saved!');
        } catch { toast.error('Save failed'); }
        finally { setSaving(s => ({ ...s, [key]: false })); }
    };

    const set = (key, field, value) =>
        setContent(c => ({ ...c, [key]: { ...c[key], [field]: value } }));
    const setArr = (key, value) =>
        setContent(c => ({ ...c, [key]: value }));

    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'about', label: 'About', icon: Info },
        { id: 'contact', label: 'Contact & Footer', icon: Phone },
    ];

    if (loading) return (
        <div className="flex items-center justify-center py-20" style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={24} className="animate-spin mr-2" /> Loading content…
        </div>
    );

    return (
        <>
            <Helmet><title>Content – Chair Factory Admin</title></Helmet>
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>
                        Content Management
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        Edit every section of your website — changes reflect immediately after saving
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--surface-overlay)' }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                            style={{
                                backgroundColor: tab === t.id ? 'var(--surface)' : 'transparent',
                                color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
                                boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                            }}>
                            <t.icon size={15} /> {t.label}
                        </button>
                    ))}
                </div>

                {/* ── HOME TAB ──────────────────────────────────── */}
                {tab === 'home' && (
                    <div className="space-y-6">
                        {/* Hero */}
                        <div className="card space-y-4">
                            <SectionHeader title="🏠 Hero Section" />
                            <Field label="Badge Text" hint="Small pill above the headline">
                                <input className="input" value={content.hero?.badge || ''}
                                    onChange={e => set('hero', 'badge', e.target.value)} />
                            </Field>
                            <Field label="Headline (Main Title)">
                                <input className="input" value={content.hero?.title || ''}
                                    onChange={e => set('hero', 'title', e.target.value)}
                                    placeholder="Crafting Premium Chairs Since 1998" />
                            </Field>
                            <Field label="Subtitle">
                                <textarea className="input min-h-[80px] resize-y" value={content.hero?.subtitle || ''}
                                    onChange={e => set('hero', 'subtitle', e.target.value)}
                                    placeholder="Factory-direct quality furniture for homes, offices, and commercial spaces." />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Primary Button Text">
                                    <input className="input" value={content.hero?.ctaPrimary || ''}
                                        onChange={e => set('hero', 'ctaPrimary', e.target.value)}
                                        placeholder="Browse Catalog" />
                                </Field>
                                <Field label="Secondary Button Text">
                                    <input className="input" value={content.hero?.ctaSecondary || ''}
                                        onChange={e => set('hero', 'ctaSecondary', e.target.value)}
                                        placeholder="Get a Quote" />
                                </Field>
                            </div>
                            <SaveBtn saving={saving.hero} label="Save Hero" onClick={() => save('hero')} />
                        </div>

                        {/* Hero Background Slideshow */}
                        <div className="card space-y-4">
                            <SectionHeader title="🖼️ Hero Background Slideshow" />
                            <p className="text-xs -mt-2" style={{ color: 'var(--text-muted)' }}>
                                Upload high-res photos (4K supported, up to 20 MB each). They will cycle every 5 seconds behind the hero text.
                            </p>

                            {/* Thumbnail grid */}
                            {heroImages.length > 0 && (
                                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
                                    {heroImages.map((url, i) => (
                                        <div key={i} className="relative group rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                                            <img src={url} alt={`slide-${i + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => removeHeroImage(i)}
                                                    className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 rounded px-1">#{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {heroImages.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 rounded-xl"
                                    style={{ border: '2px dashed var(--border)', color: 'var(--text-muted)' }}>
                                    <ImagePlus size={32} className="mb-2 opacity-40" />
                                    <p className="text-sm">No images yet — upload some below</p>
                                </div>
                            )}

                            {/* Upload button */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <input
                                    ref={heroImgInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleHeroImgUpload}
                                />
                                <button
                                    type="button"
                                    onClick={() => heroImgInputRef.current?.click()}
                                    disabled={heroImgUploading}
                                    className="btn-outline text-sm py-2 px-4 flex items-center gap-2 disabled:opacity-60">
                                    {heroImgUploading
                                        ? <><Loader2 size={14} className="animate-spin" />Uploading…</>
                                        : <><ImagePlus size={14} />Add Images</>}
                                </button>
                                {heroImages.length > 0 && (
                                    <SaveBtn saving={saving.heroImages} label="Save Slideshow" onClick={saveHeroImages} />
                                )}
                                {heroImages.length > 0 && (
                                    <button type="button" onClick={() => setHeroImages([])}
                                        className="text-xs text-red-400 hover:text-red-500">
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="card space-y-4">
                            <SectionHeader title="📊 Stats Strip" />
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>The 4 numbers shown below the hero section</p>
                            <ArrayEditor
                                rows={content.stats || DEFAULT_STATS}
                                onChange={val => setArr('stats', val)}
                                fields={[
                                    { key: 'icon', type: 'icon', default: 'Clock', flex: '0 0 auto', minWidth: '120px' },
                                    { key: 'value', label: 'Number / Value', placeholder: '25+', flex: '1 1 80px', minWidth: '80px' },
                                    { key: 'label', label: 'Label', placeholder: 'Years of Experience', flex: '2 1 140px', minWidth: '120px' },
                                ]}
                            />
                            <SaveBtn saving={saving.stats} label="Save Stats" onClick={() => save('stats')} />
                        </div>

                        {/* Features / Why Us */}
                        <div className="card space-y-4">
                            <SectionHeader title="⭐ 'Why Choose Us' Features" />
                            <ArrayEditor
                                rows={content.features || DEFAULT_FEATURES}
                                onChange={val => setArr('features', val)}
                                fields={[
                                    { key: 'icon', label: 'Emoji Icon', placeholder: '🏭' },
                                    { key: 'title', label: 'Title', placeholder: 'Factory Direct' },
                                    { key: 'desc', label: 'Description', placeholder: 'Short description…', multiline: true },
                                ]}
                            />
                            <SaveBtn saving={saving.features} label="Save Features" onClick={() => save('features')} />
                        </div>

                        {/* Home CTA */}
                        <div className="card space-y-4">
                            <SectionHeader title="📣 Bottom CTA Section" />
                            <Field label="CTA Heading">
                                <input className="input" value={content.homeCTA?.title || ''}
                                    onChange={e => set('homeCTA', 'title', e.target.value)}
                                    placeholder="Ready to Order?" />
                            </Field>
                            <Field label="CTA Subtitle">
                                <textarea className="input min-h-[80px] resize-y" value={content.homeCTA?.subtitle || ''}
                                    onChange={e => set('homeCTA', 'subtitle', e.target.value)} />
                            </Field>
                            <SaveBtn saving={saving.homeCTA} label="Save CTA" onClick={() => save('homeCTA')} />
                        </div>
                    </div>
                )}

                {/* ── ABOUT TAB ─────────────────────────────────── */}
                {tab === 'about' && (
                    <div className="space-y-6">
                        {/* About Hero */}
                        <div className="card space-y-4">
                            <SectionHeader title="🏭 About Page Hero" />
                            <Field label="Page Title">
                                <input className="input" value={content.about?.heroTitle || ''}
                                    onChange={e => set('about', 'heroTitle', e.target.value)}
                                    placeholder="Our Story" />
                            </Field>
                            <Field label="Hero Subtitle">
                                <textarea className="input min-h-[80px] resize-y" value={content.about?.heroSubtitle || ''}
                                    onChange={e => set('about', 'heroSubtitle', e.target.value)} />
                            </Field>
                            <SaveBtn saving={saving.about} label="Save About Hero" onClick={() => save('about')} />
                        </div>

                        {/* Values */}
                        <div className="card space-y-4">
                            <SectionHeader title="💎 Our Values (Cards)" />
                            <ArrayEditor
                                rows={content.values || DEFAULT_VALUES}
                                onChange={val => setArr('values', val)}
                                fields={[
                                    { key: 'icon', label: 'Emoji', placeholder: '🪵' },
                                    { key: 'title', label: 'Title', placeholder: 'Quality Materials' },
                                    { key: 'desc', label: 'Description', placeholder: 'Short description…', multiline: true },
                                ]}
                            />
                            <SaveBtn saving={saving.values} label="Save Values" onClick={() => save('values')} />
                        </div>

                        {/* Timeline */}
                        <div className="card space-y-4">
                            <SectionHeader title="📅 Our Journey (Timeline)" />
                            <ArrayEditor
                                rows={content.timeline || DEFAULT_TIMELINE}
                                onChange={val => setArr('timeline', val)}
                                fields={[
                                    { key: 'year', label: 'Year', placeholder: '1998' },
                                    { key: 'event', label: 'Milestone / Event', placeholder: 'Founded in…', multiline: true },
                                ]}
                            />
                            <SaveBtn saving={saving.timeline} label="Save Timeline" onClick={() => save('timeline')} />
                        </div>
                    </div>
                )}

                {/* ── CONTACT TAB ───────────────────────────────── */}
                {tab === 'contact' && (
                    <div className="space-y-6">
                        <div className="card space-y-4">
                            <SectionHeader title="📞 Contact Information" />
                            <p className="text-xs -mt-2" style={{ color: 'var(--text-muted)' }}>
                                These values appear on the Contact page, Footer, and WhatsApp buttons site-wide.
                            </p>
                            {[
                                ['phone', 'Phone Number', 'text', '+91 98765 43210'],
                                ['email', 'Email Address', 'email', 'info@chairfactory.com'],
                                ['whatsapp', 'WhatsApp Number (with country code, no +)', 'text', '919876543210'],
                                ['hours', 'Business Hours', 'text', 'Mon–Sat: 9 AM – 6 PM IST'],
                                ['address', 'Office / Factory Address', 'text', '123 Industrial Park, City - 400001'],
                            ].map(([field, label, type, placeholder]) => (
                                <Field key={field} label={label}>
                                    <input type={type} className="input"
                                        value={content.contact?.[field] || ''}
                                        onChange={e => set('contact', field, e.target.value)}
                                        placeholder={placeholder} />
                                </Field>
                            ))}
                            <SaveBtn saving={saving.contact} label="Save Contact Info" onClick={() => save('contact')} />
                        </div>

                        <div className="card" style={{ backgroundColor: 'var(--surface-overlay)' }}>
                            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>💡 Where these values appear</p>
                            <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                                <li>• <strong>Contact page</strong> — all 4 contact cards + address block + WhatsApp CTA</li>
                                <li>• <strong>Footer</strong> — phone, email, address in the right column; WhatsApp button</li>
                                <li>• <strong>Company branding</strong> — see the Settings page for company name, tagline, footer text</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
