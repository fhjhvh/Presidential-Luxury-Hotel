import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { userAPI, bookingAPI, serviceAPI, storeAPI, parkingAPI } from '../../services/api';
import { generateBookingPDF, generateServicePDF, generateOrderPDF } from '../../utils/pdfExport';
import './User.css';

const UserProfile = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [parkingReservations, setParkingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDates, setNewDates] = useState({ checkIn: '', checkOut: '' });
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null, info: null });
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    loyaltyPoints: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    loadUserData();
  }, [isAuthenticated, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Try authenticated endpoint first, then fallback to email-based
      let bookingsData = { bookings: [] };
      try {
        bookingsData = await bookingAPI.getMyBookings();
      } catch (authError) {
        console.log('Auth error, trying email-based lookup:', authError.message);
        if (user?.email) {
          bookingsData = await bookingAPI.getBookingsByEmail(user.email);
        }
      }
      
      // Also fetch service bookings and orders with email fallback
      let serviceBookingsData = { bookings: [] };
      let ordersData = { orders: [] };
      
      try {
        serviceBookingsData = await serviceAPI.getMyServiceBookings();
      } catch (e) {
        console.log('Service auth error, trying email fallback:', e.message);
        if (user?.email) {
          try {
            serviceBookingsData = await serviceAPI.getServiceBookingsByEmail(user.email);
          } catch (e2) {
            console.log('Service email fallback failed:', e2.message);
          }
        }
      }
      
      try {
        ordersData = await storeAPI.getMyOrders();
      } catch (e) {
        console.log('Orders auth error, trying email fallback:', e.message);
        if (user?.email) {
          try {
            ordersData = await storeAPI.getOrdersByEmail(user.email);
          } catch (e2) {
            console.log('Orders email fallback failed:', e2.message);
          }
        }
      }
      
      // Parking reservations (auth → email fallback). Non-fatal.
      let parkingData = { reservations: [] };
      try {
        parkingData = await parkingAPI.getMyReservations();
      } catch (e) {
        if (user?.email) {
          try {
            parkingData = await parkingAPI.getReservationsByEmail(user.email);
          } catch (e2) {
            console.log('Parking email fallback failed:', e2.message);
          }
        }
      }

      const allBookings = bookingsData.bookings || [];
      const allServices = serviceBookingsData.bookings || [];
      const allOrders = ordersData.orders || [];
      const allParking = parkingData.reservations || [];

      setBookings(allBookings);
      setServiceBookings(allServices);
      setOrders(allOrders);
      setParkingReservations(allParking);
      
      // Calculate stats from all booking types
      const activeRoomBookings = allBookings.filter(b => 
        ['CONFIRMED', 'PENDING', 'CHECKED_IN'].includes(b.status)
      ).length;
      const activeServices = allServices.filter(b => 
        ['CONFIRMED', 'PENDING'].includes(b.status)
      ).length;
      const activeOrders = allOrders.filter(o => 
        ['PENDING', 'PREPARING'].includes(o.status)
      ).length;
      
      const totalFromBookings = allBookings.reduce((sum, b) => sum + (b.finalPrice || b.totalPrice || 0), 0);
      const totalFromServices = allServices.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
      const totalFromOrders = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const totalSpent = totalFromBookings + totalFromServices + totalFromOrders;
      
      setStats({
        totalBookings: allBookings.length + allServices.length + allOrders.length,
        activeBookings: activeRoomBookings + activeServices + activeOrders,
        totalSpent: totalSpent,
        loyaltyPoints: Math.floor(totalSpent / 10)
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ── Cancellation policy + 24-hour protection ──────────────────
  // Refund: >7 days → 100% | 24h–7 days → 50% | <24h → not allowed.
  const getCancellationInfo = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const hoursUntil = (checkIn - now) / 3600000;
    const daysUntil  = hoursUntil / 24;
    const total = booking.finalPrice || booking.totalPrice || 0;

    if (hoursUntil < 24) {
      return {
        allowed: false, total, refundPercent: 0, refundAmount: 0, hoursUntil,
        reason: 'This reservation can no longer be modified or cancelled because check-in is less than 24 hours away.',
      };
    }
    const refundPercent = daysUntil > 7 ? 100 : 50;
    const refundAmount = Math.round(total * refundPercent) / 100;
    return { allowed: true, total, refundPercent, refundAmount, hoursUntil };
  };

  // Step 1: request cancel → opens confirmation modal (or blocks if <24h)
  const requestCancelBooking = (booking) => {
    const info = getCancellationInfo(booking);
    if (!info.allowed) {
      setMessage({ type: 'error', text: info.reason });
      return;
    }
    setCancelModal({ open: true, booking, info });
  };

  // Step 2: user confirmed → execute cancellation
  const confirmCancelBooking = async () => {
    const booking = cancelModal.booking;
    if (!booking) return;
    try {
      setActionLoading(booking.id);
      const result = await bookingAPI.cancelBooking(booking.id);
      const refund = cancelModal.info?.refundAmount;
      setMessage({
        type: 'success',
        text: result.message || `Reservation cancelled. Refund: $${Number(refund || 0).toFixed(2)} (${cancelModal.info?.refundPercent}%).`,
      });
      setCancelModal({ open: false, booking: null, info: null });
      loadUserData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel booking' });
    } finally {
      setActionLoading(null);
    }
  };

  // Open date change modal — blocked within 24h of check-in
  const openDateModal = (booking) => {
    const info = getCancellationInfo(booking);
    if (!info.allowed) {
      setMessage({ type: 'error', text: info.reason });
      return;
    }
    setSelectedBooking(booking);
    setNewDates({
      checkIn: new Date(booking.checkInDate).toISOString().split('T')[0],
      checkOut: new Date(booking.checkOutDate).toISOString().split('T')[0]
    });
    setShowDateModal(true);
  };

  // Change booking dates handler
  const handleChangeDate = async () => {
    if (!selectedBooking || !newDates.checkIn || !newDates.checkOut) return;
    
    try {
      setActionLoading(selectedBooking.id);
      const result = await bookingAPI.rescheduleBooking(
        selectedBooking.id, 
        newDates.checkIn, 
        newDates.checkOut
      );
      setMessage({ type: 'success', text: result.message || 'Booking dates updated successfully' });
      setShowDateModal(false);
      setSelectedBooking(null);
      loadUserData(); // Refresh data from backend
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change dates' });
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel service booking handler
  const handleCancelService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to cancel this service?')) return;
    
    try {
      setActionLoading(serviceId);
      await serviceAPI.cancelServiceBooking(serviceId);
      setMessage({ type: 'success', text: 'Service cancelled successfully' });
      loadUserData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel service' });
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel parking reservation handler
  const handleCancelParking = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this parking reservation?')) return;

    try {
      setActionLoading(reservationId);
      await parkingAPI.cancelReservation(reservationId);
      setMessage({ type: 'success', text: 'Parking reservation cancelled' });
      loadUserData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel parking reservation' });
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      setActionLoading(orderId);
      await storeAPI.cancelOrder(orderId);
      setMessage({ type: 'success', text: 'Order cancelled successfully' });
      loadUserData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel order' });
    } finally {
      setActionLoading(null);
    }
  };

  // Check if booking can be cancelled
  const canCancel = (status) => ['PENDING', 'CONFIRMED'].includes(status);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-profile-page">
      {/* Message Display */}
      {message && (
        <div className={`message-toast ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}
      
      {/* Cancellation Confirmation Modal — shows refund before final confirm */}
      {cancelModal.open && cancelModal.booking && (
        <div className="modal-overlay" onClick={() => setCancelModal({ open: false, booking: null, info: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>⚠️ {t('profile.confirmCancelTitle') || 'Cancel this reservation?'}</h3>
            <p>
              {t('profile.room') || 'Room'} {cancelModal.booking.room?.roomNumber} — #{cancelModal.booking.bookingNumber}
            </p>

            <div className="cancel-refund-box">
              <div className="cancel-refund-row">
                <span>{t('profile.reservationTotal') || 'Reservation total'}</span>
                <span>${Number(cancelModal.info?.total || 0).toFixed(2)}</span>
              </div>
              <div className="cancel-refund-row">
                <span>{t('profile.refundPolicy') || 'Refund'} ({cancelModal.info?.refundPercent}%)</span>
                <span className="cancel-refund-amount">${Number(cancelModal.info?.refundAmount || 0).toFixed(2)}</span>
              </div>
              <p className="cancel-refund-note">
                {cancelModal.info?.refundPercent === 100
                  ? (t('profile.refund100') || 'Full refund — more than 7 days before check-in.')
                  : (t('profile.refund50') || 'Partial refund (50%) — within 7 days of check-in.')}
              </p>
            </div>

            <div className="modal-actions">
              <button onClick={() => setCancelModal({ open: false, booking: null, info: null })} className="btn-secondary">
                {t('profile.keepReservation') || 'No, Keep Reservation'}
              </button>
              <button onClick={confirmCancelBooking} className="btn-primary" disabled={actionLoading === cancelModal.booking.id}>
                {actionLoading === cancelModal.booking.id ? '...' : (t('profile.yesContinue') || 'Yes, Continue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Change Modal */}
      {showDateModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Change Booking Dates</h3>
            <p>Room {selectedBooking.room?.roomNumber} - #{selectedBooking.bookingNumber}</p>
            <div className="date-inputs">
              <label>
                Check-in:
                <input 
                  type="date" 
                  value={newDates.checkIn} 
                  onChange={e => setNewDates({...newDates, checkIn: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </label>
              <label>
                Check-out:
                <input 
                  type="date" 
                  value={newDates.checkOut} 
                  onChange={e => setNewDates({...newDates, checkOut: e.target.value})}
                  min={newDates.checkIn || new Date().toISOString().split('T')[0]}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDateModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleChangeDate} className="btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Updating...' : 'Update Dates'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="user-profile-container">
        <motion.div 
          className="user-profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="user-avatar">
            <span>{user?.firstName?.[0] || user?.name?.[0] || '👤'}</span>
          </div>
          <div className="user-info">
            <h1>{user?.firstName} {user?.lastName || user?.name}</h1>
            <p className="user-email">{user?.email}</p>
            <div className="user-badges">
              <span className="badge badge-member">{t('profile.member')}</span>
              {stats.loyaltyPoints > 500 && (
                <span className="badge badge-vip">VIP</span>
              )}
            </div>
          </div>
        </motion.div>

        <div className="user-stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">🏨</div>
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">{t('profile.totalBookings')}</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">📅</div>
            <div className="stat-value">{stats.activeBookings}</div>
            <div className="stat-label">{t('profile.activeBookings')}</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">💰</div>
            <div className="stat-value">${stats.totalSpent.toFixed(0)}</div>
            <div className="stat-label">{t('profile.totalSpent')}</div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.loyaltyPoints}</div>
            <div className="stat-label">{t('profile.loyaltyPoints')}</div>
          </motion.div>
        </div>

        <div className="user-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            {t('profile.overview') || 'Overview'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            🏨 {t('profile.myBookings') || 'My Bookings'}
            {bookings.length > 0 && <span className="tab-badge">{bookings.length}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 {t('profile.myOrders') || 'My Orders'}
            {orders.length > 0 && <span className="tab-badge">{orders.length}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            🛎️ {t('profile.myServices') || 'My Services'}
            {serviceBookings.length > 0 && <span className="tab-badge">{serviceBookings.length}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'parking' ? 'active' : ''}`}
            onClick={() => setActiveTab('parking')}
          >
            🚗 {t('profile.myParking') || 'My Parking'}
            {parkingReservations.length > 0 && <span className="tab-badge">{parkingReservations.length}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            👤 {t('profile.account') || 'Account'}
          </button>
        </div>

        <div className="user-tab-content">
          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <motion.div className="tab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>{t('profile.welcomeBack') || 'Welcome back'}, {user?.firstName || user?.name}!</h2>
              <p>{t('profile.overviewDescription') || 'Manage your reservations, orders, and account from one place.'}</p>

              <div className="quick-actions">
                <button className="action-btn" onClick={() => navigate('/booking')}>
                  <span>🏨</span> {t('profile.bookRoom') || 'Book a Room'}
                </button>
                <button className="action-btn" onClick={() => setActiveTab('bookings')}>
                  <span>📋</span> {t('profile.viewBookings') || 'My Bookings'}
                </button>
                <button className="action-btn" onClick={() => navigate('/services')}>
                  <span>🛎️</span> {t('profile.exploreServices') || 'Services'}
                </button>
                <button className="action-btn" onClick={() => navigate('/market')}>
                  <span>🛒</span> {t('profile.hotelStore') || 'Hotel Store'}
                </button>
                <button className="action-btn" onClick={() => navigate('/restaurant')}>
                  <span>🍽️</span> Restaurant
                </button>
              </div>

              {/* Recent activity snapshot */}
              {!loading && (bookings.length > 0 || orders.length > 0 || serviceBookings.length > 0) && (
                <div className="overview-recent">
                  <h3>{t('profile.recentActivity') || 'Recent Activity'}</h3>
                  <div className="recent-list">
                    {bookings.slice(0, 2).map(b => (
                      <div key={b.id} className="recent-item" onClick={() => setActiveTab('bookings')}>
                        <span className="recent-icon">🏨</span>
                        <div className="recent-info">
                          <span className="recent-title">Room {b.room?.roomNumber} — {b.room?.type}</span>
                          <span className="recent-sub">{new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}</span>
                        </div>
                        <span className={`status ${b.status.toLowerCase()}`}>{b.status}</span>
                      </div>
                    ))}
                    {orders.slice(0, 2).map(o => (
                      <div key={o.id} className="recent-item" onClick={() => setActiveTab('orders')}>
                        <span className="recent-icon">{o.orderType === 'MARKET' ? '🛍️' : '🍽️'}</span>
                        <div className="recent-info">
                          <span className="recent-title">{o.orderType === 'MARKET' ? 'Market Order' : 'Restaurant Order'} #{o.orderNumber}</span>
                          <span className="recent-sub">{o.items?.length || 0} items · ${o.totalPrice}</span>
                        </div>
                        <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
                      </div>
                    ))}
                    {serviceBookings.slice(0, 1).map(s => (
                      <div key={s.id} className="recent-item" onClick={() => setActiveTab('services')}>
                        <span className="recent-icon">🛎️</span>
                        <div className="recent-info">
                          <span className="recent-title">{s.serviceType?.toUpperCase()} Service</span>
                          <span className="recent-sub">{new Date(s.bookingDate).toLocaleDateString()}</span>
                        </div>
                        <span className={`status ${s.status.toLowerCase()}`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── My Bookings ── */}
          {activeTab === 'bookings' && (
            <motion.div className="tab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>🏨 {t('profile.myBookings') || 'My Bookings'}</h2>
              {loading ? (
                <div className="tab-loading"><div className="spinner"></div></div>
              ) : bookings.length === 0 ? (
                <div className="no-bookings">
                  <p>{t('profile.noBookings') || 'No room bookings yet.'}</p>
                  <button className="action-btn primary" onClick={() => navigate('/booking')}>
                    {t('profile.makeFirstBooking') || 'Book a Room'}
                  </button>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map(booking => (
                    <div key={booking.id} className="profile-card profile-card--room">
                      <div className="profile-card__top">
                        <div className="profile-card__headline">
                          <span className="profile-card__icon">🏨</span>
                          <div className="profile-card__title">
                            <h4>Room {booking.room?.roomNumber} — {booking.room?.type}</h4>
                            <p className="profile-card__subtitle">
                              {new Date(booking.checkInDate).toLocaleDateString()} → {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                            <p className="profile-card__tag">#{booking.bookingNumber}</p>
                          </div>
                        </div>
                        <div className="profile-card__meta">
                          <span className={`profile-card__status status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                          <span className="profile-card__price">${booking.finalPrice || booking.totalPrice}</span>
                        </div>
                      </div>
                      {booking.serviceBookings?.length > 0 && (
                        <div className="profile-card__chips">
                          <span className="profile-card__chip">Linked Services</span>
                          {booking.serviceBookings.map(s => (
                            <span key={s.id} className="profile-card__chip">{s.serviceType}</span>
                          ))}
                        </div>
                      )}
                      <div className="profile-card__actions">
                        {canCancel(booking.status) && (
                          <button onClick={() => requestCancelBooking(booking)} className="btn-cancel profile-card__action" disabled={actionLoading === booking.id}>
                            {actionLoading === booking.id ? '...' : 'Cancel'}
                          </button>
                        )}
                        {canCancel(booking.status) && (
                          <button onClick={() => openDateModal(booking)} className="btn-reschedule profile-card__action" disabled={actionLoading === booking.id}>
                            Change Date
                          </button>
                        )}
                        <button onClick={() => generateBookingPDF(booking, 'room')} className="btn-pdf profile-card__action">PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── My Orders ── */}
          {activeTab === 'orders' && (
            <motion.div className="tab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>🛒 {t('profile.myOrders') || 'My Orders'}</h2>
              {loading ? (
                <div className="tab-loading"><div className="spinner"></div></div>
              ) : orders.length === 0 ? (
                <div className="no-bookings">
                  <p>{t('profile.noOrders') || 'No orders yet.'}</p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
                    <button className="action-btn primary" onClick={() => navigate('/market')}>Visit Store</button>
                    <button className="action-btn" onClick={() => navigate('/restaurant')}>Order from Restaurant</button>
                  </div>
                </div>
              ) : (
                <div className="bookings-list">
                  {orders.map(order => (
                    <div key={order.id} className="profile-card profile-card--order">
                      <div className="profile-card__top">
                        <div className="profile-card__headline">
                          <span className="profile-card__icon">{order.orderType === 'MARKET' ? '🛍️' : '🍽️'}</span>
                          <div className="profile-card__title">
                            <h4>{order.orderType === 'MARKET' ? 'Market Order' : 'Restaurant Order'}</h4>
                            <p className="profile-card__subtitle">{new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="profile-card__tag">#{order.orderNumber}{order.roomNumber ? ` · Room ${order.roomNumber}` : ''}</p>
                            <p className="profile-card__detail">{order.items?.length || 0} item(s)</p>
                          </div>
                        </div>
                        <div className="profile-card__meta">
                          <span className={`profile-card__status status ${order.status.toLowerCase()}`}>{order.status}</span>
                          <span className="profile-card__price">${order.totalPrice}</span>
                        </div>
                      </div>
                      {order.items?.length > 0 && (
                        <div className="profile-card__list">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="profile-card__list-item">
                              <span>{item.item?.name || item.name || 'Item'} × {item.quantity}</span>
                              <span>${Number(item.price || 0).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {(!order.items || order.items.length === 0) && order.notes && (
                        <p className="profile-card__note">{order.notes}</p>
                      )}
                      <div className="profile-card__actions">
                        {['PENDING', 'PREPARING'].includes(order.status) && (
                          <button onClick={() => handleCancelOrder(order.id)} className="btn-cancel profile-card__action" disabled={actionLoading === order.id}>
                            {actionLoading === order.id ? '...' : 'Cancel'}
                          </button>
                        )}
                        <button onClick={() => generateOrderPDF(order)} className="btn-pdf profile-card__action">PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── My Services ── */}
          {activeTab === 'services' && (
            <motion.div className="tab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>🛎️ {t('profile.myServices') || 'My Services'}</h2>
              {loading ? (
                <div className="tab-loading"><div className="spinner"></div></div>
              ) : serviceBookings.length === 0 ? (
                <div className="no-bookings">
                  <p>{t('profile.noServices') || 'No service bookings yet.'}</p>
                  <button className="action-btn primary" onClick={() => navigate('/services')}>
                    Explore Services
                  </button>
                </div>
              ) : (
                <div className="bookings-list">
                  {serviceBookings.map(service => (
                    <div key={service.id} className="profile-card profile-card--service">
                      <div className="profile-card__top">
                        <div className="profile-card__headline">
                          <span className="profile-card__icon">{service.serviceType === 'spa' ? '💆' : service.serviceType === 'gym' ? '🏋️' : service.serviceType === 'pool' ? '🏊' : service.serviceType === 'driver' ? '🚗' : service.serviceType === 'butler' ? '🎩' : '🛎️'}</span>
                          <div className="profile-card__title">
                            <h4>
                              {service.serviceType === 'spa' && 'Spa & Massage'}
                              {service.serviceType === 'gym' && 'Gym Access'}
                              {service.serviceType === 'pool' && 'Pool Access'}
                              {service.serviceType === 'driver' && 'Driver Service'}
                              {service.serviceType === 'butler' && 'Butler Service'}
                              {!['spa','gym','pool','driver','butler'].includes(service.serviceType) && service.serviceType}
                            </h4>
                            <p className="profile-card__subtitle">{new Date(service.bookingDate).toLocaleDateString()}{service.startTime && ` at ${service.startTime}`}</p>
                            <p className="profile-card__tag">#{service.bookingNumber}</p>
                          </div>
                        </div>
                        <div className="profile-card__meta">
                          <span className={`profile-card__status status ${service.status.toLowerCase()}`}>{service.status}</span>
                          <span className="profile-card__price">${service.totalPrice}</span>
                        </div>
                      </div>
                      <div className="profile-card__actions">
                        {canCancel(service.status) && (
                          <button onClick={() => handleCancelService(service.id)} className="btn-cancel profile-card__action" disabled={actionLoading === service.id}>
                            {actionLoading === service.id ? '...' : 'Cancel'}
                          </button>
                        )}
                        <button onClick={() => generateServicePDF(service)} className="btn-pdf profile-card__action">PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── My Parking ── */}
          {activeTab === 'parking' && (
            <motion.div className="tab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>🚗 {t('profile.myParking') || 'My Parking'}</h2>
              {loading ? (
                <div className="tab-loading"><div className="spinner"></div></div>
              ) : parkingReservations.length === 0 ? (
                <div className="no-bookings">
                  <p>{t('profile.noParking') || 'No parking reservations yet. Add parking when you book a room.'}</p>
                  <button className="action-btn primary" onClick={() => navigate('/booking')}>
                    {t('profile.makeFirstBooking') || 'Book a Room'}
                  </button>
                </div>
              ) : (
                <div className="bookings-list">
                  {parkingReservations.map(p => {
                    const fmt = (v) => {
                      if (!v) return null;
                      const d = new Date(v);
                      return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString();
                    };
                    const typeLabel = { valet: 'Valet', self: 'Self-Park', vip: 'VIP', ev: 'EV Charging' }[p.parkingType] || p.parkingType;
                    return (
                      <div key={p.id} className="profile-card profile-card--parking">
                        <div className="profile-card__top">
                          <div className="profile-card__headline">
                            <span className="profile-card__icon">🅿️</span>
                            <div className="profile-card__title">
                              <h4>{t('profile.parkingSpot') || 'Parking Spot'} {p.spotNumber}</h4>
                              <p className="profile-card__subtitle">
                                {fmt(p.reservationDate)}{p.startTime && p.endTime && ` · ${fmt(p.startTime)} → ${fmt(p.endTime)}`}
                              </p>
                              <p className="profile-card__tag">#{p.reservationNumber} · {typeLabel}</p>
                            </div>
                          </div>
                          <div className="profile-card__meta">
                            <span className={`profile-card__status status ${String(p.status).toLowerCase()}`}>{p.status}</span>
                            <span className="profile-card__price">{p.price > 0 ? `$${p.price}` : (t('profile.complimentary') || 'Free')}</span>
                          </div>
                        </div>
                        {canCancel(p.status) && (
                          <div className="profile-card__actions">
                            <button onClick={() => handleCancelParking(p.id)} className="btn-cancel profile-card__action" disabled={actionLoading === p.id}>
                              {actionLoading === p.id ? '...' : (t('profile.cancel') || 'Cancel')}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Account ── */}
          {activeTab === 'account' && (
            <motion.div className="tab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>👤 {t('profile.accountSettings') || 'Account Settings'}</h2>
              <div className="settings-section">
                <h3>{t('profile.personalInfo') || 'Personal Info'}</h3>
                <div className="settings-form">
                  <div className="form-row">
                    <label>{t('profile.email') || 'Email'}</label>
                    <input type="email" value={user?.email || ''} disabled />
                  </div>
                  <div className="form-row">
                    <label>{t('profile.phone') || 'Phone'}</label>
                    <input type="tel" value={user?.phone || ''} placeholder={t('profile.addPhone') || 'Add phone number'} />
                  </div>
                </div>
              </div>

              <div className="settings-section danger-zone">
                <h3>{t('profile.dangerZone') || 'Session'}</h3>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 {t('nav.logout') || 'Logout'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
