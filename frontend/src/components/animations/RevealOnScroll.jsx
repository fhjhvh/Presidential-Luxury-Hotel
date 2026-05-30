import React from 'react';
import { motion } from 'framer-motion';

const RevealOnScroll = ({ 
  children, 
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 50,
  className = '',
  threshold = 0.1
}) => {
  const directions = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 }
  };

  const initialOffset = directions[direction] || directions.up;

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        x: initialOffset.x,
        y: initialOffset.y
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
