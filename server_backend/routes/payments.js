const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Purchase coins (buyer only)
router.post('/purchase', auth, async (req, res) => {
  try {
    const { coins, amount, paymentMethod } = req.body;
    const user = req.user;

    if (user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can purchase coins' });
    }

    if (!coins || !amount) {
      return res.status(400).json({ message: 'Coins and amount are required' });
    }

    // Add coins to user in DB
    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    dbUser.coins = (dbUser.coins || 0) + Number(coins);
    await dbUser.save();

    // Create payment transaction log
    const payment = await Payment.create({
      buyerEmail: user.email,
      coins: Number(coins),
      amount: Number(amount),
      paymentMethod: paymentMethod || 'card',
    });

    // Create notification for buyer
    await Notification.create({
      message: `Successfully purchased ${coins} coins for $${amount}.`,
      toEmail: user.email,
      actionRoute: '/dashboard/purchase-coins',
    });

    res.status(201).json({
      message: 'Coins purchased successfully',
      payment,
      coins: dbUser.coins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process coin purchase' });
  }
});

// Get buyer's payment history (buyer only)
router.get('/history', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can view payment history' });
    }

    const history = await Payment.find({ buyerEmail: user.email }).sort({ purchaseDate: -1 });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
});

module.exports = router;
