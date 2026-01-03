const prisma = require('../utils/prisma');

const createTask = async (req, res) => {
    const { title, description, priority, dueDate, assigneeIds } = req.body;
    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                assignees: {
                    connect: assigneeIds.map(id => ({ id }))
                }
            },
            include: { assignees: true }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTasks = async (req, res) => {
    const { role, id } = req.user;
    try {
        let where = {};
        if (role === 'STAFF') {
            where = {
                assignees: {
                    some: { id }
                }
            };
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                assignees: true,
                comments: {
                    include: { user: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status, assigneeIds } = req.body; // Priority etc can also be added

    try {
        const data = { status };
        if (assigneeIds) {
            data.assignees = { set: assigneeIds.map(uid => ({ id: uid })) };
        }

        const task = await prisma.task.update({
            where: { id },
            data,
            include: { assignees: true }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                taskId: id,
                userId: req.user.id
            },
            include: { user: true }
        });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, addComment };
