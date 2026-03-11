import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Armchair, Loader2, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function AdminLogin() {
    const { isAuthenticated, login } = useAuthStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/admin" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Enter email and password'); return; }
        setLoading(true);
        try {
            const data = await loginAdmin(email, password);
            login(data.token, data.admin);
            toast.success(`Welcome back, ${data.admin.name}!`);
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet><title>Admin Login – Chair Factory</title></Helmet>
            <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--hero-gradient)' }}>
                {/* Back to website */}
                <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                    Back to Website
                </Link>
                <div className="w-full max-w-md animate-slide-up">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                            style={{ backgroundColor: 'var(--accent)' }}>
                            <Armchair size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                            Admin Portal
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Chair Factory Management System</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="card space-y-5">
                        <div>
                            <label className="label">Email Address</label>
                            <input type="email" className="input" placeholder="admin@chairfactory.com"
                                value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <input type={showPwd ? 'text' : 'password'} className="input pr-10"
                                    placeholder="Enter password" value={password}
                                    onChange={e => setPassword(e.target.value)} required />
                                <button type="button" onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full py-3 justify-center disabled:opacity-60">
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
                        </button>
                    </form>


                    <p className="text-center mt-3">
                        <Link to="/" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>← Back to main website</Link>
                    </p>
                </div>
            </div>
        </>
    );
}
