import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks/available`);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>Available Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks available at the moment.</p>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              {task.taskImageUrl && (
                <img src={task.taskImageUrl} alt={task.title} className="task-image" />
              )}
              <h3>{task.title}</h3>
              <p className="task-detail">{task.detail.substring(0, 100)}...</p>
              <div className="task-info">
                <p><strong>Buyer:</strong> {task.buyerName}</p>
                <p><strong>Reward:</strong> {task.payableAmount} coins</p>
                <p><strong>Workers Needed:</strong> {task.requiredWorkers}</p>
                <p><strong>Deadline:</strong> {new Date(task.completionDate).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => navigate(`/dashboard/task-details/${task._id}`)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
