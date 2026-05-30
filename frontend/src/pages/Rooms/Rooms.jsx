import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { roomAPI } from '../../services/api';
import './Rooms.css';

// Direct view/bed translation maps (Turkish) — no i18n key resolution
const VIEW_TR = {
  'City View': 'Şehir Manzarası', 'Ocean View': 'Deniz Manzarası',
  'Pool View': 'Havuz Manzarası', 'Garden View': 'Bahçe Manzarası',
  'Panoramic City': 'Panoramik Şehir', 'Skyline Panorama': 'Şehir Silüeti Panoraması',
  '360° Panorama': '360° Panorama', '360° Horizon': '360° Ufuk',
  'Panoramic Skyline': 'Panoramik Silüet',
};

const BED_TR = {
  'King Bed': 'King Yatak', 'Queen Bed': 'Queen Yatak',
  'Single Bed': 'Tek Kişilik Yatak', 'Queen + Bunk': 'Queen + Ranza',
  'Emperor Bed': 'Emperor Yatak', 'Emperor + King': 'Emperor + King',
  'Twin Beds': 'İkiz Yataklar',
};

const CARD_FEATURE_TR = {
  jacuzzi: 'Jakuzi', balcony: 'Balkon', butler: 'Butler',
  livingRoom: 'Oturma Odası', diningArea: 'Yemek Alanı',
  privatePool: 'Özel Havuz', minibar: 'Mini Bar', nespresso: 'Nespresso',
};

// Room descriptions are stored English-only in the DB. Localize by room TYPE
// (mirrors RoomDetail.jsx) so cards never show English in TR/AR.
const TYPE_DESC = {
  tr: {
    STANDARD: 'Modern olanaklara ve şehir manzarasına sahip konforlu standart oda.',
    SINGLE: 'Solo gezginler için kompakt ve şık tek kişilik oda.',
    COUPLE: 'Premium olanaklar ve zarif tasarıma sahip romantik çift kişilik oda.',
    FAMILY: 'Birden fazla yatak ve havuz manzarasıyla geniş aile odası.',
    DELUXE: 'Panoramik manzara ve mermer banyoyla sofistike deluxe oda.',
    JUNIOR_SUITE: 'Ayrı oturma alanı ve premium olanaklar sunan zarif junior süit.',
    EXECUTIVE_SUITE: 'Lüks ve profesyonel işlevselliği bir araya getiren executive süit.',
    FAMILY_SUITE: 'Ailenizin her konforu için geniş ve tam donanımlı aile süiti.',
    PRESIDENTIAL_SUITE: 'Özel hizmetler ve eşsiz konforla başkanlık süiti.',
    ROYAL_SUITE: 'En yüksek standartlarda olağanüstü kraliyet konaklaması.',
  },
  ar: {
    STANDARD: 'غرفة قياسية مريحة بإطلالة على المدينة ووسائل راحة عصرية.',
    SINGLE: 'غرفة فردية أنيقة وعملية للمسافر المنفرد.',
    COUPLE: 'غرفة رومانسية للزوجين بتصميم أنيق ووسائل راحة فاخرة.',
    FAMILY: 'غرفة عائلية واسعة بأسرّة متعددة وإطلالة على المسبح.',
    DELUXE: 'غرفة ديلوكس راقية بإطلالة بانورامية وحمام رخامي.',
    JUNIOR_SUITE: 'جناح جونيور أنيق بمنطقة جلوس منفصلة ووسائل راحة فاخرة.',
    EXECUTIVE_SUITE: 'جناح تنفيذي يجمع بين الفخامة والوظائف المهنية.',
    FAMILY_SUITE: 'جناح عائلي واسع ومجهّز بالكامل لراحة جميع أفراد العائلة.',
    PRESIDENTIAL_SUITE: 'جناح رئاسي بخدمات حصرية وراحة لا مثيل لها.',
    ROYAL_SUITE: 'إقامة ملكية استثنائية بأعلى المعايير.',
  },
};

