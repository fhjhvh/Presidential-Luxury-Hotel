import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { chatAPI, bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ReceptionDashboard.css';

const ReceptionDashboard = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadActiveSessions();
    loadRecentBookings();
    const interval = setInterval(() => {
      loadActiveSessions();
      if (selectedSession) {
        loadSessionMessages(selectedSession.id);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedSession]);

  const loadActiveSessions = async () => {
    try {
      const sessions = await chatAPI.getActiveSessions();
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadRecentBookings = async () => {
    try {
      const bookings = await bookingAPI.getAllBookings({ status: 'PENDING' });
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const loadSessionMessages = async (sessionId) => {
    try {
      const session = await chatAPI.getSession(sessionId);
      setMessages(session.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSessionSelect = async (session) => {
    setSelectedSession(session);
    await loadSessionMessages(session.id);
    
    if (!session.staffId && user?.staffProfile?.id) {
      await chatAPI.assignStaff(session.id, user.staffProfile.id);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    setLoading(true);
    try {
      await chatAPI.sendMessage(selectedSession.id, newMessage, 'text');
      setNewMessage('');
      await loadSessionMessages(selectedSession.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async (sessionId) => {
    try {
      await chatAPI.closeSession(sessionId);
      setSelectedSession(null);
      await loadActiveSessions();
    } catch (error) {
      console.error('Failed to close session:', error);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, status);
      await loadRecentBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  return (
    <div className="reception-dashboard">
      <header className="dashboard-header">
        <h1>Reception Dashboard</h1>
        <div className="user-info">
          <span>{user?.firstName} {user?.lastName}</span>
          <span className="role-badge">{user?.role?.replace('STAFF_', '')}</span>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="sessions-panel">
          <div className="panel-header">
            <h2>Active Guest Chats</h2>
            <span className="badge">{activeSessions.length}</span>
          </div>
          <div className="sessions-list">
            {activeSessions.map((session) => (
              <motion.div
                key={session.id}
                className={`session-card ${selectedSession?.id === session.id ? 'active' : ''}`}
                onClick={() => handleSessionSelect(session)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="session-avatar">
                  {session.guest.firstName[0]}{session.guest.lastName[0]}
                </div>
                <div className="session-info">
                  <h3>{session.guest.firstName} {session.guest.lastName}</h3>
                  <p className="session-email">{session.guest.email}</p>
                  {session.messages?.[0] && (
                    <p className="last-message">{session.messages[0].message.substring(0, 50)}...</p>
                  )}
                </div>
                {!session.staffId && <span className="unassigned-badge">New</span>}
              </motion.div>
            ))}
            {activeSessions.length === 0 && (
              <div className="empty-state">
                <p>No active chat sessions</p>
              </div>
            )}
          </div>
        </div>

        <div className="chat-panel">
          {selectedSession ? (
            <>
              <div className="chat-header">
                <div className="guest-info">
                  <h3>{selectedSession.guest.firstName} {selectedSession.guest.lastName}</h3>
                  <p>{selectedSession.guest.email}</p>
                </div>
                <button 
                  className="close-session-btn"
                  onClick={() => handleCloseSession(selectedSession.id)}
                >
                  Close Session
                </button>
              </div>

              <div className="messages-container">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender.id === user?.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-header">
                        <span className="sender-name">
                          {msg.sender.firstName} {msg.sender.lastName}
                        </span>
                        <span className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !newMessage.trim()}>
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </form>

              {selectedSession.guestData && (
                <div className="guest-preferences">
                  <h4>Guest Preferences</h4>
                  <div className="preferences-grid">
                    {Object.entries(selectedSession.guestData).map(([key, value]) => (
                      <div key={key} className="preference-item">
                        <span className="pref-label">{key}:</span>
                        <span className="pref-value">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="chat-placeholder">
              <div className="placeholder-icon">💬</div>
              <p>Select a guest to start chatting</p>
            </div>
          )}
        </div>

        <div className="bookings-panel">
          <div className="panel-header">
            <h2>Pending Bookings</h2>
            <span className="badge">{recentBookings.length}</span>
          </div>
          <div className="bookings-list">
            {recentBookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="booking-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="booking-header">
                  <span className="booking-number">{booking.bookingNumber}</span>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-info">
                  <p><strong>{booking.user.firstName} {booking.user.lastName}</strong></p>
                  <p>Room: {booking.room.roomNumber}</p>
                  <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p className="booking-price">${booking.finalPrice}</p>
                </div>
                <div className="booking-actions">
                  <button
                    className="btn-confirm"
                    onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                  >
                    Confirm
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => handleUpdateBookingStatus(booking.id, 'CANCELLED')}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ))}
            {recentBookings.length === 0 && (
              <div className="empty-state">
                <p>No pending bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
