import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Start with null so the Login page is always the first screen when opening the site
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const authUser = res?.data?.user || res?.user || (res?.data?.role ? res.data : null);
      const authToken = res?.data?.token || res?.token || `token_${Date.now()}`;
      
      if (!authUser) {
        throw new Error('Invalid credentials.');
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('society_auth_token', authToken);
      localStorage.setItem('society_auth_user', JSON.stringify(authUser));
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      const authUser = res?.data?.user || res?.user || (res?.data?.role ? res.data : null);
      const authToken = res?.data?.token || res?.token || `token_${Date.now()}`;
      
      if (!authUser) {
        throw new Error('Registration failed.');
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('society_auth_token', authToken);
      localStorage.setItem('society_auth_user', JSON.stringify(authUser));
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('society_auth_token');
    localStorage.removeItem('society_auth_user');
  };

  const switchDemoRole = async (targetRole) => {
    const credentials = {
      admin: { email: 'admin@greenwood.com', password: 'Password123!' },
      staff: { email: 'staff@greenwood.com', password: 'Password123!' },
      resident: { email: 'resident@greenwood.com', password: 'Password123!' }
    };
    if (credentials[targetRole]) {
      return await login(credentials[targetRole].email, credentials[targetRole].password);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isManagerOrStaff: user?.role === 'admin' || user?.role === 'staff',
    isResident: user?.role === 'resident',
    login,
    register,
    logout,
    switchDemoRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
