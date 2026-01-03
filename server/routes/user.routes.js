const express = require('express');
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/user.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyAdmin, getStaff);
router.post('/', verifyAdmin, createStaff);
router.put('/:id', verifyAdmin, updateStaff);
router.delete('/:id', verifyAdmin, deleteStaff);

module.exports = router;
