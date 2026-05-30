import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import LuxuryButton from '../../components/common/LuxuryButton';
import SuccessModal from '../../components/common/SuccessModal';
import './Auth.css';

const StaffDepartmentLogin = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { department } = useParams();
  
  const [formData, setFormData] = useState({
    staffId: '',
    pin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const departmentInfo = {
    cleaning: {
      title: 'Cleaning Staff Login',
      icon: '🧹',
      department: 'Housekeeping',
      color: '#4A9EFF'
    },
    maintenance: {
      title: 'Maintenance Staff Login',
      icon: '🔧',
      department: 'Technical Services',
      color: '#FF6B35'
    },
    kitchen: {
      title: 'Kitchen Staff Login',
      icon: '👨‍🍳',
      department: 'Culinary',
      color: '#FFB800'
    },
    club: {
      title: 'Club Staff Login',
      icon: '🏋️',
      department: 'Recreation',
      color: '#00C853'
    },
    security: {
      title: 'Security Staff Login',
      icon: '🛡️',
      department: 'Security',
      color: '#D32F2F'
    },
    nurse: {
      title: 'Medical Nurse Login',
      icon: '⚕️',
      department: 'Medical',
      color: '#7B1FA2'
    }
  };

  const currentDept = departmentInfo[department] || departmentInfo.cleaning;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.staffId.trim() || !formData.pin.trim()) {
      setError(t('auth.invalidCredentials'));
      return;
    }

    if (formData.pin.length < 4) {
      setError(t('auth.invalidPin'));
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = {
        id: formData.staffId,
        staffId: formData.staffId,
        role: 'staff',
        department: currentDept.department,
        departmentType: department,
        name: `Staff ${formData.staffId}`,
        privileges: ['service-requests', 'schedule', 'tasks', 'reports']
      };
      
      login(userData);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate(`/dashboard/staff/${department}`);
      }, 2200);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t('auth.success.loginTitle')}
        message={t('auth.success.staffWelcome', { department: t(`auth.staffRoles.roles.${department}.department`) })}
        icon="✓"
      />
      
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-logo" style={{ fontSize: '4rem' }}>{currentDept.icon}</div>
        <h1>{currentDept.title}</h1>
        <p style={{ color: currentDept.color, fontWeight: '600' }}>{currentDept.department}</p>

        {error && (
          <motion.div 
            className="auth-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ 
              color: '#ff6b6b', 
              background: 'rgba(255, 107, 107, 0.1)',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid rgba(255, 107, 107, 0.3)'
            }}
          >
            {error}
          </motion.div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="staffId"
              placeholder={t('auth.staffId')}
              value={formData.staffId}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="pin"
              placeholder={t('auth.pin')}
              value={formData.pin}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <LuxuryButton type="submit" variant="primary" size="large" fullWidth disabled={loading}>
            {loading ? '...' : t('auth.signIn')}
          </LuxuryButton>
        </form>
        
        <p className="auth-link" style={{ marginTop: '1.5rem' }}>
          <Link to="/auth/staff/role-selection">← {t('auth.backToDepartment')}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StaffDepartmentLogin;
