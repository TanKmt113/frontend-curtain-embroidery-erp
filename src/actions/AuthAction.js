/**
 * Auth Actions
 * Quản lý các actions liên quan đến xác thực
 */

import authService from '../api/services/authService';

// Action Types
export const AUTH_LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

export const AUTH_LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
export const AUTH_LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';

export const AUTH_CHECK_REQUEST = 'auth/CHECK_REQUEST';
export const AUTH_CHECK_SUCCESS = 'auth/CHECK_SUCCESS';
export const AUTH_CHECK_FAILURE = 'auth/CHECK_FAILURE';

export const AUTH_UPDATE_USER = 'auth/UPDATE_USER';
export const AUTH_CLEAR_ERROR = 'auth/CLEAR_ERROR';

export const AUTH_FORGOT_PASSWORD_REQUEST = 'auth/FORGOT_PASSWORD_REQUEST';
export const AUTH_FORGOT_PASSWORD_SUCCESS = 'auth/FORGOT_PASSWORD_SUCCESS';
export const AUTH_FORGOT_PASSWORD_FAILURE = 'auth/FORGOT_PASSWORD_FAILURE';

export const AUTH_RESET_PASSWORD_REQUEST = 'auth/RESET_PASSWORD_REQUEST';
export const AUTH_RESET_PASSWORD_SUCCESS = 'auth/RESET_PASSWORD_SUCCESS';
export const AUTH_RESET_PASSWORD_FAILURE = 'auth/RESET_PASSWORD_FAILURE';

export const AUTH_CHANGE_PASSWORD_REQUEST = 'auth/CHANGE_PASSWORD_REQUEST';
export const AUTH_CHANGE_PASSWORD_SUCCESS = 'auth/CHANGE_PASSWORD_SUCCESS';
export const AUTH_CHANGE_PASSWORD_FAILURE = 'auth/CHANGE_PASSWORD_FAILURE';

/**
 * Đăng nhập
 */
export const login = (email, password, rememberMe = false) => async (dispatch) => {
  dispatch({ type: AUTH_LOGIN_REQUEST });

  try {
    const response = await authService.login(email, password);
    const { user, accessToken, refreshToken } = response.data;

    // Lưu remember me preference
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
    }

    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: {
        user,
        accessToken,
        refreshToken,
      },
    });

    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
    
    dispatch({
      type: AUTH_LOGIN_FAILURE,
      payload: message,
    });

    return { success: false, error: message };
  }
};

/**
 * Đăng xuất
 */
export const logout = () => async (dispatch) => {
  dispatch({ type: AUTH_LOGOUT_REQUEST });

  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    dispatch({ type: AUTH_LOGOUT_SUCCESS });
  }
};

/**
 * Kiểm tra trạng thái đăng nhập
 */
export const checkAuth = () => async (dispatch) => {
  dispatch({ type: AUTH_CHECK_REQUEST });

  try {
    // Kiểm tra token có tồn tại không
    if (!authService.isAuthenticated()) {
      dispatch({ type: AUTH_CHECK_FAILURE });
      return { success: false };
    }

    // Lấy thông tin user từ API
    const response = await authService.getCurrentUser();
    
    dispatch({
      type: AUTH_CHECK_SUCCESS,
      payload: response.data,
    });

    return { success: true, user: response.data };
  } catch (error) {
    dispatch({ type: AUTH_CHECK_FAILURE });
    return { success: false };
  }
};

/**
 * Cập nhật thông tin user trong store
 */
export const updateUser = (user) => (dispatch) => {
  dispatch({
    type: AUTH_UPDATE_USER,
    payload: user,
  });
};

/**
 * Xóa error message
 */
export const clearError = () => (dispatch) => {
  dispatch({ type: AUTH_CLEAR_ERROR });
};

/**
 * Quên mật khẩu - gửi email reset
 */
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: AUTH_FORGOT_PASSWORD_REQUEST });

  try {
    await authService.forgotPassword(email);
    
    dispatch({ type: AUTH_FORGOT_PASSWORD_SUCCESS });
    
    return { success: true, message: 'Email khôi phục mật khẩu đã được gửi.' };
  } catch (error) {
    const message = error.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại.';
    
    dispatch({
      type: AUTH_FORGOT_PASSWORD_FAILURE,
      payload: message,
    });

    return { success: false, error: message };
  }
};

/**
 * Reset mật khẩu với token
 */
export const resetPassword = (token, newPassword) => async (dispatch) => {
  dispatch({ type: AUTH_RESET_PASSWORD_REQUEST });

  try {
    await authService.resetPassword(token, newPassword);
    
    dispatch({ type: AUTH_RESET_PASSWORD_SUCCESS });
    
    return { success: true, message: 'Mật khẩu đã được đặt lại thành công.' };
  } catch (error) {
    const message = error.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
    
    dispatch({
      type: AUTH_RESET_PASSWORD_FAILURE,
      payload: message,
    });

    return { success: false, error: message };
  }
};

/**
 * Đổi mật khẩu
 */
export const changePassword = (currentPassword, newPassword) => async (dispatch) => {
  dispatch({ type: AUTH_CHANGE_PASSWORD_REQUEST });

  try {
    await authService.changePassword(currentPassword, newPassword);
    
    dispatch({ type: AUTH_CHANGE_PASSWORD_SUCCESS });
    
    return { success: true, message: 'Mật khẩu đã được thay đổi thành công.' };
  } catch (error) {
    const message = error.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
    
    dispatch({
      type: AUTH_CHANGE_PASSWORD_FAILURE,
      payload: message,
    });

    return { success: false, error: message };
  }
};
