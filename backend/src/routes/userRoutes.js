const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllEmployees, getUserById, deleteUser } = require('../controllers/userController');

router.get('/', protect, adminOnly, getAllEmployees);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
