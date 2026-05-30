import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LuxuryButton from '../../components/common/LuxuryButton';
import './Auth.css';

const AdminLogin = () => {
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Save admin session to localStorage
    localStorage.setItem('admin_session', JSON.stringify({
      adminName: adminName,
      loginTime: new Date().toISOString()
    }));

    // Navigate to admin dashboard
    navigate('/admin/dashboard');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">🔑</div>
        <h1>Admin Login</h1>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Admin Name" 
              value={adminName} 
              onChange={(e) => setAdminName(e.target.value)} 
              required 
            />
          </div>
          <LuxuryButton 
            variant="primary" 
            size="large" 
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </LuxuryButton>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
