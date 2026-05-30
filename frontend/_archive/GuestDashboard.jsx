import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './GuestDashboard.css';

const GuestDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: '🏨',
      title: t('guestDashboard.actions.bookRoom'),
      description: t('guestDashboard.actions.bookRoom'),
      link: '/booking'
    },
    {
      icon: '🍽️',
      title: t('guestDashboard.actions.diningReservation'),
      description: t('guestDashboard.actions.diningReservation'),
      link: '/restaurant'
    },
    {
      icon: '💆',
      title: t('guestDashboard.actions.spaBooking'),
      description: t('guestDashboard.actions.spaBooking'),
      link: '/services'
    },
    {
      icon: '🎯',
      title: t('guestDashboard.actions.premiumServices'),
      description: t('guestDashboard.actions.premiumServices'),
      link: '/premium-services'
    }
  ];

  const announcements = [
    {
      id: 1,
      type: 'special',
      title: t('guestDashboard.announcements.specialOffer.title'),
      description: t('guestDashboard.announcements.specialOffer.description')
    },
    {
      id: 2,
      type: 'event',
      title: t('guestDashboard.announcements.newRestaurant.title'),
      description: t('guestDashboard.announcements.newRestaurant.description')
    },
    {
      id: 3,
      type: 'info',
      title: t('guestDashboard.announcements.maintenance.title'),
      description: t('guestDashboard.announcements.maintenance.description')
    }
  ];

  const offers = [
    {
      id: 1,
      title: t('guestDashboard.offers.spaPackage.title'),
      discount: '30%',
      description: t('guestDashboard.offers.spaPackage.description'),
      validUntil: t('guestDashboard.offers.spaPackage.validUntil')
    },
    {
      id: 2,
      title: t('guestDashboard.offers.dining.title'),
      discount: '25%',
      description: t('guestDashboard.offers.dining.description'),
      validUntil: t('guestDashboard.offers.dining.validUntil')
    },
    {
      id: 3,
      title: t('guestDashboard.offers.suite.title'),
      discount: '20%',
      description: t('guestDashboard.offers.suite.description'),
      validUntil: t('guestDashboard.offers.suite.validUntil')
    }
  ];

  return (
    <div className="guest-dashboard">
      <motion.div
        className="guest-dashboard__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="guest-dashboard__welcome">
          <h1>{user?.name ? t('guestDashboard.welcome', { name: user.name }) : t('guestDashboard.welcomeGuest')}</h1>
          <p className="guest-dashboard__subtitle">
            {user?.type === 'first-time' ? (
              <span className="discount-badge">{t('guestDashboard.firstTimeDiscount')}</span>
            ) : (
              <span className="discount-badge">{t('guestDashboard.loyaltyDiscount')}</span>
            )}
          </p>
        </div>
        <div className="guest-dashboard__profile-preview">
          <div className="profile-icon">👤</div>
          <div className="profile-info">
            <p className="profile-email">{user?.email}</p>
            <Link to="/dashboard/profile" className="profile-link">{t('guestDashboard.viewProfile')} →</Link>
          </div>
        </div>
      </motion.div>

      <div className="guest-dashboard__grid">
        <motion.section
          className="dashboard-section features-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="section-title">{t('guestDashboard.quickAccess')}</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                to={feature.link}
                className="feature-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Link>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="dashboard-section announcements-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="section-title">{t('guestDashboard.latestAnnouncements')}</h2>
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`announcement-card ${announcement.type}`}>
                <div className="announcement-header">
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <span className="announcement-date">{announcement.date}</span>
                </div>
                <p className="announcement-description">{announcement.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="dashboard-section offers-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="section-title">{t('guestDashboard.exclusiveOffers')}</h2>
          <div className="offers-grid">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-discount">{offer.discount} OFF</div>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-description">{offer.description}</p>
                <p className="offer-valid">{t('profile.offers.validUntil')} {offer.validUntil}</p>
                <button className="offer-button">{t('guestDashboard.claimOffer')}</button>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default GuestDashboard;
