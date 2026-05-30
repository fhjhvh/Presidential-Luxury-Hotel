import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { storeAPI, serviceAPI } from '../../services/api';
import './User.css';

const UserOrders = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/my-orders' } } });
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with email fallback
      let ordersData = { orders: [] };
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
      
      // Fetch service bookings with email fallback
      let servicesData = { bookings: [] };
      try {
        servicesData = await serviceAPI.getMyServiceBookings();
      } catch (e) {
        console.log('Services auth error, trying email fallback:', e.message);
        if (user?.email) {
          try {
            servicesData = await serviceAPI.getServiceBookingsByEmail(user.email);
          } catch (e2) {
            console.log('Services email fallback failed:', e2.message);
          }
        }
      }
      
      setOrders(ordersData.orders || []);
      setServiceBookings(servicesData.bookings || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? A 50% cancellation fee will be applied.')) {
      return;
    }
    try {
      setActionLoading(orderId);
      const result = await storeAPI.cancelOrder(orderId);
      setMessage({ type: 'success', text: result.message });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel order' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelService = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this service booking? A 50% cancellation fee will be applied.')) {
      return;
    }
    try {
      setActionLoading(bookingId);
      const result = await serviceAPI.cancelServiceBooking(bookingId);
      setMessage({ type: 'success', text: result.message });
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel service booking' });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return '#4CAF50';
      case 'PREPARING': return '#FF9800';
      case 'PENDING': return '#2196F3';
      case 'CANCELLED': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const getServiceIcon = (type) => {
    const icons = { spa: '💆', gym: '🏋️', pool: '🏊', driver: '🚗', butler: '🛎️' };
    return icons[type] || '📋';
  };

  return (
    <div className="user-orders-page">
      <div className="user-orders-container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>My Orders & Services</h1>
          <p>Track your orders and service bookings</p>
        </motion.div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
          </div>
        )}

        {/* Tabs */}
        <div className="orders-tabs">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Store Orders ({orders.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            🛎️ Service Bookings ({serviceBookings.length})
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('common.loading')}...</p>
          </div>
        ) : activeTab === 'orders' ? (
          orders.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">🛒</div>
              <h2>No Orders Found</h2>
              <p>You haven't placed any orders yet</p>
              <Link to="/market" className="cta-btn">Visit Store</Link>
            </motion.div>
          ) : (
            <div className="orders-grid">
              {orders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  className="order-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="order-header">
                    <div className="order-number">
                      <span className="label">Order #</span>
                      <span className="value">{order.orderNumber}</span>
                    </div>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-meta">
                    {order.roomNumber && <span>🚪 Room {order.roomNumber}</span>}
                    <span>{order.orderType === 'RESTAURANT' ? '🍽️ Restaurant' : '🛍️ Market'}</span>
                    {order.deliveryType === 'table' && <span>🪑 Dine In</span>}
                    {order.deliveryType === 'room' && <span>🚪 Room Delivery</span>}
                  </div>

                  <div className="order-items">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span className="item-name">{item.item?.name || item.name || 'Item'}</span>
                        <span className="item-qty">×{item.quantity}</span>
                        <span className="item-price">${Number(item.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {(!order.items || order.items.length === 0) && order.notes && (
                      <p className="order-notes-fallback">{order.notes}</p>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total</span>
                      <span className="total-price">${Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}</span>
                    </div>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {['PENDING', 'PREPARING'].includes(order.status) && (
                    <div className="order-actions">
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={actionLoading === order.id}
                      >
                        {actionLoading === order.id ? '...' : '❌ Cancel (50% fee)'}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        ) : (
          serviceBookings.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">🛎️</div>
              <h2>No Service Bookings Found</h2>
              <p>You haven't booked any services yet</p>
              <Link to="/services" className="cta-btn">Explore Services</Link>
            </motion.div>
          ) : (
            <div className="orders-grid">
              {serviceBookings.map((booking, index) => (
                <motion.div 
                  key={booking.id}
                  className="order-card service-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="order-header">
                    <div className="order-number">
                      <span className="label">{getServiceIcon(booking.serviceType)} {booking.serviceType?.toUpperCase()}</span>
                      <span className="value">{booking.bookingNumber}</span>
                    </div>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="order-meta">
                    {booking.roomNumber && <span>🚪 Room: {booking.roomNumber}</span>}
                    <span>📅 Date: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                    {booking.startTime && <span>⏰ Time: {booking.startTime}</span>}
                    {booking.duration && <span>⏱️ Duration: {booking.duration}</span>}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total Price</span>
                      <span className="total-price">${booking.totalPrice?.toFixed(2)}</span>
                    </div>
                    <span className="order-date">
                      Booked: {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(booking.status) && (
                    <div className="order-actions">
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancelService(booking.id)}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? '...' : '❌ Cancel (50% fee)'}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        )}

        <div className="page-actions">
          <Link to="/market" className="action-btn primary">
            <span>🛒</span> Visit Store
          </Link>
          <Link to="/services" className="action-btn primary">
            <span>🛎️</span> Book Services
          </Link>
          <Link to="/profile" className="action-btn secondary">
            <span>👤</span> Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
