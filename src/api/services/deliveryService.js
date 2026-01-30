/**
 * Delivery Service
 * Xử lý các API liên quan đến giao hàng và lắp đặt
 */

import httpClient from '../httpClient';

const deliveryService = {
  /**
   * Lấy danh sách giao hàng
   * @param {Object} params - Query parameters
   */
  async getAll(params = {}) {
    return httpClient.get('/deliveries', { params });
  },

  /**
   * Lấy chi tiết giao hàng
   * @param {string} id - ID giao hàng
   */
  async getById(id) {
    return httpClient.get(`/deliveries/${id}`);
  },

  /**
   * Tạo lịch giao hàng mới
   * @param {Object} data - Thông tin giao hàng
   * @param {string} data.orderId - ID đơn hàng
   * @param {string} data.type - Loại (DELIVERY, INSTALLATION)
   * @param {string} data.scheduledDate - Ngày dự kiến
   * @param {string} data.address - Địa chỉ giao hàng
   * @param {string} data.contactName - Tên người liên hệ
   * @param {string} data.contactPhone - SĐT liên hệ
   * @param {string} data.notes - Ghi chú
   */
  async create(data) {
    return httpClient.post('/deliveries', data);
  },

  /**
   * Cập nhật giao hàng
   * @param {string} id - ID giao hàng
   * @param {Object} data - Thông tin cập nhật
   */
  async update(id, data) {
    return httpClient.put(`/deliveries/${id}`, data);
  },

  /**
   * Thay đổi trạng thái giao hàng
   * @param {string} id - ID giao hàng
   * @param {string} status - Trạng thái mới (SCHEDULED, IN_TRANSIT, DELIVERED, FAILED, RESCHEDULED)
   * @param {Object} additionalData - Dữ liệu bổ sung (reason, notes, etc.)
   */
  async updateStatus(id, status, additionalData = {}) {
    return httpClient.patch(`/deliveries/${id}/status`, { status, ...additionalData });
  },

  /**
   * Lấy giao hàng theo trạng thái
   * @param {string} status - Trạng thái
   */
  async getByStatus(status) {
    return httpClient.get('/deliveries', { params: { status } });
  },

  /**
   * Lấy giao hàng theo loại
   * @param {string} type - Loại (DELIVERY, INSTALLATION)
   */
  async getByType(type) {
    return httpClient.get('/deliveries', { params: { type } });
  },

  /**
   * Lấy giao hàng theo đơn hàng
   * @param {string} orderId - ID đơn hàng
   */
  async getByOrder(orderId) {
    return httpClient.get('/deliveries', { params: { orderId } });
  },

  /**
   * Lấy lịch giao hàng theo ngày
   * @param {string} date - Ngày (YYYY-MM-DD)
   */
  async getByDate(date) {
    return httpClient.get('/deliveries', { params: { scheduledDate: date } });
  },

  /**
   * Lấy lịch giao hàng trong khoảng thời gian
   * @param {string} dateFrom - Từ ngày
   * @param {string} dateTo - Đến ngày
   */
  async getByDateRange(dateFrom, dateTo) {
    return httpClient.get('/deliveries', { params: { dateFrom, dateTo } });
  },

  /**
   * Đổi lịch giao hàng
   * @param {string} id - ID giao hàng
   * @param {string} newDate - Ngày mới
   * @param {string} reason - Lý do đổi lịch
   */
  async reschedule(id, newDate, reason) {
    return httpClient.patch(`/deliveries/${id}/reschedule`, { 
      newScheduledDate: newDate,
      rescheduleReason: reason 
    });
  },

  /**
   * Xác nhận giao hàng thành công
   * @param {string} id - ID giao hàng
   * @param {Object} data - Thông tin xác nhận (signature, notes, etc.)
   */
  async confirmDelivery(id, data = {}) {
    return httpClient.patch(`/deliveries/${id}/confirm`, data);
  },

  /**
   * Báo cáo giao hàng thất bại
   * @param {string} id - ID giao hàng
   * @param {string} reason - Lý do thất bại
   */
  async reportFailure(id, reason) {
    return httpClient.patch(`/deliveries/${id}/status`, { 
      status: 'FAILED',
      failureReason: reason 
    });
  },

  /**
   * Lấy lịch giao hàng/lắp đặt hôm nay
   */
  async getTodaySchedule() {
    const today = new Date().toISOString().split('T')[0];
    return httpClient.get('/deliveries', { params: { scheduledDate: today } });
  },
};

export default deliveryService;
