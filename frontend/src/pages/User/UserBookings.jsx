import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, serviceAPI, storeAPI } from '../../services/api';
import { generateBookingPDF } from '../../utils/pdfExport';
import './User.css';

const UserBookings = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ checkIn: '', checkOut: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/my-bookings' } } });
      return;
    }
    loadBookings();
  }, [isAuthenticated, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      let data = { bookings: [] };
      
      // Try authenticated endpoint first, then fallback to email-based
      try {
        data = await bookingAPI.getMyBookings();
      } catch (authError) {
        console.log('Auth error, trying email-based lookup:', authError.message);
        if (user?.email) {
          data = await bookingAPI.getBookingsByEmail(user.email);
        }
      }
      
      setBookings(data.bookings || data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A 50% cancellation fee will be applied.')) {
      return;
    }
    
    try {
      setActionLoading(bookingId);
      const result = await bookingAPI.cancelBooking(bookingId);
      setMessage({ type: 'success', text: result.message });
      loadBookings();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel booking' });
    } finally {
      setActionLoading(null);
    }
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setRescheduleData({
      checkIn: new Date(booking.checkInDate).toISOString().split('T')[0],
      checkOut: new Date(booking.checkOutDate).toISOString().split('T')[0]
    });
    setShowRescheduleModal(true);
  };

  const handleRescheduleBooking = async () => {
    if (!rescheduleData.checkIn || !rescheduleData.checkOut) {
      setMessage({ type: 'error', text: 'Please select new dates' });
      return;
    }

    try {
      setActionLoading(selectedBooking.id);
      const result = await bookingAPI.rescheduleBooking(
        selectedBooking.id,
        rescheduleData.checkIn,
        rescheduleData.checkOut
      );
      setMessage({ type: 'success', text: result.message });
      setShowRescheduleModal(false);
      setSelectedBooking(null);
      loadBookings();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to reschedule booking' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['CONFIRMED', 'PENDING', 'CHECKED_IN'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'CHECKED_OUT';
    if (filter === 'cancelled') return booking.status === 'CANCELLED';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      case 'CHECKED_IN': return '#2196F3';
      case 'CHECKED_OUT': return '#9E9E9E';
      case 'CANCELLED': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-bookings-page">
      <div className="user-bookings-container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{t('bookings.myBookings')}</h1>
          <p>{t('bookings.manageYourReservations')}</p>
        </motion.div>

        <div className="bookings-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('bookings.all')} ({bookings.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            {t('bookings.active')}
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            {t('bookings.completed')}
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            {t('bookings.cancelled')}
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('common.loading')}...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">📋</div>
            <h2>{t('bookings.noBookingsFound')}</h2>
            <p>{t('bookings.startBooking')}</p>
            <Link to="/booking" className="cta-btn">
              {t('bookings.bookNow')}
            </Link>
          </motion.div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                className="booking-card-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="booking-card-header">
                  <div className="booking-number">
                    <span className="label">{t('bookings.bookingNumber')}</span>
                    <span className="value">{booking.bookingNumber}</span>
                  </div>
                  <span 
                    className="booking-status-badge"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="booking-card-body">
                  <div className="room-info">
                    <h3>🏨 {t('bookings.room')} {booking.room?.roomNumber}</h3>
                    <p>{booking.room?.type} • {t('bookings.floor')} {booking.room?.floor}</p>
                  </div>

                  <div className="dates-info">
                    <div className="date-block">
                      <span className="date-label">{t('bookings.checkIn')}</span>
                      <span className="date-value">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="date-separator">
                      <span className="nights">
                        {calculateNights(booking.checkInDate, booking.checkOutDate)} {t('bookings.nights')}
                      </span>
                      <div className="arrow">→</div>
                    </div>
                    <div className="date-block">
                      <span className="date-label">{t('bookings.checkOut')}</span>
                      <span className="date-value">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span>{t('bookings.guests')}</span>
                      <span>{booking.numberOfGuests}</span>
                    </div>
                    <div className="detail-row">
                      <span>{t('bookings.totalPrice')}</span>
                      <span className="price">${booking.finalPrice}</span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="special-requests">
                      <span className="label">{t('bookings.specialRequests')}:</span>
                      <p>{booking.specialRequests}</p>
                    </div>
                  )}

                  {/* Linked Services Section */}
                  {booking.serviceBookings && booking.serviceBookings.length > 0 && (
                    <div className="linked-services-section">
                      <h4>🎯 Services for this Room</h4>
                      <div className="linked-items-list">
                        {booking.serviceBookings.map(service => (
                          <div key={service.id} className="linked-item">
                            <div className="linked-item-info">
                              <span className="linked-item-type">
                                {service.serviceType === 'spa' && '💆'}
                                {service.serviceType === 'gym' && '🏋️'}
                                {service.serviceType === 'pool' && '🏊'}
                                {service.serviceType === 'driver' && '🚗'}
                                {service.serviceType === 'butler' && '🎩'}
                                {' '}{service.serviceType.toUpperCase()}
                              </span>
                              <span className="linked-item-date">
                                {new Date(service.bookingDate).toLocaleDateString()}
                                {service.startTime && ` at ${service.startTime}`}
                              </span>
                            </div>
                            <div className="linked-item-price">
                              <span className={`linked-item-status status-${service.status.toLowerCase()}`}>
                                {service.status}
                              </span>
                              <span>${service.totalPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linked Orders Section */}
                  {booking.orders && booking.orders.length > 0 && (
                    <div className="linked-orders-section">
                      <h4>🛒 Orders for this Room</h4>
                      <div className="linked-items-list">
                        {booking.orders.map(order => (
                          <div key={order.id} className="linked-item">
                            <div className="linked-item-info">
                              <span className="linked-item-type">
                                {order.orderType === 'MARKET' ? '🛍️ Market' : '🍽️ Restaurant'}
                              </span>
                              <span className="linked-item-date">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span className="linked-item-items">
                                {order.items?.length || 0} items
                              </span>
                            </div>
                            <div className="linked-item-price">
                              <span className={`linked-item-status status-${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                              <span>${order.totalPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="booking-card-footer">
                  <span className="booked-date">
                    {t('bookings.bookedOn')} {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                  <div className="booking-actions">
                    <button 
                      className="pdf-btn"
                      onClick={() => generateBookingPDF(booking, 'room')}
                    >
                      📄 Print/PDF
                    </button>
                    {['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(booking.status) && (
                      <>
                        <button 
                          className="reschedule-btn"
                          onClick={() => openRescheduleModal(booking)}
                          disabled={actionLoading === booking.id}
                        >
                          📅 Reschedule (+20%)
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                        >
                          {actionLoading === booking.id ? '...' : '❌ Cancel (50% fee)'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Reschedule Booking</h3>
              <p className="modal-warning">⚠️ A 20% reschedule fee will be applied to the new booking price.</p>
              
              <div className="modal-form">
                <div className="form-group">
                  <label>New Check-in Date</label>
                  <input
                    type="date"
                    value={rescheduleData.checkIn}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>New Check-out Date</label>
                  <input
                    type="date"
                    value={rescheduleData.checkOut}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, checkOut: e.target.value })}
                    min={rescheduleData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowRescheduleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleRescheduleBooking}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="page-actions">
          <Link to="/booking" className="action-btn primary">
            <span>➕</span> {t('bookings.newBooking')}
          </Link>
          <Link to="/profile" className="action-btn secondary">
            <span>👤</span> {t('bookings.backToProfile')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
