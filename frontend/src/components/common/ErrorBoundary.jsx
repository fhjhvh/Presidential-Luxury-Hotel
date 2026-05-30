import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LuxuryButton from './LuxuryButton';
import './ErrorBoundary.css';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="error-boundary">
      <div className="error-content">
        <motion.div
          className="error-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          👑
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Apologies, Your Excellency
        </motion.h1>
        
        <motion.p
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          We encountered an unexpected situation while serving you.
          <br />
          Our team has been notified and is addressing this matter with utmost priority.
        </motion.p>

        <motion.div
          className="error-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {error?.status && (
            <p className="error-code">Error Code: {error.status}</p>
          )}
        </motion.div>

        <motion.div
          className="error-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link to="/">
            <LuxuryButton variant="primary" size="large">Return to Palace Entrance</LuxuryButton>
          </Link>
          <Link to="/services">
            <LuxuryButton variant="secondary" size="large">Contact Concierge</LuxuryButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
