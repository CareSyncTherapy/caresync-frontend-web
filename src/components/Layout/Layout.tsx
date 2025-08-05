// src/components/Layout.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Home, Users, LogIn, FileText, MessageSquare } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  const navigation = [
    {
      name: 'בית',
      href: '/',
      icon: Home,
      description: 'דף הבית',
    },
    {
      name: 'מטפלים',
      href: '/therapists',
      icon: Users,
      description: 'רשימת מטפלים',
    },
    {
      name: 'בלוג',
      href: '/blog',
      icon: FileText,
      description: 'מאמרים ומידע',
    },
    {
      name: 'פורום',
      href: '/forum',
      icon: MessageSquare,
      description: 'קהילה ותמיכה',
    },
    {
      name: 'התחברות/הרשמה',
      href: '/login',
      icon: LogIn,
      description: 'כניסה למערכת',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16" dir="rtl">
            {/* Navigation */}
            <nav className="flex items-center list-none m-0 p-0 w-full justify-center">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-4 py-3 rounded-lg font-hebrew-nav transition-all duration-300 flex items-center space-x-2 space-x-reverse hover:transform hover:-translate-y-1 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-white/90 hover:text-white hover:bg-white/10 shadow-md hover:shadow-lg backdrop-blur-sm'
                    }`}
                    style={{ marginRight: index > 0 ? '1rem' : '0' }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
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
