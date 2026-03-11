import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, Loader2, X, Package, ImagePlus } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImages, getAllContent } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

const empty = (firstCat = 'General') => ({ name: '', category: firstCat, description: '', material: '', dimensions: '', price: '', availability: true, featured: false, tags: '' });

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);
    const [imgFiles, setImgFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [page, setPage] = useState(1);
    const [confirmState, setConfirmState] = useState({ open: false, id: null });
    const [categories, setCategories] = useState(['General']);
    const fileInputRef = useRef(null);

    useEffect(() => {
        getAllContent().then(data => {
            const cats = data?.productCategories;
            if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
        }).catch(() => {});
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts({ page, limit: 10 });
            setProducts(data.products || []);
            setTotal(data.total || 0);
        } catch { toast.error('Failed to load products'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, [page]);

    const openCreate = () => { setEditing(null); setForm(empty(categories[0])); setImgFiles([]); setExistingImages([]); setModal(true); };
    const openEdit = (p) => {
        setEditing(p);
        setForm({ ...p, price: p.price || '', tags: (p.tags || []).join(', ') });
        setImgFiles([]);
        setExistingImages(p.images || []);
        setModal(true);
    };
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.category || !form.description || !form.material) {
            toast.error('Name, category, description, and material are required'); return;
        }
        setSaving(true);
        try {
            let images = [...existingImages]; // start from kept existing images
            if (imgFiles.length > 0) {
                const up = await uploadImages(imgFiles);
                images = [...images, ...up.urls];
            }
            const payload = {
                ...form,
                price: form.price ? parseFloat(form.price) : null,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                images,
            };
            if (editing) {
                const updated = await updateProduct(editing.id, payload);
                setProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
                toast.success('Product updated!');
            } else {
                await createProduct(payload);
                toast.success('Product created!');
                fetchProducts();
            }
            setModal(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Save failed');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        setConfirmState({ open: true, id });
    };

    const confirmDelete = async () => {
        const id = confirmState.id;
        setConfirmState({ open: false, id: null });
        try {
            await deleteProduct(id);
            setProducts(ps => ps.filter(p => p.id !== id));
            setTotal(t => t - 1);
            toast.success('Product deleted');
        } catch { toast.error('Delete failed'); }
    };

    const pages = Math.ceil(total / 10);

    return (
        <>
            <Helmet><title>Products – Chair Factory Admin</title></Helmet>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Products</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} total products</p>
                    </div>
                    <button onClick={openCreate} className="btn-primary">
                        <Plus size={18} /> Add Product
                    </button>
                </div>

                {loading ? <LoadingSpinner /> : (
                    <div className="card overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Material</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Featured</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: 'var(--surface-overlay)' }}>
                                                        {p.images?.[0]
                                                            ? <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" />
                                                            : <Package size={16} style={{ color: 'var(--text-muted)' }} />}
                                                    </div>
                                                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                                                </div>
                                            </td>
                                            <td><span className="badge badge-primary">{p.category}</span></td>
                                            <td>{p.material}</td>
                                            <td>{p.price ? `₹${p.price.toLocaleString()}` : '—'}</td>
                                            <td>
                                                <span className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}>
                                                    {p.availability ? 'Active' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td>{p.featured ? '⭐' : '—'}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openEdit(p)} className="btn-ghost p-1.5 rounded-lg" title="Edit">
                                                        <Pencil size={14} style={{ color: 'var(--accent)' }} />
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="btn-ghost p-1.5 rounded-lg" title="Delete">
                                                        <Trash2 size={14} className="text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
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

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="w-full max-w-2xl my-8 rounded-2xl shadow-2xl" style={{ backgroundColor: 'var(--surface)' }}>
                        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border)' }}>
                            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                                {editing ? 'Edit Product' : 'New Product'}
                            </h2>
                            <button onClick={() => setModal(false)} className="btn-ghost p-2 rounded-lg"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="label">Product Name *</label>
                                    <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Executive Oak Chair" />
                                </div>
                                <div>
                                    <label className="label">Category *</label>
                                    <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Material *</label>
                                    <input className="input" value={form.material} onChange={e => set('material', e.target.value)} placeholder="e.g. Solid Oak" />
                                </div>
                                <div>
                                    <label className="label">Dimensions</label>
                                    <input className="input" value={form.dimensions} onChange={e => set('dimensions', e.target.value)} placeholder="e.g. 70cm × 65cm × 110cm" />
                                </div>
                                <div>
                                    <label className="label">Price (₹) — leave blank for quote</label>
                                    <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 1200" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label">Description *</label>
                                    <textarea className="input min-h-[90px] resize-y" value={form.description} onChange={e => set('description', e.target.value)} required placeholder="Detailed description..." />
                                </div>
                                <div>
                                    <label className="label">Tags (comma separated)</label>
                                    <input className="input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="office, oak, ergonomic" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label">Product Images</label>

                                    {/* Grid of existing + new previews */}
                                    {(existingImages.length > 0 || imgFiles.length > 0) && (
                                        <div className="grid grid-cols-4 gap-2 mb-3">
                                            {existingImages.map((url, i) => (
                                                <div key={url} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: 'var(--surface-overlay)' }}>
                                                    <img src={url} alt="" className="w-full h-full object-contain" />
                                                    <button type="button"
                                                        onClick={() => setExistingImages(imgs => imgs.filter((_, j) => j !== i))}
                                                        className="absolute top-1 right-1 w-5 h-5 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                                                        <X size={11} />
                                                    </button>
                                                </div>
                                            ))}
                                            {imgFiles.map((file, i) => (
                                                <div key={i} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: 'var(--surface-overlay)' }}>
                                                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-contain" />
                                                    <div className="absolute bottom-0 inset-x-0 py-0.5 text-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)', fontSize: '9px', color: '#fff' }}>New</div>
                                                    <button type="button"
                                                        onClick={() => setImgFiles(fs => fs.filter((_, j) => j !== i))}
                                                        className="absolute top-1 right-1 w-5 h-5 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                                                        <X size={11} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Hidden real input */}
                                    <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                                        onChange={e => setImgFiles(fs => [...fs, ...Array.from(e.target.files)])} />

                                    {/* Styled upload button */}
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 border-dashed"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', width: '100%', justifyContent: 'center' }}>
                                        <ImagePlus size={16} />
                                        Add Photos
                                    </button>
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        <input type="checkbox" checked={form.availability} onChange={e => set('availability', e.target.checked)}
                                            className="w-4 h-4 rounded accent-orange-600" />
                                        Available
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                                            className="w-4 h-4 rounded accent-orange-600" />
                                        Featured
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1 py-2.5 justify-center">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 justify-center disabled:opacity-60">
                                    {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={confirmState.open}
                title="Delete Product"
                message="This will permanently remove the product. This action cannot be undone."
                confirmLabel="Delete"
                danger
                onConfirm={confirmDelete}
                onCancel={() => setConfirmState({ open: false, id: null })}
            />
        </>
    );
}
