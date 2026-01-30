/**
 * Toast Utility
 * Hiển thị thông báo toast
 */

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Toast queue
let toastQueue = [];
let toastContainer = null;

/**
 * Tạo toast container
 */
const createToastContainer = () => {
  if (toastContainer) return toastContainer;

  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;
  document.body.appendChild(toastContainer);
  return toastContainer;
};

/**
 * Tạo toast element
 */
const createToastElement = (message, type, duration) => {
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  const colors = {
    success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
    error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
    warning: { bg: '#fff3cd', border: '#ffeeba', text: '#856404' },
    info: { bg: '#cce5ff', border: '#b8daff', text: '#004085' },
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const color = colors[type] || colors.info;
  
  toast.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background-color: ${color.bg};
    border: 1px solid ${color.border};
    color: ${color.text};
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease;
    min-width: 300px;
    max-width: 450px;
  `;

  toast.innerHTML = `
    <span style="font-size: 18px;">${icons[type]}</span>
    <span style="flex: 1;">${message}</span>
    <button style="
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: ${color.text};
      opacity: 0.7;
    " onclick="this.parentElement.remove()">×</button>
  `;

  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);

  return toast;
};

/**
 * Thêm CSS animation
 */
const addAnimationStyles = () => {
  if (document.getElementById('toast-styles')) return;

  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
};

/**
 * Hiển thị toast
 */
export const showToast = (message, type = TOAST_TYPES.INFO, duration = 5000) => {
  addAnimationStyles();
  const container = createToastContainer();
  const toast = createToastElement(message, type, duration);
  container.appendChild(toast);
};

/**
 * Toast success
 */
export const toastSuccess = (message, duration) => {
  showToast(message, TOAST_TYPES.SUCCESS, duration);
};

/**
 * Toast error
 */
export const toastError = (message, duration) => {
  showToast(message, TOAST_TYPES.ERROR, duration);
};

/**
 * Toast warning
 */
export const toastWarning = (message, duration) => {
  showToast(message, TOAST_TYPES.WARNING, duration);
};

/**
 * Toast info
 */
export const toastInfo = (message, duration) => {
  showToast(message, TOAST_TYPES.INFO, duration);
};

/**
 * Hiển thị toast từ API error
 */
export const toastApiError = (error) => {
  const message = error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
  toastError(message);
};

export default {
  show: showToast,
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  apiError: toastApiError,
};
