import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminHome() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const withdrawalRes = await axios.get(`${API_URL}/withdrawals/admin/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(statsRes.data);
        setWithdrawals(withdrawalRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleApproveWithdrawal = async (withdrawalId) => {
    try {
      await axios.put(
        `${API_URL}/withdrawals/${withdrawalId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWithdrawals(withdrawals.filter((w) => w._id !== withdrawalId));
      alert('Withdrawal approved!');
    } catch (error) {
      alert('Failed to approve withdrawal');
    }
  };

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>Admin Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{stats.totalWorkers}</strong>
          <span>Total Workers</span>
        </div>
        <div className="stat-card">
          <strong>{stats.totalBuyers}</strong>
          <span>Total Buyers</span>
        </div>
        <div className="stat-card">
          <strong>{stats.totalCoins}</strong>
          <span>Total Coins in System</span>
        </div>
        <div className="stat-card">
          <strong>{stats.totalPayments}</strong>
          <span>Total Coins Paid</span>
        </div>
      </div>

      <div className="withdrawals-section">
        <h3>Pending Withdrawal Requests ({withdrawals.length})</h3>
        {withdrawals.length === 0 ? (
          <p>No pending withdrawals.</p>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Coins</th>
                <th>Amount (USD)</th>
                <th>Payment Method</th>
                <th>Account</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id}>
                  <td>{w.workerName}</td>
                  <td>{w.withdrawalCoin}</td>
                  <td>${w.withdrawalAmount.toFixed(2)}</td>
                  <td>{w.paymentSystem}</td>
                  <td>{w.accountNumber}</td>
                  <td>
                    <button
                      onClick={() => handleApproveWithdrawal(w._id)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                    >
                      Approve
                    </button>
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
