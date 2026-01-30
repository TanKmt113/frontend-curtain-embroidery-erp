/**
 * API Module Index
 * Export tất cả các thành phần của API module
 */

// HTTP Client
export { default as httpClient } from './httpClient';

// Config
export { default as API_CONFIG } from './config';

// Error Handler
export {
  handleApiError,
  formatValidationErrors,
  isAuthError,
  isValidationError,
  isServerError,
  shouldRetry,
} from './errorHandler';

// Services
export {
  authService,
  customerService,
  productService,
  quotationService,
  orderService,
  workOrderService,
  qcService,
  inventoryService,
  deliveryService,
} from './services';
