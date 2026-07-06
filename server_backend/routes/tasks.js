const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks for workers (tasks with available workers)
router.get('/available', async (req, res) => {
  try {
    const tasks = await Task.find({ requiredWorkers: { $gt: 0 }, status: 'active' }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Get single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});

// Create a new task (buyer only)
router.post('/create', auth, async (req, res) => {
  try {
    const { title, detail, payableAmount, requiredWorkers, completionDate, submissionInfo, taskImageUrl } = req.body;
    const user = req.user;

    if (user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can create tasks' });
    }

    const totalPayable = payableAmount * requiredWorkers;

    if (user.coins < totalPayable) {
      return res.status(400).json({ message: 'Insufficient coins to create this task' });
    }

    const task = await Task.create({
      title,
      detail,
      buyerEmail: user.email,
      buyerName: user.name,
      payableAmount,
      requiredWorkers,
      completionDate,
      submissionInfo,
      taskImageUrl: taskImageUrl || '',
      totalPayable,
    });

    // Deduct coins from buyer
    await User.findByIdAndUpdate(user._id, { coins: user.coins - totalPayable });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// Get buyer's tasks
router.get('/buyer/tasks', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can view their tasks' });
    }

    const tasks = await Task.find({ buyerEmail: user.email }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Update task (buyer only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, detail, submissionInfo } = req.body;
    const user = req.user;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.buyerEmail !== user.email || user.role !== 'buyer') {
      return res.status(403).json({ message: 'Unauthorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, detail, submissionInfo },
      { new: true }
    );

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Delete task (buyer only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = req.user;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.buyerEmail !== user.email || user.role !== 'buyer') {
      return res.status(403).json({ message: 'Unauthorized to delete this task' });
    }

    // Refund coins for incomplete tasks
    const refund = task.totalPayable;
    await User.findByIdAndUpdate(user._id, { coins: user.coins + refund });

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
