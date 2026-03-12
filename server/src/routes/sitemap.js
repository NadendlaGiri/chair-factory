const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/sitemap.xml', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            select: { slug: true, updatedAt: true },
        });

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        const staticPages = [
            { url: '/', changefreq: 'daily', priority: 1.0 },
            { url: '/products', changefreq: 'daily', priority: 0.9 },
            { url: '/about', changefreq: 'monthly', priority: 0.7 },
            { url: '/contact', changefreq: 'monthly', priority: 0.7 },
        ];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        staticPages.forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        });

        products.forEach(p => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/product/${p.slug}</loc>\n`;
            xml += `    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error('Sitemap error:', err);
        res.status(500).end();
    }
});

module.exports = router;
