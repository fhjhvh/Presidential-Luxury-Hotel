import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { roomAPI } from '../../services/api';
import LuxuryButton from '../../components/common/LuxuryButton';
import './RoomDetail.css';

// Direct translation maps for backend-provided string values (no i18n key resolution)
const ROOM_TR = {
  views: {
    'City View': 'Şehir Manzarası',
    'Ocean View': 'Deniz Manzarası',
    'Pool View': 'Havuz Manzarası',
    'Garden View': 'Bahçe Manzarası',
    'Panoramic City': 'Panoramik Şehir',
    'Skyline Panorama': 'Şehir Silüeti Panoraması',
    '360° Panorama': '360° Panorama',
    '360° Horizon': '360° Ufuk',
    'Panoramic Skyline': 'Panoramik Silüet',
  },
  bedTypes: {
    'King Bed': 'King Yatak',
    'Queen Bed': 'Queen Yatak',
    'Single Bed': 'Tek Kişilik Yatak',
    'Queen + Bunk': 'Queen + Ranza',
    'Emperor Bed': 'Emperor Yatak',
    'Emperor + King': 'Emperor + King',
    'Twin Beds': 'İkiz Yataklar',
  },
  amenities: {
    wifi: 'Wi-Fi',
    tv: 'TV',
    smart_tv: 'Akıllı TV',
    air_conditioning: 'Klima',
    minibar: 'Mini Bar',
    safe: 'Kasa',
    hairdryer: 'Saç Kurutma Makinesi',
    iron: 'Ütü',
    desk: 'Çalışma Masası',
    espresso_machine: 'Espresso Makinesi',
    nespresso: 'Nespresso',
    bathrobes: 'Bornoz',
    slippers: 'Terlik',
    bluetooth_speaker: 'Bluetooth Hoparlör',
    sound_system: 'Ses Sistemi',
    wine_fridge: 'Şarap Buzdolabı',
    premium_toiletries: 'Premium Tuvalet Malzemeleri',
    yoga_mat: 'Yoga Matı',
    smart_home: 'Akıllı Ev',
    home_theater: 'Ev Sineması',
    full_bar: 'Tam Bar',
    jacuzzi: 'Jakuzi',
    butler_pantry: 'Butler Servisi',
    luxury_linens: 'Lüks Nevresim',
    pillow_menu: 'Yastık Menüsü',
    video_conferencing: 'Video Konferans',
    multi_room_audio: 'Çok Odalı Ses',
    wine_cellar: 'Şarap Mahzeni',
    massage_chair: 'Masaj Koltuğu',
    butler_service: 'Butler Hizmeti',
    printer: 'Yazıcı',
    standing_desk: 'Ayaklı Çalışma Masası',
    smart_home_automation: 'Akıllı Ev Otomasyonu',
    private_cinema: 'Özel Sinema',
    chef_kitchen: 'Şef Mutfağı',
    wine_room: 'Şarap Odası',
    helipad_access: 'Helipad Erişimi',
    limousine_service: 'Limuzin Hizmeti',
    everything_included: 'Her Şey Dahil',
    personal_staff: 'Kişisel Personel',
    private_chef: 'Özel Şef',
    chauffeur: 'Şoför',
    yacht_access: 'Yat Erişimi',
    helicopter_transfers: 'Helikopter Transferi',
    concierge_24h: '7/24 Concierge',
    balcony: 'Balkon',
    private_pool: 'Özel Havuz',
    separate_living: 'Ayrı Oturma Odası',
    separate_living_area: 'Ayrı Yaşam Alanı',
    dining_area: 'Yemek Alanı',
  },
  bathroomTypes: {
    'Standard Bath': 'Standart Banyo',
    'Luxury Bath': 'Lüks Banyo',
    'Marble Bathroom': 'Mermer Banyo',
    'Rain Shower': 'Yağmur Duşu',
    'Steam Shower': 'Buhar Duşu',
    'Jacuzzi Bath': 'Jakuzili Banyo',
    'Double Vanity': 'Çift Lavabo',
    'En-suite Bathroom': 'Özel Banyo',
  },
  bathroomFeatures: {
    'Shower': 'Duş',
    'Bathtub': 'Küvet',
    'Hair Dryer': 'Saç Kurutma Makinesi',
    'Magnifying Mirror': 'Büyüteçli Ayna',
    'Premium Toiletries': 'Premium Tuvalet Malzemeleri',
    'Heated Floor': 'Isıtmalı Zemin',
    'Rain Shower': 'Yağmur Duşu',
    'Dual Sink': 'Çift Lavabo',
    'Soaking Tub': 'Banyolu Küvet',
    'Bidet': 'Bide',
    'Luxury Toiletries': 'Lüks Tuvalet Malzemeleri',
    'Towels': 'Havlu',
    'Bathrobes': 'Bornoz',
    'Slippers': 'Terlik',
    'Separate Shower': 'Ayrı Duş',
    'Steam Room': 'Buhar Odası',
  },
  services: {
    'Daily Housekeeping': 'Günlük Oda Temizliği',
    '24/7 Room Service': '7/24 Oda Servisi',
    'Room Service': 'Oda Servisi',
    'Turndown Service': 'Yataktan Hazırlama Servisi',
    'Laundry Service': 'Çamaşır Servisi',
    'Concierge Service': 'Concierge Hizmeti',
    'Airport Transfer': 'Havalimanı Transferi',
    'Valet Parking': 'Vale Park',
    'Business Services': 'İş Hizmetleri',
    'Wake-up Call': 'Uyandırma Servisi',
    'Newspaper Delivery': 'Gazete Servisi',
    'Welcome Drink': 'Karşılama İçeceği',
    'Dedicated Butler Service': 'Kişisel Butler Hizmeti',
    'Butler Service': 'Butler Hizmeti',
    'Private Check-in': 'Özel Check-in',
    'In-Suite Dining': 'Oda İçi Yemek',
    'Complimentary Breakfast': 'Ücretsiz Kahvaltı',
    'Spa Access': 'Spa Girişi',
    'Fitness Center Access': 'Fitness Merkezi Girişi',
    'Pool Access': 'Havuz Girişi',
    'Pressing Service': 'Ütüleme Hizmeti',
    'Free WiFi': 'Ücretsiz Wi-Fi',
    'Free Parking': 'Ücretsiz Otopark',
  },
  typeDescriptions: {
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
};

const ROOM_VALUE_MAPS = { tr: ROOM_TR };

const RoomDetail = () => {
  const { t, i18n } = useTranslation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomAPI.getRoomById(roomId);
      
      // Parse JSON strings
      const processedRoom = {
        ...data,
        features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features || {},
        amenities: typeof data.amenities === 'string' ? JSON.parse(data.amenities) : data.amenities || {},
        images: typeof data.images === 'string' ? JSON.parse(data.images) : data.images || []
      };
      
      setRoom(processedRoom);
    } catch (err) {
      console.error('Error loading room:', err);
      setError('Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  const maps = ROOM_VALUE_MAPS[i18n.language] || {};

  const tView     = (v)   => maps.views?.[v]            ?? v ?? '';
  const tBed      = (b)   => maps.bedTypes?.[b]         ?? b ?? '';
  const tBathType = (bt)  => maps.bathroomTypes?.[bt]   ?? bt ?? '';
  const tBathFeat = (bf)  => maps.bathroomFeatures?.[bf] ?? bf ?? '';
  const tService  = (s)   => maps.services?.[s]         ?? s ?? '';
  const tAmenity  = (key) => maps.amenities?.[key]      ?? key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const tDescription = () => maps.typeDescriptions?.[room?.type] || room?.description || '';

  const handleBookNow = () => {
    navigate('/booking', { state: { selectedRoom: room } });
  };

  const nextImage = () => {
    if (room?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
    return stars;
  };

  const getAmenityIcon = (key) => {
    const icons = {
      wifi: '📶', tv: '📺', smart_tv: '📺', air_conditioning: '❄️',
      minibar: '🍷', safe: '🔒', hairdryer: '💨', iron: '👔',
      desk: '🖥️', espresso_machine: '☕', nespresso: '☕',
      bathrobes: '🥋', slippers: '🩴', bluetooth_speaker: '🔊',
      sound_system: '🎵', wine_fridge: '🍾', premium_toiletries: '🧴',
      yoga_mat: '🧘', smart_home: '🏠', home_theater: '🎬',
      full_bar: '🍸', jacuzzi: '🛁', butler_pantry: '🍽️',
      luxury_linens: '🛏️', pillow_menu: '💤', video_conferencing: '💻',
      multi_room_audio: '🎧', wine_cellar: '🍇', massage_chair: '💆',
      butler_service: '🎩', printer: '🖨️', standing_desk: '🖥️',
      smart_home_automation: '🤖', private_cinema: '🎥', chef_kitchen: '👨‍🍳',
      wine_room: '🍷', helipad_access: '🚁', limousine_service: '🚗',
      everything_included: '✨', personal_staff: '👥', private_chef: '👨‍🍳',
      chauffeur: '🚘', yacht_access: '⛵', helicopter_transfers: '🚁',
      concierge_24h: '🔔'
    };
    return icons[key] || '✓';
  };

  if (loading) {
    return (
      <div className="room-detail-page">
        <div className="room-detail-loading">
          <div className="loading-spinner"></div>
          <p>{t('roomDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="room-detail-page">
        <div className="room-detail-error">
          <h2>{t('roomDetail.notFound')}</h2>
          <p>{error || t('roomDetail.notFoundText')}</p>
          <LuxuryButton variant="primary" onClick={() => navigate('/rooms')}>
            {t('roomDetail.backToRooms')}
          </LuxuryButton>
        </div>
      </div>
    );
  }

  const { features, amenities, images } = room;

  return (
    <div className="room-detail-page">
      {/* Image Gallery Section */}
      <section className="room-gallery-section">
        <div className="main-image-container">
          {images && images.length > 0 ? (
            <>
              <img 
                src={images[currentImageIndex]} 
                alt={`Room ${room.roomNumber} - Image ${currentImageIndex + 1}`}
                className="main-image"
                onClick={() => setShowGallery(true)}
              />
              <button className="gallery-nav prev" onClick={prevImage}>❮</button>
              <button className="gallery-nav next" onClick={nextImage}>❯</button>
              <div className="image-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
              <button className="view-all-btn" onClick={() => setShowGallery(true)}>
                {t('roomDetail.viewPhotos', { count: images.length })}
              </button>
            </>
          ) : (
            <div className="no-image-placeholder">
              <span>🏨</span>
              <p>{t('roomDetail.noImages')}</p>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images && images.length > 1 && (
          <div className="thumbnail-strip">
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Room Info Section */}
      <section className="room-info-section">
        <div className="container">
          <div className="room-info-grid">
            {/* Left Column - Details */}
            <div className="room-details-column">
              <div className="room-header">
                <div className="room-type-badge">{t(`rooms.types.${room.type}`, { defaultValue: room.type })}</div>
                <h1 className="room-title">{t('roomDetail.roomTitle')} {room.roomNumber}</h1>
                <div className="room-meta">
                  <span className="floor-info">{t('roomDetail.floor')} {room.floor}</span>
                  <span className="separator">•</span>
                  <span className="size-info">{room.size} m²</span>
                  <span className="separator">•</span>
                  <span className="capacity-info">{room.capacity} {t('roomDetail.guests')}</span>
                </div>
                
                {features?.rating && (
                  <div className="room-rating">
                    <div className="stars">{getRatingStars(features.rating)}</div>
                    <span className="rating-value">{features.rating}</span>
                  </div>
                )}
              </div>

              <div className="room-description">
                <h3>{t('roomDetail.description')}</h3>
                <p>{tDescription()}</p>
              </div>

              {features?.view && (
                <div className="room-section view-section">
                  <h3>{t('roomDetail.view')}</h3>
                  <p className="view-description">{tView(features.view)}</p>
                </div>
              )}

              {features?.bed_type && (
                <div className="room-section bed-section">
                  <h3>{t('roomDetail.bed')}</h3>
                  <p>{tBed(features.bed_type)}</p>
                </div>
              )}

              {features?.bathroom && (
                <div className="room-section bathroom-section">
                  <h3>{t('roomDetail.bathroom')} — {tBathType(features.bathroom.type)}</h3>
                  <ul className="bathroom-features">
                    {features.bathroom.features?.map((feature, idx) => (
                      <li key={idx}>{tBathFeat(feature)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {features?.services && features.services.length > 0 && (
                <div className="room-section services-section">
                  <h3>{t('roomDetail.services')}</h3>
                  <ul className="services-list">
                    {features.services.map((service, idx) => (
                      <li key={idx}>{tService(service)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {amenities && Object.keys(amenities).length > 0 && (
                <div className="room-section amenities-section">
                  <h3>{t('roomDetail.amenities')}</h3>
                  <div className="amenities-grid">
                    {Object.entries(amenities)
                      .filter(([_, value]) => value === true)
                      .map(([key]) => (
                        <div key={key} className="amenity-item">
                          <span className="amenity-icon">{getAmenityIcon(key)}</span>
                          <span className="amenity-name">{tAmenity(key)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="booking-card-column">
              <div className="booking-card">
                <div className="price-section">
                  <span className="price-label">{t('roomDetail.pricePerNight')}</span>
                  <span className="price-value">${room.currentPrice}</span>
                  {room.basePrice !== room.currentPrice && (
                    <span className="original-price">${room.basePrice}</span>
                  )}
                </div>

                <div className="room-highlights">
                  {features?.view && (
                    <div className="highlight-item">
                      <span className="highlight-icon">🌅</span>
                      <span>{tView(features.view)}</span>
                    </div>
                  )}
                  {features?.bathroom?.type && (
                    <div className="highlight-item">
                      <span className="highlight-icon">🛁</span>
                      <span>{tBathType(features.bathroom.type)}</span>
                    </div>
                  )}
                  <div className="highlight-item">
                    <span className="highlight-icon">👥</span>
                    <span>{t('roomDetail.upToGuests', { count: room.capacity })}</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">📐</span>
                    <span>{t('roomDetail.roomSize', { size: room.size })}</span>
                  </div>
                </div>

                <div className="availability-status">
                  <span className={`status-badge ${room.status?.toLowerCase()}`}>
                    {room.status === 'AVAILABLE' ? t('roomDetail.available') : room.status}
                  </span>
                </div>

                <LuxuryButton 
                  variant="primary" 
                  size="large" 
                  fullWidth
                  onClick={handleBookNow}
                  disabled={room.status !== 'AVAILABLE'}
                >
                  {t('roomDetail.bookNow')}
                </LuxuryButton>

                <p className="booking-note">
                  {t('roomDetail.freeCancellation')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="close-gallery" onClick={() => setShowGallery(false)}>×</button>
            <div className="gallery-content">
              <button className="gallery-nav-modal prev" onClick={prevImage}>❮</button>
              <img 
                src={images[currentImageIndex]} 
                alt={`Room ${room.roomNumber} - Image ${currentImageIndex + 1}`}
                className="gallery-image"
              />
              <button className="gallery-nav-modal next" onClick={nextImage}>❯</button>
            </div>
            <div className="gallery-thumbnails">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`gallery-thumb ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetail;
