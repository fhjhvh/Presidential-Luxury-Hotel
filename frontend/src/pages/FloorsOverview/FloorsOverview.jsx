import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './FloorsOverview.css';

const FLOOR_KEYS = [
  { key: 'b2', level: 'B2', label: 'B2', path: '/floors/b2', icons: ['🚗', '⚡', '🔒'], category: 'services', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format&fit=crop&q=80' },
  { key: 'b1', level: 'B1', label: 'B1', path: '/floors/b1', icons: ['🧺', '📦', '⚙️'], category: 'services', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80' },
  { key: 'f0', level: '0',  label: 'G', path: '/floors/0',  icons: ['🏛️', '🎗️', '💐'], category: 'amenities', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80' },
  { key: 'f1', level: '1',  label: '1', path: '/floors/1',  icons: ['🍽️', '🍷', '👨‍🍳'], category: 'amenities', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80' },
  { key: 'f2', level: '2',  label: '2', path: '/floors/2',  icons: ['💒', '🎤', '📊'], category: 'amenities', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80' },
  { key: 'f3', level: '3',  label: '3', path: '/floors/3',  icons: ['🧖', '🏋️', '🏊'], category: 'amenities', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80' },
  { key: 'f4', level: '4',  label: '4', path: '/floors/4',  icons: ['🚪', '🛏️', '🌆'], category: 'rooms', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80' },
  { key: 'f5', level: '5',  label: '5', path: '/floors/5',  icons: ['🛏️', '🏞️', '☕'], category: 'rooms', vip: false, aiRecommended: true,  image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&auto=format&fit=crop&q=80' },
  { key: 'f6', level: '6',  label: '6', path: '/floors/6',  icons: ['🏨', '👨‍👩‍👧', '🛁'], category: 'rooms', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80' },
  { key: 'f7', level: '7',  label: '7', path: '/floors/7',  icons: ['👑', '🥂', '🌃'], category: 'exclusive', vip: true,  aiRecommended: true,  image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80' },
  { key: 'f8', level: '8',  label: '8', path: '/floors/8',  icons: ['🏰', '🎬', '🍾'], category: 'exclusive', vip: true,  aiRecommended: false, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80' },
  { key: 'f9', level: '9',  label: '9', path: '/floors/9',  icons: ['👥', '🎓', '🏃'], category: 'services', vip: false, aiRecommended: false, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80' },
  { key: 'f10', level: '10', label: '10', path: '/floors/10', icons: ['🚁', '🛬', '⭐'], category: 'exclusive', vip: true,  aiRecommended: false, image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&auto=format&fit=crop&q=80' },
  { key: 'f11', level: '11', label: '11', path: '/floors/11', icons: ['🌅', '🏊', '🌿'], category: 'exclusive', vip: true,  aiRecommended: true,  image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&auto=format&fit=crop&q=80' },
];

const CATEGORY_KEYS = ['all', 'rooms', 'amenities', 'exclusive', 'services'];

const FloorsOverview = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const STATS = [
    { n: '14',   key: 'levels' },
    { n: '300+', key: 'rooms' },
    { n: '12',   key: 'areas' },
    { n: '24/7', key: 'operations' },
  ];

  const filtered = activeCategory === 'all'
    ? FLOOR_KEYS
    : FLOOR_KEYS.filter(f => f.category === activeCategory);

  return (
    <div className="fo">

      {/* ══ Hero ══ */}
      <section className="fo__hero">
        <div className="fo__hero-bg" />
        <div className="fo__hero-grid" />
        <div className="fo__orb fo__orb--1" />
        <div className="fo__orb fo__orb--2" />
        <div className="fo__orb fo__orb--3" />

        <div className="fo__container">
          <motion.div
            className="fo__hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>

            <motion.div
              className="fo__hero-kicker"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}>
              <span className="fo__kicker-line" />
              <span>{t('floorsOverview.heroNew.kicker')}</span>
              <span className="fo__kicker-line" />
            </motion.div>

            <motion.h1
              className="fo__hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              {t('floorsOverview.heroNew.title')}
            </motion.h1>

            <motion.p
              className="fo__hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}>
              {t('floorsOverview.heroNew.sub')}
            </motion.p>

            <motion.div
              className="fo__hero-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }} />
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="fo__stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}>
            {STATS.map((s, i) => (
              <div key={s.key} className="fo__stat">
                <span className="fo__stat-num">{s.n}</span>
                <span className="fo__stat-label">{t(`floorsOverview.statsBar.${s.key}`)}</span>
                {i < STATS.length - 1 && <span className="fo__stat-divider" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ Filter Bar ══ */}
      <div className="fo__filter-bar">
        <div className="fo__container">
          <div className="fo__filters">
            {CATEGORY_KEYS.map(cat => (
              <motion.button
                key={cat}
                className={`fo__filter-btn ${activeCategory === cat ? 'fo__filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.95 }}>
                {t(`floorsOverview.categories.${cat}`)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Floor Grid ══ */}
      <section className="fo__floors">
        <div className="fo__container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="fo__grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>

              {filtered.map((floor, i) => {
                const floorData = t(`floorsOverview.floors.${floor.key}`, { returnObjects: true });
                return (
                  <motion.div
                    key={floor.level}
                    className={`fo__card ${floor.vip ? 'fo__card--vip' : ''}`}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.055, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
                    whileHover={{ y: -10 }}>

                    <div className="fo__card-img">
                      <img src={floor.image} alt={floorData.name} loading="lazy" />
                      <div className="fo__card-img-overlay" />

                      {floor.vip && (
                        <div className="fo__badge fo__badge--vip">
                          <span className="fo__badge-star">★</span> {t('floorsOverview.badges.vip')}
                        </div>
                      )}

                      {floor.aiRecommended && (
                        <div className="fo__badge fo__badge--ai">
                          ✦ {t('floorsOverview.badges.ai')}
                        </div>
                      )}

                      <div className="fo__card-level">
                        <span className="fo__level-num">{floor.label}</span>
                        <span className="fo__level-text">{t('floorsOverview.badges.floor')}</span>
                      </div>

                      <div className="fo__card-hover-bar" />
                    </div>

                    <div className="fo__card-sep" />

                    <div className="fo__card-body">
                      <div className="fo__card-icons">
                        {floor.icons.map((icon, idx) => (
                          <span key={idx} className="fo__card-icon">{icon}</span>
                        ))}
                      </div>

                      <h3 className="fo__card-name">{floorData.name}</h3>
                      <p className="fo__card-desc">{floorData.description}</p>

                      <div className="fo__card-features">
                        {(floorData.features || []).map(feat => (
                          <span key={feat} className="fo__feat-tag">
                            <span className="fo__feat-dot">✦</span>
                            {feat}
                          </span>
                        ))}
                      </div>

                      <div className="fo__card-actions">
                        <Link to={floor.path} className="fo__btn fo__btn--primary">
                          {t('floorsOverview.actions.explore')}
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                        {['rooms', 'exclusive'].includes(floor.category) && (
                          <Link to={`/rooms?floor=${floor.level}`} className="fo__btn fo__btn--ghost">
                            {t('floorsOverview.actions.viewRooms')}
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="fo__card-shimmer" />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="fo__cta">
        <div className="fo__cta-bg">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80"
            alt="Hotel exterior at dusk" />
          <div className="fo__cta-overlay" />
        </div>
        <div className="fo__container">
          <motion.div
            className="fo__cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="fo__cta-kicker">{t('floorsOverview.ctaNew.kicker')}</div>
            <h2 className="fo__cta-title">{t('floorsOverview.ctaNew.title')}</h2>
            <div className="fo__gold-rule" />
            <p className="fo__cta-sub">{t('floorsOverview.ctaNew.sub')}</p>
            <div className="fo__cta-actions">
              <Link to="/booking" className="fo__btn fo__btn--gold fo__btn--lg">
                {t('floorsOverview.actions.bookStay')}
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </Link>
              <Link to="/rooms" className="fo__btn fo__btn--outline fo__btn--lg">
                {t('floorsOverview.actions.browseRooms')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default FloorsOverview;
