/**
 * CareSync Authentication Store
 * 
 * Zustand store for managing authentication state across the application.
 * Handles user login, logout, registration, and token management.
 * 
 * Features:
 * - User authentication state
 * - JWT token management
 * - Automatic token refresh
 * - Persistent login state
 * - Loading states
 * - Error handling
 * 
 * Author: CareSync Development Team
 * Version: 1.0.0
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@api/client'

// Types
export interface User {
  id: number
  email: string
  role: 'therapist' | 'patient'
  is_active: boolean
  created_at: string
  language_preference: 'he' | 'ar' | 'en'
  phone_number?: string
  profile_completed: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: 'therapist' | 'patient'
  language_preference?: 'he' | 'ar' | 'en'
  phone_number?: string
}

export interface AuthState {
  // State
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  
  // Computed
  isAuthenticated: boolean
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: User) => void
}

/**
 * Authentication store using Zustand with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      // Computed properties
      get isAuthenticated() {
        return !!get().token && !!get().user
      },
      
      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await api.post('/auth/login', credentials)
          const { access_token, user } = response.data
          
          // Set token in API client
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          
          set({
            user,
            token: access_token,
            isLoading: false,
            error: null
          })
          
          // Store token in localStorage for persistence
          localStorage.setItem('caresync_token', access_token)
          
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Login failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },
      
      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await api.post('/auth/register', data)
          const { user } = response.data
          
          set({
            user,
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Registration failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },
      
      logout: () => {
        // Remove token from API client
        delete api.defaults.headers.common['Authorization']
        
        // Clear localStorage
        localStorage.removeItem('caresync_token')
        
        // Reset state
        set({
          user: null,
          token: null,
          error: null
        })
      },
      
      clearError: () => {
        set({ error: null })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      updateUser: (user: User) => {
        set({ user })
      }
    }),
    {
      name: 'caresync-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
)

/**
 * Initialize authentication state on app startup
 * Checks for existing token and validates it
 */
export const initializeAuth = async () => {
  const token = localStorage.getItem('caresync_token')
  
  if (token) {
    try {
      // Set token in API client
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Validate token by fetching user profile
      const response = await api.get('/auth/me')
      const user = response.data.user
      
      useAuthStore.setState({
        user,
        token,
        isLoading: false
      })
      
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('caresync_token')
      delete api.defaults.headers.common['Authorization']
      
      useAuthStore.setState({
        user: null,
        token: null,
        isLoading: false
      })
    }
  } else {
    useAuthStore.setState({ isLoading: false })
  }
}

/**
 * Hook for accessing authentication state
 */
export const useAuth = () => {
  const auth = useAuthStore()
  
  return {
    ...auth,
    // Additional computed properties
    isTherapist: auth.user?.role === 'therapist',
    isPatient: auth.user?.role === 'patient',
    userLanguage: auth.user?.language_preference || 'he'
  }
} 