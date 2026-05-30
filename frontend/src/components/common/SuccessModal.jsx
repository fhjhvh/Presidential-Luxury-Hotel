import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, title, message, icon = '✓' }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="success-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="success-modal"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <motion.div
              className="success-modal__icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 200 }}
            >
              {icon}
            </motion.div>
            <h2 className="success-modal__title">{title}</h2>
            <p className="success-modal__message">{message}</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
