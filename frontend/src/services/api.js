import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // When running on Vercel frontend, connect to the live backend API
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://thin-papers-heal.loca.lt/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true'
  }
});

// Request interceptor: attach Bearer token and bypass tunnel reminder
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('society_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Bypass-Tunnel-Reminder'] = 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response payload or error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if not hitting auth endpoints
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('society_auth_token');
        localStorage.removeItem('society_auth_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
