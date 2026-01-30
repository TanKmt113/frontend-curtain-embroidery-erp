/**
 * HTTP Client - Axios instance với interceptors
 * Xử lý tất cả các request/response API
 */

import API_CONFIG from './config';

// Tạo class HTTPClient thay vì dùng axios trực tiếp
// để có thể dễ dàng thay đổi library nếu cần
class HTTPClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    
    // Queue để xử lý refresh token
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Lấy access token từ localStorage
   */
  getAccessToken() {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }

  /**
   * Lấy refresh token từ localStorage
   */
  getRefreshToken() {
    return localStorage.getItem(API_CONFIG.REFRESH_TOKEN_KEY);
  }

  /**
   * Lưu tokens vào localStorage
   */
  setTokens(accessToken, refreshToken) {
    if (accessToken) {
      localStorage.setItem(API_CONFIG.TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Xóa tokens khỏi localStorage
   */
  clearTokens() {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.USER_KEY);
  }

  /**
   * Kiểm tra endpoint có cần authentication không
   */
  isPublicEndpoint(url) {
    return API_CONFIG.PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
  }

  /**
   * Xử lý failed queue sau khi refresh token
   */
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    this.setTokens(data.data.accessToken, data.data.refreshToken);
    
    return data.data.accessToken;
  }

  /**
   * Tạo headers cho request
   */
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Xử lý response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        data: data,
        message: data?.message || data?.error || 'Có lỗi xảy ra',
      };
      throw error;
    }

    return data;
  }

  /**
   * Thực hiện request với retry logic cho token refresh
   */
  async request(method, url, options = {}) {
    const { data, headers: customHeaders, params, ...restOptions } = options;
    
    // Build URL with query params
    let fullUrl = `${this.baseURL}${url}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      fullUrl += `?${queryString}`;
    }

    const config = {
      method,
      headers: this.buildHeaders(customHeaders),
      ...restOptions,
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, config);
      
      // Xử lý 401 Unauthorized - Token expired
      if (response.status === 401 && !this.isPublicEndpoint(url)) {
        if (this.isRefreshing) {
          // Nếu đang refresh, thêm request vào queue
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(token => {
            config.headers['Authorization'] = `Bearer ${token}`;
            return fetch(fullUrl, config).then(res => this.handleResponse(res));
          });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshAccessToken();
          this.processQueue(null, newToken);
          
          // Retry original request với token mới
          config.headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(fullUrl, config);
          return this.handleResponse(retryResponse);
        } catch (refreshError) {
          this.processQueue(refreshError, null);
          this.clearTokens();
          
          // Redirect to login
          window.location.href = '/login';
          throw refreshError;
        } finally {
          this.isRefreshing = false;
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      // Network error hoặc các lỗi khác
      if (!error.status) {
        throw {
          status: 0,
          message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
          isNetworkError: true,
        };
      }
      throw error;
    }
  }

  // HTTP Methods
  get(url, options = {}) {
    return this.request('GET', url, options);
  }

  post(url, data, options = {}) {
    return this.request('POST', url, { ...options, data });
  }

  put(url, data, options = {}) {
    return this.request('PUT', url, { ...options, data });
  }

  patch(url, data, options = {}) {
    return this.request('PATCH', url, { ...options, data });
  }

  delete(url, options = {}) {
    return this.request('DELETE', url, options);
  }

  /**
   * Upload file
   */
  async upload(url, file, fieldName = 'file', additionalData = {}) {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const token = this.getAccessToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Không set Content-Type, browser sẽ tự set với boundary

    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse(response);
  }
}

// Export singleton instance
const httpClient = new HTTPClient();
export default httpClient;
