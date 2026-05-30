import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LuxuryButton from '../../components/common/LuxuryButton';
import './SuiteDetail.css';

const SUITE_META = {
  executive:    { floor: 7, size: '120 sqm', price: 1200,  maxGuests: 3,  beds: '1 King + Sofa', images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200','https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200','https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200'] },
  luxury:       { floor: 7, size: '150 sqm', price: 1800,  maxGuests: 4,  beds: '1 King + 1 Queen Sofa', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200','https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200','https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1200','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200','https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200'] },
  royal:        { floor: 7, size: '200 sqm', price: 2500,  maxGuests: 6,  beds: '1 King Master + 1 Queen Guest', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200','https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1200'] },
  presidential: { floor: 8, size: '500 sqm', price: 10000, maxGuests: 10, beds: '2 King Master + 2 Queen Guest', images: ['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200','https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200'] },
};

const SuiteDetail = () => {
  const { suiteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);

  const meta = SUITE_META[suiteId];
  const suiteTranslation = meta ? t(`suiteDetail.suites.${suiteId}`, { returnObjects: true }) : null;

  if (!meta || !suiteTranslation) {
    return (
      <div className="suite-not-found">
        <h1>{t('suiteDetail.notFound')}</h1>
        <p>{t('suiteDetail.notFoundText')}</p>
        <LuxuryButton onClick={() => navigate('/suites')}>{t('suiteDetail.backToSuites')}</LuxuryButton>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!user) {
      navigate('/auth/login', {
        state: {
          returnTo: `/suites/${suiteId}`,
          message: t('suiteDetail.loginMessage'),
        },
      });
      return;
    }
    navigate('/booking', { state: { selectedSuite: { ...meta, id: suiteId, name: suiteTranslation.name } } });
  };

  const images = meta.images;
  const nextImage = () => setCurrentImage(prev => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage(prev => (prev - 1 + images.length) % images.length);

  const description = Array.isArray(suiteTranslation.description)
    ? suiteTranslation.description
    : [suiteTranslation.description];

  const amenities = Array.isArray(suiteTranslation.amenities) ? suiteTranslation.amenities : [];
  const servicesIncluded = Array.isArray(suiteTranslation.luxuryServicesIncluded) ? suiteTranslation.luxuryServicesIncluded : [];
  const servicesExtra = Array.isArray(suiteTranslation.luxuryServicesExtra) ? suiteTranslation.luxuryServicesExtra : [];

  return (
    <div className="suite-detail-page">
      <section className="suite-gallery">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            className="gallery-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundImage: `url(${images[currentImage]})` }}
          />
        </AnimatePresence>
        <div className="gallery-overlay">
          <div className="gallery-content">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              {suiteTranslation.name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {suiteTranslation.tagline}
            </motion.p>
          </div>
          <button className="gallery-nav prev" onClick={prevImage}>‹</button>
          <button className="gallery-nav next" onClick={nextImage}>›</button>
        </div>
        <div className="gallery-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`thumbnail ${idx === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(idx)}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
      </section>

      <section className="suite-info">
        <div className="suite-info-grid">
          <div className="suite-main-info">
            <div className="suite-specs">
              <div className="spec">
                <span className="spec-icon">📐</span>
                <span className="spec-label">{t('suiteDetail.labels.size')}</span>
                <span className="spec-value">{meta.size}</span>
              </div>
              <div className="spec">
                <span className="spec-icon">🏢</span>
                <span className="spec-label">{t('suiteDetail.labels.floor')}</span>
                <span className="spec-value">{meta.floor}</span>
              </div>
              <div className="spec">
                <span className="spec-icon">👥</span>
                <span className="spec-label">{t('suiteDetail.labels.guests')}</span>
                <span className="spec-value">{t('suiteDetail.labels.upTo', { n: meta.maxGuests })}</span>
              </div>
              <div className="spec">
                <span className="spec-icon">🛏️</span>
                <span className="spec-label">{t('suiteDetail.labels.beds')}</span>
                <span className="spec-value">{meta.beds}</span>
              </div>
            </div>

            <div className="suite-description">
              <h2>{t('suiteDetail.labels.about')}</h2>
              {description.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="suite-amenities">
              <h2>{t('suiteDetail.labels.amenities')}</h2>
              <ul className="amenities-grid">
                {amenities.map((amenity, idx) => (
                  <li key={idx}>✓ {amenity}</li>
                ))}
              </ul>
            </div>

            <div className="suite-services">
              <h2>{t('suiteDetail.labels.luxuryServices')}</h2>
              <div className="services-list">
                {servicesIncluded.map((name, idx) => (
                  <div key={`inc-${idx}`} className="service-item included">
                    <span className="service-name">✓ {name}</span>
                    <span className="service-price">{t('suiteDetail.labels.included')}</span>
                  </div>
                ))}
                {servicesExtra.map((svc, idx) => (
                  <div key={`ext-${idx}`} className="service-item extra">
                    <span className="service-name">+ {svc.name}</span>
                    <span className="service-price">{svc.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="suite-booking-card">
            <div className="booking-card-content">
              <div className="price-display">
                <span className="price-from">{t('suiteDetail.labels.from')}</span>
                <span className="price-amount">${meta.price.toLocaleString()}</span>
                <span className="price-unit">{t('suiteDetail.labels.perNight')}</span>
              </div>
              <div className="booking-highlights">
                <p>✓ {t('suiteDetail.labels.bestRate')}</p>
                <p>✓ {t('suiteDetail.labels.freeCancellation')}</p>
                <p>✓ {t('suiteDetail.labels.memberBenefits')}</p>
              </div>
              <LuxuryButton variant="gold" fullWidth onClick={handleBookNow}>
                {t('suiteDetail.labels.bookSuite')}
              </LuxuryButton>
              <p className="booking-note">
                {t('suiteDetail.labels.callUs')} <strong>+1 (555) 123-4567</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuiteDetail;
