import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

const api = axios.create({
    baseURL: BASE,
    headers: { 'Content-Type': 'application/json' },
});


// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-logout on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/admin/login';
        }
        return Promise.reject(err);
    }
);

// Auth
export const loginAdmin = (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data);
export const updateAdminProfile = (data) =>
    api.put('/auth/profile', data).then(r => r.data);

// Products
export const getProducts = (params) =>
    api.get('/products', { params }).then(r => r.data);
export const getProduct = (slug) =>
    api.get(`/products/${slug}`).then(r => r.data);
export const createProduct = (data) =>
    api.post('/products', data).then(r => r.data);
export const updateProduct = (id, data) =>
    api.put(`/products/${id}`, data).then(r => r.data);
export const deleteProduct = (id) =>
    api.delete(`/products/${id}`).then(r => r.data);
export const getRelatedProducts = (slug) =>
    api.get(`/products/${slug}/related`).then(r => r.data);
export const getTopProducts = () =>
    api.get(`/products/analytics/top`).then(r => r.data);
export const importProducts = (data) =>
    api.post(`/products/import`, data).then(r => r.data);

// Inquiries
export const submitInquiry = (data) =>
    api.post(`/inquiries`, data).then(r => r.data);
export const getInquiries = () =>
    api.get(`/inquiries`).then(r => r.data);
export const deleteInquiry = (id) =>
    api.delete(`/inquiries/${id}`).then(r => r.data);

// Activity Logs
export const getActivityLogs = (limit = 20) =>
    api.get(`/activities?limit=${limit}`).then(r => r.data);

// Orders
export const submitOrder = (data) =>
    api.post('/orders', data).then(r => r.data);
export const getOrders = (params) =>
    api.get('/orders', { params }).then(r => r.data);
export const getOrder = (id) =>
    api.get(`/orders/${id}`).then(r => r.data);
export const updateOrderStatus = (id, status) =>
    api.put(`/orders/${id}/status`, { status }).then(r => r.data);
export const getDashboardStats = () =>
    api.get('/orders/stats').then(r => r.data);

// Content
export const getAllContent = () => api.get('/content').then(r => r.data);
export const getContent = (key) => api.get(`/content/${key}`).then(r => r.data);
export const upsertContent = (key, value) =>
    api.put(`/content/${key}`, { value }).then(r => r.data);

// Themes
export const getThemeConfig = () => api.get('/themes').then(r => r.data);
export const setDefaultTheme = (defaultTheme) =>
    api.put('/themes', { defaultTheme }).then(r => r.data);

// Upload
export const uploadImages = (files) => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
};

export default api;
