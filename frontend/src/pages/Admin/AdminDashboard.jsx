import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateBookingPDF, generateOrderPDF, generateReportPDF } from '../../utils/pdfExport';
import './AdminDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fixed floors data
const FIXED_FLOORS = [
  { floorNumber: -2, name: 'Basement 2', displayName: 'B2' },
  { floorNumber: -1, name: 'Basement 1', displayName: 'B1' },
  { floorNumber: 0, name: 'Ground Floor', displayName: 'G' },
  { floorNumber: 1, name: '1st Floor', displayName: '1' },
  { floorNumber: 2, name: '2nd Floor', displayName: '2' },
  { floorNumber: 3, name: '3rd Floor', displayName: '3' },
  { floorNumber: 4, name: '4th Floor', displayName: '4' },
  { floorNumber: 5, name: '5th Floor', displayName: '5' },
  { floorNumber: 6, name: '6th Floor', displayName: '6' },
  { floorNumber: 7, name: '7th Floor', displayName: '7' },
  { floorNumber: 8, name: '8th Floor', displayName: '8' },
  { floorNumber: 9, name: '9th Floor', displayName: '9' },
  { floorNumber: 10, name: '10th Floor', displayName: '10' },
  { floorNumber: 11, name: '11th Floor', displayName: '11' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data states
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [reportRange, setReportRange] = useState('monthly');
  const [reportData, setReportData] = useState({});

  // Filters
  const [bookingFilter, setBookingFilter] = useState('all');
  const [clientSearch, setClientSearch] = useState('');

  // Form states
  const [roomForm, setRoomForm] = useState({ 
    roomNumber: '', 
    type: 'STANDARD', 
    floor: 1, 
    price: 150, 
    capacity: 2, 
    status: 'AVAILABLE',
    description: '',
    images: '',
    features: '',
    amenities: ''
  });
  const [storeForm, setStoreForm] = useState({ name: '', nameAr: '', description: '', category: 'snacks', price: 0, quantity: 0, image: '' });
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingStore, setEditingStore] = useState(null);

  // Settings
  const [footerSettings, setFooterSettings] = useState({ phone: '', email: '', address: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  
  // Guest Invoice Modal
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestInvoiceData, setGuestInvoiceData] = useState(null);

  const getToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate('/admin/login'); return; }
    // Local offline tokens don't authenticate with the real backend — force re-login
    const session = JSON.parse(localStorage.getItem('admin_session') || '{}');
    if (session.isLocal || token.startsWith('local_admin_')) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_session');
      navigate('/admin/login');
      return;
    }
    loadData();
  }, []);

  useEffect(() => { if (getToken()) loadData(); }, [activeTab]);
  useEffect(() => { if (activeTab === 'reports' && getToken()) loadData(); }, [reportRange]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Centralised fetch that redirects on 401
  const adminFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...(options.headers || {}),
      },
    });
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_session');
      navigate('/admin/login');
      throw new Error('Session expired — please log in again.');
    }
    return res;
  };

  const loadData = async () => {
    setLoading(true);
    try {

      if (activeTab === 'dashboard') {
        const [statsRes, allBookingsRes] = await Promise.all([
          adminFetch(`${API}/admin/statistics`),
          adminFetch(`${API}/admin/all-bookings`),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());

        if (allBookingsRes.ok) {
          const allData = await allBookingsRes.json();
          const recentBookings = allData.roomBookings || [];
          const recentOrders   = allData.orders || [];
          setBookings(recentBookings.slice(0, 5));
          setOrders(recentOrders.slice(0, 5));
          setServiceBookings((allData.serviceBookings || []).slice(0, 5));

          const activity = [];
          recentBookings.slice(0, 3).forEach(b => activity.push({
            action: `Booking ${b.bookingNumber} — ${b.status}`,
            time: new Date(b.createdAt).toLocaleDateString(),
          }));
          recentOrders.slice(0, 2).forEach(o => activity.push({
            action: `Order ${o.orderNumber} — ${o.status}`,
            time: new Date(o.createdAt).toLocaleDateString(),
          }));
          setActivityLog(activity);
        }

      } else if (activeTab === 'bookings') {
        const res = await adminFetch(`${API}/admin/room-bookings`);
        if (res.ok) setBookings(await res.json());
        else setBookings([]);

      } else if (activeTab === 'clients') {
        const res = await adminFetch(`${API}/admin/users`);
        if (res.ok) setClients(await res.json());
        else setClients([]);

      } else if (activeTab === 'rooms') {
        const res = await fetch(`${API}/rooms`);
        if (res.ok) setRooms(await res.json());
        else setRooms([]);

      } else if (activeTab === 'store') {
        const res = await adminFetch(`${API}/admin/store-items`);
        if (res.ok) setStoreItems(await res.json());
        else setStoreItems([]);

      } else if (activeTab === 'orders') {
        const res = await adminFetch(`${API}/admin/orders`);
        if (res.ok) setOrders(await res.json());
        else setOrders([]);

      } else if (activeTab === 'services') {
        const res = await adminFetch(`${API}/admin/service-bookings`);
        if (res.ok) setServiceBookings(await res.json());
        else setServiceBookings([]);

      } else if (activeTab === 'reports') {
        const res = await adminFetch(`${API}/admin/reports?range=${reportRange}`);
        if (res.ok) setReportData(await res.json());

      } else if (activeTab === 'settings') {
        const res = await adminFetch(`${API}/admin/settings/footer`);
        if (res.ok) setFooterSettings(await res.json());
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
    setLoading(false);
  };

  // Room CRUD - Using Backend API
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse images as JSON array
      let imagesArray = [];
      if (roomForm.images) {
        try {
          imagesArray = roomForm.images.split(',').map(url => url.trim()).filter(url => url);
        } catch (e) {
          imagesArray = [roomForm.images];
        }
      }

      const roomData = {
        roomNumber: roomForm.roomNumber,
        type: roomForm.type,
        floor: parseInt(roomForm.floor),
        basePrice: parseFloat(roomForm.price),
        currentPrice: parseFloat(roomForm.price),
        capacity: parseInt(roomForm.capacity),
        status: roomForm.status,
        description: roomForm.description,
        images: JSON.stringify(imagesArray),
        features: roomForm.features || '{}',
        amenities: roomForm.amenities || '{}'
      };

      let response;
      if (editingRoom) {
        response = await adminFetch(`${API}/rooms/${editingRoom.id}`, {
          method: 'PUT',
          body: JSON.stringify(roomData),
        });
      } else {
        response = await adminFetch(`${API}/rooms`, {
          method: 'POST',
          body: JSON.stringify(roomData),
        });
      }

      if (response.ok) {
        showMessage('success', editingRoom ? 'Room updated!' : 'Room created!');
        setRoomForm({ roomNumber: '', type: 'STANDARD', floor: 1, price: 150, capacity: 2, status: 'AVAILABLE', description: '', images: '', features: '', amenities: '' });
        setEditingRoom(null);
        loadData();
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to save room');
      }
    } catch (e) {
      console.error('Room submit error:', e);
      showMessage('error', 'Failed to save room');
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      const response = await adminFetch(`${API}/rooms/${id}`, { method: 'DELETE' });
      if (response.ok) {
        showMessage('success', 'Room deleted!');
        loadData();
      } else {
        const err = await response.json();
        showMessage('error', err.error || 'Failed to delete room');
      }
    } catch (e) {
      if (e.message !== 'Session expired — please log in again.') showMessage('error', 'Failed to delete room');
    }
  };

  const editRoom = (room) => {
    setEditingRoom(room);
    // Parse images back to comma-separated string
    let imagesStr = '';
    try {
      const imgs = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
      imagesStr = Array.isArray(imgs) ? imgs.join(', ') : '';
    } catch (e) {
      imagesStr = room.images || '';
    }
    
    setRoomForm({ 
      roomNumber: room.roomNumber, 
      type: room.type, 
      floor: room.floor, 
      price: room.currentPrice || room.basePrice, 
      capacity: room.capacity, 
      status: room.status,
      description: room.description || '',
      images: imagesStr,
      features: typeof room.features === 'string' ? room.features : JSON.stringify(room.features || {}),
      amenities: typeof room.amenities === 'string' ? room.amenities : JSON.stringify(room.amenities || {})
    });
  };

  // Store CRUD - Using Backend API
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        name: storeForm.name,
        nameAr: storeForm.nameAr,
        description: storeForm.description || '',
        category: storeForm.category,
        price: parseFloat(storeForm.price),
        quantity: parseInt(storeForm.quantity) || 0,
        image: storeForm.image,
        isAvailable: true
      };

      let response;
      if (editingStore) {
        response = await adminFetch(`${API}/admin/store-items/${editingStore.id}`, {
          method: 'PUT',
          body: JSON.stringify(itemData),
        });
      } else {
        response = await adminFetch(`${API}/admin/store-items`, {
          method: 'POST',
          body: JSON.stringify(itemData),
        });
      }

      if (response.ok) {
        showMessage('success', editingStore ? 'Item updated!' : 'Item created!');
        setStoreForm({ name: '', nameAr: '', description: '', category: 'snacks', price: 0, quantity: 0, image: '' });
        setEditingStore(null);
        loadData();
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to save item');
      }
    } catch (e) {
      console.error('Store submit error:', e);
      showMessage('error', 'Failed to save item');
    }
  };

  const deleteStoreItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const response = await adminFetch(`${API}/admin/store-items/${id}`, { method: 'DELETE' });
      if (response.ok) {
        const data = await response.json();
        showMessage('success', data.softDeleted ? (data.message || 'Item marked as unavailable.') : 'Item deleted!');
        loadData();
      } else {
        const err = await response.json();
        showMessage('error', err.error || 'Failed to delete item');
      }
    } catch (e) {
      if (e.message !== 'Session expired — please log in again.') showMessage('error', 'Failed to delete item');
    }
  };

  const editStoreItem = (item) => {
    setEditingStore(item);
    setStoreForm({
      name: item.name,
      nameAr: item.nameAr || '',
      description: item.description || '',
      category: item.category,
      price: item.price,
      quantity: item.quantity ?? 0,
      image: item.image || '',
    });
  };

  // Status updates — real API via adminFetch
  const updateBookingStatus = async (id, status) => {
    try {
      const res = await adminFetch(`${API}/admin/room-bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      if (res.ok) { showMessage('success', 'Booking status updated!'); loadData(); }
      else showMessage('error', 'Failed to update booking status');
    } catch (e) { if (e.message !== 'Session expired — please log in again.') showMessage('error', 'Failed to update booking status'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await adminFetch(`${API}/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      if (res.ok) { showMessage('success', 'Order status updated!'); loadData(); }
      else showMessage('error', 'Failed to update order status');
    } catch (e) { if (e.message !== 'Session expired — please log in again.') showMessage('error', 'Failed to update order status'); }
  };

  // Settings — real API
  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminFetch(`${API}/admin/settings/footer`, {
        method: 'PUT',
        body: JSON.stringify(footerSettings),
      });
      if (res.ok) showMessage('success', 'Footer settings saved!');
      else showMessage('error', 'Failed to save footer settings');
    } catch (e) { if (e.message !== 'Session expired — please log in again.') showMessage('error', 'Failed to save footer settings'); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    try {
      const res = await adminFetch(`${API}/admin/change-password`, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      if (res.ok) {
        showMessage('success', 'Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '' });
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to change password');
      }
    } catch (e) { if (e.message !== 'Session expired — please log in again.') showMessage('error', 'Failed to change password'); }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  // Guest Invoice Modal Handler
  const handleGuestClick = (guest) => {
    // Get all bookings for this guest
    const guestBookings = bookings.filter(b => 
      b.userId === guest.id || 
      b.guestEmail === guest.email ||
      b.user?.email === guest.email
    );
    
    // Get all service bookings for this guest
    const guestServices = serviceBookings.filter(s => 
      s.userId === guest.id || 
      s.guestInfo?.email === guest.email
    );
    
    // Calculate totals
    const bookingTotal = guestBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const serviceTotal = guestServices.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    
    // Get current booking status
    const currentBooking = guestBookings.find(b => 
      b.status === 'CHECKED_IN' || b.status === 'CONFIRMED'
    );
    
    setGuestInvoiceData({
      guest,
      bookings: guestBookings,
      services: guestServices,
      totalBookings: bookingTotal,
      totalServices: serviceTotal,
      grandTotal: bookingTotal + serviceTotal,
      currentBooking,
      status: currentBooking?.status || 'NO_BOOKING'
    });
    setSelectedGuest(guest);
  };

  const closeGuestInvoice = () => {
    setSelectedGuest(null);
    setGuestInvoiceData(null);
  };

  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'clients', icon: '👥', label: 'Clients' },
    { id: 'rooms', icon: '🏨', label: 'Rooms' },
    { id: 'services', icon: '✨', label: 'Services' },
    { id: 'store', icon: '🛍️', label: 'Store' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'ai-analytics', icon: '🤖', label: 'AI Analytics', external: '/admin/ai-analytics' },
  ];

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === bookingFilter);
  const filteredClients = clients.filter(c => 
    clientSearch === '' || 
    c.email?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.firstName?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.lastName?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>👑 Luxury Admin</h2>
          <p>Presidential Hotel</p>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            tab.external ? (
              <button
                key={tab.id}
                className="admin-nav-item admin-nav-item--external"
                onClick={() => navigate(tab.external)}
              >
                <span className="nav-icon">{tab.icon}</span> {tab.label}
                <span className="nav-external-badge">↗</span>
              </button>
            ) : (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span> {tab.label}
              </button>
            )
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>{tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}</h1>
          <button className="btn-refresh" onClick={loadData} disabled={loading}>🔄 Refresh</button>
        </header>

        {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}
        {loading && <div className="admin-loading">⏳ Loading...</div>}

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card revenue">
                <span className="stat-icon">💰</span>
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">${(stats.totalRevenue || 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📅</span>
                <div className="stat-info">
                  <h3>Total Bookings</h3>
                  <p className="stat-value">{stats.totalBookings || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🏨</span>
                <div className="stat-info">
                  <h3>Available Rooms</h3>
                  <p className="stat-value">{stats.availableRooms ?? '—'}/{stats.totalRooms || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📈</span>
                <div className="stat-info">
                  <h3>Occupancy Rate</h3>
                  <p className="stat-value">{stats.occupancyRate ?? 0}%</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div className="stat-info">
                  <h3>Total Guests</h3>
                  <p className="stat-value">{stats.totalUsers || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✨</span>
                <div className="stat-info">
                  <h3>Service Bookings</h3>
                  <p className="stat-value">{stats.totalServices || 0}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="dashboard-section">
                <h3>Recent Bookings</h3>
                <div className="recent-list">
                  {bookings.length === 0 ? (
                    <p className="no-data">No bookings yet</p>
                  ) : bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="recent-item">
                      <div>
                        <div className="recent-main">{b.bookingNumber}</div>
                        <div className="recent-sub">
                          {b.user ? `${b.user.firstName} ${b.user.lastName}` : 'Guest'} · Room {b.room?.roomNumber || '—'} · {new Date(b.checkInDate).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-section">
                <h3>Recent Orders</h3>
                <div className="recent-list">
                  {orders.length === 0 ? (
                    <p className="no-data">No orders yet</p>
                  ) : orders.slice(0, 5).map(o => (
                    <div key={o.id} className="recent-item">
                      <div>
                        <div className="recent-main">{o.orderNumber}</div>
                        <div className="recent-sub">{o.clientName || o.user ? `${o.user?.firstName} ${o.user?.lastName}` : 'Guest'} · ${(o.totalPrice || 0).toFixed(2)}</div>
                      </div>
                      <span className={`status-badge ${o.status?.toLowerCase()}`}>{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-section">
                <h3>Activity Feed</h3>
                <div className="activity-feed">
                  {activityLog.map((log, i) => (
                    <div key={i} className="activity-item">
                      <span>{log.action}</span>
                      <small>{log.time}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>All Bookings</h3>
              <div className="booking-filters">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CONFIRMED', label: 'Confirmed' },
                  { value: 'CHECKED_IN', label: 'Checked In' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                ].map(f => (
                  <button
                    key={f.value}
                    className={`filter-btn ${bookingFilter === f.value ? 'active' : ''}`}
                    onClick={() => setBookingFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="admin-table-container">
              {filteredBookings.length === 0 ? (
                <p className="no-data">No bookings found</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking #</th>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.bookingNumber}</strong></td>
                        <td>{b.user?.firstName || b.guestName || 'Guest'} {b.user?.lastName || ''}</td>
                        <td>Room {b.room?.roomNumber || b.roomId}</td>
                        <td>{new Date(b.checkInDate || b.checkIn).toLocaleDateString()}</td>
                        <td>{new Date(b.checkOutDate || b.checkOut).toLocaleDateString()}</td>
                        <td className="price">${(b.finalPrice || b.totalPrice || 0).toFixed(2)}</td>
                        <td>
                          <select 
                            value={b.status?.toLowerCase() || 'pending'} 
                            onChange={(e) => updateBookingStatus(b.id, e.target.value.toUpperCase())}
                            className={`status-select ${b.status?.toLowerCase()}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked_in">Checked In</option>
                            <option value="checked_out">Checked Out</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="action-buttons">
                          <button className="btn-pdf" onClick={() => generateBookingPDF(b, 'room')}>📄 PDF</button>
                          {(b.serviceBookings?.length > 0 || b.orders?.length > 0) && (
                            <span className="linked-badge" title={`${b.serviceBookings?.length || 0} services, ${b.orders?.length || 0} orders`}>
                              🔗 {(b.serviceBookings?.length || 0) + (b.orders?.length || 0)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* CLIENTS */}
        {activeTab === 'clients' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Registered Users ({clients.length})</h3>
              <input
                type="search"
                placeholder="Search by name or email…"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="admin-table-container">
              {filteredClients.length === 0 ? (
                <p className="no-data">No users found</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Total Stays</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map(c => (
                      <tr key={c.id} className="clickable-row" onClick={() => handleGuestClick(c)}>
                        <td><strong>{c.firstName} {c.lastName}</strong></td>
                        <td>{c.email}</td>
                        <td>{c.phone || '—'}</td>
                        <td>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem',
                            borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
                            background: c.role === 'ADMIN' ? '#FEF3C7' : '#D1FAE5',
                            color:      c.role === 'ADMIN' ? '#92400E'  : '#065F46',
                          }}>
                            {c.role?.replace('GUEST_', '').replace('_', ' ') || 'Guest'}
                          </span>
                        </td>
                        <td>{c.guestProfile?.totalStays ?? 0} stays</td>
                        <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ROOMS */}
        {activeTab === 'rooms' && (
          <div className="admin-section">
            <div className="info-banner">
              ℹ️ Manage all hotel rooms. Edit images, prices, descriptions, services, and status.
            </div>
            
            <form className="admin-form room-form-expanded" onSubmit={handleRoomSubmit}>
              <h3>{editingRoom ? '✏️ Edit Room' : '➕ Add New Room'}</h3>
              <div className="form-grid">
                <input 
                  type="text" 
                  placeholder="Room Number (e.g., 101) *" 
                  value={roomForm.roomNumber} 
                  onChange={e => setRoomForm({...roomForm, roomNumber: e.target.value})} 
                  required 
                />
                <select 
                  value={roomForm.type} 
                  onChange={e => setRoomForm({...roomForm, type: e.target.value})}
                >
                  <option value="STANDARD">Standard</option>
                  <option value="DELUXE">Deluxe</option>
                  <option value="SUITE">Suite</option>
                  <option value="PENTHOUSE">Penthouse</option>
                </select>
                <select 
                  value={roomForm.floor} 
                  onChange={e => setRoomForm({...roomForm, floor: parseInt(e.target.value)})}
                >
                  {FIXED_FLOORS.filter(f => f.floorNumber > 0).map(f => (
                    <option key={f.floorNumber} value={f.floorNumber}>{f.name}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  placeholder="Price per night ($)" 
                  value={roomForm.price} 
                  onChange={e => setRoomForm({...roomForm, price: parseFloat(e.target.value)})} 
                  min="0" 
                  step="0.01"
                  required 
                />
                <input 
                  type="number" 
                  placeholder="Capacity (guests)" 
                  value={roomForm.capacity} 
                  onChange={e => setRoomForm({...roomForm, capacity: parseInt(e.target.value)})} 
                  min="1"
                  required 
                />
                <select 
                  value={roomForm.status} 
                  onChange={e => setRoomForm({...roomForm, status: e.target.value})}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
              
              <div className="form-full-width">
                <label>Description</label>
                <textarea 
                  placeholder="Room description..."
                  value={roomForm.description}
                  onChange={e => setRoomForm({...roomForm, description: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className="form-full-width">
                <label>Images (comma-separated URLs)</label>
                <textarea 
                  placeholder="https://image1.jpg, https://image2.jpg, ..."
                  value={roomForm.images}
                  onChange={e => setRoomForm({...roomForm, images: e.target.value})}
                  rows="2"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingRoom ? 'Update Room' : 'Add Room'}</button>
                {editingRoom && (
                  <button type="button" className="btn-secondary" onClick={() => {
                    setEditingRoom(null);
                    setRoomForm({ roomNumber: '', type: 'STANDARD', floor: 1, price: 150, capacity: 2, status: 'AVAILABLE', description: '', images: '', features: '', amenities: '' });
                  }}>Cancel</button>
                )}
              </div>
            </form>

            <div className="admin-table-container">
              <h3>🏨 All Rooms ({rooms.length})</h3>
              {rooms.length === 0 ? (
                <p className="no-data">No rooms found in database.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Room #</th>
                      <th>Type</th>
                      <th>Floor</th>
                      <th>Capacity</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.roomNumber}</strong></td>
                        <td><span className={`type-badge ${r.type?.toLowerCase()}`}>{r.type}</span></td>
                        <td>Floor {r.floor}</td>
                        <td>{r.capacity} guests</td>
                        <td className="price">${r.currentPrice || r.basePrice}</td>
                        <td><span className={`status-badge ${r.status?.toLowerCase()}`}>{r.status}</span></td>
                        <td className="actions">
                          <button className="btn-edit" onClick={() => editRoom(r)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => deleteRoom(r.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === 'services' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>✨ Service Bookings</h3>
              <div className="service-stats-row">
                <span className="stat-pill spa">💆 Spa: {serviceBookings.filter(b => b.serviceType === 'spa').length}</span>
                <span className="stat-pill gym">💪 Gym: {serviceBookings.filter(b => b.serviceType === 'gym').length}</span>
                <span className="stat-pill pool">🏊 Pool: {serviceBookings.filter(b => b.serviceType === 'pool').length}</span>
                <span className="stat-pill driver">🚗 Driver: {serviceBookings.filter(b => b.serviceType === 'driver').length}</span>
                <span className="stat-pill butler">🎩 Butler: {serviceBookings.filter(b => b.serviceType === 'butler').length}</span>
              </div>
            </div>
            
            <div className="admin-table-container">
              {serviceBookings.length === 0 ? (
                <p className="no-data">No service bookings yet. Bookings will appear here when guests book services.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking #</th>
                      <th>Service</th>
                      <th>Guest</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceBookings.map(booking => (
                      <tr key={booking.id}>
                        <td><strong>{booking.bookingNumber}</strong></td>
                        <td>
                          <span className={`type-badge ${booking.serviceType}`}>
                            {booking.serviceType === 'spa' && '💆'}
                            {booking.serviceType === 'gym' && '💪'}
                            {booking.serviceType === 'pool' && '🏊'}
                            {booking.serviceType === 'driver' && '🚗'}
                            {booking.serviceType === 'butler' && '🎩'}
                            {' '}{booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div>{booking.guestName}</div>
                          <small style={{color: 'rgba(255,255,255,0.5)'}}>{booking.guestEmail}</small>
                        </td>
                        <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                        <td className="price">${booking.totalPrice?.toFixed(2)}</td>
                        <td><span className={`status-badge ${booking.status?.toLowerCase()}`}>{booking.status}</span></td>
                        <td>
                          <button className="btn-view" onClick={() => setSelectedService(booking)}>👁️ Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* STORE */}
        {activeTab === 'store' && (
          <div className="admin-section">
            <form className="admin-form" onSubmit={handleStoreSubmit}>
              <h3>{editingStore ? '✏️ Edit Item' : '➕ Add Store Item'}</h3>
              <div className="form-grid">
                <input 
                  type="text" 
                  placeholder="Item Name (English) *" 
                  value={storeForm.name} 
                  onChange={e => setStoreForm({...storeForm, name: e.target.value})} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="اسم المنتج (Arabic)" 
                  value={storeForm.nameAr} 
                  onChange={e => setStoreForm({...storeForm, nameAr: e.target.value})}
                  dir="rtl"
                />
                <select
                  value={storeForm.category}
                  onChange={e => setStoreForm({...storeForm, category: e.target.value})}
                >
                  <option value="drinks">Drinks</option>
                  <option value="snacks">Snacks</option>
                  <option value="candy">Candy</option>
                  <option value="chips">Chips</option>
                  <option value="biscuits">Biscuits</option>
                  <option value="essentials">Essentials</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Price ($) *" 
                  value={storeForm.price} 
                  onChange={e => setStoreForm({...storeForm, price: parseFloat(e.target.value)})} 
                  min="0" 
                  step="0.01"
                  required 
                />
                <input
                  type="number"
                  placeholder="Stock Quantity *"
                  value={storeForm.quantity}
                  onChange={e => setStoreForm({...storeForm, quantity: parseInt(e.target.value)})}
                  min="0"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Emoji Icon" 
                  value={storeForm.image} 
                  onChange={e => setStoreForm({...storeForm, image: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingStore ? 'Update Item' : 'Add Item'}</button>
                {editingStore && (
                  <button type="button" className="btn-secondary" onClick={() => {
                    setEditingStore(null);
                    setStoreForm({ name: '', nameAr: '', description: '', category: 'snacks', price: 0, quantity: 0, image: '' });
                  }}>Cancel</button>
                )}
              </div>
            </form>

            <div className="admin-table-container">
              <h3>🛍️ Store Items ({storeItems.length})</h3>
              {storeItems.length === 0 ? (
                <p className="no-data">No items found. Add one above.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Name</th>
                      <th>Arabic</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.image || '📦'}</td>
                        <td><strong>{item.name}</strong></td>
                        <td dir="rtl">{item.nameAr || '-'}</td>
                        <td>{item.category}</td>
                        <td className="price">${item.price?.toFixed(2)}</td>
                        <td>{item.quantity ?? 0}</td>
                        <td className="actions">
                          <button className="btn-edit" onClick={() => editStoreItem(item)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => deleteStoreItem(item.id)}>🗑️ Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="admin-table-container">
              <h3>📦 All Orders ({orders.length})</h3>
              {orders.length === 0 ? (
                <p className="no-data">No orders yet.</p>
              ) : (
                <table className="admin-table orders-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><strong>{order.orderNumber}</strong></td>
                        <td>{order.clientName || (order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest')}</td>
                        <td>
                          {order.items?.length > 0
                            ? order.items.map(i => i.item?.name || i.name).filter(Boolean).join(', ')
                            : 'No items'}
                        </td>
                        <td className="price">${order.totalPrice?.toFixed(2)}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            className={`status-select ${order.status?.toLowerCase()}`}
                          >
                            <option value="PENDING">⏳ Pending</option>
                            <option value="PREPARING">👨‍🍳 Preparing</option>
                            <option value="DELIVERED">✅ Delivered</option>
                            <option value="CANCELLED">❌ Cancelled</option>
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>📈 Reports & Analytics</h3>
              <div className="booking-filters">
                {[
                  { value: 'daily',   label: 'Today' },
                  { value: 'monthly', label: 'This Month' },
                  { value: 'yearly',  label: 'This Year' },
                ].map(r => (
                  <button
                    key={r.value}
                    className={`filter-btn ${reportRange === r.value ? 'active' : ''}`}
                    onClick={() => setReportRange(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="reports-grid">
              <div className="report-card highlight">
                <h4>Total Revenue</h4>
                <div className="report-value">${(reportData.totalRevenue || 0).toFixed(2)}</div>
                <div className="report-date">All sources combined</div>
              </div>
              <div className="report-card">
                <h4>Room Bookings Revenue</h4>
                <div className="report-value">${(reportData.bookingRevenue || 0).toFixed(2)}</div>
                <div className="report-date">{reportData.totalBookings || 0} bookings</div>
              </div>
              <div className="report-card">
                <h4>Store Orders Revenue</h4>
                <div className="report-value">${(reportData.orderRevenue || 0).toFixed(2)}</div>
                <div className="report-date">{reportData.totalOrders || 0} orders</div>
              </div>
              <div className="report-card">
                <h4>Services Revenue</h4>
                <div className="report-value">${(reportData.serviceRevenue || 0).toFixed(2)}</div>
                <div className="report-date">{reportData.totalServices || 0} service bookings</div>
              </div>
              <div className="report-card">
                <h4>Occupancy Rate</h4>
                <div className="report-value">{reportData.occupancyRate || 0}%</div>
                <div className="report-date">{reportData.activeBookings || 0}/{reportData.totalRooms || 0} rooms occupied</div>
              </div>
              <div className="report-card">
                <h4>New Guests</h4>
                <div className="report-value">{reportData.newUsers || 0}</div>
                <div className="report-date">Registered {reportRange === 'daily' ? 'today' : reportRange === 'monthly' ? 'this month' : 'this year'}</div>
              </div>
            </div>

            <div className="report-breakdown-section">
              <h4>Booking Status Breakdown</h4>
              <div className="breakdown-chips">
                <span className="status-badge confirmed">✓ Confirmed / Active: {reportData.confirmedBookings || 0}</span>
                <span className="status-badge completed">✔ Completed: {reportData.completedBookings || 0}</span>
                <span className="status-badge cancelled">✗ Cancelled: {reportData.cancelledBookings || 0}</span>
              </div>
            </div>

            <div className="report-actions">
              <button className="btn-primary" onClick={() => generateReportPDF(reportData, reportRange)}>
                📄 Download PDF Report
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="admin-section settings-section">
            <div className="settings-card">
              <h3>🔐 Change Admin Password</h3>
              <p>Update your administrative access credentials</p>
              <button className="btn-primary" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
            </div>

            <div className="settings-card">
              <h3>📞 Footer Settings</h3>
              <p>Manage contact information displayed on website</p>
              <form onSubmit={handleFooterSubmit} className="settings-form">
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={footerSettings.phone} 
                  onChange={e => setFooterSettings({...footerSettings, phone: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={footerSettings.email} 
                  onChange={e => setFooterSettings({...footerSettings, email: e.target.value})}
                />
                <textarea 
                  placeholder="Address" 
                  value={footerSettings.address} 
                  onChange={e => setFooterSettings({...footerSettings, address: e.target.value})}
                />
                <button type="submit" className="btn-primary">💾 Save Footer Settings</button>
              </form>
            </div>

            <div className="settings-card">
              <h3>🌐 Language Options</h3>
              <p>Active Languages: English, Arabic, Turkish</p>
              <div className="language-options">
                <label><input type="checkbox" checked disabled /> English</label>
                <label><input type="checkbox" checked disabled /> Arabic (العربية)</label>
                <label><input type="checkbox" checked disabled /> Turkish (Türkçe)</label>
              </div>
            </div>
          </div>
        )}

        {/* PASSWORD MODAL */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>🔐 Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Change Password</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* GUEST INVOICE MODAL */}
        {selectedGuest && guestInvoiceData && (
          <div className="modal-overlay" onClick={closeGuestInvoice}>
            <div className="modal-content invoice-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={closeGuestInvoice}>×</button>
              <div className="invoice-header">
                <h3>🧾 Guest Invoice</h3>
                <span className={`status-badge ${guestInvoiceData.status.toLowerCase()}`}>
                  {guestInvoiceData.status === 'CHECKED_IN' ? '✅ Checked In' : 
                   guestInvoiceData.status === 'CONFIRMED' ? '📅 Confirmed' :
                   guestInvoiceData.status === 'CHECKED_OUT' ? '🚪 Checked Out' : '—'}
                </span>
              </div>
              
              <div className="invoice-section">
                <h4>Guest Information</h4>
                <div className="invoice-row">
                  <span>Name:</span>
                  <strong>{selectedGuest.firstName} {selectedGuest.lastName}</strong>
                </div>
                <div className="invoice-row">
                  <span>Email:</span>
                  <span>{selectedGuest.email}</span>
                </div>
                <div className="invoice-row">
                  <span>Phone:</span>
                  <span>{selectedGuest.phone || '—'}</span>
                </div>
              </div>

              {guestInvoiceData.currentBooking && (
                <div className="invoice-section">
                  <h4>Current Booking</h4>
                  <div className="invoice-row">
                    <span>Room:</span>
                    <strong>{guestInvoiceData.currentBooking.room?.roomNumber || guestInvoiceData.currentBooking.roomId}</strong>
                  </div>
                  <div className="invoice-row">
                    <span>Check-in:</span>
                    <span>{new Date(guestInvoiceData.currentBooking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="invoice-row">
                    <span>Check-out:</span>
                    <span>{new Date(guestInvoiceData.currentBooking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="invoice-section">
                <h4>Booking History ({guestInvoiceData.bookings.length})</h4>
                {guestInvoiceData.bookings.length === 0 ? (
                  <p className="no-data">No bookings found</p>
                ) : (
                  <div className="invoice-list">
                    {guestInvoiceData.bookings.map((b, i) => (
                      <div key={i} className="invoice-list-item">
                        <span>Room {b.room?.roomNumber || b.roomId}</span>
                        <span>{new Date(b.checkInDate).toLocaleDateString()}</span>
                        <span className="price">${b.totalPrice?.toFixed(2) || '0.00'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="invoice-section">
                <h4>Services Used ({guestInvoiceData.services.length})</h4>
                {guestInvoiceData.services.length === 0 ? (
                  <p className="no-data">No services used</p>
                ) : (
                  <div className="invoice-list">
                    {guestInvoiceData.services.map((s, i) => (
                      <div key={i} className="invoice-list-item">
                        <span>{s.serviceType}</span>
                        <span>{new Date(s.date || s.createdAt).toLocaleDateString()}</span>
                        <span className="price">${s.totalPrice?.toFixed(2) || '0.00'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="invoice-totals">
                <div className="invoice-row">
                  <span>Room Bookings:</span>
                  <span>${guestInvoiceData.totalBookings.toFixed(2)}</span>
                </div>
                <div className="invoice-row">
                  <span>Services:</span>
                  <span>${guestInvoiceData.totalServices.toFixed(2)}</span>
                </div>
                <div className="invoice-row total">
                  <span>Grand Total:</span>
                  <strong>${guestInvoiceData.grandTotal.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* SERVICE DETAILS MODAL */}
        {selectedService && (
          <div className="modal-overlay" onClick={() => setSelectedService(null)}>
            <div className="modal-content invoice-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedService(null)}>×</button>
              <div className="invoice-header">
                <h3>
                  {selectedService.serviceType === 'spa' && '💆'}
                  {selectedService.serviceType === 'gym' && '💪'}
                  {selectedService.serviceType === 'pool' && '🏊'}
                  {selectedService.serviceType === 'driver' && '🚗'}
                  {selectedService.serviceType === 'butler' && '🎩'}
                  {' '}Service Invoice
                </h3>
                <span className={`status-badge ${selectedService.status?.toLowerCase()}`}>{selectedService.status}</span>
              </div>

              <div className="invoice-section">
                <h4>Booking Info</h4>
                <div className="invoice-row"><span>Booking #:</span><strong>{selectedService.bookingNumber}</strong></div>
                <div className="invoice-row"><span>Service:</span><span style={{textTransform:'capitalize'}}>{selectedService.serviceType}</span></div>
                <div className="invoice-row"><span>Date:</span><span>{selectedService.bookingDate ? new Date(selectedService.bookingDate).toLocaleDateString() : '—'}</span></div>
                {selectedService.startTime && <div className="invoice-row"><span>Time:</span><span>{selectedService.startTime}</span></div>}
                {selectedService.duration && <div className="invoice-row"><span>Duration:</span><span>{selectedService.duration} min</span></div>}
                {selectedService.roomNumber && <div className="invoice-row"><span>Room:</span><span>{selectedService.roomNumber}</span></div>}
              </div>

              <div className="invoice-section">
                <h4>Guest Info</h4>
                <div className="invoice-row"><span>Name:</span><strong>{selectedService.guestName || (selectedService.user ? `${selectedService.user.firstName} ${selectedService.user.lastName}` : '—')}</strong></div>
                {selectedService.guestEmail && <div className="invoice-row"><span>Email:</span><span>{selectedService.guestEmail}</span></div>}
              </div>

              {(() => {
                let fd = {};
                try { fd = JSON.parse(selectedService.formData || '{}'); } catch {}
                const entries = Object.entries(fd).filter(([, v]) => v !== null && v !== '' && !Array.isArray(v) && typeof v !== 'object');
                const arrEntries = Object.entries(fd).filter(([, v]) => Array.isArray(v) && v.length > 0);
                if (!entries.length && !arrEntries.length) return null;
                return (
                  <div className="invoice-section">
                    <h4>Service Details</h4>
                    {entries.map(([k, v]) => (
                      <div key={k} className="invoice-row">
                        <span>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</span>
                        <span>{String(v)}</span>
                      </div>
                    ))}
                    {arrEntries.map(([k, v]) => (
                      <div key={k} className="invoice-row">
                        <span>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</span>
                        <span>{v.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="invoice-totals">
                <div className="invoice-row total">
                  <span>Total Price:</span>
                  <strong>${(selectedService.totalPrice || 0).toFixed(2)}</strong>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <button className="btn-pdf" onClick={() => generateBookingPDF(selectedService, 'service')}>
                  📄 Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
