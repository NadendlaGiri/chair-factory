import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, MessageCircle } from 'lucide-react';
import { getInquiries, deleteInquiry } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const data = await getInquiries();
            setInquiries(data);
        } catch {
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async () => {
        const id = confirmDelete.id;
        setConfirmDelete({ open: false, id: null });
        try {
            await deleteInquiry(id);
            setInquiries(prev => prev.filter(i => i.id !== id));
            toast.success('Inquiry deleted');
        } catch {
            toast.error('Failed to delete inquiry');
        }
    };

    return (
        <>
            <Helmet><title>Inquiries – Chair Factory Admin</title></Helmet>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Customer Inquiries</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Messages sent from product pages.</p>
                </div>

                {loading ? <LoadingSpinner /> : inquiries.length === 0 ? (
                    <div className="card text-center py-12">
                        <MessageCircle size={32} className="mx-auto mb-3" style={{ color: 'var(--border)' }} />
                        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No inquiries found.</p>
                    </div>
                ) : (
                    <div className="card overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Message</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.map(iq => (
                                        <tr key={iq.id}>
                                            <td className="text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(iq.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                            <td>
                                                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{iq.customerName}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{iq.phone}</p>
                                            </td>
                                            <td>
                                                {iq.productSlug ? (
                                                    <a href={`/products/${iq.productSlug}`} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>
                                                        {iq.productName}
                                                    </a>
                                                ) : <span className="text-sm font-medium">{iq.productName}</span>}
                                            </td>
                                            <td className="max-w-xs text-sm" style={{ color: 'var(--text-primary)' }}>
                                                <p className="line-clamp-2" title={iq.message}>{iq.message}</p>
                                            </td>
                                            <td>
                                                <button onClick={() => setConfirmDelete({ open: true, id: iq.id })} className="btn-ghost p-1.5 rounded-lg" title="Delete">
                                                    <Trash2 size={16} className="text-red-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={handleDelete}
                title="Delete Inquiry"
                message="Are you sure you want to delete this inquiry? This cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </>
    );
}
