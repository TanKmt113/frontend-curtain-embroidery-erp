/**
 * useAuth Hook
 * Custom hook để quản lý authentication
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authService } from '../api';
import { handleApiError } from '../api/errorHandler';

// Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Khởi tạo - kiểm tra user đã đăng nhập
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Fetch user info từ server
            const response = await authService.getCurrentUser();
            setUser(response.data);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        // Token invalid, clear tokens
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      const handledError = handleApiError(err);
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      const handledError = handleApiError(err);
      return { success: false, error: handledError };
    }
  }, []);

  // Check permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    // ADMIN có tất cả quyền
    if (user.role === 'ADMIN') return true;
    // Kiểm tra permission cụ thể
    return user.permissions?.includes(permission);
  }, [user]);

  // Check role
  const hasRole = useCallback((role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    changePassword,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook để sử dụng auth context
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
