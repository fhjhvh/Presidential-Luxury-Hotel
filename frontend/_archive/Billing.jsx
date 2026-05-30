import React from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Billing = () => {
  const invoices = [
    { id: 'INV-2026-001', date: '2025-12-15', description: 'Deluxe Room Stay', amount: '$2,250', status: 'Paid' },
    { id: 'INV-2026-002', date: '2026-01-10', description: 'Spa Services', amount: '$850', status: 'Paid' },
    { id: 'INV-2026-003', date: '2026-01-20', description: 'Fine Dining', amount: '$420', status: 'Pending' }
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Billing & Invoices</h1>
      <div className="billing-summary">
        <div className="summary-card">
          <div className="summary-icon">💳</div>
          <div className="summary-content">
            <div className="summary-value">$3,520</div>
            <div className="summary-label">Total Spent</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-value">2</div>
            <div className="summary-label">Paid Invoices</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">⏳</div>
          <div className="summary-content">
            <div className="summary-value">1</div>
            <div className="summary-label">Pending</div>
          </div>
        </div>
      </div>
      <div className="invoice-list">
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            className="invoice-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="invoice-header">
              <div>
                <h3>{invoice.id}</h3>
                <p className="invoice-date">{invoice.date}</p>
              </div>
              <span className={`status status--${invoice.status.toLowerCase()}`}>{invoice.status}</span>
            </div>
            <p className="invoice-description">{invoice.description}</p>
            <div className="invoice-footer">
              <span className="invoice-amount">{invoice.amount}</span>
              <button className="btn-action btn-action--download">Download PDF</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
