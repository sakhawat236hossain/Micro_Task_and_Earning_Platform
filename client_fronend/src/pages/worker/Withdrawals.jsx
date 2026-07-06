import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Withdrawals() {
  const { user, token, updateCoins } = useAuth();
  const [form, setForm] = useState({
    withdrawalCoin: '',
    paymentSystem: 'bkash',
    accountNumber: '',
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const withdrawalAmount = form.withdrawalCoin ? (parseInt(form.withdrawalCoin) / 20).toFixed(2) : '0.00';
  const canWithdraw = user && user.coins >= 200;

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get(`${API_URL}/withdrawals/worker/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWithdrawals(response.data);
      } catch (error) {
        console.error('Failed to fetch withdrawals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const coin = parseInt(form.withdrawalCoin);

    if (!form.withdrawalCoin || !form.accountNumber) {
      setError('All fields are required');
      setSubmitting(false);
      return;
    }

    if (coin < 200) {
      setError('Minimum 200 coins required');
      setSubmitting(false);
      return;
    }

    if (user.coins < coin) {
      setError('Insufficient coins');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/withdrawals/request`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Withdrawal request created! Awaiting admin approval.');
      setWithdrawals([response.data.withdrawal, ...withdrawals]);
      setForm({
        withdrawalCoin: '',
        paymentSystem: 'bkash',
        accountNumber: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>Withdrawals</h2>

      <div className="withdrawal-info">
        <div className="info-card">
          <p className="info-label">Available Coins</p>
          <p className="info-value">{user.coins}</p>
        </div>
        <div className="info-card">
          <p className="info-label">Withdrawal Rate</p>
          <p className="info-value">20 coins = $1</p>
        </div>
        <div className="info-card">
          <p className="info-label">Minimum Withdrawal</p>
          <p className="info-value">200 coins = $10</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="withdrawal-form">
        <h3>Request Withdrawal</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <label>
          Coins to Withdraw
          <input
            type="number"
            name="withdrawalCoin"
            value={form.withdrawalCoin}
            onChange={handleChange}
            placeholder="Minimum 200"
            min="200"
            max={user.coins}
            required
          />
        </label>

        <label>
          Withdrawal Amount (USD)
          <input
            type="text"
            value={`$${withdrawalAmount}`}
            disabled
            style={{ backgroundColor: '#f0fdf4', color: '#166534' }}
          />
        </label>

        <label>
          Payment Method
          <select name="paymentSystem" value={form.paymentSystem} onChange={handleChange}>
            <option value="bkash">Bkash</option>
            <option value="rocket">Rocket</option>
            <option value="nagad">Nagad</option>
            <option value="stripe">Stripe</option>
          </select>
        </label>

        <label>
          Account Number
          <input
            type="text"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            placeholder="Your account number"
            required
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !canWithdraw}
          style={!canWithdraw ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          {submitting ? 'Processing...' : !canWithdraw ? 'Insufficient Coins' : 'Request Withdrawal'}
        </button>
      </form>

      <div className="withdrawal-history">
        <h3>Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <p>No withdrawal requests yet.</p>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Coins</th>
                <th>Amount (USD)</th>
                <th>Payment Method</th>
                <th>Request Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id}>
                  <td>{withdrawal.withdrawalCoin}</td>
                  <td>${withdrawal.withdrawalAmount.toFixed(2)}</td>
                  <td>{withdrawal.paymentSystem}</td>
                  <td>{new Date(withdrawal.withdrawalDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: getStatusColor(withdrawal.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}
                    >
                      {withdrawal.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
