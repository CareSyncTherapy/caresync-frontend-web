import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Calendar, User, Tag, MessageSquare } from 'lucide-react'
import { useBlogStore } from '@store/blogStore'

const BlogPage: React.FC = () => {
  const { blogPosts } = useBlogStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 font-hebrew-display">
              בלוג CareSync
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-hebrew-ui max-w-2xl mx-auto">
            מאמרים מקצועיים, טיפים ומידע עדכני על בריאות הנפש והתמודדות עם אתגרים נפשיים
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Post Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <FileText className="w-16 h-16 text-white opacity-80" />
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3 font-hebrew-ui">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 font-hebrew-display line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 font-hebrew-ui line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500 font-hebrew-ui">
                    <User className="w-4 h-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-hebrew-ui"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-gray-500 font-hebrew-ui">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span>{post.totalTopics} נושאים</span>
                    <span className="mx-2">•</span>
                    <span>{post.totalPosts} תגובות</span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-hebrew-ui font-medium"
                  >
                    קרא עוד
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-hebrew-display">
            הישארו מעודכנים
          </h2>
          <p className="text-gray-600 mb-6 font-hebrew-ui">
            הירשמו לניוזלטר שלנו וקבלו מאמרים חדשים ישירות לתיבת הדואר שלכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="הכנס את כתובת המייל שלך"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-hebrew-ui"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-hebrew-ui font-medium">
              הרשמה
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage 