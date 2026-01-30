/**
 * Inventory Service
 * Xử lý các API liên quan đến kho hàng
 */

import httpClient from '../httpClient';

const inventoryService = {
  /**
   * Lấy danh sách tồn kho
   * @param {Object} params - Query parameters
   */
  async getAll(params = {}) {
    return httpClient.get('/inventory', { params });
  },

  /**
   * Lấy chi tiết tồn kho
   * @param {string} id - ID tồn kho
   */
  async getById(id) {
    return httpClient.get(`/inventory/${id}`);
  },

  /**
   * Nhập kho
   * @param {Object} data - Thông tin nhập kho
   * @param {string} data.productId - ID sản phẩm
   * @param {number} data.quantity - Số lượng
   * @param {string} data.ownership - Quyền sở hữu (COMPANY, CONSIGNMENT)
   * @param {string} data.customerId - ID khách hàng (nếu là hàng ký gửi)
   * @param {string} data.notes - Ghi chú
   */
  async receive(data) {
    return httpClient.post('/inventory/receive', data);
  },

  /**
   * Xuất kho
   * @param {Object} data - Thông tin xuất kho
   */
  async issue(data) {
    return httpClient.post('/inventory/issue', data);
  },

  /**
   * Điều chỉnh tồn kho
   * @param {Object} data - Thông tin điều chỉnh
   * @param {string} data.inventoryId - ID tồn kho
   * @param {number} data.adjustQuantity - Số lượng điều chỉnh (+/-)
   * @param {string} data.reason - Lý do điều chỉnh
   */
  async adjust(data) {
    return httpClient.post('/inventory/adjust', data);
  },

  /**
   * Lấy tồn kho theo quyền sở hữu
   * @param {string} ownership - Quyền sở hữu (COMPANY, CONSIGNMENT)
   */
  async getByOwnership(ownership) {
    return httpClient.get('/inventory', { params: { ownership } });
  },

  /**
   * Lấy hàng ký gửi của khách hàng
   * @param {string} customerId - ID khách hàng
   */
  async getConsignmentByCustomer(customerId) {
    return httpClient.get('/inventory', { 
      params: { ownership: 'CONSIGNMENT', customerId } 
    });
  },

  /**
   * Lấy lịch sử giao dịch kho
   * @param {Object} params - Query parameters
   */
  async getTransactionHistory(params = {}) {
    return httpClient.get('/inventory/transactions', { params });
  },

  /**
   * Lấy lịch sử giao dịch của một sản phẩm
   * @param {string} productId - ID sản phẩm
   * @param {Object} params - Query parameters
   */
  async getProductTransactions(productId, params = {}) {
    return httpClient.get(`/inventory/transactions`, { 
      params: { ...params, productId } 
    });
  },

  /**
   * Đặt trước hàng cho đơn hàng
   * @param {Object} data - Thông tin đặt trước
   */
  async reserve(data) {
    return httpClient.post('/inventory/reserve', data);
  },

  /**
   * Giải phóng hàng đã đặt trước
   * @param {Object} data - Thông tin giải phóng
   */
  async release(data) {
    return httpClient.post('/inventory/release', data);
  },

  /**
   * Kiểm tra tồn kho khả dụng
   * @param {string} productId - ID sản phẩm
   * @param {number} quantity - Số lượng cần kiểm tra
   */
  async checkAvailability(productId, quantity) {
    return httpClient.get('/inventory/check-availability', {
      params: { productId, quantity }
    });
  },

  /**
   * Lấy báo cáo tồn kho
   * @param {Object} params - Query parameters
   */
  async getReport(params = {}) {
    return httpClient.get('/inventory/report', { params });
  },
};

export default inventoryService;
