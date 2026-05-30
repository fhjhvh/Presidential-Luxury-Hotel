import React from 'react';
import { motion } from 'framer-motion';
import './GuestJourneyTimeline.css';

const GuestJourneyTimeline = () => {
  const stages = [
    { id: 1, phase: 'Arrival', icon: '✈', status: 'completed', desc: 'Welcome to presidential luxury' },
    { id: 2, phase: 'Stay', icon: '🏛', status: 'active', desc: 'Your current experience' },
    { id: 3, phase: 'Services', icon: '💎', status: 'active', desc: 'Curated for your comfort' },
    { id: 4, phase: 'Departure', icon: '🎯', status: 'upcoming', desc: 'Until we meet again' }
  ];

  return (
    <div className="journey-timeline">
      <div className="journey-timeline__header">
        <h3>Your Journey</h3>
        <p>Experience crafted for distinction</p>
      </div>
      
      <div className="journey-timeline__stages">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className={`journey-stage journey-stage--${stage.status}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="journey-stage__icon">{stage.icon}</div>
            <div className="journey-stage__content">
              <h4>{stage.phase}</h4>
              <p>{stage.desc}</p>
            </div>
            {index < stages.length - 1 && (
              <div className="journey-stage__connector"></div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GuestJourneyTimeline;
