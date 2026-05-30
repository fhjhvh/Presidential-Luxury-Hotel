import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import './Services.css';

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Authentication enforcement - redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/access', { 
        state: {
          redirectMessage: t('booking.loginRequired'),
          from: '/services'
        } 
      });
    }
  }, [user, navigate]);

  const services = [
    { icon: '🍽️', nameKey: 'services.items.dining.name', descKey: 'services.items.dining.desc', link: '/restaurant' },
    { icon: '💆', nameKey: 'services.items.spa.name', descKey: 'services.items.spa.desc', link: '/services/spa' },
    { icon: '🏋️', nameKey: 'services.items.gym.name', descKey: 'services.items.gym.desc', link: '/services/gym' },
    { icon: '🏊', nameKey: 'services.items.pool.name', descKey: 'services.items.pool.desc', link: '/services/pool' },
    { icon: '🚗', nameKey: 'services.items.chauffeur.name', descKey: 'services.items.chauffeur.desc', link: '/services/chauffeur' },
    { icon: '🛎️', nameKey: 'services.items.concierge.name', descKey: 'services.items.concierge.desc', link: '/services/concierge' },
    { icon: '🛒', nameKey: 'services.items.store.name', descKey: 'services.items.store.desc', link: '/market' }
  ];

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>{t('services.hero.title')}</h1>
            <p>{t('services.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>
      <section className="section container">
        <div className="services-grid">
          {services.map((service, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <Link to={service.link}>
                <motion.div className="service-item" whileHover={{ scale: 1.05 }}>
                  <div className="service-icon">{service.icon}</div>
                  <h3>{t(service.nameKey)}</h3>
                  <p>{t(service.descKey)}</p>
                  <div className="service-arrow">→</div>
                </motion.div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
