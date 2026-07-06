const express = require('express');
const Submission = require('../models/Submission');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Worker submits work for a task
router.post('/submit', auth, async (req, res) => {
  try {
    const { taskId, submissionDetails } = req.body;
    const user = req.user;

    if (user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can submit' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const submission = await Submission.create({
      taskId,
      taskTitle: task.title,
      payableAmount: task.payableAmount,
      workerEmail: user.email,
      workerName: user.name,
      buyerEmail: task.buyerEmail,
      buyerName: task.buyerName,
      submissionDetails,
    });

    // Decrease required workers count
    await Task.findByIdAndUpdate(taskId, { requiredWorkers: task.requiredWorkers - 1 });

    res.status(201).json({
      message: 'Submission created successfully',
      submission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create submission' });
  }
});

// Get worker's submissions
router.get('/worker/submissions', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can view their submissions' });
    }

    const submissions = await Submission.find({ workerEmail: user.email }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

// Get buyer's pending submissions for review
router.get('/buyer/pending', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can view submissions' });
    }

    const submissions = await Submission.find({ buyerEmail: user.email, status: 'pending' }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

// Buyer approves submission
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const user = req.user;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.buyerEmail !== user.email || user.role !== 'buyer') {
      return res.status(403).json({ message: 'Unauthorized to approve this submission' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission cannot be approved' });
    }

    // Update submission status
    await Submission.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

    // Add coins to worker
    const worker = await User.findOne({ email: submission.workerEmail });
    if (worker) {
      await User.findByIdAndUpdate(worker._id, { coins: worker.coins + submission.payableAmount });
    }

    res.json({ message: 'Submission approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve submission' });
  }
});

// Buyer rejects submission
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const user = req.user;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.buyerEmail !== user.email || user.role !== 'buyer') {
      return res.status(403).json({ message: 'Unauthorized to reject this submission' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission cannot be rejected' });
    }

    // Update submission status
    await Submission.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });

    // Increase required workers for the task
    const task = await Task.findById(submission.taskId);
    if (task) {
      await Task.findByIdAndUpdate(submission.taskId, { requiredWorkers: task.requiredWorkers + 1 });
    }

    res.json({ message: 'Submission rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject submission' });
  }
});

module.exports = router;
