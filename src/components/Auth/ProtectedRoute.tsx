/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to login page.
 * 
 * Features:
 * - Authentication check
 * - Automatic redirect to login
 * - Loading state handling
 * - Role-based access control
 * 
 * Author: CareSync Development Team
 * Version: 1.0.0
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@store/authStore'
import LoadingSpinner from '@components/UI/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'therapist' | 'patient'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute 