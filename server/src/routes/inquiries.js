const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middlewares/auth');

// Public route to submit inquiry
router.post('/', async (req, res) => {
    try {
        const { productName, productSlug, customerName, phone, message } = req.body;
        const inquiry = await prisma.productInquiry.create({
            data: { productName, productSlug, customerName, phone, message }
        });
        res.status(201).json({ message: 'Inquiry submitted', inquiry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin protected list
router.get('/', authMiddleware, async (req, res) => {
    try {
        const inquiries = await prisma.productInquiry.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin delete
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.productInquiry.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
