import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRelatedProducts } from '../../services/api';
import ProductCard from './ProductCard';

export default function RelatedProducts({ currentSlug }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentSlug) return;
        setLoading(true);
        getRelatedProducts(currentSlug)
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [currentSlug]);

    if (loading || products.length === 0) return null;

    return (
        <div className="mt-20 border-t pt-16" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                ))}
            </div>
            <div className="text-center mt-10">
                <Link to="/products" className="btn-secondary">View All Products</Link>
            </div>
        </div>
    );
}
