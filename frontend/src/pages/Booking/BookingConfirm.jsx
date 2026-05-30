import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import LuxuryButton from '../../components/common/LuxuryButton';
import './BookingConfirm.css';

const BookingConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { room, guestData } = location.state || {};

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(guestData?.numberOfGuests || 1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!room) {
    return (
      <div className="booking-confirm-page">
        <div className="error-message">
          <h2>{t('bookingConfirm.noRoom')}</h2>
          <LuxuryButton onClick={() => navigate('/booking')}>
            {t('bookingConfirm.noRoomBack')}
          </LuxuryButton>
        </div>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = parseFloat(room.price.replace(/[^0-9.]/g, ''));
    return pricePerNight * nights;
  };

  const getDiscountInfo = () => {
    if (user?.role === 'GUEST_NEW' || user?.guestProfile?.isFirstVisit) {
      return { rate: 0.20, label: t('bookingConfirm.discountFirst') };
    }
    if (user?.role === 'GUEST_RETURNING' || user?.guestProfile?.totalStays > 0) {
      return { rate: 0.10, label: t('bookingConfirm.discountReturning') };
    }
    return { rate: 0, label: null };
  };

  const discount = getDiscountInfo();
  const total = calculateTotal();
  const discountAmount = total * discount.rate;
  const finalPrice = total - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      setError(t('bookingConfirm.errorDates'));
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError(t('bookingConfirm.errorDateOrder'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        roomId: room.id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        specialRequests: specialRequests || null,
        guestPreferences: guestData || null,
      };

      const booking = await bookingAPI.createBooking(bookingData);
      navigate('/booking-success', { state: { booking } });
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-confirm-page">
      <motion.div
        className="booking-confirm-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>{t('bookingConfirm.pageTitle')}</h1>

        <div className="booking-layout">
          <div className="room-summary">
            <h2>{t('bookingConfirm.roomDetails')}</h2>
            <div className="room-card">
              <h3>{room.name}</h3>
              <p className="room-type">{room.type}</p>
              <p className="room-price">{room.price}</p>
              <div className="room-features">
                {room.features?.map((feature, i) => (
                  <span key={i} className="feature-tag">{feature}</span>
                ))}
              </div>
              <p className="room-capacity">{t('bookingConfirm.capacity', { count: room.capacity })}</p>
            </div>

            {discount.label && (
              <div className="discount-notice">
                <span className="discount-icon">🎉</span>
                <div>
                  <strong>{discount.label}</strong>
                  <p>{t('bookingConfirm.discountMessage')}</p>
                </div>
              </div>
            )}
          </div>

          <div className="booking-form-section">
            <h2>{t('bookingConfirm.bookingInfo')}</h2>
            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>{t('bookingConfirm.checkIn')}</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('bookingConfirm.checkOut')}</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('bookingConfirm.numGuests')}</label>
                <input
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                  min="1"
                  max={room.capacity}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('bookingConfirm.specialRequests')}</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={t('bookingConfirm.requestsPlaceholder')}
                  rows="4"
                />
              </div>

              <div className="price-summary">
                <div className="price-row">
                  <span>{t('bookingConfirm.roomRate', { nights: calculateNights() })}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {discount.rate > 0 && (
                  <div className="price-row discount">
                    <span>{discount.label}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>{t('bookingConfirm.total')}</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="form-actions">
                <LuxuryButton variant="secondary" onClick={() => navigate(-1)} type="button">
                  {t('bookingConfirm.back')}
                </LuxuryButton>
                <LuxuryButton variant="primary" type="submit" disabled={loading}>
                  {loading ? t('bookingConfirm.processing') : t('bookingConfirm.confirm')}
                </LuxuryButton>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirm;
