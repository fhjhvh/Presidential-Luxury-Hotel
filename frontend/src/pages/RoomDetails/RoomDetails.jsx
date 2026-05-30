import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { roomAPI } from '../../services/api';
import { getRoomTranslators } from '../../utils/roomLocale';
import BackButton from '../../components/common/BackButton';
import LuxuryButton from '../../components/common/LuxuryButton';
import './RoomDetails.css';

const RoomDetails = () => {
  const { t, i18n } = useTranslation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { tView, tBed, tBathType, tBathFeat, tService, tAmenity, tDescription } = getRoomTranslators(i18n.language);
  
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
      <div className="room-details">
        <BackButton />
        <div className="room-detail-loading">
          <div className="loading-spinner"></div>
          <p>{t('roomDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="room-details">
        <BackButton />
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
    <div className="room-details">
      <BackButton />
      
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
                <p>{tDescription(room.type, room.description)}</p>
              </div>

              {/* View Description */}
              {features?.view && (
                <div className="room-section view-section">
                  <h3>{t('roomDetail.view')}</h3>
                  <p className="view-description">{tView(features.view)}</p>
                </div>
              )}

              {/* Bed Type */}
              {features?.bed_type && (
                <div className="room-section bed-section">
                  <h3>{t('roomDetail.bed')}</h3>
                  <p>{tBed(features.bed_type)}</p>
                </div>
              )}

              {/* Bathroom Details */}
              {features?.bathroom && (
                <div className="room-section bathroom-section">
                  <h3>{t('roomDetail.bathroom')} — {tBathType(features.bathroom?.type)}</h3>
                  <ul className="bathroom-features">
                    {(Array.isArray(features.bathroom?.features) ? features.bathroom.features : []).map((feature, idx) => (
                      <li key={idx}>{tBathFeat(feature)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Services */}
              {Array.isArray(features?.services) && features.services.length > 0 && (
                <div className="room-section services-section">
                  <h3>{t('roomDetail.services')}</h3>
                  <ul className="services-list">
                    {features.services.map((service, idx) => (
                      <li key={idx}>{tService(service)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Amenities */}
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

export default RoomDetails;
