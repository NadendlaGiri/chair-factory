const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

const getProducts = async (req, res) => {
    try {
        const { category, material, featured, search, page = 1, limit = 12 } = req.query;
        const where = {};
        if (category) where.category = category.toUpperCase();
        if (material) where.material = { contains: material, mode: 'insensitive' };
        if (featured === 'true') where.featured = true;
        if (search) where.name = { contains: search, mode: 'insensitive' };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [products, total] = await Promise.all([
            prisma.product.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
            prisma.product.count({ where }),
        ]);

        res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, category, description, material, dimensions, price, availability, featured, images, tags } = req.body;
        if (!name || !category || !description || !material) {
            return res.status(400).json({ error: 'Name, category, description, and material are required' });
        }
        let slug = slugify(name);
        const existing = await prisma.product.findUnique({ where: { slug } });
        if (existing) slug = `${slug}-${Date.now()}`;

        const product = await prisma.product.create({
            data: {
                name, slug, category: category.toUpperCase(),
                description, material, dimensions: dimensions || '',
                price: price ? parseFloat(price) : null,
                availability: availability !== undefined ? availability : true,
                featured: featured || false,
                images: images || [],
                tags: tags || [],
            },
        });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, category, description, material, dimensions, price, availability, featured, images, tags } = req.body;
        const data = {};
        if (name) { data.name = name; data.slug = slugify(name); }
        if (category) data.category = category.toUpperCase();
        if (description) data.description = description;
        if (material) data.material = material;
        if (dimensions !== undefined) data.dimensions = dimensions;
        if (price !== undefined) data.price = price ? parseFloat(price) : null;
        if (availability !== undefined) data.availability = availability;
        if (featured !== undefined) data.featured = featured;
        if (images) data.images = images;
        if (tags) data.tags = tags;

        const product = await prisma.product.update({ where: { id }, data });
        res.json(product);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
