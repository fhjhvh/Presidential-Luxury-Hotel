import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Validate JWT token format (basic check)
const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') return false;
  // JWT has 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  // Must not be a local/fake token
  if (token.startsWith('local_')) return false;
  return true;
};

// Clear all auth data from storage
const clearAuthStorage = () => {
  localStorage.removeItem('plhms_user');
  localStorage.removeItem('plhms_token');
  sessionStorage.clear();
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth and validate token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('plhms_user');
      const storedToken = localStorage.getItem('plhms_token');
      
      console.log('🔐 AuthContext: Initializing auth...');
      console.log('🔐 AuthContext: Token exists:', !!storedToken);
      console.log('🔐 AuthContext: Token valid format:', storedToken ? isValidJWT(storedToken) : false);
      
      if (storedUser && storedToken) {
        // Validate token format first
        if (!isValidJWT(storedToken)) {
          console.warn('❌ Invalid token detected (not JWT format), clearing auth data');
          clearAuthStorage();
          setLoading(false);
          return;
        }
        
        try {
          const userData = JSON.parse(storedUser);
          const token = storedToken;
          
          // Verify token with backend
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            setUser({ ...userData, token });
          } else {
            // Token invalid on backend - clear and logout
            console.warn('Token rejected by backend, logging out');
            clearAuthStorage();
          }
        } catch (error) {
          // Backend unreachable - keep user logged in but warn
          console.warn('Could not verify token with backend:', error.message);
          try {
            const userData = JSON.parse(storedUser);
            setUser({ ...userData, token: storedToken });
          } catch {
            clearAuthStorage();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register - Backend only, no local fallback
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (!response.token || !isValidJWT(response.token)) {
        return { success: false, error: 'Invalid token received from server' };
      }
      
      const userWithToken = {
        ...response.user,
        token: response.token,
        role: response.user.role,
        loginTime: new Date().toISOString()
      };
      
      setUser(userWithToken);
      localStorage.setItem('plhms_user', JSON.stringify(userWithToken));
      localStorage.setItem('plhms_token', response.token);
      
      return { success: true, user: userWithToken };
    } catch (error) {
      console.error('Registration failed:', error.message);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please ensure the server is running.' 
      };
    }
  };

  // Login - Backend only, no local fallback
  const login = async (email, password, idNumber) => {
    console.log('🔐 Login: Attempting login for', email || `ID: ${idNumber}`);
    try {
      const response = await authAPI.login(email, password, idNumber);
      console.log('🔐 Login: Response received', { hasToken: !!response.token, hasUser: !!response.user });
      
      if (!response.token || !isValidJWT(response.token)) {
        console.error('🔐 Login: Invalid token format received');
        return { success: false, error: 'Invalid token received from server' };
      }
      
      const userWithToken = {
        ...response.user,
        token: response.token,
        role: response.user.role,
        loginTime: new Date().toISOString()
      };
      
      // Store in state and localStorage
      setUser(userWithToken);
      localStorage.setItem('plhms_user', JSON.stringify(userWithToken));
      localStorage.setItem('plhms_token', response.token);
      
      console.log('✅ Login: Success! Token stored in localStorage');
      console.log('✅ Login: Token preview:', response.token.substring(0, 50) + '...');
      
      return { success: true, user: userWithToken };
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please ensure the server is running.' 
      };
    }
  };


  const logout = async () => {
    try {
      if (user?.token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearAuthStorage();
      navigate('/');
    }
  };

  // Force logout - used when token is invalid
  const forceLogout = () => {
    setUser(null);
    clearAuthStorage();
  };

  // Update user profile fields in state and localStorage
  const updateUser = (updates) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('plhms_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    register,
    login,
    logout,
    forceLogout,
    updateUser,
    loading,
    isAuthenticated: !!user && isValidJWT(user?.token)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
