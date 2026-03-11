import { useState, useEffect, useRef } from 'react';
import { Building2, User, Lock, Save, Loader2, CheckCircle, Eye, EyeOff, AlertCircle, ImagePlus, X, Tag, Plus } from 'lucide-react';
import { upsertContent, getAllContent, updateAdminProfile, uploadImages } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useCompanyStore } from '../../store/companyStore';

/* ── small toast ── */
function Toast({ msg, type }) {
    if (!msg) return null;
    const isErr = type === 'error';
    return (
        <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${isErr ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
            {isErr ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
            {msg}
        </div>
    );
}

/* ── section card wrapper ── */
function Section({ icon: Icon, title, children }) {
    return (
        <div className="card space-y-5">
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <Icon size={18} />
                </div>
                <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            </div>
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="label">{label}</label>
            {children}
        </div>
    );
}

export default function AdminSettings() {
    const { admin, setAuth } = useAuthStore();
    const { update: updateCompany } = useCompanyStore();

    /* ── Company Branding state ── */
    const [brand, setBrand] = useState({ companyName: '', tagline: '', footerText: '', logo: '' });
    const [logoPreview, setLogoPreview] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [brandStatus, setBrandStatus] = useState({ saving: false, msg: '', type: '' });
    const logoInputRef = useRef(null);

    /* ── Profile state ── */
    const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' });
    const [profilePwd, setProfilePwd] = useState('');
    const [showProfilePwd, setShowProfilePwd] = useState(false);
    const [profileStatus, setProfileStatus] = useState({ saving: false, msg: '', type: '' });

    /* ── Password change state ── */
    const [pwds, setPwds] = useState({ current: '', next: '', confirm: '' });
    const [showPwds, setShowPwds] = useState({ current: false, next: false, confirm: false });
    const [pwdStatus, setPwdStatus] = useState({ saving: false, msg: '', type: '' });

    /* ── Product Categories & Materials state ── */
    const [catInput, setCatInput] = useState('');
    const [matInput, setMatInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [catStatus, setCatStatus] = useState({ saving: false, msg: '', type: '' });

    /* ── Load brand data on mount ── */
    useEffect(() => {
        getAllContent().then(data => {
            const company = data.company || {};
            const logo = company.logo || '';
            setBrand({
                companyName: company.name || '',
                tagline: company.tagline || '',
                footerText: company.footerText || '',
                logo,
            });
            setLogoPreview(logo);
            if (Array.isArray(data.productCategories)) setCategories(data.productCategories);
            if (Array.isArray(data.productMaterials)) setMaterials(data.productMaterials);
        }).catch(() => { });
    }, []);

    /* ── Logo upload ── */
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoUploading(true);
        try {
            const { urls } = await uploadImages([file]);
            const url = urls[0];
            setBrand(b => ({ ...b, logo: url }));
            setLogoPreview(url);
        } catch {
            setBrandStatus({ saving: false, msg: 'Logo upload failed', type: 'error' });
            setTimeout(() => setBrandStatus(s => ({ ...s, msg: '' })), 3000);
        } finally {
            setLogoUploading(false);
            e.target.value = '';
        }
    };

    const removeLogo = () => {
        setBrand(b => ({ ...b, logo: '' }));
        setLogoPreview('');
    };

    /* ── Save brand ── */
    const saveBrand = async () => {
        setBrandStatus({ saving: true, msg: '', type: '' });
        try {
            await upsertContent('company', { name: brand.companyName, tagline: brand.tagline, footerText: brand.footerText, logo: brand.logo });
            // Push changes to the global store so Header/Footer update instantly
            updateCompany(brand.companyName, brand.tagline, brand.footerText, brand.logo);
            setBrandStatus({ saving: false, msg: 'Company info saved!', type: 'ok' });
        } catch {
            setBrandStatus({ saving: false, msg: 'Failed to save. Try again.', type: 'error' });
        }
        setTimeout(() => setBrandStatus(s => ({ ...s, msg: '' })), 3500);
    };

    /* ── Save profile (name + email) ── */
    const saveProfile = async () => {
        if (!profile.name.trim()) return setProfileStatus({ saving: false, msg: 'Name cannot be empty', type: 'error' });
        setProfileStatus({ saving: true, msg: '', type: '' });
        try {
            const payload = { name: profile.name };
            if (profile.email !== admin?.email) {
                if (!profilePwd) return setProfileStatus({ saving: false, msg: 'Enter current password to change email', type: 'error' });
                payload.email = profile.email;
                payload.currentPassword = profilePwd;
            }
            const res = await updateAdminProfile(payload);
            setAuth(res.token, res.admin);
            setProfilePwd('');
            setProfileStatus({ saving: false, msg: 'Profile updated!', type: 'ok' });
        } catch (err) {
            setProfileStatus({ saving: false, msg: err.response?.data?.error || 'Update failed', type: 'error' });
        }
        setTimeout(() => setProfileStatus(s => ({ ...s, msg: '' })), 3500);
    };

    /* ── Save password ── */
    const savePassword = async () => {
        if (!pwds.current) return setPwdStatus({ saving: false, msg: 'Enter your current password', type: 'error' });
        if (pwds.next.length < 6) return setPwdStatus({ saving: false, msg: 'New password must be at least 6 characters', type: 'error' });
        if (pwds.next !== pwds.confirm) return setPwdStatus({ saving: false, msg: 'New passwords do not match', type: 'error' });
        setPwdStatus({ saving: true, msg: '', type: '' });
        try {
            const res = await updateAdminProfile({ name: admin?.name, currentPassword: pwds.current, newPassword: pwds.next });
            setAuth(res.token, res.admin);
            setPwds({ current: '', next: '', confirm: '' });
            setPwdStatus({ saving: false, msg: 'Password changed successfully!', type: 'ok' });
        } catch (err) {
            setPwdStatus({ saving: false, msg: err.response?.data?.error || 'Failed to change password', type: 'error' });
        }
        setTimeout(() => setPwdStatus(s => ({ ...s, msg: '' })), 3500);
    };

    const pwdInput = (field, label) => (
        <Field label={label}>
            <div className="relative">
                <input
                    type={showPwds[field] ? 'text' : 'password'}
                    className="input pr-10"
                    value={pwds[field]}
                    onChange={e => setPwds(p => ({ ...p, [field]: e.target.value }))}
                    placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPwds(s => ({ ...s, [field]: !s[field] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPwds[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
        </Field>
    );

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Settings</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your company branding and account credentials</p>
            </div>

            {/* ── Company Branding ── */}
            <Section icon={Building2} title="Company Branding">

                {/* Logo upload */}
                <Field label="Company Logo">
                    <div className="flex items-center gap-4">
                        {/* Preview */}
                        <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                            style={{ border: '2px dashed var(--border)', backgroundColor: 'var(--surface-overlay)' }}>
                            {logoPreview
                                ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                                : <ImagePlus size={26} style={{ color: 'var(--text-muted)' }} />}
                        </div>
                        <div className="space-y-2">
                            {/* Hidden file input */}
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                            />
                            <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                disabled={logoUploading}
                                className="btn-outline text-sm py-1.5 px-4 flex items-center gap-2 disabled:opacity-60">
                                {logoUploading
                                    ? <><Loader2 size={14} className="animate-spin" />Uploading…</>
                                    : <><ImagePlus size={14} />{logoPreview ? 'Change Logo' : 'Upload Logo'}</>}
                            </button>
                            {logoPreview && (
                                <button type="button" onClick={removeLogo}
                                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500">
                                    <X size={12} /> Remove logo
                                </button>
                            )}
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                PNG, JPG or WebP · Max 5 MB
                            </p>
                        </div>
                    </div>
                </Field>

                <Field label="Company Name">
                    <input className="input" value={brand.companyName}
                        onChange={e => setBrand(b => ({ ...b, companyName: e.target.value }))}
                        placeholder="e.g. Chair Factory" />
                </Field>
                <Field label="Tagline / Subtitle">
                    <input className="input" value={brand.tagline}
                        onChange={e => setBrand(b => ({ ...b, tagline: e.target.value }))}
                        placeholder="e.g. Factory-direct quality furniture since 1998" />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Shown in the hero section below the headline</p>
                </Field>
                <Field label="Footer Text">
                    <input className="input" value={brand.footerText}
                        onChange={e => setBrand(b => ({ ...b, footerText: e.target.value }))}
                        placeholder="e.g. © 2024 Chair Factory. All rights reserved." />
                </Field>
                <div className="flex items-center gap-4 pt-1">
                    <button onClick={saveBrand} disabled={brandStatus.saving} className="btn-primary py-2 px-5 text-sm disabled:opacity-60 flex items-center gap-2">
                        {brandStatus.saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save Branding</>}
                    </button>
                    <Toast msg={brandStatus.msg} type={brandStatus.type} />
                </div>
            </Section>

            {/* ── Admin Profile ── */}
            <Section icon={User} title="Admin Profile">
                <Field label="Display Name">
                    <input className="input" value={profile.name}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        placeholder="Factory Admin" />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Shown in the sidebar and dashboard greeting</p>
                </Field>
                <Field label="Email Address">
                    <input type="email" className="input" value={profile.email}
                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </Field>
                {profile.email !== admin?.email && (
                    <Field label="Current Password (required to change email)">
                        <div className="relative">
                            <input type={showProfilePwd ? 'text' : 'password'} className="input pr-10"
                                value={profilePwd} onChange={e => setProfilePwd(e.target.value)} placeholder="••••••••" />
                            <button type="button" onClick={() => setShowProfilePwd(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                                {showProfilePwd ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </Field>
                )}
                <div className="flex items-center gap-4 pt-1">
                    <button onClick={saveProfile} disabled={profileStatus.saving} className="btn-primary py-2 px-5 text-sm disabled:opacity-60 flex items-center gap-2">
                        {profileStatus.saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save Profile</>}
                    </button>
                    <Toast msg={profileStatus.msg} type={profileStatus.type} />
                </div>
            </Section>

            {/* ── Change Password ── */}
            <Section icon={Lock} title="Change Password">
                {pwdInput('current', 'Current Password')}
                {pwdInput('next', 'New Password')}
                {pwdInput('confirm', 'Confirm New Password')}
                {pwds.next && pwds.confirm && pwds.next !== pwds.confirm && (
                    <p className="text-xs text-red-400">Passwords don't match</p>
                )}
                <div className="flex items-center gap-4 pt-1">
                    <button onClick={savePassword} disabled={pwdStatus.saving} className="btn-primary py-2 px-5 text-sm disabled:opacity-60 flex items-center gap-2">
                        {pwdStatus.saving ? <><Loader2 size={14} className="animate-spin" />Updating…</> : <><Lock size={14} />Change Password</>}
                    </button>
                    <Toast msg={pwdStatus.msg} type={pwdStatus.type} />
                </div>
            </Section>

            {/* ── Product Categories & Materials ── */}
            <Section icon={Tag} title="Product Categories & Materials">
                <p className="text-sm -mt-2" style={{ color: 'var(--text-muted)' }}>
                    These drive the category dropdown when adding products and the filter tabs on the public Products page.
                </p>

                {/* Categories */}
                <div>
                    <label className="label">Categories</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {categories.map((c, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                                {c}
                                <button type="button" onClick={() => setCategories(prev => prev.filter((_, j) => j !== i))}
                                    className="hover:opacity-70" aria-label="Remove"><X size={11} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input className="input flex-1" value={catInput} placeholder="e.g. Chairs, Sofas, Tables"
                            onChange={e => setCatInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = catInput.trim(); if (v && !categories.includes(v)) { setCategories(p => [...p, v]); setCatInput(''); } } }} />
                        <button type="button" className="btn-outline px-3 py-2 text-sm"
                            onClick={() => { const v = catInput.trim(); if (v && !categories.includes(v)) { setCategories(p => [...p, v]); setCatInput(''); } }}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Press Enter or click Add</p>
                </div>

                {/* Materials */}
                <div>
                    <label className="label">Materials (optional — for filter dropdown)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {materials.map((m, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                                {m}
                                <button type="button" onClick={() => setMaterials(prev => prev.filter((_, j) => j !== i))}
                                    className="hover:opacity-70" aria-label="Remove"><X size={11} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input className="input flex-1" value={matInput} placeholder="e.g. Solid Oak, Steel, Fabric"
                            onChange={e => setMatInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = matInput.trim(); if (v && !materials.includes(v)) { setMaterials(p => [...p, v]); setMatInput(''); } } }} />
                        <button type="button" className="btn-outline px-3 py-2 text-sm"
                            onClick={() => { const v = matInput.trim(); if (v && !materials.includes(v)) { setMaterials(p => [...p, v]); setMatInput(''); } }}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        disabled={catStatus.saving}
                        className="btn-primary py-2 px-5 text-sm disabled:opacity-60 flex items-center gap-2"
                        onClick={async () => {
                            setCatStatus({ saving: true, msg: '', type: '' });
                            try {
                                await Promise.all([
                                    upsertContent('productCategories', categories),
                                    upsertContent('productMaterials', materials),
                                ]);
                                setCatStatus({ saving: false, msg: 'Saved!', type: 'success' });
                            } catch { setCatStatus({ saving: false, msg: 'Save failed', type: 'error' }); }
                            setTimeout(() => setCatStatus(s => ({ ...s, msg: '' })), 3000);
                        }}>
                        {catStatus.saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save Categories</>}
                    </button>
                    <Toast msg={catStatus.msg} type={catStatus.type} />
                </div>
            </Section>
        </div>
    );
}
