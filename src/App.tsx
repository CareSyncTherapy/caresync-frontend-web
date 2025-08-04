/**
 * CareSync App Component
 * 
 * Main application component that sets up routing and layout structure.
 * Handles authentication state, navigation, and global error boundaries.
 * 
 * Features:
 * - Protected routes for authenticated users
 * - Public routes for unauthenticated users
 * - Responsive layout with navigation
 * - Error boundary for crash handling
 * - Loading states and suspense
 * 
 * Author: CareSync Development Team
 * Version: 1.0.0
 */

import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

// Import page components
import HomePage from '@pages/HomePage'
import LoginPage from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'
import TherapistListPage from '@pages/TherapistListPage'
import TherapistDetailPage from '@pages/TherapistDetailPage'
import ProfilePage from '@pages/ProfilePage'
import NotFoundPage from '@pages/NotFoundPage'

// Import layout components
import Layout from '@components/Layout/Layout'
import LoadingSpinner from '@components/UI/LoadingSpinner'
import ErrorBoundary from '@components/UI/ErrorBoundary'

// Import protected route component
import ProtectedRoute from '@components/Auth/ProtectedRoute'

/**
 * Main App component with routing and layout
 */
const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/therapists" element={<TherapistListPage />} />
            <Route path="/therapists/:id" element={<TherapistDetailPage />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App 