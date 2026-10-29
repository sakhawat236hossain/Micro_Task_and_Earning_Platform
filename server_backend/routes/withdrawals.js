const express = require('express');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Worker creates withdrawal request
router.post('/request', auth, async (req, res) => {
  try {
    const { withdrawalCoin, paymentSystem, accountNumber } = req.body;
    const user = req.user;

    if (user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can request withdrawals' });
    }

    if (withdrawalCoin < 200) {
      return res.status(400).json({ message: 'Minimum 200 coins required for withdrawal' });
    }

    if (user.coins < withdrawalCoin) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    const withdrawalAmount = withdrawalCoin / 20; // 20 coins = 1 dollar

    // Deduct coins immediately from worker in DB
    const dbUser = await User.findById(user.id);
    if (!dbUser || dbUser.coins < withdrawalCoin) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }
    dbUser.coins -= withdrawalCoin;
    await dbUser.save();

    const withdrawal = await Withdrawal.create({
      workerEmail: user.email,
      workerName: user.name,
      withdrawalCoin,
      withdrawalAmount,
      paymentSystem,
      accountNumber,
    });

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      withdrawal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create withdrawal request' });
  }
});

// Worker views their withdrawal requests
router.get('/worker/requests', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can view their requests' });
    }

    const withdrawals = await Withdrawal.find({ workerEmail: user.email }).sort({ withdrawalDate: -1 });
    res.json(withdrawals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch withdrawal requests' });
  }
});

// Admin views all pending withdrawal requests
router.get('/admin/pending', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view withdrawal requests' });
    }

    const withdrawals = await Withdrawal.find({ status: 'pending' }).sort({ withdrawalDate: -1 });
    res.json(withdrawals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch withdrawal requests' });
  }
});

// Admin approves withdrawal request
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve withdrawals' });
    }

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal cannot be approved' });
    }

    // Update withdrawal status
    await Withdrawal.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

    // Send notification to worker
    await Notification.create({
      message: `Your withdrawal request of $${withdrawal.withdrawalAmount.toFixed(2)} was approved.`,
      toEmail: withdrawal.workerEmail,
      actionRoute: '/dashboard/withdrawals',
    });

    res.json({ message: 'Withdrawal approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve withdrawal' });
  }
});

// Admin rejects withdrawal request
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can reject withdrawals' });
    }

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal cannot be rejected' });
    }

    // Update withdrawal status
    await Withdrawal.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });

    // Refund coins to worker in DB
    const worker = await User.findOne({ email: withdrawal.workerEmail });
    if (worker) {
      worker.coins += withdrawal.withdrawalCoin;
      await worker.save();
    }

    // Send notification to worker
    await Notification.create({
      message: `Your withdrawal request of $${withdrawal.withdrawalAmount.toFixed(2)} was rejected. Coins refunded.`,
      toEmail: withdrawal.workerEmail,
      actionRoute: '/dashboard/withdrawals',
    });

    res.json({ message: 'Withdrawal rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject withdrawal' });
  }
});

module.exports = router;
