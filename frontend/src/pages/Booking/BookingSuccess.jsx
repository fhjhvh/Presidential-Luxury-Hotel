import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LuxuryButton from '../../components/common/LuxuryButton';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { booking } = location.state || {};

  useEffect(() => {
    if (!booking) {
      navigate('/booking');
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const locale = i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const checkInDate = new Date(booking.checkInDate).toLocaleDateString(locale, dateOptions);
  const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString(locale, dateOptions);

  const discountType = booking.discountApplied / booking.totalPrice === 0.20
    ? t('bookingSuccess.discountFirst')
    : t('bookingSuccess.discountReturning');

  return (
    <div className="booking-success-page">
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          ✓
        </motion.div>

        <h1>{t('bookingSuccess.title')}</h1>
        <p className="success-subtitle">{t('bookingSuccess.subtitle')}</p>

        <div className="booking-details-card">
          <div className="booking-number-section">
            <span className="label">{t('bookingSuccess.bookingNumber')}</span>
            <span className="booking-number">{booking.bookingNumber}</span>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">{t('bookingSuccess.guestName')}</span>
              <span className="detail-value">
                {booking.user.firstName} {booking.user.lastName}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">{t('bookingSuccess.room')}</span>
              <span className="detail-value">{t('bookingSuccess.roomPrefix')} {booking.room.roomNumber}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">{t('bookingSuccess.roomType')}</span>
              <span className="detail-value">{booking.room.type}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">{t('bookingSuccess.checkIn')}</span>
              <span className="detail-value">{checkInDate}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">{t('bookingSuccess.checkOut')}</span>
              <span className="detail-value">{checkOutDate}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">{t('bookingSuccess.guests')}</span>
              <span className="detail-value">{booking.numberOfGuests}</span>
            </div>
          </div>

          <div className="pricing-section">
            <div className="price-row">
              <span>{t('bookingSuccess.totalAmount')}</span>
              <span className="original-price">${booking.totalPrice.toFixed(2)}</span>
            </div>
            {booking.discountApplied > 0 && (
              <div className="price-row discount">
                <span>{t('bookingSuccess.discountApplied')}</span>
                <span>-${booking.discountApplied.toFixed(2)}</span>
              </div>
            )}
            <div className="price-row total">
              <span>{t('bookingSuccess.finalPrice')}</span>
              <span>${booking.finalPrice.toFixed(2)}</span>
            </div>
          </div>

          {booking.discountApplied > 0 && (
            <div className="discount-notice">
              <span className="icon">🎉</span>
              <span>
                {t('bookingSuccess.discountMsg', {
                  amount: booking.discountApplied.toFixed(2),
                  type: discountType
                })}
              </span>
            </div>
          )}
        </div>

        <div className="next-steps">
          <h3>{t('bookingSuccess.nextSteps')}</h3>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-icon">📧</span>
              <h4>{t('bookingSuccess.confirmEmail')}</h4>
              <p>{t('bookingSuccess.confirmEmailText')}</p>
            </div>
            <div className="step-card">
              <span className="step-icon">📱</span>
              <h4>{t('bookingSuccess.stayUpdated')}</h4>
              <p>{t('bookingSuccess.stayUpdatedText')}</p>
            </div>
            <div className="step-card">
              <span className="step-icon">🏨</span>
              <h4>{t('bookingSuccess.checkInStep')}</h4>
              <p>{t('bookingSuccess.checkInStepText')}</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <LuxuryButton variant="secondary" onClick={() => navigate('/dashboard')}>
            {t('bookingSuccess.dashboard')}
          </LuxuryButton>
          <LuxuryButton variant="primary" onClick={() => navigate('/')}>
            {t('bookingSuccess.backHome')}
          </LuxuryButton>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
