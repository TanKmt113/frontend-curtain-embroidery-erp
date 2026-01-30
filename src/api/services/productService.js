/**
 * Product Service
 * Xử lý các API liên quan đến sản phẩm
 */

import httpClient from '../httpClient';

const productService = {
  /**
   * Lấy danh sách sản phẩm
   * @param {Object} params - Query parameters
   */
  async getAll(params = {}) {
    return httpClient.get('/products', { params });
  },

  /**
   * Lấy chi tiết sản phẩm
   * @param {string} id - ID sản phẩm
   */
  async getById(id) {
    return httpClient.get(`/products/${id}`);
  },

  /**
   * Tạo sản phẩm mới
   * @param {Object} data - Thông tin sản phẩm
   */
  async create(data) {
    return httpClient.post('/products', data);
  },

  /**
   * Cập nhật sản phẩm
   * @param {string} id - ID sản phẩm
   * @param {Object} data - Thông tin cập nhật
   */
  async update(id, data) {
    return httpClient.put(`/products/${id}`, data);
  },

  /**
   * Xóa sản phẩm
   * @param {string} id - ID sản phẩm
   */
  async delete(id) {
    return httpClient.delete(`/products/${id}`);
  },

  /**
   * Lấy sản phẩm theo loại
   * @param {string} type - Loại sản phẩm (CURTAIN_FABRIC, CURTAIN_ROMAN, etc.)
   */
  async getByType(type) {
    return httpClient.get('/products', { params: { type } });
  },

  /**
   * Lấy danh sách loại sản phẩm
   */
  async getProductTypes() {
    return httpClient.get('/products/types');
  },

  /**
   * Tìm kiếm sản phẩm
   * @param {string} query - Từ khóa tìm kiếm
   */
  async search(query) {
    return httpClient.get('/products', { params: { search: query } });
  },

  /**
   * Upload hình ảnh sản phẩm
   * @param {File} file - File hình ảnh
   * @returns {Promise<{url: string, filename: string, size: number, mimetype: string}>}
   */
  async uploadImage(file) {
    const response = await httpClient.upload('/upload/image?folder=products', file, 'file');
    return response.data || response;
  },

  /**
   * Upload hình ảnh và cập nhật vào sản phẩm
   * @param {string} productId - ID sản phẩm
   * @param {File} file - File hình ảnh
   */
  async uploadProductImage(productId, file) {
    // Upload file first
    const uploadResult = await this.uploadImage(file);
    // Then update product with image URL
    await this.update(productId, { image: uploadResult.url });
    return uploadResult;
  },
};

export default productService;
