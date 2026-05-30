import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const ADMIN_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const session = localStorage.getItem('admin_session');
    if (token && session) {
      // Already logged in, redirect to dashboard
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate against the real backend — this is the ONLY valid path.
      // The dashboard requires a real JWT and rejects any local/offline token,
      // so there is no usable "local fallback"; attempting one only produced
      // an infinite login → dashboard → login loop. We now surface the real
      // failure instead.
      const response = await fetch(`${ADMIN_API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid password. Please try again.');
        } else if (data.error === 'Admin account not configured') {
          setError('Admin account not set up yet. Start the backend once so it initializes, then try again.');
        } else {
          setError(data.error || 'Login failed. Please try again.');
        }
        return;
      }

      if (!data.token) {
        setError('Login failed — the server did not return a session token.');
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_session', JSON.stringify({
        adminId: data.admin?.id,
        username: data.admin?.username || 'Administrator',
        loginTime: new Date().toISOString()
      }));

      navigate('/admin/dashboard');
    } catch (err) {
      // fetch threw → backend not reachable at all (server down or DB down).
      // Do NOT create a fake local session (that caused the login loop).
      console.error('Admin login: backend unreachable:', err.message);
      setError('Cannot reach the server. Make sure the backend is running on port 5000 and the MySQL database is started, then try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowHint(true);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-login-icon">🔐</div>
          <h1>Admin Access</h1>
          <p>Hotel Management System</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <button 
            type="button" 
            className="forgot-password-btn"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
        </div>

        {showHint && (
          <div className="password-hint-modal" onClick={() => setShowHint(false)}>
            <div className="password-hint-content" onClick={(e) => e.stopPropagation()}>
              <h3>🔑 Password Hint</h3>
              <p className="hint-text">Founder's Name + Birth Year</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Try: Ammar2001
              </p>
              <button onClick={() => setShowHint(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
