import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('society_auth_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('society_auth_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const verifiedUser = res?.data?.user || res?.user || res?.data;
          if (verifiedUser) {
            setUser(verifiedUser);
            localStorage.setItem('society_auth_user', JSON.stringify(verifiedUser));
          }
        } catch {
          // Keep current state
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const authUser = res?.data?.user || res?.user || (res?.data?.role ? res.data : null);
    const authToken = res?.data?.token || res?.token || `token_${Date.now()}`;
    
    if (!authUser) {
      throw new Error('Invalid email or password.');
    }

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('society_auth_token', authToken);
    localStorage.setItem('society_auth_user', JSON.stringify(authUser));
    return authUser;
  };

  const register = async (userData) => {
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
