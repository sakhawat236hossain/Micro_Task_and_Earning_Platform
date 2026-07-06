import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ManageUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRoleId(userId);
    try {
      const response = await axios.put(
        `${API_URL}/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.map((u) => (u._id === userId ? response.data.user : u)));
      alert('User role updated!');
    } catch (error) {
      alert('Failed to update user role');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(users.filter((u) => u._id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>Manage Users</h2>
      <p>Total Users: {users.length}</p>

      <table className="submissions-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Coins</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  disabled={updatingRoleId === user._id}
                  style={{ padding: '6px 8px', borderRadius: '4px' }}
                >
                  <option value="worker">Worker</option>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{user.coins}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user._id)}
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
