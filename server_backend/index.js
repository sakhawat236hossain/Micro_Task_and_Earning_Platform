const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
const submissionsRoutes = require('./routes/submissions');
const withdrawalsRoutes = require('./routes/withdrawals');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'TaskEarn Hub API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/withdrawals', withdrawalsRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskearn')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
