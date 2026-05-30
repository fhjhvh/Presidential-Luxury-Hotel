import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './BackButton.css';

const BackButton = ({ to = null, label = null, className = '' }) => {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('common.back');
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      className={`back-button ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="back-button__arrow">←</span>
      <span className="back-button__label">{resolvedLabel}</span>
    </motion.button>
  );
};

export default BackButton;
