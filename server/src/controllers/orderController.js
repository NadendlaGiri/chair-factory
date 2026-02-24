const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    try {
        const { customerName, phone, email, company, location, productName, quantity, material, timeline, notes } = req.body;
        if (!customerName || !phone || !email || !location || !productName || !quantity) {
            return res.status(400).json({ error: 'Required fields: customerName, phone, email, location, productName, quantity' });
        }
        const order = await prisma.orderRequest.create({
            data: { customerName, phone, email, company, location, productName, quantity: parseInt(quantity), material, timeline, notes },
        });
        res.status(201).json({ message: 'Order request submitted successfully!', id: order.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const where = status ? { status: status.toUpperCase() } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [orders, total] = await Promise.all([
            prisma.orderRequest.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
            prisma.orderRequest.count({ where }),
        ]);
        res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await prisma.orderRequest.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status?.toUpperCase())) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const order = await prisma.orderRequest.update({
            where: { id: parseInt(req.params.id) },
            data: { status: status.toUpperCase() },
        });
        res.json(order);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Order not found' });
        res.status(500).json({ error: 'Server error' });
    }
};

const getStats = async (req, res) => {
    try {
        const [totalOrders, newOrders, inProgress, completed, totalProducts] = await Promise.all([
            prisma.orderRequest.count(),
            prisma.orderRequest.count({ where: { status: 'NEW' } }),
            prisma.orderRequest.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.orderRequest.count({ where: { status: 'COMPLETED' } }),
            prisma.product.count(),
        ]);
        const recentOrders = await prisma.orderRequest.findMany({
            take: 5, orderBy: { createdAt: 'desc' },
            select: { id: true, customerName: true, productName: true, status: true, createdAt: true },
        });
        res.json({ totalOrders, newOrders, inProgress, completed, totalProducts, recentOrders });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus, getStats };
