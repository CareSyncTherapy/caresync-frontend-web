import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Users, TrendingUp, Clock, Heart, MessageCircle } from 'lucide-react'
import { useBlogStore } from '@store/blogStore'
import { formatRelativeTime } from '../utils/dateUtils'

const ForumPage: React.FC = () => {
  const { 
    forumCategories, 
    calculateCategoryStats, 
    getTotalStats, 
    getBlogPostByCategoryId, 
    getRecentTopics, 
    initializeStore, 
    isLoading, 
    error,
    blogPosts
  } = useBlogStore()
  
  const totalStats = getTotalStats()
  
  // Make recentTopics reactive by recalculating when blogPosts changes
  const recentTopics = useMemo(() => {
    return getRecentTopics()
  }, [blogPosts, getRecentTopics])

  useEffect(() => {
    // Load forum data from backend on component mount
    initializeStore().catch(console.error)
  }, [initializeStore])


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 font-hebrew-display">
              פורום CareSync
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-hebrew-ui max-w-2xl mx-auto">
            מרחב בטוח לשיתוף, תמיכה הדדית ודיונים על בריאות הנפש
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600 font-hebrew-ui">טוען נתונים...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-hebrew-ui">{error}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 font-hebrew-display">{totalStats.totalMembers}</div>
            <div className="text-gray-600 font-hebrew-ui">חברים רשומים</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 font-hebrew-display">{totalStats.totalTopics}</div>
            <div className="text-gray-600 font-hebrew-ui">נושאים פעילים</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 font-hebrew-display">{totalStats.totalPosts}</div>
            <div className="text-gray-600 font-hebrew-ui">תגובות</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 font-hebrew-display">{totalStats.newTopics}</div>
            <div className="text-gray-600 font-hebrew-ui">נושאים חדשים</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-hebrew-display">
              קטגוריות
            </h2>
            <div className="space-y-4">
              {forumCategories.map((category) => {
                const blogPost = getBlogPostByCategoryId(category.id)
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      {blogPost ? (
                        <Link
                          to={`/blog/${blogPost.slug}`}
                          className="text-lg font-semibold text-gray-900 font-hebrew-display hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {category.name}
                        </Link>
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900 font-hebrew-display">
                          {category.name}
                        </h3>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 font-hebrew-ui">
                      {category.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 font-hebrew-ui">
                      <span>{category.totalTopics} נושאים</span>
                      <span>{category.totalPosts} פוסטים</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Topics */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-hebrew-display">
                נושאים אחרונים
              </h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-hebrew-ui font-medium">
                נושא חדש
              </button>
            </div>

            <div className="space-y-4">
              {recentTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {topic.isHot && (
                          <TrendingUp className="w-4 h-4 text-orange-500 mr-2" />
                        )}
                        <Link
                          to={`/topic/${topic.slug}`}
                          className="text-lg font-semibold text-gray-900 font-hebrew-display hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {topic.title}
                        </Link>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3 font-hebrew-ui">
                        <span>מאת {topic.author}</span>
                        <span className="mx-2">•</span>
                        <span>{topic.category}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 font-hebrew-ui">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="mr-4">{topic.replies} תגובות</span>
                        <span className="mr-4">{topic.views} צפיות</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatRelativeTime(topic.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mr-4">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-hebrew-ui font-medium">
                טען עוד נושאים
              </button>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-hebrew-display">
            כללי הקהילה
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-hebrew-ui">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-hebrew-display">
                ✅ מה מותר
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• שיתוף חוויות אישיות</li>
                <li>• מתן תמיכה ואמפתיה</li>
                <li>• שאילת שאלות מקצועיות</li>
                <li>• שיתוף משאבים מועילים</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-hebrew-display">
                ❌ מה אסור
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• מתן ייעוץ רפואי</li>
                <li>• ביקורת או שיפוטיות</li>
                <li>• פרסום או ספאם</li>
                <li>• תוכן פוגעני</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumPage 