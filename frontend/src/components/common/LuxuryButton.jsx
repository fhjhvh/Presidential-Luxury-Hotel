import React from 'react';
import { motion } from 'framer-motion';
import './LuxuryButton.css';

const LuxuryButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  return (
    <motion.button
      className={`luxury-btn luxury-btn--${variant} luxury-btn--${size} ${fullWidth ? 'luxury-btn--full' : ''} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="luxury-btn__content">{children}</span>
      <span className="luxury-btn__shine"></span>
    </motion.button>
  );
};

export default LuxuryButton;
