import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">דף לא נמצא</h2>
        <p className="mb-6">הדף שחיפשת לא קיים</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          חזור לדף הבית
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage 