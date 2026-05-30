import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HotelConcierge from '../components/concierge/HotelConcierge';
import './DashboardLayout.css';

const DashboardLayout = ({ isAdmin = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const userMenuItems = [
    { path: '/dashboard', label: t('dashboard.overview'), icon: '📊' },
    { path: '/dashboard/reservations', label: t('dashboard.myReservations'), icon: '🏨' },
    { path: '/dashboard/billing', label: t('dashboard.billing'), icon: '💳' },
    { path: '/dashboard/service-requests', label: t('dashboard.serviceRequests'), icon: '🛎️' },
    { path: '/dashboard/profile', label: t('dashboard.profile'), icon: '👤' },
    { path: '/dashboard/history', label: t('dashboard.bookingHistory'), icon: '📜' }
  ];

  const adminMenuItems = [
    { path: '/admin/login', label: t('dashboard.adminLogin'), icon: '🔑' },
    { path: '/dashboard/admin', label: t('dashboard.overview'), icon: '🏛️' },
    { path: '/dashboard/admin/floors', label: t('dashboard.floorManagement'), icon: '🏢' },
    { path: '/dashboard/admin/rooms', label: t('dashboard.roomManagement'), icon: '🚪' },
    { path: '/dashboard/admin/pricing', label: t('dashboard.pricingAvailability'), icon: '💰' },
    { path: '/dashboard/admin/staff', label: t('dashboard.staffManagement'), icon: '👥' },
    { path: '/dashboard/admin/analytics', label: t('dashboard.analyticsReports'), icon: '📈' }
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-layout">
      {isMobile && isSidebarOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'dashboard-sidebar--open' : 'dashboard-sidebar--closed'}`}>
        <div className="dashboard-sidebar__header">
          <Link to="/" className="dashboard-sidebar__logo">
            <span className="dashboard-sidebar__logo-icon">♛</span>
            {isSidebarOpen && (
              <div className="dashboard-sidebar__logo-text">
                <h3>PLHMS</h3>
                <p>{isAdmin ? t('dashboard.adminPanel') : t('dashboard.guestPortal')}</p>
              </div>
            )}
          </Link>
          <button
            className="dashboard-sidebar__toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="dashboard-sidebar__nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`dashboard-sidebar__link ${location.pathname === item.path ? 'dashboard-sidebar__link--active' : ''}`}
            >
              <span className="dashboard-sidebar__link-icon">{item.icon}</span>
              {isSidebarOpen && <span className="dashboard-sidebar__link-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="dashboard-sidebar__footer">
          <button
            className="dashboard-sidebar__logout"
            onClick={handleLogout}
          >
            <span className="dashboard-sidebar__link-icon">🚪</span>
            {isSidebarOpen && <span>{t('dashboard.logout')}</span>}
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header__content">
            <div className="dashboard-header__left">
              <button
                className="dashboard-header__hamburger"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle navigation"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div className="dashboard-header__title">
                <h1>{isAdmin ? t('dashboard.adminDashboard') : t('dashboard.guestDashboard')}</h1>
                <p>{t('dashboard.welcomeBack')}</p>
              </div>
            </div>
            <div className="dashboard-header__actions">
              <button className="dashboard-header__notification">
                🔔
                <span className="dashboard-header__badge">3</span>
              </button>
              <Link to={isAdmin ? '/dashboard/admin' : '/dashboard/profile'} className="dashboard-header__profile">
                <div className="dashboard-header__avatar">
                  {isAdmin ? 'A' : 'G'}
                </div>
              </Link>
              <Link to="/admin/login" className="dashboard-header__admin-panel">
                {t('dashboard.adminPanel')}
              </Link>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
      <HotelConcierge />
    </div>
  );
};

export default DashboardLayout;
