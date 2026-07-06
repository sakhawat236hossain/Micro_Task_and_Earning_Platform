import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function BuyerMyTasks() {
  const { user, token, updateCoins } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks/buyer/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate)));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const task = tasks.find((t) => t._id === taskId);
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(tasks.filter((t) => t._id !== taskId));
        updateCoins(user.coins + task.totalPayable);
        alert('Task deleted and coins refunded!');
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>My Tasks</h2>
      {tasks.length === 0 ? (
        <p>You have no tasks yet.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Workers Needed</th>
              <th>Payable Amount</th>
              <th>Total Cost</th>
              <th>Completion Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.requiredWorkers}</td>
                <td>{task.payableAmount} coins</td>
                <td>{task.totalPayable} coins</td>
                <td>{new Date(task.completionDate).toLocaleDateString()}</td>
                <td>{task.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 10px', background: '#dc2626' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
