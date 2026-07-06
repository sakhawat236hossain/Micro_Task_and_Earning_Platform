import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TaskDetails() {
  const { taskId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks/${taskId}`);
        setTask(response.data);
      } catch (error) {
        setError('Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!submissionDetails.trim()) {
      setError('Submission details are required');
      setSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${API_URL}/submissions/submit`,
        {
          taskId,
          submissionDetails,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Submission created successfully!');
      setSubmissionDetails('');
      setTimeout(() => navigate('/dashboard/my-submissions'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit work');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  if (!task) {
    return <div className="dashboard-section">Task not found</div>;
  }

  return (
    <div className="dashboard-section">
      <button onClick={() => navigate('/dashboard/task-list')} className="btn btn-secondary" style={{ marginBottom: '16px' }}>
        ← Back to Tasks
      </button>

      <h2>{task.title}</h2>
      <div className="task-details">
        <div className="task-info-block">
          <h3>Task Information</h3>
          <p><strong>Buyer:</strong> {task.buyerName}</p>
          <p><strong>Reward:</strong> {task.payableAmount} coins per submission</p>
          <p><strong>Workers Needed:</strong> {task.requiredWorkers}</p>
          <p><strong>Deadline:</strong> {new Date(task.completionDate).toLocaleDateString()}</p>
          <p><strong>Details:</strong> {task.detail}</p>
          <p><strong>What to Submit:</strong> {task.submissionInfo}</p>
        </div>

        <form onSubmit={handleSubmit} className="submission-form">
          <h3>Submit Your Work</h3>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <label>
            Your Submission
            <textarea
              value={submissionDetails}
              onChange={(e) => setSubmissionDetails(e.target.value)}
              placeholder="Provide evidence or details of your work"
              rows="6"
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Work'}
          </button>
        </form>
      </div>
    </div>
  );
}
