const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

router.post('/', protect, adminOnly, createTask);
router.get('/', protect, adminOnly, getAllTasks);
router.get('/my-tasks', protect, getMyTasks);
router.patch('/:id/status', protect, updateTaskStatus);
router.delete('/:id', protect, adminOnly, deleteTask);

module.exports = router;
