import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, MessageSquare, Eye, Calendar, 
         User, Tag, ArrowRight, Heart } from 'lucide-react'
import { useBlogStore } from '@store/blogStore'

const TopicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { getTopicBySlug, addPostToTopic, voteOnTopic, voteOnPost } = useBlogStore()
  const [newPostContent, setNewPostContent] = useState('')

  const topic = slug ? getTopicBySlug(slug) : undefined

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-hebrew-display mb-4">
            הנושא לא נמצא
          </h1>
          <Link
            to="/forum"
            className="text-blue-600 hover:text-blue-800 font-hebrew-ui"
          >
            חזור לפורום
          </Link>
        </div>
      </div>
    )
  }

  const handleAddPost = () => {
    if (!newPostContent.trim()) return

    const newPost = {
      id: Date.now(),
      content: newPostContent,
      author: 'משתמש אנונימי',
      date: new Date().toLocaleDateString('he-IL'),
      topicId: topic.id,
      upvotes: 0,
      downvotes: 0
    }

    addPostToTopic(topic.id, newPost)
    setNewPostContent('')
  }

  const handleVoteTopic = (isUpvote: boolean) => {
    voteOnTopic(topic.id, isUpvote)
  }

  const handleVotePost = (postId: number, isUpvote: boolean) => {
    voteOnPost(postId, isUpvote)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Topic Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6 font-hebrew-ui">
            <Link to="/forum" className="hover:text-blue-600">
              פורום
            </Link>
            <ArrowRight className="w-4 h-4 mx-2 rotate-180" />
            <span>{topic.category}</span>
          </div>

          {/* Topic Title and Stats */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-hebrew-display">
                {topic.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mb-4 font-hebrew-ui">
                <User className="w-4 h-4 mr-1" />
                <span>מאת {topic.author}</span>
                <span className="mx-2">•</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{topic.date}</span>
                <span className="mx-2">•</span>
                <Eye className="w-4 h-4 mr-1" />
                <span>{topic.views} צפיות</span>
              </div>
            </div>
            <div className="flex flex-col items-center mr-6">
              <button
                onClick={() => handleVoteTopic(true)}
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <span className="text-lg font-bold text-gray-900 font-hebrew-display">
                {(topic.upvotes || 0) - (topic.downvotes || 0)}
              </span>
              <button
                onClick={() => handleVoteTopic(false)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <ArrowDown className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {topic.tags.length > 0 && (
            <div className="flex gap-2 mb-6">
              {topic.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-hebrew-ui flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Topic Content */}
          <div className="prose prose-lg max-w-none font-hebrew-ui text-gray-700 mb-6">
            <p className="text-lg leading-relaxed">{topic.content}</p>
          </div>

          {/* Topic Stats */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500 font-hebrew-ui">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{topic.replies} תגובות</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 font-hebrew-ui">
              <Heart className="w-4 h-4 mr-1" />
              <span>{(topic.upvotes || 0) + (topic.downvotes || 0)} הצבעות</span>
            </div>
          </div>
        </div>

        {/* Add Reply */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-hebrew-display">
            הוסף תגובה
          </h3>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="כתוב את תגובתך..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-hebrew-ui"
            rows={4}
            maxLength={5000}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500 font-hebrew-ui">
              {newPostContent.length}/5000 תווים
            </span>
            <button
              onClick={handleAddPost}
              disabled={!newPostContent.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-hebrew-ui font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              שלח תגובה
            </button>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 font-hebrew-display">
            תגובות ({topic.posts.length})
          </h2>
          
          {topic.posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-hebrew-display">
                אין תגובות עדיין
              </h3>
              <p className="text-gray-600 font-hebrew-ui">
                היה הראשון להגיב לנושא זה
              </p>
            </div>
          ) : (
            topic.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500 font-hebrew-ui">
                        <User className="w-4 h-4 mr-1" />
                        <span className="font-medium text-gray-900">{post.author}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="prose prose-lg max-w-none font-hebrew-ui text-gray-700">
                      <p className="leading-relaxed">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center mr-4">
                    <button
                      onClick={() => handleVotePost(post.id, true)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-gray-900 font-hebrew-display">
                      {(post.upvotes || 0) - (post.downvotes || 0)}
                    </span>
                    <button
                      onClick={() => handleVotePost(post.id, false)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TopicPage 