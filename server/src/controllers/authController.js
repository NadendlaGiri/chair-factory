const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, name: admin.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            admin: { id: admin.id, email: admin.email, name: admin.name },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: req.admin.id },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body;
    if (!name && !email && !newPassword) {
        return res.status(400).json({ error: 'No changes provided' });
    }
    try {
        const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        // If changing password or sensitive fields, require current password
        if (newPassword || email) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to change email or password' });
            }
            const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
            if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Check email uniqueness
        if (email && email !== admin.email) {
            const exists = await prisma.admin.findUnique({ where: { email } });
            if (exists) return res.status(409).json({ error: 'That email is already in use' });
        }

        const data = {};
        if (name) data.name = name;
        if (email) data.email = email;
        if (newPassword) data.passwordHash = await bcrypt.hash(newPassword, 10);

        const updated = await prisma.admin.update({
            where: { id: req.admin.id },
            data,
            select: { id: true, email: true, name: true },
        });

        // Issue a fresh token with updated claims
        const token = jwt.sign(
            { id: updated.id, email: updated.email, name: updated.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({ admin: updated, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { login, getMe, updateProfile };
