import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function MySubmissions() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${API_URL}/submissions/worker/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(response.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [token]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const filteredSubmissions = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <h2>My Submissions</h2>

      <div className="filter-buttons">
        <button
          onClick={() => handleFilterChange('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginRight: '8px' }}
        >
          All ({submissions.length})
        </button>
        <button
          onClick={() => handleFilterChange('pending')}
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginRight: '8px' }}
        >
          Pending ({submissions.filter((s) => s.status === 'pending').length})
        </button>
        <button
          onClick={() => handleFilterChange('approved')}
          className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginRight: '8px' }}
        >
          Approved ({submissions.filter((s) => s.status === 'approved').length})
        </button>
        <button
          onClick={() => handleFilterChange('rejected')}
          className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Rejected ({submissions.filter((s) => s.status === 'rejected').length})
        </button>
      </div>

      {paginatedSubmissions.length === 0 ? (
        <p style={{ marginTop: '16px' }}>No submissions found.</p>
      ) : (
        <>
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Buyer Name</th>
                <th>Reward</th>
                <th>Submitted At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.map((sub) => (
                <tr key={sub._id}>
                  <td>{sub.taskTitle}</td>
                  <td>{sub.buyerName}</td>
                  <td>{sub.payableAmount} coins</td>
                  <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: getStatusColor(sub.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}
                    >
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubmissions.length > itemsPerPage && (
            <div className="pagination" style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
