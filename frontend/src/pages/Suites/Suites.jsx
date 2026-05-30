import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { roomAPI } from '../../services/api';
import './Suites.css';

const SUITE_TYPES = ['JUNIOR_SUITE', 'EXECUTIVE_SUITE', 'FAMILY_SUITE', 'PRESIDENTIAL_SUITE', 'ROYAL_SUITE'];

const SUITE_ICONS = {
  JUNIOR_SUITE: '🌟', EXECUTIVE_SUITE: '💼', FAMILY_SUITE: '🏡',
  PRESIDENTIAL_SUITE: '👑', ROYAL_SUITE: '🏰',
};
const SUITE_TIERS = {
  JUNIOR_SUITE: 'premium', EXECUTIVE_SUITE: 'executive', FAMILY_SUITE: 'family',
  PRESIDENTIAL_SUITE: 'presidential', ROYAL_SUITE: 'royal',
};

const FALLBACK_SUITES = [
  { id: 's1', roomNumber: '701', type: 'JUNIOR_SUITE', floor: 7, capacity: 4, size: 90, currentPrice: 750, status: 'AVAILABLE', visualStatus: 'available', description: 'Elegant Junior Suite with separate living room, panoramic city views, marble spa bathroom with jacuzzi, and butler service.', images: ['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'], features: { view: 'Panoramic City', bed_type: 'King Bed', beds: 1, bathrooms: 2, rating: 4.6, jacuzzi: true, butler_service: true, separate_living: true, category: 'JUNIOR_SUITE' } },
  { id: 's2', roomNumber: '801', type: 'EXECUTIVE_SUITE', floor: 8, capacity: 4, size: 120, currentPrice: 950, status: 'AVAILABLE', visualStatus: 'available', description: 'Distinguished Executive Suite with private office, conference facilities, panoramic skyline views, and bespoke butler service.', images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'], features: { view: 'Skyline Panorama', bed_type: 'King Bed', beds: 1, bathrooms: 2, rating: 4.7, private_office: true, butler_service: true, category: 'EXECUTIVE_SUITE' } },
  { id: 's3', roomNumber: '1001', type: 'PRESIDENTIAL_SUITE', floor: 10, capacity: 6, size: 250, currentPrice: 2500, status: 'AVAILABLE', visualStatus: 'available', description: 'The Presidential Suite — private elevator, panoramic rooftop infinity pool, personal chef, cinema room, and 360° city views.', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=800'], features: { view: '360° Panorama', bed_type: 'Emperor Bed', beds: 2, bathrooms: 3, rating: 4.9, private_pool: true, butler_service: true, private_chef: true, cinema: true, category: 'PRESIDENTIAL_SUITE' } },
  { id: 's4', roomNumber: '1101', type: 'ROYAL_SUITE', floor: 11, capacity: 8, size: 380, currentPrice: 5000, status: 'AVAILABLE', visualStatus: 'available', description: 'The Royal Suite — sovereign sky palace with helipad, private infinity pool, cinema, library, grand piano, and three dedicated butlers.', images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 'https://images.unsplash.com/photo-1430285561322-7808604715df?w=800'], features: { view: '360° Horizon', bed_type: 'Emperor + King', beds: 4, bathrooms: 5, rating: 5.0, private_pool: true, butler_service: true, helipad_access: true, cinema: true, library: true, grand_piano: true, category: 'ROYAL_SUITE' } },
];

// ── Suite Image Slider ────────────────────────────────────────────
const SuiteSlider = ({ images, id, visualStatus }) => {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const imgs = Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800'];

  return (
    <div className="suite-slider">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${id}-${idx}`}
          src={imgs[idx]}
          alt="Suite"
          className="suite-slider__img"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.5 }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800'; }}
        />
      </AnimatePresence>

      {imgs.length > 1 && (
        <>
          <button className="suite-slider-btn suite-slider-btn--prev"
            onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length); }}>‹</button>
          <button className="suite-slider-btn suite-slider-btn--next"
            onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % imgs.length); }}>›</button>
          <div className="suite-slider-dots">
            {imgs.map((_, i) => (
              <span key={i}
                className={`suite-dot ${i === idx ? 'suite-dot--active' : ''}`}
                onClick={e => { e.stopPropagation(); setIdx(i); }} />
            ))}
          </div>
        </>
      )}

      {visualStatus && visualStatus !== 'available' && (
        <div className={`suite-status-badge suite-status-badge--${visualStatus}`}>
          {visualStatus === 'booked'
            ? t('suites.status.badgeBooked')
            : visualStatus === 'near-available'
            ? t('suites.status.badgeNearAvail')
            : t('suites.status.badgeMaintenance')}
        </div>
      )}
    </div>
  );
};

// ── Suite Card ────────────────────────────────────────────────────
const SuiteCard = ({ suite, onBook, onView, index }) => {
  const { t, i18n } = useTranslation();
  const meta = {
    label:   t(`suites.meta.${suite.type}.label`,   { defaultValue: suite.type }),
    tagline: t(`suites.meta.${suite.type}.tagline`, { defaultValue: '' }),
    icon:    SUITE_ICONS[suite.type] || '🌟',
    tier:    SUITE_TIERS[suite.type] || 'premium',
  };
  const features = typeof suite.features === 'object' ? suite.features : {};
  const isBookable = suite.visualStatus === 'available';

  const luxuryFeatures = [
    features.butler_service   && t('suites.luxuryFeatures.butler'),
    features.private_pool     && t('suites.luxuryFeatures.privatePool'),
    features.private_chef     && t('suites.luxuryFeatures.privateChef'),
    features.jacuzzi          && t('suites.luxuryFeatures.jacuzzi'),
    features.sauna            && t('suites.luxuryFeatures.sauna'),
    features.cinema           && t('suites.luxuryFeatures.cinema'),
    features.library          && t('suites.luxuryFeatures.library'),
    features.grand_piano      && t('suites.luxuryFeatures.grandPiano'),
    features.private_elevator && t('suites.luxuryFeatures.privateElevator'),
    features.helipad_access   && t('suites.luxuryFeatures.helipadAccess'),
    features.wine_cellar      && t('suites.luxuryFeatures.wineCellar'),
    features.rooftop_garden   && t('suites.luxuryFeatures.rooftopGarden'),
    features.separate_living  && t('suites.luxuryFeatures.livingRoom'),
    features.private_office   && t('suites.luxuryFeatures.privateOffice'),
  ].filter(Boolean);

  const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
  const availableDate = suite.nextAvailableDate
    ? new Date(suite.nextAvailableDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <motion.article
      className={`sc sc--${meta.tier} sc--${suite.visualStatus}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
    >
      <div className="sc__media" onClick={() => onView(suite)}>
        <SuiteSlider images={suite.images} id={suite.id} visualStatus={suite.visualStatus !== 'available' ? suite.visualStatus : null} />
        <div className="sc__tier-ribbon">
          <span className="sc__icon">{meta.icon}</span>
          <span className="sc__type-label">{meta.label}</span>
        </div>
        <div className="sc__floor-chip">{t('suites.card.floor')} {suite.floor}</div>
        {features.rating && <div className="sc__rating-chip">⭐ {features.rating}</div>}
      </div>

      <div className="sc__body">
        <div className="sc__head">
          <div>
            <p className="sc__tagline">{meta.tagline}</p>
            <h3 className="sc__name">{meta.label} <span className="sc__num">#{suite.roomNumber}</span></h3>
          </div>
          {suite.visualStatus !== 'available' && (
            <span className={`sc__status-chip sc__status-chip--${suite.visualStatus}`}>
              {suite.visualStatus === 'booked' ? t('suites.status.booked') : t('suites.status.availableSoon')}
            </span>
          )}
        </div>

        <p className="sc__desc">{suite.description?.substring(0, 150)}{suite.description?.length > 150 ? '…' : ''}</p>

        <div className="sc__specs">
          <div className="sc__spec">
            <span className="sc__spec-icon">👥</span>
            <span>{suite.capacity} {t('suites.card.guests')}</span>
          </div>
          {suite.size && (
            <div className="sc__spec">
              <span className="sc__spec-icon">📐</span>
              <span>{suite.size} m²</span>
            </div>
          )}
          {features.beds && (
            <div className="sc__spec">
              <span className="sc__spec-icon">🛏</span>
              <span>{features.beds} {features.beds === 1 ? t('suites.card.bed') : t('suites.card.beds')}</span>
            </div>
          )}
          {features.bathrooms && (
            <div className="sc__spec">
              <span className="sc__spec-icon">🚿</span>
              <span>{features.bathrooms} {features.bathrooms === 1 ? t('suites.card.bath') : t('suites.card.baths')}</span>
            </div>
          )}
          {features.view && (
            <div className="sc__spec sc__spec--view">
              <span className="sc__spec-icon">🌅</span>
              <span>{features.view}</span>
            </div>
          )}
          {features.bed_type && (
            <div className="sc__spec">
              <span className="sc__spec-icon">✦</span>
              <span>{features.bed_type}</span>
            </div>
          )}
        </div>

        {luxuryFeatures.length > 0 && (
          <div className="sc__luxury-features">
            <p className="sc__features-label">{t('suites.card.exclusiveFeatures')}</p>
            <div className="sc__features-list">
              {luxuryFeatures.slice(0, 6).map((f, i) => (
                <span key={i} className="sc__feat-badge">✦ {f}</span>
              ))}
              {luxuryFeatures.length > 6 && (
                <span className="sc__feat-more">{t('suites.card.more', { count: luxuryFeatures.length - 6 })}</span>
              )}
            </div>
          </div>
        )}

        {!isBookable && (
          <div className={`sc__unavail ${suite.visualStatus === 'near-available' ? 'sc__unavail--near' : 'sc__unavail--booked'}`}>
            {suite.visualStatus === 'booked'
              ? <><strong>{t('suites.status.currentlyReserved')}</strong>{availableDate && <span> — {t('suites.status.availableFrom')} <strong>{availableDate}</strong></span>}</>
              : <><strong>{t('suites.status.checkingOut')}</strong>{availableDate && <span> — {t('suites.status.freeFrom')} <strong>{availableDate}</strong></span>}</>}
          </div>
        )}

        <div className="sc__footer">
          <div className="sc__price-block">
            <span className="sc__price">${suite.currentPrice?.toLocaleString()}</span>
            <span className="sc__per-night">{t('suites.card.perNight')}</span>
          </div>
          <div className="sc__actions">
            <button className="sc__btn-details" onClick={() => onView(suite)}>{t('suites.card.viewDetails')}</button>
            <button
              className={`sc__btn-book ${!isBookable ? 'sc__btn-book--disabled' : ''}`}
              disabled={!isBookable}
              onClick={() => isBookable && onBook(suite)}
            >
              {isBookable ? t('suites.card.reserveSuite') : t('suites.card.unavailable')}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
const Suites = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const FILTER_TABS = [
    { id: 'all',                 label: t('suites.filterTabs.all') },
    { id: 'JUNIOR_SUITE',        label: t('suites.filterTabs.junior') },
    { id: 'EXECUTIVE_SUITE',     label: t('suites.filterTabs.executive') },
    { id: 'FAMILY_SUITE',        label: t('suites.filterTabs.family') },
    { id: 'PRESIDENTIAL_SUITE',  label: t('suites.filterTabs.presidential') },
    { id: 'ROYAL_SUITE',         label: t('suites.filterTabs.royal') },
  ];

  useEffect(() => { loadSuites(); }, []);

  const loadSuites = async () => {
    try {
      setLoading(true);
      const data = await roomAPI.getAllRooms();
      if (!Array.isArray(data) || data.length === 0) { setSuites(FALLBACK_SUITES); return; }

      const parsed = data
        .filter(r => SUITE_TYPES.includes(r.type))
        .map(r => ({
          ...r,
          features:  typeof r.features  === 'string' ? safeJson(r.features,  {}) : (r.features  || {}),
          amenities: typeof r.amenities === 'string' ? safeJson(r.amenities, {}) : (r.amenities || {}),
          images:    typeof r.images    === 'string' ? safeJson(r.images,    []) : (r.images    || []),
        }));

      setSuites(parsed.length ? parsed : FALLBACK_SUITES);
    } catch {
      setSuites(FALLBACK_SUITES);
    } finally {
      setLoading(false);
    }
  };

  const safeJson = (s, fb) => { try { return JSON.parse(s); } catch { return fb; } };

  const filtered = filter === 'all' ? suites : suites.filter(s => s.type === filter);

  return (
    <div className="suites-page">
      <section className="suites-hero">
        <div className="suites-hero__bg" />
        <div className="suites-hero__overlay" />
        <div className="suites-hero__particles" />
        <div className="container">
          <motion.div
            className="suites-hero__content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="suites-hero__kicker">{t('suites.hero.kicker')}</span>
            <h1 className="suites-hero__title">
              {t('suites.hero.titleLine1')}<br /><em>{t('suites.hero.titleLine2')}</em>
            </h1>
            <p className="suites-hero__sub">
              {t('suites.hero.sub', { count: suites.length })}
            </p>
            <div className="suites-hero__stats">
              <div className="stat"><span className="stat-num">{suites.length}</span><span className="stat-label">{t('suites.hero.stats.suites')}</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">7–11</span><span className="stat-label">{t('suites.hero.stats.floors')}</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">24/7</span><span className="stat-label">{t('suites.hero.stats.butler')}</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">5★</span><span className="stat-label">{t('suites.hero.stats.rated')}</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="suites-filter-bar">
        <div className="container">
          <div className="suites-filter-tabs">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                className={`suite-tab ${filter === tab.id ? 'suite-tab--active' : ''}`}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
                {tab.id !== 'all' && (
                  <span className="suite-tab-count">
                    {suites.filter(s => s.type === tab.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="suites-body">
        <div className="container">
          {loading ? (
            <div className="suites-loading">
              <div className="suite-spinner" />
              <p>{t('suites.loading')}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="suites-empty">
              <p>{t('suites.empty')}</p>
              <button className="suite-reset-btn" onClick={() => setFilter('all')}>{t('suites.showAll')}</button>
            </div>
          ) : (
            <div className="suites-grid">
              {filtered.map((suite, i) => (
                <SuiteCard
                  key={suite.id}
                  suite={suite}
                  index={i}
                  onBook={s => navigate('/booking', { state: { selectedRoom: s } })}
                  onView={s => navigate(`/rooms/${s.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="suites-cta">
        <div className="container">
          <motion.div
            className="suites-cta__inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="suites-cta__label">{t('suites.cta.label')}</span>
            <h2 className="suites-cta__title">{t('suites.cta.title')}</h2>
            <p className="suites-cta__sub">{t('suites.cta.sub')}</p>
            <div className="suites-cta__actions">
              <button className="cta-btn cta-btn--primary" onClick={() => navigate('/booking')}>{t('suites.cta.reserve')}</button>
              <button className="cta-btn cta-btn--ghost" onClick={() => navigate('/rooms')}>{t('suites.cta.browse')}</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Suites;
