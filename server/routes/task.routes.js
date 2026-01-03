const express = require('express');
const { createTask, getTasks, updateTask, addComment } = require('../controllers/task.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getTasks);
router.post('/', verifyAdmin, createTask);
router.put('/:id', verifyToken, updateTask); // Staff can update status
router.post('/:id/comments', verifyToken, addComment);

module.exports = router;
