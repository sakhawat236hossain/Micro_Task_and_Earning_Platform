const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const Withdrawal = require('../models/Withdrawal');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();

// Get admin statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view stats' });
    }

    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalCoins = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$coins' } } },
    ]);
    const totalPayments = await Submission.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$payableAmount' } } },
    ]);

    res.json({
      totalWorkers,
      totalBuyers,
      totalCoins: totalCoins[0]?.total || 0,
      totalPayments: totalPayments[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Get all users
router.get('/users', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view users' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user
router.delete('/users/:id', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete users' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all user's tasks
    await Task.deleteMany({ buyerEmail: targetUser.email });
    // Delete all user's submissions
    await Submission.deleteMany({ workerEmail: targetUser.email });
    // Delete all user's withdrawals
    await Withdrawal.deleteMany({ workerEmail: targetUser.email });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Update user role
router.put('/users/:id/role', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update roles' });
    }

    if (!['worker', 'buyer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// Get all tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view all tasks' });
    }

    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Delete task by admin
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Refund coins to buyer
    const buyer = await User.findOne({ email: task.buyerEmail });
    if (buyer) {
      await User.findByIdAndUpdate(buyer._id, { coins: buyer.coins + task.totalPayable });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
