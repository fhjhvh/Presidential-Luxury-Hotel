import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LuxuryButton from '../../components/common/LuxuryButton';
import './Dashboard.css';

const ServiceRequests = () => {
  const [requests] = useState([
    { id: 1, service: 'Room Service', request: 'Breakfast delivery at 8 AM', status: 'Completed', date: '2026-01-15' },
    { id: 2, service: 'Housekeeping', request: 'Extra towels and pillows', status: 'In Progress', date: '2026-01-16' },
    { id: 3, service: 'Concierge', request: 'Restaurant reservation', status: 'Pending', date: '2026-01-16' }
  ]);

  const services = [
    { icon: '🛎️', name: 'Room Service', desc: 'Food & beverage delivery' },
    { icon: '🧹', name: 'Housekeeping', desc: 'Cleaning & maintenance' },
    { icon: '💆', name: 'Spa Booking', desc: 'Wellness treatments' },
    { icon: '🍽️', name: 'Restaurant', desc: 'Table reservations' },
    { icon: '🚗', name: 'Transportation', desc: 'Car & driver service' },
    { icon: '🎯', name: 'Concierge', desc: 'General assistance' }
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Service Requests</h1>
      
      <div className="service-request-section">
        <h2 className="section-subtitle">Request a Service</h2>
        <div className="service-quick-actions">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-quick-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="service-icon-large">{service.icon}</div>
              <h4>{service.name}</h4>
              <p>{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="service-request-section">
        <h2 className="section-subtitle">My Requests</h2>
        <div className="request-list">
          {requests.map((req, index) => (
            <motion.div
              key={req.id}
              className="request-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="request-header">
                <div>
                  <h3>{req.service}</h3>
                  <p className="request-date">{req.date}</p>
                </div>
                <span className={`status status--${req.status.toLowerCase().replace(' ', '-')}`}>{req.status}</span>
              </div>
              <p className="request-description">{req.request}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequests;
