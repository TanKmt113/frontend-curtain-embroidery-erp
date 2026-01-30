/**
 * Work Order Service
 * Xử lý các API liên quan đến lệnh sản xuất
 */

import httpClient from '../httpClient';

const workOrderService = {
  /**
   * Lấy danh sách lệnh sản xuất
   * @param {Object} params - Query parameters
   */
  async getAll(params = {}) {
    return httpClient.get('/work-orders', { params });
  },

  /**
   * Lấy chi tiết lệnh sản xuất
   * @param {string} id - ID lệnh sản xuất
   */
  async getById(id) {
    return httpClient.get(`/work-orders/${id}`);
  },

  /**
   * Tạo lệnh sản xuất mới
   * @param {Object} data - Thông tin lệnh sản xuất
   */
  async create(data) {
    return httpClient.post('/work-orders', data);
  },

  /**
   * Cập nhật lệnh sản xuất
   * @param {string} id - ID lệnh sản xuất
   * @param {Object} data - Thông tin cập nhật
   */
  async update(id, data) {
    return httpClient.put(`/work-orders/${id}`, data);
  },

  /**
   * Thay đổi trạng thái lệnh sản xuất
   * @param {string} id - ID lệnh sản xuất
   * @param {string} status - Trạng thái mới (PENDING, IN_PROGRESS, COMPLETED, ON_HOLD)
   */
  async updateStatus(id, status) {
    return httpClient.patch(`/work-orders/${id}/status`, { status });
  },

  /**
   * Lấy lệnh sản xuất theo trạng thái
   * @param {string} status - Trạng thái
   */
  async getByStatus(status) {
    return httpClient.get('/work-orders', { params: { status } });
  },

  /**
   * Lấy lệnh sản xuất theo đơn hàng
   * @param {string} orderId - ID đơn hàng
   */
  async getByOrder(orderId) {
    return httpClient.get('/work-orders', { params: { orderId } });
  },

  /**
   * Lấy các công đoạn của lệnh sản xuất
   * @param {string} id - ID lệnh sản xuất
   */
  async getSteps(id) {
    return httpClient.get(`/work-orders/${id}/steps`);
  },

  /**
   * Cập nhật trạng thái công đoạn
   * @param {string} workOrderId - ID lệnh sản xuất
   * @param {string} stepId - ID công đoạn
   * @param {Object} data - Thông tin cập nhật
   */
  async updateStep(workOrderId, stepId, data) {
    return httpClient.patch(`/work-orders/${workOrderId}/steps/${stepId}`, data);
  },

  /**
   * Bắt đầu công đoạn
   * @param {string} workOrderId - ID lệnh sản xuất
   * @param {string} stepId - ID công đoạn
   */
  async startStep(workOrderId, stepId) {
    return httpClient.patch(`/work-orders/${workOrderId}/steps/${stepId}/start`);
  },

  /**
   * Hoàn thành công đoạn
   * @param {string} workOrderId - ID lệnh sản xuất
   * @param {string} stepId - ID công đoạn
   * @param {Object} data - Kết quả hoàn thành
   */
  async completeStep(workOrderId, stepId, data = {}) {
    return httpClient.patch(`/work-orders/${workOrderId}/steps/${stepId}/complete`, data);
  },

  /**
   * Lấy quy trình sản xuất mẫu
   */
  async getRoutingTemplates() {
    return httpClient.get('/work-orders/routing-templates');
  },
};

export default workOrderService;
