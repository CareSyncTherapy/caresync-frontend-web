/**
 * API Client Configuration for CareSync Frontend
 * 
 * This module configures the Axios HTTP client for making API calls to the backend.
 * It includes request/response interceptors for authentication, logging, and error handling.
 * 
 * Features:
 * - Automatic authentication token injection
 * - Request/response logging (development only)
 * - Error handling and logging
 * - Cache-busting for development
 * 
 * Author: CareSync Development Team
 * Version: 2.0.0
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'

// API Configuration
const API_BASE_URL = '/api' // Use proxy
const API_TIMEOUT = 30000 // 30 seconds

console.log('API Configuration:', {
  API_BASE_URL,
  API_TIMEOUT,
  timestamp: new Date().toISOString()
})

/**
 * Create axios instance with default configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': '2.0.0',
  },
})

console.log('Axios instance created with:', {
  baseURL: api.defaults.baseURL,
  timeout: api.defaults.timeout,
  headers: api.defaults.headers
})

/**
 * Request interceptor
 * Adds authentication token and logging
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    const token = localStorage.getItem('caresync_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add cache-busting parameter to force fresh requests
    if (config.url && !config.url.includes('?')) {
      config.url = `${config.url}?_t=${Date.now()}`
    }
    
    // Log request (development only)
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      console.log('Request config:', {
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    console.error('Request error details:', {
      message: error.message,
      code: error.code,
      config: error.config
    })
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * Handles common response patterns and errors
 */
api.interceptors.response.use(
  (response) => {
    // Log response (development only)
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    }
    
    return response
  },
  async (error) => {
    const { response, config } = error
    
    // Log error (development only)
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: response?.status,
        url: config?.url,
        message: response?.data?.error || error.message
      })
    }
    
    // Handle specific error cases
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('caresync_token')
          delete api.defaults.headers.common['Authorization']
          
          // Show error message
          // toast.error('Session expired. Please login again.') // Removed toast as per new_code
          
          // Redirect to login page
          window.location.href = '/login'
          break
          
        case 403:
          // Forbidden
          // toast.error('You do not have permission to perform this action.') // Removed toast as per new_code
          break
          
        case 404:
          // Not found
          // toast.error('The requested resource was not found.') // Removed toast as per new_code
          break
          
        case 422:
          // Validation error
          const validationErrors = response.data?.errors || response.data?.error
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err: string) => console.error(err)) // Changed toast to console.error
          } else {
            console.error(validationErrors || 'Validation failed.') // Changed toast to console.error
          }
          break
          
        case 429:
          // Rate limited
          // toast.error('Too many requests. Please try again later.') // Removed toast as per new_code
          break
          
        case 500:
          // Server error
          // toast.error('Server error. Please try again later.') // Removed toast as per new_code
          break
          
        default:
          // Other errors
          const errorMessage = response.data?.error || 'An error occurred.'
          console.error(errorMessage) // Changed toast to console.error
      }
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      // toast.error('Request timeout. Please check your connection.') // Removed toast as per new_code
    } else if (!error.response) {
      // Network error
      // toast.error('Network error. Please check your connection.') // Removed toast as per new_code
    }
    
    return Promise.reject(error)
  }
)

/**
 * API helper functions
 */
export const apiClient = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then(response => response.data),
  
  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then(response => response.data),
  
  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config).then(response => response.data),
  
  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config).then(response => response.data),
  
  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config).then(response => response.data),
}

/**
 * Export the axios instance for direct use
 */
export { api }

/**
 * Health check function
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health')
    return true
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
} 