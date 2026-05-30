import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import BackButton from '../../components/common/BackButton';
import StoryNarrative from '../../components/common/StoryNarrative';
import './Floor.css';

const FACILITY_ICONS    = ['🔌', '📹', '🚗', '🔧'];
const ZONE_STATUS_CLASS = ['available', 'available', 'reserved', 'active', 'premium'];
const STAT_ICONS        = ['🚗', '⚡', '📹', '🔐'];
const STAT_NUMS         = ['150', '20', '24/7', '100%'];

const FloorB2 = () => {
  const { t } = useTranslation();
  const zones      = t('floorPages.b2.zones',      { returnObjects: true });
  const facilities = t('floorPages.b2.facilities', { returnObjects: true });
  const features   = t('floorPages.b2.features',   { returnObjects: true });
  const stats      = t('floorPages.b2.stats',      { returnObjects: true });

  return (
    <div className="floor-page floor-page--parking" style={{ '--flr-hero-img': 'url(https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1920&auto=format&fit=crop&q=80)' }}>
      <BackButton />
      <section className="floor-hero">
        <div className="floor-hero__overlay"></div>
        <div className="container">
          <motion.div className="floor-hero__content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="floor-hero__badge">{t('floorPages.b2.heroBadge')}</div>
            <h1 className="floor-hero__title">{t('floorPages.b2.heroTitle')}</h1>
            <p className="floor-hero__description">{t('floorPages.b2.heroDesc')}</p>
          </motion.div>
        </div>
      </section>

      <section className="floor-content section">
        <div className="container">
          <StoryNarrative text={t('floorPages.b2.storyText')} />

          <RevealOnScroll>
            <div className="floor-overview">
              <h2 className="section-title">{t('floorPages.b2.overviewTitle')}</h2>
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
              <h3 className="section-subtitle">{t('floorPages.b2.areasTitle')}</h3>
              <div className="parking-grid">
                {Array.isArray(zones) && zones.map((zone, index) => (
                  <motion.div key={zone.id} className="parking-zone-card" whileHover={{ scale: 1.03, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div className="parking-zone-header">
                      <h4>{t('floors.zonePrefix')} {zone.id}</h4>
                      <span className={`parking-status parking-status--${ZONE_STATUS_CLASS[index]}`}>
                        {zone.status}
                      </span>
                    </div>
                    <div className="parking-zone-body">
                      <div className="parking-info">
                        <span className="parking-label">{t('floors.capacityLabel')}:</span>
                        <span className="parking-value">{zone.slots} {t('floors.slotsLabel')}</span>
                      </div>
                      <div className="parking-info">
                        <span className="parking-label">{t('floors.typeLabel')}:</span>
                        <span className="parking-value">{zone.type}</span>
                      </div>
                    </div>
                    <div className="parking-visualization">
                      {[...Array(Math.min(zone.slots, 12))].map((_, i) => (
                        <div key={i} className="parking-slot" title={`Slot ${i + 1}`}></div>
                      ))}
                      {zone.slots > 12 && <div className="parking-more">+{zone.slots - 12}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.b2.facilitiesTitle')}</h3>
              <div className="facilities-grid">
                {Array.isArray(facilities) && facilities.map((facility, index) => (
                  <div key={index} className="facility-card">
                    <div className="facility-icon">{FACILITY_ICONS[index]}</div>
                    <div className="facility-info">
                      <h4>{facility.name}</h4>
                      <p>{facility.count} {t('floors.unitsLabel')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            <div className="floor-section">
              <h3 className="section-subtitle">{t('floorPages.b2.featuresTitle')}</h3>
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

export default FloorB2;
