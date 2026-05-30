import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloorControl from './sections/FloorControl';
import RoomControl from './sections/RoomControl';
import SuiteControl from './sections/SuiteControl';
import ParkingControl from './sections/ParkingControl';
import RestaurantControl from './sections/RestaurantControl';
import FeatureControl from './sections/FeatureControl';
import './HotelControlSystem.css';

const HotelControlSystem = () => {
  const [activeSection, setActiveSection] = useState('floors');
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFloors();
  }, []);

  const loadFloors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/floors');
      if (!response.ok) {
        throw new Error('Failed to fetch floors');
      }
      const data = await response.json();
      setFloors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load floors:', error);
      setError(error.message);
      setFloors([]);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'floors', label: 'Floor Management', icon: '🏢', component: FloorControl },
    { id: 'rooms', label: 'Room Control', icon: '🚪', component: RoomControl },
    { id: 'suites', label: 'Suite Control', icon: '👑', component: SuiteControl },
    { id: 'parking', label: 'Parking Management', icon: '🚗', component: ParkingControl },
    { id: 'restaurant', label: 'Restaurant System', icon: '🍽️', component: RestaurantControl },
    { id: 'features', label: 'Feature Control', icon: '⭐', component: FeatureControl },
  ];

  const activeComponent = sections.find(s => s.id === activeSection)?.component;

  if (loading) {
    return (
      <div className="hotel-control-system">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a1628',
          color: '#d4af37',
          fontSize: '1.2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
            <div>Loading Hotel Control System...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-control-system">
      <aside className="control-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏨</span>
            <div className="logo-text">
              <h2>Hotel Control</h2>
              <p>Management System</p>
            </div>
          </div>
        </div>

        <nav className="control-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
              {activeSection === section.id && (
                <motion.div
                  className="nav-indicator"
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" className="back-home-btn">
            <span>🏠</span>
            <span>Back to Website</span>
          </a>
        </div>
      </aside>

      <main className="control-main">
        <div className="control-header">
          <div className="header-info">
            <h1>{sections.find(s => s.id === activeSection)?.label}</h1>
            <p>Manage and control all hotel operations</p>
          </div>
        </div>

        <div className="control-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeComponent && React.createElement(activeComponent, {
                floors,
                selectedFloor,
                setSelectedFloor,
                onFloorsUpdate: loadFloors
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default HotelControlSystem;
