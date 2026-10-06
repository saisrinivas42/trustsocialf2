import { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, login as loginService, register as registerService, logout as logoutService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser } = await loginService(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (fullName, username, email, password) => {
    const { user: newUser } = await registerService(fullName, username, email, password);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('trustsocial_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
