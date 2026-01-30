/**
 * QC Service
 * Xử lý các API liên quan đến kiểm tra chất lượng
 */

import httpClient from '../httpClient';

const qcService = {
  /**
   * Lấy danh sách biên bản QC
   * @param {Object} params - Query parameters
   */
  async getAll(params = {}) {
    return httpClient.get('/qc-records', { params });
  },

  /**
   * Lấy chi tiết biên bản QC
   * @param {string} id - ID biên bản QC
   */
  async getById(id) {
    return httpClient.get(`/qc-records/${id}`);
  },

  /**
   * Tạo biên bản QC mới
   * @param {Object} data - Thông tin biên bản QC
   * @param {string} data.workOrderId - ID lệnh sản xuất
   * @param {string} data.result - Kết quả (PASS, FAIL, CONDITIONAL)
   * @param {number} data.quantityChecked - Số lượng kiểm tra
   * @param {number} data.quantityPassed - Số lượng đạt
   * @param {number} data.quantityFailed - Số lượng không đạt
   * @param {string} data.defectDescription - Mô tả lỗi
   * @param {string} data.notes - Ghi chú
   */
  async create(data) {
    return httpClient.post('/qc-records', data);
  },

  /**
   * Cập nhật biên bản QC
   * @param {string} id - ID biên bản QC
   * @param {Object} data - Thông tin cập nhật
   */
  async update(id, data) {
    return httpClient.put(`/qc-records/${id}`, data);
  },

  /**
   * Lấy biên bản QC theo lệnh sản xuất
   * @param {string} workOrderId - ID lệnh sản xuất
   */
  async getByWorkOrder(workOrderId) {
    return httpClient.get('/qc-records', { params: { workOrderId } });
  },

  /**
   * Lấy biên bản QC theo kết quả
   * @param {string} result - Kết quả (PASS, FAIL, CONDITIONAL)
   */
  async getByResult(result) {
    return httpClient.get('/qc-records', { params: { result } });
  },

  /**
   * Lấy thống kê QC
   * @param {Object} params - Query parameters (dateFrom, dateTo)
   */
  async getStatistics(params = {}) {
    return httpClient.get('/qc-records/statistics', { params });
  },

  /**
   * Upload hình ảnh QC
   * @param {string} id - ID biên bản QC
   * @param {File} file - File hình ảnh
   */
  async uploadImage(id, file) {
    return httpClient.upload(`/qc-records/${id}/images`, file);
  },
};

export default qcService;
