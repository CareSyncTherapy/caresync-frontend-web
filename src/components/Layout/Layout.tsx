// src/components/Layout.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@store/authStore'
import { LogOut, Home, Users, LogIn } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    {
      name: 'התחברות/הרשמה',
      href: '/login',
      icon: LogIn,
      description: 'כניסה למערכת',
    },
    {
      name: 'מטפלים',
      href: '/therapists',
      icon: Users,
      description: 'רשימת מטפלים',
    },
    {
      name: 'בית',
      href: '/',
      icon: Home,
      description: 'דף הבית',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16">
            <nav dir="rtl" className="flex flex-row-reverse items-center list-none m-0 p-0 w-full justify-end">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-6 py-3 bg-blue-100 text-blue-800 rounded font-hebrew-nav"
                  style={{ marginLeft: index > 0 ? '2rem' : '0' }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 font-hebrew-nav">
            <p>&copy; 2025 CareSync. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
