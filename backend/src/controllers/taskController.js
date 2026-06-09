const Task = require('../models/Task');

// Create a new task (admin only)
const createTask = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { title, description, priority, dueDate, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo,
      assignedBy: req.user.id,
    });

    const created = await task.save();
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all tasks (admin only) and populate assignedTo/assignedBy name and email
const getAllTasks = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get tasks assigned to the logged-in employee (employee only)
const getMyTasks = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Not authorized as employee' });
    }

    const tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedBy', 'name email');
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update task status by id (employee only)
const updateTaskStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Not authorized as employee' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure employee can only update their own tasks
    if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updated = await task.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a task by id (admin only)
const deleteTask = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.remove();
    return res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
};
