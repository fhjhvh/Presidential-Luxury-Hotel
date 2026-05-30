import React from 'react';
import { motion } from 'framer-motion';
import './StoryNarrative.css';

const StoryNarrative = ({ text, align = 'center' }) => {
  return (
    <motion.div
      className={`story-narrative story-narrative--${align}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="story-narrative__line"></div>
      <p className="story-narrative__text">{text}</p>
      <div className="story-narrative__line"></div>
    </motion.div>
  );
};

export default StoryNarrative;
