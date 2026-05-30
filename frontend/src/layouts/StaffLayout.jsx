import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './StaffLayout.css';

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/staff/reception', label: 'Reception', icon: '🛎️' },
    { path: '/staff/bookings', label: 'Bookings', icon: '📅' },
    { path: '/staff/guests', label: 'Guests', icon: '👥' },
    { path: '/staff/rooms', label: 'Room Status', icon: '🚪' },
    { path: '/staff/requests', label: 'Requests', icon: '📋' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('staff_session');
    navigate('/staff/login');
  };

  return (
    <div className="staff-layout">
      <aside className={`staff-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="staff-sidebar__header">
          <Link to="/staff/dashboard" className="staff-sidebar__logo">
            <span className="staff-sidebar__logo-icon">♛</span>
            {isSidebarOpen && (
              <div className="staff-sidebar__logo-text">
                <h3>PLHMS</h3>
                <p>Staff Portal</p>
              </div>
            )}
          </Link>
          <button
            className="staff-sidebar__toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="staff-sidebar__nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`staff-sidebar__link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="staff-sidebar__link-icon">{item.icon}</span>
              {isSidebarOpen && <span className="staff-sidebar__link-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="staff-sidebar__footer">
          <button className="staff-sidebar__logout" onClick={handleLogout}>
            <span>🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="staff-main">
        <header className="staff-header">
          <div className="staff-header__content">
            <h1>Staff Portal</h1>
            <div className="staff-header__actions">
              <button className="staff-header__notification">
                🔔<span className="badge">3</span>
              </button>
            </div>
          </div>
        </header>

        <main className="staff-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
