/**
 * Error Handler
 * Xử lý các loại lỗi từ API
 */

// Các mã lỗi HTTP và message tương ứng
const HTTP_ERROR_MESSAGES = {
  400: 'Yêu cầu không hợp lệ',
  401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại',
  403: 'Bạn không có quyền thực hiện thao tác này',
  404: 'Không tìm thấy dữ liệu',
  405: 'Phương thức không được hỗ trợ',
  408: 'Yêu cầu quá thời gian chờ',
  409: 'Dữ liệu đã tồn tại hoặc xung đột',
  422: 'Dữ liệu không hợp lệ',
  429: 'Quá nhiều yêu cầu. Vui lòng thử lại sau',
  500: 'Lỗi máy chủ. Vui lòng thử lại sau',
  502: 'Máy chủ không phản hồi',
  503: 'Dịch vụ tạm thời không khả dụng',
  504: 'Máy chủ không phản hồi kịp thời',
};

// Các mã lỗi nghiệp vụ từ backend
const BUSINESS_ERROR_CODES = {
  // Auth errors
  'AUTH_001': 'Email hoặc mật khẩu không đúng',
  'AUTH_002': 'Tài khoản đã bị khóa',
  'AUTH_003': 'Token không hợp lệ',
  'AUTH_004': 'Token đã hết hạn',
  
  // Customer errors
  'CUSTOMER_001': 'Khách hàng không tồn tại',
  'CUSTOMER_002': 'Email khách hàng đã tồn tại',
  'CUSTOMER_003': 'Số điện thoại đã được sử dụng',
  
  // Product errors
  'PRODUCT_001': 'Sản phẩm không tồn tại',
  'PRODUCT_002': 'Mã sản phẩm đã tồn tại',
  
  // Order errors
  'ORDER_001': 'Đơn hàng không tồn tại',
  'ORDER_002': 'Không thể hủy đơn hàng đã sản xuất',
  'ORDER_003': 'Đơn hàng đã hoàn thành',
  
  // Quotation errors
  'QUOTATION_001': 'Báo giá không tồn tại',
  'QUOTATION_002': 'Báo giá đã hết hạn',
  
  // Work Order errors
  'WORKORDER_001': 'Lệnh sản xuất không tồn tại',
  'WORKORDER_002': 'Lệnh sản xuất đã hoàn thành',
  
  // Inventory errors
  'INVENTORY_001': 'Không đủ tồn kho',
  'INVENTORY_002': 'Sản phẩm không có trong kho',
  
  // Delivery errors
  'DELIVERY_001': 'Lịch giao hàng không tồn tại',
  'DELIVERY_002': 'Không thể thay đổi giao hàng đã hoàn thành',
  
  // Validation errors
  'VALIDATION_001': 'Dữ liệu không hợp lệ',
  'VALIDATION_002': 'Thiếu thông tin bắt buộc',
};

/**
 * Xử lý lỗi API và trả về message phù hợp
 */
export const handleApiError = (error) => {
  // Network error
  if (error.isNetworkError) {
    return {
      type: 'network',
      message: error.message || 'Không thể kết nối đến server',
      shouldRetry: true,
    };
  }

  const { status, data } = error;

  // Lấy error code từ response nếu có
  const errorCode = data?.code || data?.errorCode;
  
  // Kiểm tra business error
  if (errorCode && BUSINESS_ERROR_CODES[errorCode]) {
    return {
      type: 'business',
      code: errorCode,
      message: BUSINESS_ERROR_CODES[errorCode],
      details: data?.details || data?.errors,
      shouldRetry: false,
    };
  }

  // Xử lý validation errors (thường là array)
  if (status === 400 || status === 422) {
    if (data?.errors && Array.isArray(data.errors)) {
      return {
        type: 'validation',
        message: 'Vui lòng kiểm tra lại thông tin',
        errors: data.errors.reduce((acc, err) => {
          acc[err.field || err.path] = err.message;
          return acc;
        }, {}),
        shouldRetry: false,
      };
    }
  }

  // HTTP error
  const httpMessage = HTTP_ERROR_MESSAGES[status];
  if (httpMessage) {
    return {
      type: 'http',
      status,
      message: data?.message || httpMessage,
      shouldRetry: status >= 500,
    };
  }

  // Unknown error
  return {
    type: 'unknown',
    message: data?.message || error.message || 'Có lỗi xảy ra. Vui lòng thử lại',
    shouldRetry: false,
  };
};

/**
 * Format validation errors để hiển thị trong form
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return {};
  
  if (Array.isArray(errors)) {
    return errors.reduce((acc, err) => {
      const field = err.field || err.path || err.param;
      acc[field] = err.message || err.msg;
      return acc;
    }, {});
  }
  
  return errors;
};

/**
 * Kiểm tra có phải lỗi authentication không
 */
export const isAuthError = (error) => {
  return error.status === 401 || error.status === 403;
};

/**
 * Kiểm tra có phải lỗi validation không
 */
export const isValidationError = (error) => {
  return error.status === 400 || error.status === 422;
};

/**
 * Kiểm tra có phải lỗi server không
 */
export const isServerError = (error) => {
  return error.status >= 500;
};

/**
 * Kiểm tra có nên retry request không
 */
export const shouldRetry = (error) => {
  const handledError = handleApiError(error);
  return handledError.shouldRetry;
};

export default {
  handleApiError,
  formatValidationErrors,
  isAuthError,
  isValidationError,
  isServerError,
  shouldRetry,
};
