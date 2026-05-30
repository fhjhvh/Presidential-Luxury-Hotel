import React from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const History = () => {
  const history = [
    { id: 1, type: 'Room Booking', room: 'Presidential Suite', date: '2025-11-10 - 2025-11-15', status: 'Completed', amount: '$50,000' },
    { id: 2, type: 'Spa Service', service: 'Royal Treatment Package', date: '2025-10-20', status: 'Completed', amount: '$1,200' },
    { id: 3, type: 'Restaurant', service: 'Private Dining Experience', date: '2025-09-15', status: 'Completed', amount: '$850' },
    { id: 4, type: 'Room Booking', room: 'Deluxe Room 505', date: '2025-08-05 - 2025-08-10', status: 'Completed', amount: '$2,250' },
    { id: 5, type: 'Event', service: 'Conference Room Rental', date: '2025-07-22', status: 'Completed', amount: '$3,500' }
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Booking History</h1>
      
      <div className="history-stats">
        <div className="history-stat">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">5</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>
        <div className="history-stat">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">$57,800</div>
            <div className="stat-label">Lifetime Value</div>
          </div>
        </div>
        <div className="history-stat">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">VIP</div>
            <div className="stat-label">Status Level</div>
          </div>
        </div>
      </div>

      <div className="history-timeline">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            className="history-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="history-marker"></div>
            <div className="history-card">
              <div className="history-header">
                <div>
                  <h3>{item.room || item.service}</h3>
                  <span className="history-type">{item.type}</span>
                </div>
                <span className="history-amount">{item.amount}</span>
              </div>
              <p className="history-date">{item.date}</p>
              <span className={`status status--${item.status.toLowerCase()}`}>{item.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;
