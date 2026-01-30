/**
 * useApi Hook
 * Custom hook để gọi API với state management
 */

import { useState, useCallback } from 'react';
import { handleApiError } from '../api/errorHandler';

/**
 * Hook để gọi API với loading, error state
 * @param {Function} apiFunc - Function gọi API
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - { data, loading, error, execute, reset }
 */
const useApi = (apiFunc, options = {}) => {
  const {
    onSuccess,
    onError,
    initialData = null,
    transformData,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunc(...args);
      
      let resultData = response.data || response;
      
      // Transform data nếu có
      if (transformData) {
        resultData = transformData(resultData);
      }
      
      setData(resultData);
      
      if (onSuccess) {
        onSuccess(resultData, response);
      }
      
      return { success: true, data: resultData };
    } catch (err) {
      const handledError = handleApiError(err);
      setError(handledError);
      
      if (onError) {
        onError(handledError, err);
      }
      
      return { success: false, error: handledError };
    } finally {
      setLoading(false);
    }
  }, [apiFunc, onSuccess, onError, transformData]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
};

/**
 * Hook để fetch data khi component mount
 * @param {Function} apiFunc - Function gọi API
 * @param {Array} deps - Dependencies để re-fetch
 * @param {Object} options - Các tùy chọn
 */
export const useFetch = (apiFunc, deps = [], options = {}) => {
  const { immediate = true, ...restOptions } = options;
  const api = useApi(apiFunc, restOptions);

  // Auto fetch when dependencies change
  useState(() => {
    if (immediate) {
      api.execute();
    }
  }, deps);

  return api;
};

/**
 * Hook để mutation (create, update, delete)
 * @param {Function} apiFunc - Function gọi API
 * @param {Object} options - Các tùy chọn
 */
export const useMutation = (apiFunc, options = {}) => {
  return useApi(apiFunc, options);
};

export default useApi;
