import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function BuyerHome() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ tasks: 0, pending: 0, totalSpent: 0 });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionsRes = await axios.get(`${API_URL}/submissions/buyer/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasksRes = await axios.get(`${API_URL}/tasks/buyer/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubmissions(submissionsRes.data);

        const pendingCount = submissionsRes.data.length;
        const taskCount = tasksRes.data.length;
        const totalSpent = tasksRes.data.reduce((sum, task) => sum + task.totalPayable, 0);

        setStats({
          tasks: taskCount,
          pending: pendingCount,
          totalSpent,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleApprove = async (submissionId) => {
    try {
      await axios.put(`${API_URL}/submissions/${submissionId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(submissions.filter((s) => s._id !== submissionId));
      setSelectedSubmission(null);
      alert('Submission approved!');
    } catch (error) {
      alert('Failed to approve submission');
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await axios.put(`${API_URL}/submissions/${submissionId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(submissions.filter((s) => s._id !== submissionId));
      setSelectedSubmission(null);
      alert('Submission rejected!');
    } catch (error) {
      alert('Failed to reject submission');
    }
  };

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>Buyer Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{stats.tasks}</strong>
          <span>Total Tasks</span>
        </div>
        <div className="stat-card">
          <strong>{stats.pending}</strong>
          <span>Pending Submissions</span>
        </div>
        <div className="stat-card">
          <strong>{stats.totalSpent}</strong>
          <span>Total Coins Spent</span>
        </div>
      </div>

      <div className="submissions-section">
        <h3>Submissions to Review ({submissions.length})</h3>
        {submissions.length === 0 ? (
          <p>No pending submissions yet.</p>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Task Title</th>
                <th>Payable Amount</th>
                <th>Submission Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id}>
                  <td>{sub.workerName}</td>
                  <td>{sub.taskTitle}</td>
                  <td>{sub.payableAmount} coins</td>
                  <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Review Submission</h3>
            <p><strong>Worker:</strong> {selectedSubmission.workerName}</p>
            <p><strong>Email:</strong> {selectedSubmission.workerEmail}</p>
            <p><strong>Task:</strong> {selectedSubmission.taskTitle}</p>
            <p><strong>Submission:</strong> {selectedSubmission.submissionDetails}</p>
            <p><strong>Payable Amount:</strong> {selectedSubmission.payableAmount} coins</p>
            <div className="modal-actions">
              <button
                onClick={() => handleApprove(selectedSubmission._id)}
                className="btn btn-primary"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedSubmission._id)}
                className="btn btn-secondary"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
