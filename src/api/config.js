/**
 * API Configuration
 * Cấu hình các thông số cho API
 */

const API_CONFIG = {
  // Base URL của API backend
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  
  // Timeout cho request (ms)
  TIMEOUT: 30000,
  
  // Headers mặc định
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Token keys trong localStorage
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_info',
  
  // Các endpoint không cần authentication
  PUBLIC_ENDPOINTS: [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/forgot-password',
  ],
};

export default API_CONFIG;
