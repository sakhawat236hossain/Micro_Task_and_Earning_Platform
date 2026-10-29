import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function MyPayments() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_URL}/payments/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  if (loading) {
    return <div className="dashboard-section">Loading...</div>;
  }

  return (
    <div className="dashboard-section">
      <h2>Payment History</h2>
      <p>Log of your purchased coin packages.</p>

      {payments.length === 0 ? (
        <p>You haven't purchased any coin packages yet.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Purchase Date</th>
              <th>Coins Added</th>
              <th>Amount Paid</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{new Date(payment.purchaseDate).toLocaleString()}</td>
                <td style={{ color: '#f59e0b', fontWeight: 'bold' }}>💰 {payment.coins} coins</td>
                <td style={{ color: '#166534', fontWeight: 'bold' }}>${payment.amount.toFixed(2)}</td>
                <td>{payment.paymentMethod.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
