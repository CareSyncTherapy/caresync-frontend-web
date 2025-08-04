/**
 * CareSync Frontend - Main Entry Point
 * 
 * This is the main entry point for the CareSync mental health platform frontend.
 * It sets up the React application with routing, state management, and
 * internationalization support.
 * 
 * Features:
 * - React 18 with concurrent features
 * - React Router for navigation
 * - Zustand for state management
 * - React Query for server state
 * - Internationalization (i18n) support
 * - Toast notifications
 * - Error boundaries
 * 
 * Author: CareSync Development Team
 * Version: 1.0.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/config'

// Import main App component
import App from './App'

// Import global styles
import './styles/globals.css'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
})

// Root component with all providers
const Root = () => {
  return (
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </BrowserRouter>
        </QueryClientProvider>
      </I18nextProvider>
    </React.StrictMode>
  )
}

// Render the application
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(<Root />) 