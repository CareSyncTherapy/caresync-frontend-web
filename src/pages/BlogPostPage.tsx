import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileText, Calendar, User, Tag, MessageSquare, 
         TrendingUp, Clock, Heart, ArrowRight, Plus } from 'lucide-react'
import { useBlogStore } from '@store/blogStore'
import TopicForm from '@components/UI/TopicForm'
import toast from 'react-hot-toast'
import { formatRelativeTime } from '../utils/dateUtils'

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { 
    getBlogPostBySlug, 
    addTopicToCategory, 
    addPostToTopic, 
    initializeStore, 
    isLoading, 
    error,
    blogPosts,
    forumCategories
  } = useBlogStore()
  const [showTopicForm, setShowTopicForm] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)

  // Get the blog post reactively - this will update when blogPosts changes
  const blogPost = useMemo(() => {
    return slug ? getBlogPostBySlug(slug) : undefined
  }, [slug, blogPosts, getBlogPostBySlug])

  useEffect(() => {
    // Load forum data from backend on component mount
    initializeStore().catch(console.error)
  }, [initializeStore])

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-hebrew-display mb-4">
            המאמר לא נמצא
          </h1>
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 font-hebrew-ui"
          >
            חזור לרשימת המאמרים
          </Link>
        </div>
      </div>
    )
  }

  const handleAddTopic = async (topicData: { title: string; content: string; tags: string[] }) => {
    try {
      console.log('Creating new topic with data:', topicData) // Debug log
      
      // Test API connection first
      const { testApiConnection, forumCategories } = useBlogStore.getState()
      const isConnected = await testApiConnection()
      
      if (!isConnected) {
        throw new Error('Cannot connect to server. Please check your connection.')
      }
      
      // Find the correct forum category by name from the dynamic forums
      const targetCategory = forumCategories.find(cat => cat.name === blogPost.forumCategory.name)
      
      if (!targetCategory) {
        throw new Error(`Forum category "${blogPost.forumCategory.name}" not found in backend`)
      }
      
      const newTopic = {
        id: Date.now(),
        title: topicData.title,
        content: topicData.content,
        author: 'משתמש אנונימי',
        date: new Date().toLocaleDateString('he-IL'),
        tags: topicData.tags,
        replies: 0,
        views: 0,
        lastActivity: 'עכשיו',
        category: blogPost.forumCategory.name,
        isHot: false,
        posts: [],
        upvotes: 0,
        downvotes: 0,
        slug: topicData.title.toLowerCase().replace(/\s+/g, '-')
      }

      console.log('New topic object:', newTopic) // Debug log
      console.log('Using forum category ID:', targetCategory.id) // Debug log
      await addTopicToCategory(targetCategory.id, newTopic)
      setShowTopicForm(false)
      toast.success('נושא חדש נוצר בהצלחה!')
    } catch (error: any) {
      console.error('Error creating topic:', error)
      toast.error(error.message || 'שגיאה ביצירת הנושא')
    }
  }

  const handleAddPost = async () => {
    if (!newPostContent.trim() || !selectedTopicId) return

    try {
      const newPost = {
        id: Date.now(),
        content: newPostContent,
        author: 'משתמש אנונימי',
        date: new Date().toLocaleDateString('he-IL'),
        topicId: selectedTopicId,
        upvotes: 0,
        downvotes: 0
      }

      await addPostToTopic(selectedTopicId, newPost)
      setNewPostContent('')
      setSelectedTopicId(null)
      toast.success('תגובה נוספה בהצלחה!')
    } catch (error: any) {
      console.error('Error creating post:', error)
      toast.error(error.message || 'שגיאה בהוספת התגובה')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Forum Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-hebrew-display">
                {blogPost.forumCategory.name}
              </h1>
              <p className="text-xl text-gray-600 font-hebrew-ui">
                {blogPost.forumCategory.description}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 font-hebrew-display">
                {blogPost.topics.length}
              </div>
              <div className="text-gray-600 font-hebrew-ui">נושאים</div>
            </div>
          </div>
        </div>

        {/* Forum Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* Add New Topic */}
          {showTopicForm ? (
            <div className="mb-8">
              <TopicForm
                onSubmit={handleAddTopic}
                onCancel={() => setShowTopicForm(false)}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-hebrew-display">
                  התחל נושא חדש
                </h3>
                <button
                  onClick={() => setShowTopicForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-hebrew-ui font-medium flex items-center mx-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  צור נושא חדש
                </button>
              </div>
            </div>
          )}

          {/* Topics List */}
          <div className="space-y-6">
            {(() => {
              // Get topics from the forum category that matches this blog post
              const matchingCategory = forumCategories.find(cat => cat.name === blogPost.forumCategory.name)
              const topicsToDisplay = matchingCategory?.topics || blogPost.topics
              return topicsToDisplay.map((topic) => (
                <div
                key={topic.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
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
                      <span>{formatRelativeTime(topic.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 font-hebrew-ui">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span className="mr-4">{topic.replies} תגובות</span>
                      <span className="mr-4">{topic.views} צפיות</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Posts in Topic */}
                {topic.posts.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {topic.posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 font-hebrew-ui">
                            {post.author}
                          </span>
                          <span className="text-sm text-gray-500 font-hebrew-ui">
                            {formatRelativeTime(post.date)}
                          </span>
                        </div>
                        <p className="text-gray-700 font-hebrew-ui">{post.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Reply */}
                {selectedTopicId === topic.id ? (
                  <div className="mt-4">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="כתוב תגובה..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-hebrew-ui"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleAddPost}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-hebrew-ui font-medium"
                      >
                        שלח תגובה
                      </button>
                      <button
                        onClick={() => setSelectedTopicId(null)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-hebrew-ui font-medium"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedTopicId(topic.id)}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-hebrew-ui font-medium flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    הוסף תגובה
                  </button>
                )}
              </div>
            ))
            })()}
          </div>

          {(() => {
            const matchingCategory = forumCategories.find(cat => cat.name === blogPost.forumCategory.name)
            const topicsToDisplay = matchingCategory?.topics || blogPost.topics
            return topicsToDisplay.length === 0
          })() && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-hebrew-display">
                אין נושאים עדיין
              </h3>
              <p className="text-gray-600 font-hebrew-ui">
                התחל את השיחה הראשונה בנושא זה
              </p>
            </div>
          )}
        </div>

        {/* Back to Forum */}
        <div className="text-center mt-8">
          <Link
            to="/forum"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-hebrew-ui font-medium"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            חזור לפורום הראשי
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage 