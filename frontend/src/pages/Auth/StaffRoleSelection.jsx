import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './StaffRoleSelection.css';

const StaffRoleSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const staffRoles = [
    {
      id: 'cleaning',
      icon: '🧹',
      title: 'Cleaning Staff',
      titleAr: 'طاقم التنظيف',
      titleTr: 'Temizlik Personeli',
      department: 'Housekeeping',
      path: '/auth/staff/cleaning'
    },
    {
      id: 'maintenance',
      icon: '🔧',
      title: 'Maintenance Staff',
      titleAr: 'طاقم الصيانة',
      titleTr: 'Bakım Personeli',
      department: 'Technical Services',
      path: '/auth/staff/maintenance'
    },
    {
      id: 'kitchen',
      icon: '👨‍🍳',
      title: 'Kitchen Staff',
      titleAr: 'طاقم المطبخ',
      titleTr: 'Mutfak Personeli',
      department: 'Culinary',
      path: '/auth/staff/kitchen'
    },
    {
      id: 'club',
      icon: '🏋️',
      title: 'Club Staff',
      titleAr: 'طاقم النادي',
      titleTr: 'Kulüp Personeli',
      department: 'Recreation',
      path: '/auth/staff/club'
    },
    {
      id: 'security',
      icon: '🛡️',
      title: 'Security Staff',
      titleAr: 'طاقم الأمن',
      titleTr: 'Güvenlik Personeli',
      department: 'Security',
      path: '/auth/staff/security'
    },
    {
      id: 'nurse',
      icon: '⚕️',
      title: 'Medical Nurse',
      titleAr: 'الممرضة الطبية',
      titleTr: 'Tıbbi Hemşire',
      department: 'Medical',
      path: '/auth/staff/nurse'
    }
  ];

  return (
    <div className="staff-role-selection">
      <div className="staff-role-selection__bg" />
      <div className="staff-role-selection__container">
        <motion.div
          className="staff-role-selection__header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="staff-role-selection__mark">♛</div>
          <h1 className="staff-role-selection__title">Select Your Department</h1>
          <p className="staff-role-selection__subtitle">Choose your role to access your work dashboard</p>
        </motion.div>

        <div className="staff-role-selection__grid">
          {staffRoles.map((role, idx) => (
            <motion.button
              key={role.id}
              type="button"
              className="staff-role-card"
              onClick={() => navigate(role.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="staff-role-card__icon">{role.icon}</div>
              <h3 className="staff-role-card__title">{role.title}</h3>
              <p className="staff-role-card__department">{role.department}</p>
              <div className="staff-role-card__arrow">→</div>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="staff-role-selection__back"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/login" className="staff-role-selection__back-link">
            ← {t('auth.backToSelection')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffRoleSelection;
