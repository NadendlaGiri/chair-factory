const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const config = await prisma.themeConfig.findFirst();
        res.json(config || { defaultTheme: 'light' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/', authMiddleware, async (req, res) => {
    try {
        const { defaultTheme } = req.body;
        const validThemes = ['light', 'dark', 'industrial', 'wood', 'modern'];
        if (!validThemes.includes(defaultTheme)) {
            return res.status(400).json({ error: 'Invalid theme' });
        }
        const existing = await prisma.themeConfig.findFirst();
        let config;
        if (existing) {
            config = await prisma.themeConfig.update({ where: { id: existing.id }, data: { defaultTheme } });
        } else {
            config = await prisma.themeConfig.create({ data: { defaultTheme } });
        }
        res.json(config);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
