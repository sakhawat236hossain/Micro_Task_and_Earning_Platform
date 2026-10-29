import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle } from '../firebase';
import { uploadToImgBB } from '../utils/upload';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'worker', photoURL: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setError('');
    try {
      const url = await uploadToImgBB(file);
      setForm((prev) => ({ ...prev, photoURL: url }));
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register(form.name, form.email, form.password, form.role, form.photoURL);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const googleUser = await loginWithGoogle();
      // Google Auth logins automatically, backend registers as worker if not existing
      await googleLogin(googleUser.name, googleUser.email, googleUser.photoURL);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        <p>Join as a worker or buyer.</p>
        {error && <div className="error-message">{error}</div>}
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Profile Photo
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploadingImage && <span style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '4px' }}>Uploading to imgBB...</span>}
          {form.photoURL && (
            <img src={form.photoURL} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', marginTop: '6px', objectFit: 'cover' }} />
          )}
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="worker">Worker</option>
            <option value="buyer">Buyer</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading || uploadingImage}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <button type="button" onClick={handleGoogleRegister} className="btn btn-secondary" style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading || uploadingImage}>
          <span>🌐</span> Register with Google
        </button>
        <p className="auth-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}
