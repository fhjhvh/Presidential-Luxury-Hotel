import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import BackButton from '../../components/common/BackButton';
import './Floor.css';

const STAT_ICONS     = ['🚪', '📏', '🏞️', '🎯'];
const STAT_NUMS      = ['60', '60-65', '100%', 'VIP'];
const STATUS_CLASSES = ['available', 'available', 'reserved'];

const Floor5 = () => {
  const { t } = useTranslation();
  const areas    = t('floorPages.f5.areas',    { returnObjects: true });
  const features = t('floorPages.f5.features', { returnObjects: true });
  const stats    = t('floorPages.f5.stats',    { returnObjects: true });

  return (
    <div className="floor-page" style={{ '--flr-hero-img': 'url(https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920&auto=format&fit=crop&q=80)' }}>
      <BackButton />
      <section className="floor-hero">
        <div className="floor-hero__overlay"></div>
        <div className="container">
          <motion.div className="floor-hero__content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="floor-hero__badge">{t('floorPages.f5.heroBadge')}</div>
            <h1 className="floor-hero__title">{t('floorPages.f5.heroTitle')}</h1>
            <p className="floor-hero__description">{t('floorPages.f5.heroDesc')}</p>
          </motion.div>
        </div>
      </section>

      <section className="floor-content section">
        <div className="container">
          <RevealOnScroll>
            <div className="floor-overview">
              <h2 className="section-title">{t('floorPages.f5.overviewTitle')}</h2>
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
              <h3 className="section-subtitle">{t('floorPages.f5.areasTitle')}</h3>
              <div className="room-grid">
                {Array.isArray(areas) && areas.map((room, index) => (
                  <motion.div key={index} className="room-card" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div className="room-card__number">{room.number.split('-')[0]}</div>
                    <div className="room-card__header">
                      <h4 className="room-card__title">{room.type}</h4>
                      <p className="room-card__type">{t('floors.roomsLabel')} {room.number}</p>
                      <p className="room-card__type">{room.size}</p>
                      <span className={`room-card__status room-card__status--${STATUS_CLASSES[index]}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="room-card__features">
                      {Array.isArray(room.features) && room.features.map((feature, i) => (
                        <span key={i} className="room-feature-tag">{feature}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.f5.featuresTitle')}</h3>
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

export default Floor5;
