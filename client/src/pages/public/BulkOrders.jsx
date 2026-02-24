import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Loader2 } from 'lucide-react';
import { submitOrder } from '../../services/api';
import toast from 'react-hot-toast';

const TIMELINES = ['Within 1 week', '2–3 weeks', '1 month', '2–3 months', 'Flexible'];

export default function BulkOrders() {
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        customerName: '', phone: '', email: '', company: '', location: '',
        productName: searchParams.get('product') || '', quantity: '', material: '', timeline: '', notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.customerName || !form.phone || !form.email || !form.location || !form.productName || !form.quantity) {
            toast.error('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            await submitOrder(form);
            setDone(true);
            toast.success('Order request submitted successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit order. Please try again.');
        } finally { setLoading(false); }
    };

    if (done) return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center max-w-md px-4 animate-slide-up">
                <CheckCircle size={64} className="mx-auto mb-6" style={{ color: '#22c55e' }} />
                <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                    Request Submitted!
                </h2>
                <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Thank you for your order request. Our team will review it and contact you within 24 hours.
                </p>
                <button onClick={() => { setDone(false); setForm({ customerName: '', phone: '', email: '', company: '', location: '', productName: '', quantity: '', material: '', timeline: '', notes: '' }); }}
                    className="btn-primary">
                    Submit Another Request
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Bulk Orders – Chair Factory</title>
                <meta name="description" content="Submit bulk or single order requests for chairs and benches. We handle orders from 1 to 10,000+ units." />
            </Helmet>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="section-title">Order Request</h1>
                    <p className="section-subtitle">Fill in your details and we'll get back to you within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-8">
                    {/* Customer Details */}
                    <section>
                        <h2 className="font-bold text-lg mb-4 pb-2" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>
                            Your Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Full Name <span className="text-red-500">*</span></label>
                                <input className="input" placeholder="John Smith" value={form.customerName} onChange={e => set('customerName', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Phone Number <span className="text-red-500">*</span></label>
                                <input className="input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Email Address <span className="text-red-500">*</span></label>
                                <input className="input" type="email" placeholder="john@company.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Company Name <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                                <input className="input" placeholder="Your Company Ltd." value={form.company} onChange={e => set('company', e.target.value)} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="label">Location / Delivery Address <span className="text-red-500">*</span></label>
                                <input className="input" placeholder="City, State, Country" value={form.location} onChange={e => set('location', e.target.value)} required />
                            </div>
                        </div>
                    </section>

                    {/* Order Details */}
                    <section>
                        <h2 className="font-bold text-lg mb-4 pb-2" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>
                            Order Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Product Name / Type <span className="text-red-500">*</span></label>
                                <input className="input" placeholder="e.g. Executive Oak Chair" value={form.productName} onChange={e => set('productName', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Quantity <span className="text-red-500">*</span></label>
                                <input className="input" type="number" min="1" placeholder="e.g. 50" value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Material Preference</label>
                                <input className="input" placeholder="e.g. Solid Oak, Steel, etc." value={form.material} onChange={e => set('material', e.target.value)} />
                            </div>
                            <div>
                                <label className="label">Delivery Timeline</label>
                                <select className="input" value={form.timeline} onChange={e => set('timeline', e.target.value)}>
                                    <option value="">Select timeline...</option>
                                    {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="label">Additional Notes</label>
                                <textarea className="input min-h-[100px] resize-y" placeholder="Any special requirements, custom dimensions, finish preferences, etc."
                                    value={form.notes} onChange={e => set('notes', e.target.value)} />
                            </div>
                        </div>
                    </section>

                    <button type="submit" disabled={loading}
                        className="btn-primary w-full py-3.5 text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Submit Order Request'}
                    </button>
                </form>
            </div>
        </>
    );
}
