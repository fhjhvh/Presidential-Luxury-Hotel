import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HotelControlEntry.css';

const HotelControlEntry = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/hotel-control/dashboard');
  };

  return (
    <div className="hotel-control-entry">
      <motion.div
        className="entry-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="entry-icon">
          <span>🏨</span>
        </div>
        <h1 className="entry-title">Hotel Control System</h1>
        <p className="entry-subtitle">Centralized Management Dashboard</p>
        
        <motion.button
          className="entry-button"
          onClick={handleEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="button-icon">🎯</span>
          <span className="button-text">Enter Control Panel</span>
        </motion.button>

        <div className="entry-features">
          <div className="feature-item">
            <span className="feature-icon">🏢</span>
            <span className="feature-label">Floor Management</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚪</span>
            <span className="feature-label">Room Control</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🍽️</span>
            <span className="feature-label">Restaurant System</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚗</span>
            <span className="feature-label">Parking Management</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HotelControlEntry;
