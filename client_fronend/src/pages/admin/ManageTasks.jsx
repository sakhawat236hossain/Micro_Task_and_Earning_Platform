import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ManageTasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/admin/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(tasks.filter((t) => t._id !== taskId));
        alert('Task deleted and coins refunded to buyer!');
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
      <h2>Manage Tasks</h2>
      <p>Total Tasks: {tasks.length}</p>

      <table className="submissions-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Buyer</th>
            <th>Workers Needed</th>
            <th>Payable/Worker</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.buyerName}</td>
              <td>{task.requiredWorkers}</td>
              <td>{task.payableAmount} coins</td>
              <td>{task.totalPayable} coins</td>
              <td>{task.status}</td>
              <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '6px 10px',
                    background: '#dc2626',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
