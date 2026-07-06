import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function WorkerHome() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarned: 0,
  });
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionsRes = await axios.get(`${API_URL}/submissions/worker/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const submissions = submissionsRes.data;
        const approved = submissions.filter((s) => s.status === 'approved');
        const pending = submissions.filter((s) => s.status === 'pending');
        const totalEarned = approved.reduce((sum, s) => sum + s.payableAmount, 0);

        setStats({
          totalSubmissions: submissions.length,
          pendingSubmissions: pending.length,
          totalEarned,
        });

        setApprovedSubmissions(approved);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>Worker Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{stats.totalSubmissions}</strong>
          <span>Total Submissions</span>
        </div>
        <div className="stat-card">
          <strong>{stats.pendingSubmissions}</strong>
          <span>Pending Review</span>
        </div>
        <div className="stat-card">
          <strong>${(stats.totalEarned / 20).toFixed(2)}</strong>
          <span>Total Earned (approx)</span>
        </div>
      </div>

      <div className="approved-submissions">
        <h3>Approved Submissions ({approvedSubmissions.length})</h3>
        {approvedSubmissions.length === 0 ? (
          <p>No approved submissions yet.</p>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Buyer</th>
                <th>Earned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedSubmissions.map((sub) => (
                <tr key={sub._id}>
                  <td>{sub.taskTitle}</td>
                  <td>{sub.buyerName}</td>
                  <td>{sub.payableAmount} coins</td>
                  <td className="status-approved">{sub.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
