import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import RoyalLogo from './RoyalLogo';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean navbar - NO Market here (Market is inside Services)
  const baseMenuItems = [
    { path: '/', label: t('nav.home'), icon: '🏠' },
    { path: '/floors', label: t('nav.floors'), icon: '🏢' },
    { path: '/rooms', label: t('nav.rooms'), icon: '🛏️' },
    { path: '/suites', label: t('nav.suites'), icon: '🛌' },
    { path: '/services', label: t('nav.services'), icon: '🛎️' },
    { path: '/luxury-vip', label: 'VIP Services', icon: '💎' },
    { path: '/booking', label: t('nav.bookNow'), icon: '📅' }
  ];

  const getDashboardPath = () => {
    if (!user) return '/dashboard/profile';
    
    switch(user.role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'STAFF_RECEPTION':
        return '/dashboard/reception';
      case 'GUEST':
        return '/dashboard/guest';
      default:
        return '/dashboard/profile';
    }
  };

  // Don't add profile to menu items - profile is in dropdown
  const menuItems = baseMenuItems;

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="navbar__container container">
        <div className="navbar__brand">
          <Link to="/" className="navbar__logo">
            <RoyalLogo size="md" layout="horizontal" />
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="navbar__links">
          {menuItems.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  className="navbar__link-underline"
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="navbar__actions">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="navbar__profile-wrapper" ref={dropdownRef}>
              <button 
                className="navbar__profile-btn"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <span className="navbar__profile-avatar">👤</span>
                <span className="navbar__profile-name">{user.name || user.email?.split('@')[0]}</span>
                <span className="navbar__profile-arrow">{showProfileDropdown ? '▲' : '▼'}</span>
              </button>
              
              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div 
                    className="navbar__profile-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="navbar__profile-header">
                      <div className="navbar__profile-info">
                        <span className="navbar__profile-fullname">{user.name || t('nav.guest')}</span>
                        <span className="navbar__profile-email">{user.email}</span>
                        <span className="navbar__profile-role">{user.role === 'GUEST' ? t('nav.guestRole') : user.role}</span>
                      </div>
                    </div>
                    <div className="navbar__profile-menu">
                      <Link 
                        to="/profile" 
                        className="navbar__profile-item"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <span>👤</span> {t('nav.myProfile')}
                      </Link>
                      <Link 
                        to="/my-bookings" 
                        className="navbar__profile-item"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <span>📋</span> {t('nav.myBookings')}
                      </Link>
                      <Link 
                        to="/my-orders" 
                        className="navbar__profile-item"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <span>🛒</span> {t('nav.myOrders')}
                      </Link>
                      <Link 
                        to="/market" 
                        className="navbar__profile-item"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <span>🏪</span> {t('nav.hotelStore')}
                      </Link>
                    </div>
                    <div className="navbar__profile-footer">
                      <button className="navbar__logout-btn" onClick={handleLogout}>
                        🚪 {t('nav.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="navbar__signin-btn">
              {t('nav.signIn')}
            </Link>
          )}
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`navbar__mobile-icon ${isMobileMenuOpen ? 'navbar__mobile-icon--open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="navbar__mobile-panel">
              <div className="navbar__mobile-top">
                <div className="navbar__mobile-title">Presidential Navigation</div>
                <div className="navbar__mobile-subtitle">Elevated routes for an exclusive guest experience</div>
              </div>
              <div className="navbar__mobile-links">
                {menuItems.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-icon">{link.icon}</span>
                    <span className="navbar__mobile-link-text">{link.label}</span>
                  </Link>
                ))}
              </div>
              {isAuthenticated && user ? (
                <div className="navbar__mobile-profile-section">
                  <div className="navbar__mobile-profile-card">
                    <div className="navbar__mobile-profile-avatar">👤</div>
                    <div className="navbar__mobile-profile-details">
                      <span className="navbar__mobile-profile-name">{user.name || user.firstName || user.email?.split('@')[0]}</span>
                      <span className="navbar__mobile-profile-label">Member access</span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="navbar__mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-icon">👤</span>
                    <span className="navbar__mobile-link-text">{t('nav.myProfile')}</span>
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="navbar__mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-icon">📋</span>
                    <span className="navbar__mobile-link-text">{t('nav.myBookings')}</span>
                  </Link>
                  <Link
                    to="/my-orders"
                    className="navbar__mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-icon">🛒</span>
                    <span className="navbar__mobile-link-text">{t('nav.myOrders')}</span>
                  </Link>
                  <Link
                    to="/market"
                    className="navbar__mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-icon">🛍️</span>
                    <span className="navbar__mobile-link-text">{t('nav.hotelStore')}</span>
                  </Link>
                  <button
                    className="navbar__mobile-logout"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    🚪 {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="navbar__mobile-signin" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('nav.signIn')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
