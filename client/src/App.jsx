import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ScrollToTop from './components/ui/ScrollToTop';
import StickyQuote from './components/ui/StickyQuote';
import CompareBar from './components/ui/CompareBar';

// Public pages (lazy loaded)
const Home = lazy(() => import('./pages/public/Home'));
const Products = lazy(() => import('./pages/public/Products'));
const ProductDetail = lazy(() => import('./pages/public/ProductDetail'));
const About = lazy(() => import('./pages/public/About'));
const BulkOrders = lazy(() => import('./pages/public/BulkOrders'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Compare = lazy(() => import('./pages/public/Compare'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminThemes = lazy(() => import('./pages/admin/AdminThemes'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function RouteScrollReset() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col page-transition" style={{ backgroundColor: 'var(--surface)' }}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
                <RouteScrollReset />
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
                    <Route path="/products/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
                    <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/orders" element={<PublicLayout><BulkOrders /></PublicLayout>} />
                    <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                    <Route path="/compare" element={<PublicLayout><Compare /></PublicLayout>} />

                    {/* Admin */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="admin/products" element={<AdminProducts />} />
                        <Route path="admin/orders" element={<AdminOrders />} />
                        <Route path="admin/inquiries" element={<AdminInquiries />} />
                        <Route path="admin/content" element={<AdminContent />} />
                        <Route path="admin/themes" element={<AdminThemes />} />
                        <Route path="admin/settings" element={<AdminSettings />} />
                    </Route>

                    <Route path="*" element={
                        <PublicLayout>
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--accent)' }}>404</h1>
                                <p className="text-xl mb-8" style={{ color: 'var(--text-muted)' }}>Page not found</p>
                                <a href="/" className="btn-primary">Go Home</a>
                            </div>
                        </PublicLayout>
                    } />
                </Routes>
                {/* ── Global floating UI ── */}
                <ScrollToTop />
                <StickyQuote />
                <CompareBar />
            </Suspense>
        </BrowserRouter>
    );
}
