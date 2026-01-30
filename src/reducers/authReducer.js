/**
 * Auth Reducer
 * Quản lý state xác thực
 */

import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_CHECK_REQUEST,
  AUTH_CHECK_SUCCESS,
  AUTH_CHECK_FAILURE,
  AUTH_UPDATE_USER,
  AUTH_CLEAR_ERROR,
  AUTH_FORGOT_PASSWORD_REQUEST,
  AUTH_FORGOT_PASSWORD_SUCCESS,
  AUTH_FORGOT_PASSWORD_FAILURE,
  AUTH_RESET_PASSWORD_REQUEST,
  AUTH_RESET_PASSWORD_SUCCESS,
  AUTH_RESET_PASSWORD_FAILURE,
  AUTH_CHANGE_PASSWORD_REQUEST,
  AUTH_CHANGE_PASSWORD_SUCCESS,
  AUTH_CHANGE_PASSWORD_FAILURE,
} from '../actions/AuthAction';

const initialState = {
  // User info
  user: null,
  isAuthenticated: false,
  
  // Loading states
  isLoading: false,
  isCheckingAuth: true, // Ban đầu là true để kiểm tra auth khi app load
  
  // Error handling
  error: null,
  
  // Forgot password
  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: null,
  
  // Reset password
  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
  
  // Change password
  changePasswordLoading: false,
  changePasswordSuccess: false,
  changePasswordError: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };

    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    // Logout
    case AUTH_LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case AUTH_LOGOUT_SUCCESS:
      return {
        ...initialState,
        isCheckingAuth: false,
      };

    // Check Auth
    case AUTH_CHECK_REQUEST:
      return {
        ...state,
        isCheckingAuth: true,
      };

    case AUTH_CHECK_SUCCESS:
      return {
        ...state,
        isCheckingAuth: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case AUTH_CHECK_FAILURE:
      return {
        ...state,
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
      };

    // Update User
    case AUTH_UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };

    // Clear Error
    case AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
        forgotPasswordError: null,
        resetPasswordError: null,
        changePasswordError: null,
      };

    // Forgot Password
    case AUTH_FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        forgotPasswordLoading: true,
        forgotPasswordSuccess: false,
        forgotPasswordError: null,
      };

    case AUTH_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordSuccess: true,
        forgotPasswordError: null,
      };

    case AUTH_FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordSuccess: false,
        forgotPasswordError: action.payload,
      };

    // Reset Password
    case AUTH_RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetPasswordLoading: true,
        resetPasswordSuccess: false,
        resetPasswordError: null,
      };

    case AUTH_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordSuccess: true,
        resetPasswordError: null,
      };

    case AUTH_RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordSuccess: false,
        resetPasswordError: action.payload,
      };

    // Change Password
    case AUTH_CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        changePasswordLoading: true,
        changePasswordSuccess: false,
        changePasswordError: null,
      };

    case AUTH_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordLoading: false,
        changePasswordSuccess: true,
        changePasswordError: null,
      };

    case AUTH_CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePasswordLoading: false,
        changePasswordSuccess: false,
        changePasswordError: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
