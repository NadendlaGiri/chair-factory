import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from './store/authStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public pages (lazy loaded)
const Home = lazy(() => import('./pages/public/Home'));
const Products = lazy(() => import('./pages/public/Products'));
const ProductDetail = lazy(() => import('./pages/public/ProductDetail'));
const About = lazy(() => import('./pages/public/About'));
const BulkOrders = lazy(() => import('./pages/public/BulkOrders'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Admin pages (lazy loaded)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminThemes = lazy(() => import('./pages/admin/AdminThemes'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--surface)' }}>
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
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
                    <Route path="/products/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
                    <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/orders" element={<PublicLayout><BulkOrders /></PublicLayout>} />
                    <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="content" element={<AdminContent />} />
                        <Route path="themes" element={<AdminThemes />} />
                        <Route path="settings" element={<AdminSettings />} />
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
            </Suspense>
        </BrowserRouter>
    );
}
