import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const coinPackages = [
  { id: 1, coins: 10, price: 1 },
  { id: 2, coins: 150, price: 10 },
  { id: 3, coins: 500, price: 20 },
  { id: 4, coins: 1000, price: 35 },
];

export default function PurchaseCoins() {
  const { user, updateCoins } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Add coins to user
      const newCoins = user.coins + selectedPackage.coins;
      updateCoins(newCoins);
      setSuccess(`Successfully purchased ${selectedPackage.coins} coins for $${selectedPackage.price}!`);
      setShowPayment(false);
      setSelectedPackage(null);
      setLoading(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }, 2000);
  };

  return (
    <div className="dashboard-section">
      <h2>Purchase Coins</h2>
      <p>Get more coins to create tasks and complete work.</p>

      {success && <div className="success-message">{success}</div>}

      <div className="coin-packages">
        {coinPackages.map((pkg) => (
          <div key={pkg.id} className="coin-package-card">
            <div className="coins-amount">{pkg.coins}</div>
            <div className="coins-label">coins</div>
            <div className="price">${pkg.price}</div>
            <button
              onClick={() => handleSelectPackage(pkg)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {showPayment && selectedPackage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Purchase</h3>
            <p>You are about to purchase:</p>
            <div className="payment-details">
              <p>
                <strong>Coins:</strong> {selectedPackage.coins}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedPackage.price}
              </p>
            </div>

            <label>
              Payment Method
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">Credit/Debit Card</option>
                <option value="dummy">Dummy Payment (for testing)</option>
              </select>
            </label>

            {paymentMethod === 'card' && (
              <div className="payment-form">
                <label>
                  Card Number
                  <input type="text" placeholder="1234 5678 9012 3456" disabled value="4242 4242 4242 4242" />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label>
                    Expiry Date
                    <input type="text" placeholder="MM/YY" disabled value="12/26" />
                  </label>
                  <label>
                    CVC
                    <input type="text" placeholder="123" disabled value="123" />
                  </label>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={handlePayment} className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Complete Purchase'}
              </button>
              <button onClick={() => setShowPayment(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="purchase-info">
        <h3>How it works</h3>
        <ul>
          <li>Select a coin package</li>
          <li>Complete payment</li>
          <li>Coins are instantly added to your account</li>
          <li>Use coins to create tasks or withdraw earnings</li>
        </ul>
      </div>
    </div>
  );
}
