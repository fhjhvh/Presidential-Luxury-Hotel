import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import BackButton from '../../components/common/BackButton';
import './Floor.css';

const SERVICE_ICONS = ['', '', '', ''];
const ZONE_ICONS    = ['', '', '', '', '', ''];
const STAT_ICONS    = ['🧺', '📦', '🚗', '👥'];
const STAT_NUMS     = ['500+', '80', '80', '50+'];

const FloorB1 = () => {
  const { t } = useTranslation();
  const areas    = t('floorPages.b1.areas',    { returnObjects: true });
  const zones    = t('floorPages.b1.zones',    { returnObjects: true });
  const features = t('floorPages.b1.features', { returnObjects: true });
  const stats    = t('floorPages.b1.stats',    { returnObjects: true });

  return (
    <div className="floor-page" style={{ '--flr-hero-img': 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&auto=format&fit=crop&q=80)' }}>
      <BackButton />
      <section className="floor-hero">
        <div className="floor-hero__overlay"></div>
        <div className="container">
          <motion.div className="floor-hero__content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="floor-hero__badge">{t('floorPages.b1.heroBadge')}</div>
            <h1 className="floor-hero__title">{t('floorPages.b1.heroTitle')}</h1>
            <p className="floor-hero__description">{t('floorPages.b1.heroDesc')}</p>
          </motion.div>
        </div>
      </section>

      <section className="floor-content section">
        <div className="container">
          <RevealOnScroll>
            <div className="floor-overview">
              <h2 className="section-title">{t('floorPages.b1.overviewTitle')}</h2>
              <div className="floor-stats">
                {STAT_ICONS.map((icon, i) => (
                  <div key={i} className="floor-stat-card">
                    <div className="floor-stat-icon">{icon}</div>
                    <div className="floor-stat-number">{STAT_NUMS[i]}</div>
                    <div className="floor-stat-label">{Array.isArray(stats) ? stats[i] : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.b1.areasTitle')}</h3>
              <div className="service-grid">
                {Array.isArray(areas) && areas.map((service, index) => (
                  <motion.div key={index} className="service-card" whileHover={{ scale: 1.03, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div className="service-card__icon">{SERVICE_ICONS[index]}</div>
                    <h4 className="service-card__title">{service.name}</h4>
                    <div className="service-card__description">
                      <p>{t('floors.typeLabel')}: <strong>{service.status}</strong></p>
                      <p>{t('floors.capacityLabel')}: <strong>{service.capacity}</strong></p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.b1.mapTitle')}</h3>
              <div className="floor-map">
                <div className="floor-map__title">{t('floorPages.b1.mapSubtitle')}</div>
                <div className="floor-map__grid">
                  {Array.isArray(zones) && zones.map((zone, index) => (
                    <motion.div key={index} className="floor-map__area" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <div className="floor-map__area-icon">{ZONE_ICONS[index]}</div>
                      <div className="floor-map__area-name">{zone.name}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>{zone.size}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.b1.featuresTitle')}</h3>
              <div className="features-list">
                {Array.isArray(features) && features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default FloorB1;
