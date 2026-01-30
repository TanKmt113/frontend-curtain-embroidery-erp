/**
 * Auth Service
 * Xử lý các API liên quan đến xác thực
 */

import httpClient from '../httpClient';
import API_CONFIG from '../config';

const authService = {
  /**
   * Đăng nhập
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    const response = await httpClient.post('/auth/login', { email, password });
    
    if (response.data) {
      const { accessToken, refreshToken, user } = response.data;
      httpClient.setTokens(accessToken, refreshToken);
      localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user));
    }
    
    return response;
  },

  /**
   * Đăng xuất
   */
  async logout() {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      httpClient.clearTokens();
    }
  },

  /**
   * Làm mới token
   */
  async refreshToken() {
    const refreshToken = httpClient.getRefreshToken();
    const response = await httpClient.post('/auth/refresh', { refreshToken });
    
    if (response.data) {
      httpClient.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  },

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser() {
    return httpClient.get('/auth/me');
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated() {
    return !!httpClient.getAccessToken();
  },

  /**
   * Lấy thông tin user từ localStorage
   */
  getStoredUser() {
    const userStr = localStorage.getItem(API_CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(currentPassword, newPassword) {
    return httpClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Quên mật khẩu - gửi email reset
   */
  async forgotPassword(email) {
    return httpClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset mật khẩu với token
   */
  async resetPassword(token, newPassword) {
    return httpClient.post('/auth/reset-password', { token, newPassword });
  },
};

export default authService;
