const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getContent = async (req, res) => {
    try {
        const { key } = req.params;
        if (key) {
            const content = await prisma.siteContent.findUnique({ where: { key } });
            return res.json(content || { key, value: {} });
        }
        const all = await prisma.siteContent.findMany();
        const result = {};
        all.forEach(item => { result[item.key] = item.value; });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const upsertContent = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        if (!value) return res.status(400).json({ error: 'Value is required' });
        const content = await prisma.siteContent.upsert({
            where: { key },
            create: { key, value },
            update: { value },
        });
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getContent, upsertContent };
