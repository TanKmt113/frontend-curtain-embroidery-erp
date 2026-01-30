/**
 * Order Service
 * Xử lý các API liên quan đến đơn hàng
 */

import httpClient from '../httpClient';

const orderService = {
  /**
   * Lấy danh sách đơn hàng
   * @param {Object} params - Query parameters
   */
  async getAll(params = {}) {
    return httpClient.get('/orders', { params });
  },

  /**
   * Lấy chi tiết đơn hàng
   * @param {string} id - ID đơn hàng
   */
  async getById(id) {
    return httpClient.get(`/orders/${id}`);
  },

  /**
   * Tạo đơn hàng mới
   * @param {Object} data - Thông tin đơn hàng
   */
  async create(data) {
    return httpClient.post('/orders', data);
  },

  /**
   * Cập nhật đơn hàng
   * @param {string} id - ID đơn hàng
   * @param {Object} data - Thông tin cập nhật
   */
  async update(id, data) {
    return httpClient.put(`/orders/${id}`, data);
  },

  /**
   * Thay đổi trạng thái đơn hàng
   * @param {string} id - ID đơn hàng
   * @param {string} status - Trạng thái mới
   */
  async updateStatus(id, status) {
    return httpClient.patch(`/orders/${id}/status`, { status });
  },

  /**
   * Xóa/Hủy đơn hàng
   * @param {string} id - ID đơn hàng
   */
  async cancel(id, reason) {
    return httpClient.patch(`/orders/${id}/status`, { 
      status: 'CANCELLED',
      cancelReason: reason 
    });
  },

  /**
   * Lấy đơn hàng theo trạng thái
   * @param {string} status - Trạng thái đơn hàng
   */
  async getByStatus(status) {
    return httpClient.get('/orders', { params: { status } });
  },

  /**
   * Lấy đơn hàng theo khách hàng
   * @param {string} customerId - ID khách hàng
   */
  async getByCustomer(customerId) {
    return httpClient.get('/orders', { params: { customerId } });
  },

  /**
   * Lấy các hạng mục của đơn hàng
   * @param {string} id - ID đơn hàng
   */
  async getItems(id) {
    return httpClient.get(`/orders/${id}/items`);
  },

  /**
   * Thêm hạng mục vào đơn hàng
   * @param {string} id - ID đơn hàng
   * @param {Object} item - Thông tin hạng mục
   */
  async addItem(id, item) {
    return httpClient.post(`/orders/${id}/items`, item);
  },

  /**
   * Cập nhật hạng mục đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @param {string} itemId - ID hạng mục
   * @param {Object} data - Thông tin cập nhật
   */
  async updateItem(orderId, itemId, data) {
    return httpClient.put(`/orders/${orderId}/items/${itemId}`, data);
  },

  /**
   * Xóa hạng mục khỏi đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @param {string} itemId - ID hạng mục
   */
  async removeItem(orderId, itemId) {
    return httpClient.delete(`/orders/${orderId}/items/${itemId}`);
  },

  /**
   * Lấy tiến độ sản xuất của đơn hàng
   * @param {string} id - ID đơn hàng
   */
  async getProductionProgress(id) {
    return httpClient.get(`/orders/${id}/production-progress`);
  },

  /**
   * In/Export đơn hàng PDF
   * @param {string} id - ID đơn hàng
   */
  async exportPdf(id) {
    return httpClient.get(`/orders/${id}/export-pdf`, {
      responseType: 'blob',
    });
  },
};

export default orderService;
