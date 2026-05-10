import axios from 'axios';

// ─── Axios Instance ─────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send cookies with every request
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach JWT ────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('traveloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 ───────────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('traveloop_token');
      localStorage.removeItem('traveloop_user');
      // Only redirect if not already on auth pages
      const path = window.location.pathname;
      if (!['/login', '/signup', '/onboarding', '/welcome'].includes(path)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ───────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/users/me'),
  updateProfile: (data) => API.patch('/users/me', data),
  updatePassword: (data) => API.patch('/auth/update-password', data),
};

// ─── Trip API ───────────────────────────────────────────────────────────────
export const tripAPI = {
  getAll: (params) => API.get('/trips', { params }),
  getById: (id) => API.get(`/trips/${id}`),
  create: (data) => API.post('/trips', data),
  update: (id, data) => API.patch(`/trips/${id}`, data),
  delete: (id) => API.delete(`/trips/${id}`),
};

// ─── Health Check ───────────────────────────────────────────────────────────
export const healthCheck = () => API.get('/health');

export default API;