const SUITE_TYPES = ['JUNIOR_SUITE', 'EXECUTIVE_SUITE', 'FAMILY_SUITE', 'PRESIDENTIAL_SUITE', 'ROYAL_SUITE'];

const TYPE_ICONS = {
  STANDARD: '🛏️', SINGLE: '👤', COUPLE: '💑', FAMILY: '👨‍👩‍👧‍👦',
  DELUXE: '✨', JUNIOR_SUITE: '🌟', EXECUTIVE_SUITE: '💼',
  FAMILY_SUITE: '🏡', PRESIDENTIAL_SUITE: '👑', ROYAL_SUITE: '🏰',
};

const TYPE_COLORS = {
  STANDARD: '#6B7280', SINGLE: '#3B82F6', COUPLE: '#EC4899', FAMILY: '#10B981',
  DELUXE: '#F59E0B', JUNIOR_SUITE: '#8B5CF6', EXECUTIVE_SUITE: '#7C3AED',
  FAMILY_SUITE: '#059669', PRESIDENTIAL_SUITE: '#B45309', ROYAL_SUITE: '#92400E',
};

const STATUS_CSS = {
  available: 'status--available',
  booked: 'status--booked',
  'near-available': 'status--near',
  maintenance: 'status--maintenance',
};

const FILTER_IDS = ['all', 'STANDARD', 'SINGLE', 'COUPLE', 'FAMILY', 'DELUXE', 'suites'];
const FILTER_ICONS = { all: '', STANDARD: '🛏️ ', SINGLE: '👤 ', COUPLE: '💑 ', FAMILY: '👨‍👩‍👧‍👦 ', DELUXE: '✨ ', suites: '👑 ' };

const ROOMS_PER_PAGE = 12;

