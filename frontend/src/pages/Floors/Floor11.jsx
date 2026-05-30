import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import BackButton from '../../components/common/BackButton';
import './Floor.css';

const AREA_ICONS = ['🏊', '🌳', '🍸', '🍽️', '🌅', '🎵'];
const STAT_ICONS = ['🏊', '🌳', '🌅', '⭐'];
const STAT_NUMS  = ['450', '800', '360°', 'Sunset'];

const Floor11 = () => {
  const { t } = useTranslation();
  const areas    = t('floorPages.f11.areas',    { returnObjects: true });
  const features = t('floorPages.f11.features', { returnObjects: true });
  const stats    = t('floorPages.f11.stats',    { returnObjects: true });

  return (
    <div className="floor-page" style={{ '--flr-hero-img': 'url(https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&auto=format&fit=crop&q=80)' }}>
      <BackButton />
      <section className="floor-hero">
        <div className="floor-hero__overlay"></div>
        <div className="container">
          <motion.div className="floor-hero__content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="floor-hero__badge">{t('floorPages.f11.heroBadge')}</div>
            <h1 className="floor-hero__title">{t('floorPages.f11.heroTitle')}</h1>
            <p className="floor-hero__description">{t('floorPages.f11.heroDesc')}</p>
          </motion.div>
        </div>
      </section>

      <section className="floor-content section">
        <div className="container">
          <RevealOnScroll>
            <div className="floor-overview">
              <h2 className="section-title">{t('floorPages.f11.overviewTitle')}</h2>
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
              <h3 className="section-subtitle">{t('floorPages.f11.areasTitle')}</h3>
              <div className="room-grid">
                {Array.isArray(areas) && areas.map((area, index) => (
                  <motion.div key={index} className="room-card" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div className="service-card__icon">{AREA_ICONS[index]}</div>
                    <div className="room-card__header">
                      <h4 className="room-card__title">{area.name}</h4>
                      <p className="room-card__type">{area.size || area.capacity}</p>
                      <p className="room-card__type">{area.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.f11.featuresTitle')}</h3>
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
            <div style={{ padding: '4rem', background: 'linear-gradient(135deg, rgba(201,164,76,0.15), rgba(15,28,46,0.4))', border: '2px solid var(--royal-gold)', borderRadius: '4px', textAlign: 'center', marginTop: '3rem', boxShadow: '0 20px 60px rgba(201,164,76,0.2)' }}>
              <h3 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--royal-gold)' }}>
                {t('floorPages.f11.closingTitle')}
              </h3>
              <p style={{ fontSize: '1.25rem', lineHeight: '2', opacity: 0.95, maxWidth: '900px', margin: '0 auto' }}>
                {t('floorPages.f11.closingText')}
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Floor11;
