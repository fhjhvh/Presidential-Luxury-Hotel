import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import BackButton from '../../components/common/BackButton';
import './Floor.css';

const AREA_ICONS = ['🏰', '🍽️', '🎬', '🏊', '💼', '🤝'];
const STAT_ICONS = ['👑', '🏊', '🎬', '🛎️'];
const STAT_NUMS  = ['500', 'Private', 'Cinema', 'Exclusive'];

const Floor8 = () => {
  const { t } = useTranslation();
  const areas    = t('floorPages.f8.areas',    { returnObjects: true });
  const features = t('floorPages.f8.features', { returnObjects: true });
  const stats    = t('floorPages.f8.stats',    { returnObjects: true });

  return (
    <div className="floor-page" style={{ '--flr-hero-img': 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&auto=format&fit=crop&q=80)' }}>
      <BackButton />
      <section className="floor-hero">
        <div className="floor-hero__overlay"></div>
        <div className="container">
          <motion.div className="floor-hero__content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="floor-hero__badge">{t('floorPages.f8.heroBadge')}</div>
            <h1 className="floor-hero__title">{t('floorPages.f8.heroTitle')}</h1>
            <p className="floor-hero__description">{t('floorPages.f8.heroDesc')}</p>
          </motion.div>
        </div>
      </section>

      <section className="floor-content section">
        <div className="container">
          <RevealOnScroll>
            <div className="floor-overview">
              <h2 className="section-title">{t('floorPages.f8.overviewTitle')}</h2>
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
              <h3 className="section-subtitle">{t('floorPages.f8.areasTitle')}</h3>
              <div className="room-grid">
                {Array.isArray(areas) && areas.map((area, index) => (
                  <motion.div key={index} className="room-card" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div className="service-card__icon">{AREA_ICONS[index]}</div>
                    <div className="room-card__header">
                      <h4 className="room-card__title">{area.name}</h4>
                      <p className="room-card__type">{area.size}</p>
                      <p className="room-card__type">{area.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.f8.featuresTitle')}</h3>
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

          <RevealOnScroll delay={0.4}>
            <div style={{ padding: '3rem', background: 'linear-gradient(135deg, rgba(201,164,76,0.1), rgba(15,28,46,0.3))', border: '2px solid var(--royal-gold)', borderRadius: '4px', textAlign: 'center', marginTop: '3rem' }}>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--royal-gold)' }}>
                {t('floorPages.f8.closingTitle')}
              </h3>
              <p style={{ fontSize: '1.25rem', lineHeight: '1.8', opacity: 0.95, maxWidth: '900px', margin: '0 auto' }}>
                {t('floorPages.f8.closingText')}
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Floor8;
