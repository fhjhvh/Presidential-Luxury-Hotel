import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ServicePage.css';

const ServicesIndex = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const services = [
    { id: 'restaurant', route: '/restaurant', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', icon: '🍽️' },
    { id: 'market',     route: '/market',     image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800', icon: '🛒' },
    { id: 'spa',        route: '/services/spa',    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', icon: '💆' },
    { id: 'gym',        route: '/services/gym',    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', icon: '💪' },
    { id: 'pool',       route: '/services/pool',   image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', icon: '🏊' },
    { id: 'driver',     route: '/services/driver', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', icon: '🚗' },
    { id: 'butler',     route: '/services/butler', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', icon: '🎩' },
  ];

  return (
    <div className="services-index-page">
      <div className="services-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {t('servicesIndex.hero.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {t('servicesIndex.hero.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="services-grid-container">
        <div className="services-grid">
          {services.map((svc, index) => {
            const data = t(`servicesIndex.services.${svc.id}`, { returnObjects: true });
            return (
              <motion.div
                key={svc.id}
                className="service-card-large"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(svc.route)}
              >
                <div className="service-card-image">
                  <img src={svc.image} alt={data.name} loading="lazy" />
                  <div className="service-card-overlay">
                    <span className="service-icon">{svc.icon}</span>
                  </div>
                </div>
                <div className="service-card-body">
                  <h2>{data.name}</h2>
                  <p className="service-desc">{data.description}</p>
                  <ul className="service-features">
                    {(data.features || []).map(feature => (
                      <li key={feature}>✓ {feature}</li>
                    ))}
                  </ul>
                  <div className="service-footer">
                    <span className="service-price">{data.price}</span>
                    <button className="service-btn">{t('servicesIndex.explore')}</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesIndex;
