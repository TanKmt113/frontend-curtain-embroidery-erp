/**
 * Quotation Service
 * Xử lý các API liên quan đến báo giá
 */

import httpClient from '../httpClient';

const quotationService = {
  /**
   * Lấy danh sách báo giá
   * @param {Object} params - Query parameters
   */
  async getAll(params = {}) {
    return httpClient.get('/quotations', { params });
  },

  /**
   * Lấy chi tiết báo giá
   * @param {string} id - ID báo giá
   */
  async getById(id) {
    return httpClient.get(`/quotations/${id}`);
  },

  /**
   * Tạo báo giá mới
   * @param {Object} data - Thông tin báo giá
   */
  async create(data) {
    return httpClient.post('/quotations', data);
  },

  /**
   * Cập nhật báo giá
   * @param {string} id - ID báo giá
   * @param {Object} data - Thông tin cập nhật
   */
  async update(id, data) {
    return httpClient.put(`/quotations/${id}`, data);
  },

  /**
   * Thay đổi trạng thái báo giá
   * @param {string} id - ID báo giá
   * @param {string} status - Trạng thái mới (DRAFT, SENT, APPROVED, REJECTED, EXPIRED)
   */
  async updateStatus(id, status) {
    return httpClient.patch(`/quotations/${id}/status`, { status });
  },

  /**
   * Xóa báo giá
   * @param {string} id - ID báo giá
   */
  async delete(id) {
    return httpClient.delete(`/quotations/${id}`);
  },

  /**
   * Lấy báo giá theo trạng thái
   * @param {string} status - Trạng thái báo giá
   */
  async getByStatus(status) {
    return httpClient.get('/quotations', { params: { status } });
  },

  /**
   * Lấy báo giá theo khách hàng
   * @param {string} customerId - ID khách hàng
   */
  async getByCustomer(customerId) {
    return httpClient.get('/quotations', { params: { customerId } });
  },

  /**
   * Chuyển báo giá thành đơn hàng
   * @param {string} id - ID báo giá
   */
  async convertToOrder(id) {
    return httpClient.post(`/quotations/${id}/convert-to-order`);
  },

  /**
   * Gửi báo giá cho khách hàng (qua email)
   * @param {string} id - ID báo giá
   */
  async sendToCustomer(id) {
    return httpClient.post(`/quotations/${id}/send`);
  },

  /**
   * In/Export báo giá PDF
   * @param {string} id - ID báo giá
   */
  async exportPdf(id) {
    return httpClient.get(`/quotations/${id}/export-pdf`, {
      responseType: 'blob',
    });
  },
};

export default quotationService;
