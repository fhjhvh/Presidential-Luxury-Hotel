import React from 'react';
import { motion } from 'framer-motion';
import GuestJourneyTimeline from '../../components/dashboard/GuestJourneyTimeline';
import './Dashboard.css';

const UserDashboard = () => {
  const stats = [
    { icon: '🏨', label: 'Active Reservations', value: '2' },
    { icon: '💳', label: 'Total Spent', value: '$4,500' },
    { icon: '⭐', label: 'Loyalty Points', value: '1,250' },
    { icon: '📅', label: 'Upcoming Stays', value: '1' }
  ];

  const reservations = [
    { id: 1, room: 'Deluxe Room', checkIn: '2026-01-15', checkOut: '2026-01-20', status: 'Confirmed' },
    { id: 2, room: 'Presidential Suite', checkIn: '2026-03-10', checkOut: '2026-03-15', status: 'Pending' }
  ];

  return (
    <div className="dashboard">
      <GuestJourneyTimeline />
      <div className="dashboard-stats">
        {stats.map((stat, i) => (
          <motion.div key={i} className="stat-card" whileHover={{ scale: 1.02 }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="dashboard-section">
        <h2>My Reservations</h2>
        <div className="reservation-list">
          {reservations.map(res => (
            <div key={res.id} className="reservation-card">
              <h3>{res.room}</h3>
              <p>Check-in: {res.checkIn}</p>
              <p>Check-out: {res.checkOut}</p>
              <span className={`status status--${res.status.toLowerCase()}`}>{res.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
