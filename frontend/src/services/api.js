const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  // Try to get token from dedicated storage first
  const storedToken = localStorage.getItem('plhms_token');
  if (storedToken && !storedToken.startsWith('local_')) {
    console.log('🔑 getAuthToken: Found valid token in plhms_token');
    return storedToken;
  }
  
  // Fallback to user object token
  const user = localStorage.getItem('plhms_user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token && !userData.token.startsWith('local_')) {
        console.log('🔑 getAuthToken: Found valid token in user object');
        return userData.token;
      }
    } catch {
      console.log('🔑 getAuthToken: Failed to parse user data');
    }
  }
  
  console.log('🔑 getAuthToken: No valid token found');
  return null;
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔐 apiRequest: Authorization header SET');
  } else {
    console.warn('⚠️ apiRequest: NO TOKEN - Authorization header NOT set');
  }

  const config = {
    ...options,
    headers,
  };

  const fullUrl = `${API_URL}${endpoint}`;
  console.log('🔗 apiRequest: Fetching', fullUrl);
  console.log('🔐 apiRequest: Has Auth Header:', !!headers['Authorization']);

  try {
    const response = await fetch(fullUrl, config);
    
    console.log('📡 apiRequest: Response status:', response.status);
    console.log('📡 apiRequest: Response ok:', response.ok);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      console.error('❌ apiRequest: Error response data:', errorData);
      
      if (response.status === 401) {
        console.error('Authentication failed - Token may be invalid or expired');
        if (errorData.error === 'Authentication required' || errorData.error === 'Invalid token') {
          localStorage.removeItem('plhms_user');
          localStorage.removeItem('plhms_token');
        }
      }
      
      throw new Error(errorData.error || errorData.message || 'Request failed');
    }

    const data = await response.json();
    console.log('✅ apiRequest: Success data:', data);
    return data;
  } catch (error) {
    console.error('❌ apiRequest: Exception:', error);
    console.error('❌ apiRequest: Error message:', error.message);
    throw error;
  }
};

export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: async (email, password, idNumber) => {
    console.log('🌐 API: Starting login request');
    console.log('📧 API: Email:', email);
    console.log('🔗 API: URL:', `${API_URL}/auth/login`);

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, ...(idNumber && { idNumber }) }),
      });

      console.log('✅ API: Login successful, received data:', result);
      return result;
    } catch (error) {
      console.error('❌ API: Login failed with error:', error);
      console.error('❌ API: Error message:', error.message);
      throw error;
    }
  },

  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),

  getProfile: () => apiRequest('/auth/profile'),
};

export const roomAPI = {
  getAllRooms: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/rooms?${params}`);
  },

  getRoomById: (roomId) => apiRequest(`/rooms/${roomId}`),

  filterRooms: (preferences) => apiRequest('/rooms/filter', {
    method: 'POST',
    body: JSON.stringify(preferences),
  }),

  createRoom: (roomData) => apiRequest('/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData),
  }),

  updateRoom: (roomId, updateData) => apiRequest(`/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),

  deleteRoom: (roomId) => apiRequest(`/rooms/${roomId}`, {
    method: 'DELETE',
  }),
};

export const bookingAPI = {
  createBooking: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  createGuestBooking: (bookingData) => apiRequest('/bookings/guest', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  cancelBooking: async (bookingId, userEmail = null) => {
    // Try authenticated endpoint first, fallback to email-based
    try {
      return await apiRequest(`/bookings/${bookingId}/cancel`, { method: 'POST' });
    } catch (error) {
      if (error.message?.includes('Authentication') || error.message?.includes('token')) {
        const email = userEmail || JSON.parse(localStorage.getItem('plhms_user') || '{}').email;
        if (email) {
          return await apiRequest('/bookings/cancel-by-email', {
            method: 'POST',
            body: JSON.stringify({ bookingId, email })
          });
        }
      }
      throw error;
    }
  },

  rescheduleBooking: async (bookingId, newCheckInDate, newCheckOutDate, userEmail = null) => {
    // Try authenticated endpoint first, fallback to email-based
    try {
      return await apiRequest(`/bookings/${bookingId}/reschedule`, {
        method: 'POST',
        body: JSON.stringify({ newCheckInDate, newCheckOutDate }),
      });
    } catch (error) {
      if (error.message?.includes('Authentication') || error.message?.includes('token')) {
        const email = userEmail || JSON.parse(localStorage.getItem('plhms_user') || '{}').email;
        if (email) {
          return await apiRequest('/bookings/reschedule-by-email', {
            method: 'POST',
            body: JSON.stringify({ bookingId, email, newCheckInDate, newCheckOutDate })
          });
        }
      }
      throw error;
    }
  },

  getMyBookings: () => apiRequest('/bookings/my-bookings'),

  getBookingsByEmail: (email) => apiRequest(`/bookings/by-email/${encodeURIComponent(email)}`),

  getBookingById: (bookingId) => apiRequest(`/bookings/${bookingId}`),

  getAllBookings: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/bookings?${params}`);
  },

  updateBookingStatus: (bookingId, status) => apiRequest(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

// Service Booking API
export const serviceAPI = {
  bookService: (bookingData) => apiRequest('/services/book', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  getMyServiceBookings: () => apiRequest('/services/my-bookings'),

  getServiceBookingsByEmail: (email) => apiRequest(`/services/by-email/${encodeURIComponent(email)}`),

  cancelServiceBooking: (bookingId) => apiRequest(`/services/bookings/${bookingId}/cancel`, {
    method: 'POST',
  }),

  rescheduleServiceBooking: (bookingId, newDate, newTime) => apiRequest(`/services/bookings/${bookingId}/reschedule`, {
    method: 'POST',
    body: JSON.stringify({ newDate, newTime }),
  }),

  getAllServiceBookings: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/services/bookings?${params}`);
  },

  getServicePricing: () => apiRequest('/services/pricing'),
};

