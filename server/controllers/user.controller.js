const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

const getStaff = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'STAFF' },
            select: { id: true, name: true, email: true, status: true, role: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createStaff = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: 'User exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: 'STAFF' }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStaff = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.update({
            where: { id },
            data: req.body
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getStaff, createStaff, updateStaff, deleteStaff };
