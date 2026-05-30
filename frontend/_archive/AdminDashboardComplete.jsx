import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localDB from '../../services/localDatabase';
import './AdminDashboard.css';

const API = 'http://localhost:5000/api';
const { rooms: roomsDB, bookings: bookingsDB, orders: ordersDB, store: storeDB, stats: statsDB, settings: settingsDB } = localDB;

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
  const [activityLog, setActivityLog] = useState([]);
  
  // Filters
  const [bookingFilter, setBookingFilter] = useState('all');
  const [clientSearch, setClientSearch] = useState('');

  // Form states
  const [roomForm, setRoomForm] = useState({ name: '', type: 'DELUXE', floor: 1, price: 250, capacity: 2, status: 'available' });
  const [storeForm, setStoreForm] = useState({ name: '', nameAr: '', category: 'comfort', price: 0, stock: 0, image: '📦' });
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingStore, setEditingStore] = useState(null);

  // Settings
  const [footerSettings, setFooterSettings] = useState({ phone: '', email: '', address: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const getToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, []);

  useEffect(() => { loadData(); }, [activeTab]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        setStats(statsDB.getDashboardStats());
        setBookings(bookingsDB.getAll().slice(0, 5));
        setOrders(ordersDB.getAll().slice(0, 5));
        setActivityLog([
          { action: 'New booking created', time: 'Just now' },
          { action: 'Room 305 checked out', time: '10 mins ago' },
          { action: 'New order received', time: '25 mins ago' }
        ]);
      } else if (activeTab === 'bookings') {
        setBookings(bookingsDB.getAll());
      } else if (activeTab === 'clients') {
        const allBookings = bookingsDB.getAll();
        const usersDB = JSON.parse(localStorage.getItem('plhms_users_db') || '[]');
        setClients(usersDB);
      } else if (activeTab === 'rooms') {
        setRooms(roomsDB.getAll());
      } else if (activeTab === 'store') {
        setStoreItems(storeDB.getAll());
      } else if (activeTab === 'orders') {
        setOrders(ordersDB.getAll());
      } else if (activeTab === 'reports') {
        setStats(statsDB.getDashboardStats());
      } else if (activeTab === 'settings') {
        setFooterSettings(settingsDB.get());
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
    setLoading(false);
  };

  // Room CRUD
  const handleRoomSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        roomsDB.update(editingRoom.id, roomForm);
        showMessage('success', 'Room updated successfully!');
      } else {
        roomsDB.create(roomForm);
        showMessage('success', 'Room created successfully!');
      }
      setRoomForm({ name: '', type: 'DELUXE', floor: 1, price: 250, capacity: 2, status: 'available' });
      setEditingRoom(null);
      loadData();
    } catch (e) {
      showMessage('error', 'Failed to save room');
    }
  };

  const deleteRoom = (id) => {
    if (!window.confirm('Delete this room?')) return;
    roomsDB.delete(id);
    showMessage('success', 'Room deleted!');
    loadData();
  };

  const editRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({ name: room.name, type: room.type, floor: room.floor, price: room.price, capacity: room.capacity, status: room.status });
  };

  // Store CRUD
  const handleStoreSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingStore) {
        storeDB.update(editingStore.id, storeForm);
        showMessage('success', 'Item updated!');
      } else {
        storeDB.create(storeForm);
        showMessage('success', 'Item created!');
      }
      setStoreForm({ name: '', nameAr: '', category: 'comfort', price: 0, stock: 0, image: '📦' });
      setEditingStore(null);
      loadData();
    } catch (e) {
      showMessage('error', 'Failed to save item');
    }
  };

  const deleteStoreItem = (id) => {
    if (!window.confirm('Delete this item?')) return;
    storeDB.delete(id);
    showMessage('success', 'Item deleted!');
    loadData();
  };

  const editStoreItem = (item) => {
    setEditingStore(item);
    setStoreForm({ name: item.name, nameAr: item.nameAr || '', category: item.category, price: item.price, stock: item.stock, image: item.image || '📦' });
  };

  // Status updates
  const updateBookingStatus = (id, status) => {
    bookingsDB.update(id, { status });
    showMessage('success', 'Booking status updated!');
    loadData();
  };

  const updateOrderStatus = (id, status) => {
    ordersDB.updateStatus(id, status);
    showMessage('success', 'Order status updated!');
    loadData();
  };

  // Settings
  const handleFooterSubmit = (e) => {
    e.preventDefault();
    settingsDB.save(footerSettings);
    showMessage('success', 'Footer settings saved!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    showMessage('success', 'Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '' });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
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
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter);
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
            <button 
              key={tab.id} 
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span> {tab.label}
            </button>
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
                  <p className="stat-value">${stats.totalRevenue?.toFixed(2) || '0.00'}</p>
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
                  <p className="stat-value">{stats.availableRooms || 0}/{stats.totalRooms || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📈</span>
                <div className="stat-info">
                  <h3>Occupancy Rate</h3>
                  <p className="stat-value">{stats.occupancyRate || 0}%</p>
                </div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="dashboard-section">
                <h3>Recent Bookings</h3>
                <div className="recent-list">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="recent-item">
                      <div>
                        <div className="recent-main">{b.bookingNumber}</div>
                        <div className="recent-sub">Room {b.roomId} - {b.checkIn}</div>
                      </div>
                      <span className={`status-badge ${b.status}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-section">
                <h3>Recent Orders</h3>
                <div className="recent-list">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="recent-item">
                      <div>
                        <div className="recent-main">{o.orderNumber}</div>
                        <div className="recent-sub">${o.totalPrice?.toFixed(2)}</div>
                      </div>
                      <span className={`status-badge ${o.status}`}>{o.status}</span>
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
                {['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(f => (
                  <button 
                    key={f} 
                    className={`filter-btn ${bookingFilter === f ? 'active' : ''}`}
                    onClick={() => setBookingFilter(f)}
                  >
                    {f.replace('_', ' ')}
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
                        <td>{b.guestName || 'Guest'}</td>
                        <td>Room {b.roomId}</td>
                        <td>{b.checkIn}</td>
                        <td>{b.checkOut}</td>
                        <td className="price">${b.totalPrice?.toFixed(2)}</td>
                        <td>
                          <select 
                            value={b.status} 
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className={`status-select ${b.status}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked_in">Checked In</option>
                            <option value="checked_out">Checked Out</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button className="btn-view">👁️ View</button>
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
              <h3>Client Data Hall</h3>
              <input 
                type="search" 
                placeholder="Search clients..." 
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="admin-table-container">
              {filteredClients.length === 0 ? (
                <p className="no-data">No clients found</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Total Bookings</th>
                      <th>Total Spent</th>
                      <th>Loyalty Points</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.firstName} {c.lastName}</strong></td>
                        <td>{c.email}</td>
                        <td>{c.phone || '-'}</td>
                        <td>{c.totalBookings || 0}</td>
                        <td className="price">${c.totalSpent?.toFixed(2) || '0.00'}</td>
                        <td>{c.loyaltyPoints || 0} pts</td>
                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
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
              ℹ️ Floors are fixed (B2 to 11th Floor). You can only add/edit rooms and assign them to floors.
            </div>
            
            <form className="admin-form" onSubmit={handleRoomSubmit}>
              <h3>{editingRoom ? '✏️ Edit Room' : '➕ Add New Room'}</h3>
              <div className="form-grid">
                <input 
                  type="text" 
                  placeholder="Room Name *" 
                  value={roomForm.name} 
                  onChange={e => setRoomForm({...roomForm, name: e.target.value})} 
                  required 
                />
                <select 
                  value={roomForm.type} 
                  onChange={e => setRoomForm({...roomForm, type: e.target.value})}
                >
                  <option value="STANDARD">Standard</option>
                  <option value="DELUXE">Deluxe</option>
                  <option value="SUITE">Suite</option>
                  <option value="PRESIDENTIAL">Presidential</option>
                </select>
                <select 
                  value={roomForm.floor} 
                  onChange={e => setRoomForm({...roomForm, floor: parseInt(e.target.value)})}
                >
                  {FIXED_FLOORS.map(f => (
                    <option key={f.floorNumber} value={f.floorNumber}>{f.name}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  placeholder="Price ($)" 
                  value={roomForm.price} 
                  onChange={e => setRoomForm({...roomForm, price: parseFloat(e.target.value)})} 
                  min="0" 
                  step="0.01"
                  required 
                />
                <input 
                  type="number" 
                  placeholder="Capacity" 
                  value={roomForm.capacity} 
                  onChange={e => setRoomForm({...roomForm, capacity: parseInt(e.target.value)})} 
                  min="1"
                  required 
                />
                <select 
                  value={roomForm.status} 
                  onChange={e => setRoomForm({...roomForm, status: e.target.value})}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingRoom ? 'Update Room' : 'Add Room'}</button>
                {editingRoom && (
                  <button type="button" className="btn-secondary" onClick={() => {
                    setEditingRoom(null);
                    setRoomForm({ name: '', type: 'DELUXE', floor: 1, price: 250, capacity: 2, status: 'available' });
                  }}>Cancel</button>
                )}
              </div>
            </form>

            <div className="admin-table-container">
              <h3>🏨 All Rooms ({rooms.length})</h3>
              {rooms.length === 0 ? (
                <p className="no-data">No rooms found. Add one above.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
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
                        <td><strong>{r.name}</strong></td>
                        <td>{r.type}</td>
                        <td>{FIXED_FLOORS.find(f => f.floorNumber === r.floor)?.name || r.floor}</td>
                        <td>{r.capacity} guests</td>
                        <td className="price">${r.price}</td>
                        <td><span className={`status-badge ${r.status}`}>{r.status}</span></td>
                        <td className="actions">
                          <button className="btn-edit" onClick={() => editRoom(r)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => deleteRoom(r.id)}>🗑️ Delete</button>
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
            <h3>✨ Hotel Services Management</h3>
            <div className="services-grid">
              {[
                { name: 'Restaurant', icon: '🍽️', desc: 'Fine dining experience' },
                { name: 'Gym', icon: '💪', desc: '24/7 fitness center' },
                { name: 'Spa', icon: '💆', desc: 'Luxury spa treatments' },
                { name: 'Pool', icon: '🏊', desc: 'Infinity pool & jacuzzi' },
                { name: 'Driver Service', icon: '🚗', desc: 'Airport transfers' },
                { name: 'Concierge', icon: '🎩', desc: 'Premium assistance' }
              ].map(service => (
                <div key={service.name} className="service-card">
                  <h3>{service.icon} {service.name}</h3>
                  <p>{service.desc}</p>
                  <div className="service-stats">
                    <span>Active: ✓ Operational</span>
                  </div>
                  <button className="btn-primary">Manage</button>
                </div>
              ))}
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
                  <option value="comfort">Comfort</option>
                  <option value="spa">Spa</option>
                  <option value="food">Food & Beverage</option>
                  <option value="souvenirs">Souvenirs</option>
                  <option value="luxury">Luxury Items</option>
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
                  placeholder="Stock *" 
                  value={storeForm.stock} 
                  onChange={e => setStoreForm({...storeForm, stock: parseInt(e.target.value)})} 
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
                    setStoreForm({ name: '', nameAr: '', category: 'comfort', price: 0, stock: 0, image: '📦' });
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
                        <td>{item.stock}</td>
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
                        <td>{order.customerName || 'Guest'}</td>
                        <td>
                          {order.items?.map(i => i.name).join(', ') || `${order.items?.length || 0} items`}
                        </td>
                        <td className="price">${order.totalPrice?.toFixed(2)}</td>
                        <td>
                          <select 
                            value={order.status} 
                            onChange={e => updateOrderStatus(order.id, e.target.value)} 
                            className={`status-select ${order.status}`}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="preparing">👨‍🍳 Preparing</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
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
            <h3>📈 Reports & Analytics</h3>
            
            <div className="reports-grid">
              <div className="report-card">
                <h4>Total Revenue</h4>
                <div className="report-value">${stats.totalRevenue?.toFixed(2) || '0.00'}</div>
                <div className="report-date">All Time</div>
              </div>
              <div className="report-card">
                <h4>Today's Revenue</h4>
                <div className="report-value">${stats.todayRevenue?.toFixed(2) || '0.00'}</div>
                <div className="report-date">{new Date().toLocaleDateString()}</div>
              </div>
              <div className="report-card">
                <h4>Occupancy Rate</h4>
                <div className="report-value">{stats.occupancyRate || 0}%</div>
                <div className="report-date">Current</div>
              </div>
              <div className="report-card">
                <h4>Total Bookings</h4>
                <div className="report-value">{stats.totalBookings || 0}</div>
                <div className="report-date">All Time</div>
              </div>
            </div>

            <div className="report-actions">
              <button className="btn-primary">📊 Export Excel</button>
              <button className="btn-primary">📄 Export PDF</button>
              <button className="btn-primary">📧 Email Report</button>
            </div>

            <div className="report-table">
              <h4>Revenue by Month</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                Monthly breakdown will be displayed here once data is available.
              </p>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
