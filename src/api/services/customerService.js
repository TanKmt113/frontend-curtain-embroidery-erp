/**
 * Customer Service
 * Xử lý các API liên quan đến khách hàng
 */

import httpClient from '../httpClient';

const customerService = {
  /**
   * Lấy danh sách khách hàng
   * @param {Object} params - Query parameters
   * @param {number} params.page - Số trang
   * @param {number} params.limit - Số item mỗi trang
   * @param {string} params.search - Từ khóa tìm kiếm
   * @param {string} params.type - Loại khách hàng (INDIVIDUAL, COMPANY, CONSIGNMENT)
   * @param {string} params.sortBy - Sắp xếp theo field
   * @param {string} params.sortOrder - Thứ tự sắp xếp (asc, desc)
   */
  async getAll(params = {}) {
    return httpClient.get('/customers', { params });
  },

  /**
   * Lấy chi tiết khách hàng
   * @param {string} id - ID khách hàng
   */
  async getById(id) {
    return httpClient.get(`/customers/${id}`);
  },

  /**
   * Tạo khách hàng mới
   * @param {Object} data - Thông tin khách hàng
   */
  async create(data) {
    return httpClient.post('/customers', data);
  },

  /**
   * Cập nhật khách hàng
   * @param {string} id - ID khách hàng
   * @param {Object} data - Thông tin cập nhật
   */
  async update(id, data) {
    return httpClient.put(`/customers/${id}`, data);
  },

  /**
   * Xóa khách hàng
   * @param {string} id - ID khách hàng
   */
  async delete(id) {
    return httpClient.delete(`/customers/${id}`);
  },

  /**
   * Lấy lịch sử đơn hàng của khách hàng
   * @param {string} id - ID khách hàng
   * @param {Object} params - Query parameters
   */
  async getOrderHistory(id, params = {}) {
    return httpClient.get(`/customers/${id}/orders`, { params });
  },

  /**
   * Lấy khách hàng theo loại
   * @param {string} type - Loại khách hàng
   */
  async getByType(type) {
    return httpClient.get('/customers', { params: { type } });
  },

  /**
   * Tìm kiếm khách hàng
   * @param {string} query - Từ khóa tìm kiếm
   */
  async search(query) {
    return httpClient.get('/customers', { params: { search: query } });
  },
};

export default customerService;
