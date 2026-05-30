import React from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Reservations = () => {
  const reservations = [
    { id: 1, room: 'Deluxe Room 505', checkIn: '2026-01-15', checkOut: '2026-01-20', status: 'Confirmed', total: '$2,250' },
    { id: 2, room: 'Presidential Suite', checkIn: '2026-03-10', checkOut: '2026-03-15', status: 'Pending', total: '$50,000' },
    { id: 3, room: 'Royal Suite 728', checkIn: '2026-02-05', checkOut: '2026-02-08', status: 'Confirmed', total: '$7,500' }
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">My Reservations</h1>
      <div className="reservation-list">
        {reservations.map((res, index) => (
          <motion.div
            key={res.id}
            className="reservation-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="reservation-header">
              <h3>{res.room}</h3>
              <span className={`status status--${res.status.toLowerCase()}`}>{res.status}</span>
            </div>
            <div className="reservation-details">
              <div className="detail-row">
                <span className="detail-label">Check-in:</span>
                <span className="detail-value">{res.checkIn}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Check-out:</span>
                <span className="detail-value">{res.checkOut}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total:</span>
                <span className="detail-value detail-value--gold">{res.total}</span>
              </div>
            </div>
            <div className="reservation-actions">
              <button className="btn-action btn-action--view">View Details</button>
              <button className="btn-action btn-action--cancel">Cancel</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