const FALLBACK_ROOMS = [
  { id: 'f1', roomNumber: '101', type: 'STANDARD', floor: 1, capacity: 2, size: 32, currentPrice: 150, status: 'AVAILABLE', visualStatus: 'available', description: 'Comfortable standard room with modern amenities and city view.', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], features: { view: 'City View', bed_type: 'Queen Bed', beds: 1, bathrooms: 1, rating: 4.2, category: 'STANDARD' }, amenities: { wifi: true, tv: true, air_conditioning: true, minibar: true } },
  { id: 'f2', roomNumber: '111', type: 'SINGLE', floor: 1, capacity: 1, size: 22, currentPrice: 120, status: 'AVAILABLE', visualStatus: 'available', description: 'Compact, stylish single room for the solo traveler.', images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'], features: { view: 'Garden View', bed_type: 'Single Bed', beds: 1, bathrooms: 1, rating: 4.0, category: 'SINGLE' }, amenities: { wifi: true, tv: true, air_conditioning: true } },
  { id: 'f3', roomNumber: '301', type: 'COUPLE', floor: 3, capacity: 2, size: 42, currentPrice: 320, status: 'AVAILABLE', visualStatus: 'available', description: 'Romantic couple room with jacuzzi and champagne welcome.', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'], features: { view: 'Ocean View', bed_type: 'King Bed', beds: 1, bathrooms: 1, rating: 4.6, jacuzzi: true, category: 'COUPLE' }, amenities: { wifi: true, tv: true, air_conditioning: true, jacuzzi: true } },
  { id: 'f4', roomNumber: '306', type: 'FAMILY', floor: 3, capacity: 4, size: 62, currentPrice: 380, status: 'AVAILABLE', visualStatus: 'available', description: 'Spacious family room with multiple beds and pool view.', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'], features: { view: 'Pool View', bed_type: 'Queen + Bunk', beds: 3, bathrooms: 1, rating: 4.3, category: 'FAMILY' }, amenities: { wifi: true, tv: true, air_conditioning: true, minibar: true } },
  { id: 'f5', roomNumber: '406', type: 'DELUXE', floor: 4, capacity: 2, size: 48, currentPrice: 350, status: 'AVAILABLE', visualStatus: 'available', description: 'Sophisticated deluxe room with panoramic views and marble bath.', images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'], features: { view: 'Panoramic City', bed_type: 'King Bed', beds: 1, bathrooms: 1, rating: 4.5, jacuzzi: true, category: 'DELUXE' }, amenities: { wifi: true, tv: true, air_conditioning: true, minibar: true, jacuzzi: true } },
];

const safeJson = (str, fallback) => { try { return JSON.parse(str); } catch { return fallback; } };

const ImageSlider = ({ images, roomId, statusOverlay }) => {
  const [idx, setIdx] = useState(0);
  const imgs = Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'];

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % imgs.length); };

  return (
    <div className="room-slider">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${roomId}-${idx}`}
          src={imgs[idx]}
          alt="Room view"
          className="room-slider__img"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'; }}
        />
      </AnimatePresence>
      {imgs.length > 1 && (
        <>
          <button className="slider-btn slider-btn--prev" onClick={prev} aria-label="Previous image">‹</button>
          <button className="slider-btn slider-btn--next" onClick={next} aria-label="Next image">›</button>
          <div className="slider-dots">
            {imgs.map((_, i) => (
              <span key={i} className={`slider-dot ${i === idx ? 'slider-dot--active' : ''}`}
                onClick={e => { e.stopPropagation(); setIdx(i); }} />
            ))}
          </div>
        </>
      )}
      {statusOverlay && (
        <div className={`room-status-overlay room-status-overlay--${statusOverlay.type}`}>
          {statusOverlay.text}
        </div>
      )}
    </div>
  );
};

const RoomCard = ({ room, onBook, onView, t, language }) => {
  const typeLabel = t(`rooms.types.${room.type}`, { defaultValue: room.type });
  const icon      = TYPE_ICONS[room.type] || '🛏️';
  const color     = TYPE_COLORS[room.type] || '#6B7280';
  const statusKey = room.visualStatus === 'near-available' ? 'nearAvailable' : room.visualStatus;
  const statusLabel  = t(`rooms.status.${statusKey}`, { defaultValue: room.visualStatus });
  const statusCssKey = room.visualStatus;
  const isBookable   = room.visualStatus === 'available';
  // NOTE: typeof null === 'object', so guard explicitly against null.
  const features  = room.features  && typeof room.features  === 'object' ? room.features  : {};
  const amenities = room.amenities && typeof room.amenities === 'object' ? room.amenities : {};
  const isSuite   = SUITE_TYPES.includes(room.type);

  const tv = language === 'tr';
  const asText = (v) => (typeof v === 'string' || typeof v === 'number') ? String(v) : '';
  const tView = (v) => asText((tv && VIEW_TR[v]) || v);
  const tBed  = (b) => asText((tv && BED_TR[b])  || b);
  const tFeat = (k) => (tv && CARD_FEATURE_TR[k]) || t(`rooms.featureTags.${k}`, { defaultValue: k });
  // Localized description by type; fall back to the DB (English) only if unmapped.
  const localizedDesc = (language !== 'en' && TYPE_DESC[language]?.[room.type]) || room.description || '';

  const featureTags = [
    features.view     ? tView(features.view)     : null,
    features.bed_type ? tBed(features.bed_type)  : null,
    features.jacuzzi        && tFeat('jacuzzi'),
    features.balcony        && tFeat('balcony'),
    features.butler_service && tFeat('butler'),
    features.separate_living && tFeat('livingRoom'),
    features.dining_area    && tFeat('diningArea'),
    features.private_pool   && tFeat('privatePool'),
    amenities.minibar       && tFeat('minibar'),
    amenities.nespresso     && tFeat('nespresso'),
  ].filter(Boolean).slice(0, 4);

  const dateLocale = language === 'tr' ? 'tr-TR' : language === 'ar' ? 'ar-EG' : 'en-US';
  const availableDate = room.nextAvailableDate
    ? new Date(room.nextAvailableDate).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  let statusOverlay = null;
  if (room.visualStatus === 'booked')          statusOverlay = { type: 'booked',       text: t('rooms.page.overlayBooked') };
  else if (room.visualStatus === 'near-available') statusOverlay = { type: 'near-available', text: t('rooms.page.overlaySoon') };
  else if (room.visualStatus === 'maintenance') statusOverlay = { type: 'maintenance',  text: t('rooms.page.overlayMaintenance') };

  const bedsLabel = features.beds
    ? `${features.beds} ${features.beds === 1 ? t('rooms.page.bed') : t('rooms.page.beds')}`
    : null;
  const bathsLabel = features.bathrooms
    ? `${features.bathrooms} ${features.bathrooms === 1 ? t('rooms.page.bath') : t('rooms.page.baths')}`
    : null;

  return (
    <motion.div
      className={`room-card ${isSuite ? 'room-card--suite' : ''} room-card--${room.visualStatus}`}
      whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}>

      <div className="room-card__media" onClick={() => onView(room)}>
        <ImageSlider images={room.images} roomId={room.id} statusOverlay={statusOverlay} />
        <div className="room-card__type-badge" style={{ background: color }}>
          {icon} {typeLabel}
        </div>
        <div className="room-card__floor-tag">
          {t('rooms.page.floorTag', { n: room.floor })}
        </div>
        {features.rating && <div className="room-card__rating">⭐ {features.rating}</div>}
      </div>

      <div className="room-card__body">
        <div className="room-card__header">
          <h3 className="room-card__title">
            {isSuite ? typeLabel : t('rooms.page.roomTitle', { n: room.roomNumber })}
            {isSuite && <span className="room-card__num"> · #{room.roomNumber}</span>}
          </h3>
          <div className={`room-card__status-pill ${STATUS_CSS[statusCssKey] || 'status--available'}`}>
            {statusLabel}
          </div>
        </div>

        <p className="room-card__desc">
          {localizedDesc.substring(0, 110)}{localizedDesc.length > 110 ? '…' : ''}
        </p>

        <div className="room-card__specs">
          <span className="spec-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            {room.capacity} {t('rooms.roomCard.guests')}
          </span>
          {room.size && (
            <span className="spec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              {room.size} {t('rooms.roomCard.sqm')}
            </span>
          )}
          {bedsLabel  && <span className="spec-item">🛏 {bedsLabel}</span>}
          {bathsLabel && <span className="spec-item">🚿 {bathsLabel}</span>}
        </div>

        {featureTags.length > 0 && (
          <div className="room-card__tags">
            {featureTags.map((tag, i) => <span key={i} className="feature-tag">{tag}</span>)}
          </div>
        )}

        {!isBookable && (
          <div className={`room-card__unavail-msg ${room.visualStatus === 'near-available' ? 'msg--near' : 'msg--booked'}`}>
            {room.visualStatus === 'booked' ? (
              <>🔴 <strong>{t('rooms.page.bookedMsg')}</strong>
                {availableDate && <span> {t('rooms.page.availableOn')} <strong>{availableDate}</strong></span>}
              </>
            ) : (
              <>🟣 <strong>{t('rooms.page.checkoutMsg')}</strong>
                {availableDate && <span> {t('rooms.page.freeOn')} <strong>{availableDate}</strong></span>}
              </>
            )}
          </div>
        )}

        <div className="room-card__footer">
          <div className="room-card__price">
            <span className="price-amount">${room.currentPrice?.toLocaleString()}</span>
            <span className="price-night">{t('rooms.page.pricePerNight')}</span>
          </div>
          <div className="room-card__actions">
            <button className="btn-details" onClick={() => onView(room)}>
              {t('rooms.page.details')}
            </button>
            <button
              className={`btn-book ${!isBookable ? 'btn-book--disabled' : ''}`}
              disabled={!isBookable}
              onClick={() => isBookable && onBook(room)}>
              {isBookable ? t('rooms.roomCard.bookNow') : t('rooms.page.unavailable')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Rooms = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [rooms, setRooms]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { loadRooms(); }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomAPI.getAllRooms();
      if (!Array.isArray(data) || data.length === 0) { setRooms(FALLBACK_ROOMS); return; }
      const processed = data.map(room => ({
        ...room,
        features:  typeof room.features  === 'string' ? safeJson(room.features,  {}) : (room.features  || {}),
        amenities: typeof room.amenities === 'string' ? safeJson(room.amenities, {}) : (room.amenities || {}),
        images:    typeof room.images    === 'string' ? safeJson(room.images,    []) : (room.images    || []),
      }));
      setRooms(processed);
    } catch {
      setRooms(FALLBACK_ROOMS);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = useCallback(() => {
    if (filter === 'all')    return rooms.filter(r => !SUITE_TYPES.includes(r.type));
    if (filter === 'suites') return rooms.filter(r =>  SUITE_TYPES.includes(r.type));
    return rooms.filter(r => r.type === filter);
  }, [rooms, filter])();

  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE);
  const start      = (currentPage - 1) * ROOMS_PER_PAGE;
  const paginated  = filteredRooms.slice(start, start + ROOMS_PER_PAGE);

  const handleFilterChange = (f) => { setFilter(f); setCurrentPage(1); };
  const handleBook = (room) => navigate('/booking', { state: { selectedRoom: room } });
  const handleView = (room) => navigate(`/rooms/${room.id}`);

  const counts = {
    all:      rooms.filter(r => !SUITE_TYPES.includes(r.type)).length,
    STANDARD: rooms.filter(r => r.type === 'STANDARD').length,
    SINGLE:   rooms.filter(r => r.type === 'SINGLE').length,
    COUPLE:   rooms.filter(r => r.type === 'COUPLE').length,
    FAMILY:   rooms.filter(r => r.type === 'FAMILY').length,
    DELUXE:   rooms.filter(r => r.type === 'DELUXE').length,
    suites:   rooms.filter(r =>  SUITE_TYPES.includes(r.type)).length,
  };

  const foundType = filter === 'suites' ? t('rooms.page.suitesType') : t('rooms.page.roomsType');

  return (
    <div className="rooms-page">
      <section className="rooms-hero">
        <div className="rooms-hero__overlay" />
        <div className="container">
          <motion.div
            className="rooms-hero__content"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <span className="rooms-hero__label">{t('rooms.page.label')}</span>
            <h1 className="rooms-hero__title">{t('rooms.page.title')}</h1>
            <p className="rooms-hero__sub">
              {t('rooms.page.found', { count: rooms.length, type: foundType })}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="rooms-content">
        <div className="container">
          <div className="rooms-filters">
            {FILTER_IDS.map(id => {
              const label = t(`rooms.allFilters.${id}`);
              return (
                <button
                  key={id}
                  className={`filter-pill ${filter === id ? 'filter-pill--active' : ''}`}
                  onClick={() => handleFilterChange(id)}>
                  {FILTER_ICONS[id]}{label}
                  {counts[id] > 0 && <span className="filter-count">{counts[id]}</span>}
                </button>
              );
            })}
          </div>

          <div className="rooms-meta">
            <span>{t('rooms.page.found', { count: filteredRooms.length, type: foundType })}</span>
            <div className="legend">
              <span className="legend-item legend-item--available">{t('rooms.legend.available')}</span>
              <span className="legend-item legend-item--near">{t('rooms.legend.soon')}</span>
              <span className="legend-item legend-item--booked">{t('rooms.legend.booked')}</span>
            </div>
          </div>

          {loading ? (
            <div className="rooms-loading">
              <div className="loading-ring" />
              <p>{t('rooms.page.loading')}</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="rooms-empty">
              <p>{t('rooms.page.empty')}</p>
              <button className="btn-reset" onClick={() => handleFilterChange('all')}>
                {t('rooms.page.showAll')}
              </button>
            </div>
          ) : (
            <>
              <div className={`rooms-grid ${filter === 'suites' ? 'rooms-grid--suites' : ''}`}>
                {paginated.map((room, i) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}>
                    <RoomCard room={room} onBook={handleBook} onView={handleView} t={t} language={i18n.language} />
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="rooms-pagination">
                  <button className="pg-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    {t('rooms.page.prev')}
                  </button>
                  <div className="pg-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`pg-num ${currentPage === p ? 'pg-num--active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
                    ))}
                  </div>
                  <button className="pg-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    {t('rooms.page.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
