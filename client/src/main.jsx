import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { useThemeStore } from './store/themeStore';

// Apply stored theme before first render
const storedTheme = JSON.parse(localStorage.getItem('chair-theme') || '{}')?.state?.theme || 'light';
document.documentElement.setAttribute('data-theme', storedTheme);
if (storedTheme === 'dark') document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                }}
            />
            <App />
        </HelmetProvider>
    </React.StrictMode>
);
