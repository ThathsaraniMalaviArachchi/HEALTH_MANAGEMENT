import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/auth';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Effect to load user on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Decode the JWT token to get user info
          // This is a temporary solution until we implement a proper /me endpoint
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          
          setCurrentUser({
            id: payload.userId,
            role: payload.role || 'user', // Default to 'user' if role is not present
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    if (response.token) {
      setToken(response.token);
      return response;
    }
  };

  // Register function
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    if (response.token) {
      setToken(response.token);
      return response;
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setToken(null);
    setCurrentUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};