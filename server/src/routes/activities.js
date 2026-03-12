const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const logs = await prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
