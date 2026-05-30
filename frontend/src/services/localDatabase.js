// Local Storage Database Service
// Provides offline functionality when backend is unavailable

const DB_KEYS = {
  USERS: 'plhms_users_db',
  ROOMS: 'plhms_rooms_db',
  BOOKINGS: 'plhms_bookings_db',
  ORDERS: 'plhms_orders_db',
  STORE_ITEMS: 'plhms_store_db',
  SETTINGS: 'plhms_settings_db'
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Generic CRUD operations
const getAll = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveAll = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getById = (key, id) => {
  const items = getAll(key);
  return items.find(item => item.id === id);
};

const create = (key, item) => {
  const items = getAll(key);
  const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
  items.push(newItem);
  saveAll(key, items);
  return newItem;
};

const update = (key, id, updates) => {
  const items = getAll(key);
  const index = items.findIndex(item => item.id === id);
  if (index >= 0) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    saveAll(key, items);
    return items[index];
  }
  return null;
};

const remove = (key, id) => {
  const items = getAll(key);
  const filtered = items.filter(item => item.id !== id);
  saveAll(key, filtered);
  return filtered.length < items.length;
};

// Initialize default rooms if none exist
const initializeRooms = () => {
  const rooms = getAll(DB_KEYS.ROOMS);
  if (rooms.length === 0) {
    const defaultRooms = [
      { id: 'room1', name: 'Deluxe Room', type: 'DELUXE', floor: 1, price: 250, status: 'available', capacity: 2, amenities: ['WiFi', 'TV', 'Mini Bar'] },
      { id: 'room2', name: 'Executive Suite', type: 'SUITE', floor: 2, price: 450, status: 'available', capacity: 4, amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi'] },
      { id: 'room3', name: 'Presidential Suite', type: 'PRESIDENTIAL', floor: 11, price: 1500, status: 'available', capacity: 6, amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi', 'Private Pool'] },
      { id: 'room4', name: 'Standard Room', type: 'STANDARD', floor: 1, price: 150, status: 'available', capacity: 2, amenities: ['WiFi', 'TV'] },
      { id: 'room5', name: 'Family Room', type: 'FAMILY', floor: 3, price: 350, status: 'available', capacity: 5, amenities: ['WiFi', 'TV', 'Mini Bar', 'Kids Area'] },
    ];
    saveAll(DB_KEYS.ROOMS, defaultRooms);
  }
};

// Initialize default store items
const initializeStore = () => {
  const items = getAll(DB_KEYS.STORE_ITEMS);
  if (items.length === 0) {
    const defaultItems = [
      { id: 'item1', name: 'Luxury Bathrobe', nameAr: 'روب استحمام فاخر', price: 120, category: 'comfort', image: '🛁', stock: 50 },
      { id: 'item2', name: 'Premium Slippers', nameAr: 'شبشب فاخر', price: 45, category: 'comfort', image: '🩴', stock: 100 },
      { id: 'item3', name: 'Spa Gift Set', nameAr: 'مجموعة هدايا سبا', price: 85, category: 'spa', image: '🧴', stock: 30 },
      { id: 'item4', name: 'Gourmet Chocolate Box', nameAr: 'صندوق شوكولاتة فاخرة', price: 55, category: 'food', image: '🍫', stock: 40 },
      { id: 'item5', name: 'Hotel Souvenir Mug', nameAr: 'كوب تذكاري', price: 25, category: 'souvenirs', image: '☕', stock: 200 },
    ];
    saveAll(DB_KEYS.STORE_ITEMS, defaultItems);
  }
};

// Room operations
export const roomsDB = {
  getAll: () => { initializeRooms(); return getAll(DB_KEYS.ROOMS); },
  getById: (id) => getById(DB_KEYS.ROOMS, id),
  create: (room) => create(DB_KEYS.ROOMS, room),
  update: (id, updates) => update(DB_KEYS.ROOMS, id, updates),
  delete: (id) => remove(DB_KEYS.ROOMS, id),
  getAvailable: (checkIn, checkOut) => {
    const rooms = getAll(DB_KEYS.ROOMS);
    const bookings = getAll(DB_KEYS.BOOKINGS);
    return rooms.filter(room => {
      const roomBookings = bookings.filter(b => b.roomId === room.id && b.status !== 'cancelled');
      return !roomBookings.some(b => {
        const bStart = new Date(b.checkIn);
        const bEnd = new Date(b.checkOut);
        const qStart = new Date(checkIn);
        const qEnd = new Date(checkOut);
        return (qStart < bEnd && qEnd > bStart);
      });
    });
  }
};

// Booking operations
export const bookingsDB = {
  getAll: () => getAll(DB_KEYS.BOOKINGS),
  getById: (id) => getById(DB_KEYS.BOOKINGS, id),
  getByUser: (userId) => getAll(DB_KEYS.BOOKINGS).filter(b => b.userId === userId),
  create: (booking) => {
    const newBooking = create(DB_KEYS.BOOKINGS, {
      ...booking,
      status: 'pending',
      bookingNumber: 'BK' + Date.now().toString().slice(-8)
    });
    // Update room status
    if (booking.roomId) {
      update(DB_KEYS.ROOMS, booking.roomId, { status: 'booked' });
    }
    return newBooking;
  },
  update: (id, updates) => update(DB_KEYS.BOOKINGS, id, updates),
  cancel: (id) => update(DB_KEYS.BOOKINGS, id, { status: 'cancelled' }),
  confirm: (id) => update(DB_KEYS.BOOKINGS, id, { status: 'confirmed' }),
  checkIn: (id) => update(DB_KEYS.BOOKINGS, id, { status: 'checked_in' }),
  checkOut: (id) => {
    const booking = getById(DB_KEYS.BOOKINGS, id);
    if (booking?.roomId) {
      update(DB_KEYS.ROOMS, booking.roomId, { status: 'available' });
    }
    return update(DB_KEYS.BOOKINGS, id, { status: 'checked_out' });
  }
};

// Order operations
export const ordersDB = {
  getAll: () => getAll(DB_KEYS.ORDERS),
  getById: (id) => getById(DB_KEYS.ORDERS, id),
  getByUser: (userId) => getAll(DB_KEYS.ORDERS).filter(o => o.userId === userId),
  create: (order) => create(DB_KEYS.ORDERS, {
    ...order,
    status: 'pending',
    orderNumber: 'ORD' + Date.now().toString().slice(-8)
  }),
  update: (id, updates) => update(DB_KEYS.ORDERS, id, updates),
  updateStatus: (id, status) => update(DB_KEYS.ORDERS, id, { status })
};

// Store operations
export const storeDB = {
  getAll: () => { initializeStore(); return getAll(DB_KEYS.STORE_ITEMS); },
  getById: (id) => getById(DB_KEYS.STORE_ITEMS, id),
  create: (item) => create(DB_KEYS.STORE_ITEMS, item),
  update: (id, updates) => update(DB_KEYS.STORE_ITEMS, id, updates),
  delete: (id) => remove(DB_KEYS.STORE_ITEMS, id)
};

// Settings operations
export const settingsDB = {
  get: () => {
    const settings = localStorage.getItem(DB_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      phone: '+1 234 567 890',
      email: 'info@presidentialluxury.com',
      address: '123 Luxury Avenue, Downtown',
      languages: ['en', 'ar', 'tr']
    };
  },
  save: (settings) => {
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }
};

// Statistics
export const statsDB = {
  getDashboardStats: () => {
    const bookings = getAll(DB_KEYS.BOOKINGS);
    const orders = getAll(DB_KEYS.ORDERS);
    const rooms = getAll(DB_KEYS.ROOMS);
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.createdAt?.startsWith(today));
    const todayOrders = orders.filter(o => o.createdAt?.startsWith(today));
    
    return {
      totalRooms: rooms.length,
      availableRooms: rooms.filter(r => r.status === 'available').length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter(b => ['pending', 'confirmed', 'checked_in'].includes(b.status)).length,
      todayCheckIns: todayBookings.filter(b => b.status === 'checked_in').length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      todayRevenue: todayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      occupancyRate: rooms.length > 0 ? Math.round((rooms.filter(r => r.status !== 'available').length / rooms.length) * 100) : 0
    };
  }
};

// Initialize on load
initializeRooms();
initializeStore();

export default {
  rooms: roomsDB,
  bookings: bookingsDB,
  orders: ordersDB,
  store: storeDB,
  settings: settingsDB,
  stats: statsDB
};
