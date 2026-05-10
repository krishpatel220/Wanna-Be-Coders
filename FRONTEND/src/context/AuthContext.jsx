import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('traveloop_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('traveloop_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hydrate user from backend on mount (if token exists)
  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        const userData = res.data?.data?.user;
        if (userData) {
          setUser(userData);
          localStorage.setItem('traveloop_user', JSON.stringify(userData));
        }
      } catch (err) {
        // Token expired or invalid — clear auth silently
        console.warn('Auth hydration failed:', err.message);
        localStorage.removeItem('traveloop_token');
        localStorage.removeItem('traveloop_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      const { token: jwt, data } = res.data;
      setToken(jwt);
      setUser(data.user);
      localStorage.setItem('traveloop_token', jwt);
      localStorage.setItem('traveloop_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const signup = useCallback(async (formData) => {
    setError(null);
    try {
      // Map frontend fields → backend expected shape
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword || formData.passwordConfirm,
        phone: formData.mobile,
        dob: formData.dob,
        location: `${formData.address ? formData.address + ', ' : ''}${formData.state ? formData.state + ', ' : ''}${formData.country}`,
      };

      const res = await authAPI.register(payload);
      const { token: jwt, data } = res.data;
      setToken(jwt);
      setUser(data.user);
      localStorage.setItem('traveloop_token', jwt);
      localStorage.setItem('traveloop_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore — we clear locally regardless
    }
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    localStorage.removeItem('traveloop_chat_history');
  }, []);

  const updateProfile = useCallback(async (updates) => {
    setError(null);
    try {
      const res = await authAPI.updateProfile(updates);
      const updated = res.data?.data?.user;
      if (updated) {
        setUser(updated);
        localStorage.setItem('traveloop_user', JSON.stringify(updated));
      }
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed.';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    updateProfile,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
