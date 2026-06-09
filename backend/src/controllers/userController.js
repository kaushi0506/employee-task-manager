const User = require('../models/User');

// Get all employees (admin only)
const getAllEmployees = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const employees = await User.find({ role: 'employee' }).select('name email role createdAt');
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single user by id (admin only)
const getUserById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a user by id (admin only)
const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    return res.status(200).json({ message: 'User removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getUserById,
  deleteUser,
};
