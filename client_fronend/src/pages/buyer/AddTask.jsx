import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AddTask() {
  const { user, token, updateCoins } = useAuth();
  const [form, setForm] = useState({
    title: '',
    detail: '',
    payableAmount: '',
    requiredWorkers: '',
    completionDate: '',
    submissionInfo: '',
    taskImageUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const payable = parseFloat(form.payableAmount) || 0;
    const workers = parseInt(form.requiredWorkers) || 0;
    return payable * workers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const totalPayable = calculateTotal();

    if (!form.title || !form.detail || !form.payableAmount || !form.requiredWorkers || !form.completionDate || !form.submissionInfo) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (user.coins < totalPayable) {
      setError(`Insufficient coins. Need ${totalPayable} coins, you have ${user.coins}`);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/tasks/create`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Task created successfully!');
      updateCoins(user.coins - totalPayable);
      setForm({
        title: '',
        detail: '',
        payableAmount: '',
        requiredWorkers: '',
        completionDate: '',
        submissionInfo: '',
        taskImageUrl: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const totalPayable = calculateTotal();

  return (
    <div className="dashboard-section">
      <h2>Create a New Task</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <label>
          Task Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Write a product review"
            required
          />
        </label>

        <label>
          Task Details
          <textarea
            name="detail"
            value={form.detail}
            onChange={handleChange}
            placeholder="Detailed description of what workers need to do"
            rows="4"
            required
          />
        </label>

        <label>
          Payable Amount per Worker (Coins)
          <input
            type="number"
            name="payableAmount"
            value={form.payableAmount}
            onChange={handleChange}
            placeholder="10"
            min="1"
            required
          />
        </label>

        <label>
          Number of Workers Needed
          <input
            type="number"
            name="requiredWorkers"
            value={form.requiredWorkers}
            onChange={handleChange}
            placeholder="50"
            min="1"
            required
          />
        </label>

        <label>
          Completion Date
          <input
            type="date"
            name="completionDate"
            value={form.completionDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Submission Info (What should workers submit?)
          <textarea
            name="submissionInfo"
            value={form.submissionInfo}
            onChange={handleChange}
            placeholder="e.g., Screenshot of review + link"
            rows="3"
            required
          />
        </label>

        <label>
          Task Image URL (optional)
          <input
            type="url"
            name="taskImageUrl"
            value={form.taskImageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </label>

        <div className="task-summary">
          <p>Total Cost: {totalPayable} coins (Your balance: {user.coins} coins)</p>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