// Parking Reservations API (guest-facing)
export const parkingAPI = {
  reserve: (data) => apiRequest('/parking/reserve', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMyReservations: () => apiRequest('/parking/my-reservations'),

  getReservationsByEmail: (email) => apiRequest(`/parking/reservations/by-email/${encodeURIComponent(email)}`),

  cancelReservation: (id) => apiRequest(`/parking/reservations/${id}/cancel`, {
    method: 'POST',
  }),
};

// Store/Orders API
export const storeAPI = {
  getItems: () => apiRequest('/store/items'),

  getItemById: (itemId) => apiRequest(`/store/items/${itemId}`),

  createOrder: (orderData) => apiRequest('/store/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  getMyOrders: () => apiRequest('/store/my-orders'),

  getOrdersByEmail: (email) => apiRequest(`/store/orders/by-email/${encodeURIComponent(email)}`),

  cancelOrder: (orderId) => apiRequest(`/store/orders/${orderId}/cancel`, {
    method: 'POST',
  }),

  getOrderByNumber: (orderNumber) => apiRequest(`/store/orders/${orderNumber}`),
};

// VIP Service API
export const vipAPI = {
  bookVipService: (data) => apiRequest('/vip/book', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMyVipBookings: () => apiRequest('/vip/my-bookings'),
};

export const conciergeAPI = {
  chat: (messages) =>
    apiRequest('/concierge/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),
};

export const chatAPI = {
  createSession: () => apiRequest('/chat/sessions', {
    method: 'POST',
    body: JSON.stringify({}),
  }),

  getSession: (sessionId) => apiRequest(`/chat/sessions/${sessionId}`),

  sendMessage: (sessionId, content, messageType = 'text', metadata = {}) =>
    apiRequest(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, messageType, metadata }),
    }),

  updateSessionData: (sessionId, guestData) =>
    apiRequest(`/chat/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ guestData }),
    }),

  assignStaff: (sessionId, staffId) =>
    apiRequest(`/chat/sessions/${sessionId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ staffId }),
    }),

  closeSession: (sessionId) =>
    apiRequest(`/chat/sessions/${sessionId}/close`, {
      method: 'POST',
    }),

  getActiveSessions: () => apiRequest('/chat/sessions/active'),
};

export const userAPI = {
  getAllUsers: () => apiRequest('/users'),
  
  getUserById: (userId) => apiRequest(`/users/${userId}`),
  
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (userData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  createUser: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  updateUser: (userId, userData) => apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  deleteUser: (userId) => apiRequest(`/users/${userId}`, {
    method: 'DELETE',
  }),
  
  getStaff: () => apiRequest('/users?role=STAFF'),
};

// Helper function for admin API requests with proper error handling
const adminRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  console.log('🔗 adminRequest:', options.method || 'GET', url);
  
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('❌ adminRequest failed:', response.status, data);
      throw new Error(data.error || data.message || `Server error: ${response.status}`);
    }
    
    console.log('✅ adminRequest success:', data);
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      console.error('❌ Backend server not reachable. Make sure it is running on port 5000.');
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
    }
    throw error;
  }
};

// Admin API - NO AUTH required for now
export const adminAPI = {
  // Floors
  getFloors: () => adminRequest('/floors'),
  createFloor: (data) => adminRequest('/floors', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateFloor: (id, data) => adminRequest(`/floors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteFloor: (id) => adminRequest(`/floors/${id}`, {
    method: 'DELETE'
  }),

  // Rooms
  getRooms: () => adminRequest('/rooms'),
  createRoom: (data) => adminRequest('/rooms', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateRoom: (id, data) => adminRequest(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteRoom: (id) => adminRequest(`/rooms/${id}`, {
    method: 'DELETE'
  }),

  // Features
  getFeatures: () => adminRequest('/features'),
  createFeature: (data) => adminRequest('/features', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateFeature: (id, data) => adminRequest(`/features/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteFeature: (id) => adminRequest(`/features/${id}`, {
    method: 'DELETE'
  }),

  // Food
  getFood: () => adminRequest('/food'),
  createFood: (data) => adminRequest('/food', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateFood: (id, data) => adminRequest(`/food/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteFood: (id) => adminRequest(`/food/${id}`, {
    method: 'DELETE'
  }),

  // Parking
  getParking: () => adminRequest('/parking'),
  createParking: (data) => adminRequest('/parking', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateParking: (id, data) => adminRequest(`/parking/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteParking: (id) => adminRequest(`/parking/${id}`, {
    method: 'DELETE'
  }),

  // Bookings
  getBookings: () => adminRequest('/bookings'),
  
  // Suites (same as rooms with type filter)
  getSuites: () => adminRequest('/rooms?type=SUITE'),
  createSuite: (data) => adminRequest('/rooms', {
    method: 'POST',
    body: JSON.stringify({ ...data, type: 'SUITE' })
  }),
  updateSuite: (id, data) => adminRequest(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteSuite: (id) => adminRequest(`/rooms/${id}`, {
    method: 'DELETE'
  }),
};

export default {
  auth: authAPI,
  rooms: roomAPI,
  bookings: bookingAPI,
  services: serviceAPI,
  store: storeAPI,
  chat: chatAPI,
  concierge: conciergeAPI,
  admin: adminAPI,
};
