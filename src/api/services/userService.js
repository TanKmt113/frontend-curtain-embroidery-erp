/**
 * User Service
 * API calls for user and role management
 */

import httpClient from '../httpClient';

const userService = {
  // ==================== User Management ====================

  /**
   * Get all users with pagination and filters
   * Returns full response with data and meta for pagination
   */
  getAll: async (params = {}) => {
    const response = await httpClient.get('/users', { params });
    return response; // Return full response { success, data, meta }
  },

  /**
   * Get user by ID
   */
  getById: async (id) => {
    const response = await httpClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  create: async (data) => {
    const response = await httpClient.post('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id, data) => {
    const response = await httpClient.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  delete: async (id) => {
    const response = await httpClient.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Change user password (user changes their own - requires currentPassword)
   * POST /api/v1/users/:id/change-password
   */
  changePassword: async (id, data) => {
    const response = await httpClient.post(`/users/${id}/change-password`, data);
    return response.data;
  },

  /**
   * Reset user password (admin resets for another user)
   * POST /api/v1/users/:id/reset-password
   */
  resetPassword: async (id, data) => {
    const response = await httpClient.post(`/users/${id}/reset-password`, data);
    return response.data;
  },

  // ==================== Role Management ====================

  /**
   * Get all roles
   * Returns full response with data for consistency
   */
  getRoles: async () => {
    const response = await httpClient.get('/roles');
    return response; // Return full response { success, data }
  },

  /**
   * Get role by ID
   */
  getRoleById: async (id) => {
    const response = await httpClient.get(`/roles/${id}`);
    return response.data;
  },

  /**
   * Create new role
   */
  createRole: async (data) => {
    const response = await httpClient.post('/roles', data);
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (id, data) => {
    const response = await httpClient.patch(`/roles/${id}`, data);
    return response.data;
  },

  /**
   * Delete role
   */
  deleteRole: async (id) => {
    const response = await httpClient.delete(`/roles/${id}`);
    return response.data;
  },

  /**
   * Get role permissions
   */
  getRolePermissions: async (id) => {
    const response = await httpClient.get(`/roles/${id}/permissions`);
    return response.data;
  },

  /**
   * Update role permissions
   */
  updateRolePermissions: async (id, permissions) => {
    const response = await httpClient.put(`/roles/${id}/permissions`, { permissions });
    return response.data;
  },

  // ==================== Profile ====================

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await httpClient.get('/users/profile');
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data) => {
    const response = await httpClient.patch('/users/profile', data);
    return response.data;
  },

  /**
   * Update current user avatar
   */
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await httpClient.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default userService;
