import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = ({ fullScreen = false, size = 'medium' }) => {
  const containerClass = fullScreen ? 'loader-container loader-container--fullscreen' : 'loader-container';
  
  return (
    <div className={containerClass}>
      <div className={`loader loader--${size}`}>
        <motion.div
          className="loader__ring"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className="loader__ring loader__ring--inner"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <div className="loader__logo">
          <motion.div
            className="loader__crown"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            ♛
          </motion.div>
        </div>
      </div>
      {fullScreen && (
        <motion.p
          className="loader__text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          Loading Presidential Experience...
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
