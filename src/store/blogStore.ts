import { create } from 'zustand'
import { BlogPost, ForumCategory, Topic, Post } from '../types/blog'
import { apiClient, api } from '../api/client'


interface BlogStore {
  blogPosts: BlogPost[]
  forumCategories: ForumCategory[]
  isLoading: boolean
  error: string | null
  getBlogPostBySlug: (slug: string) => BlogPost | undefined
  getForumCategoryById: (id: number) => ForumCategory | undefined
  getBlogPostByCategoryId: (categoryId: number) => BlogPost | undefined
  getTopicBySlug: (slug: string) => Topic | undefined
  addTopicToCategory: (categoryId: number, topic: Topic) => Promise<void>
  addPostToTopic: (topicId: number, post: Post) => Promise<void>
  voteOnTopic: (topicId: number, isUpvote: boolean) => Promise<void>
  voteOnPost: (postId: number, isUpvote: boolean) => Promise<void>
  calculateCategoryStats: (categoryId: number) => { totalTopics: number; totalPosts: number }
  getTotalStats: () => { totalTopics: number; totalPosts: number; totalMembers: number; newTopics: number }
  getRecentTopics: () => Topic[]
      fetchTopics: () => Promise<void>
    fetchPosts: (topicId: number) => Promise<void>
    fetchForums: () => Promise<void>
    
    clearError: () => void
  testApiConnection: () => Promise<boolean>
  initializeStore: () => Promise<void>
}


export const useBlogStore = create<BlogStore>((set, get) => {
  // Initialize with empty data - will be populated dynamically
  const initializeForumCategories = () => {
    const blogPosts = [
      {
        id: 1,
        title: 'כיצד להתמודד עם חרדה חברתית',
        excerpt: 'מדריך מקיף להתמודדות עם חרדה חברתית וכיצד לבנות ביטחון עצמי...',
        content: 'תוכן מלא של המאמר על חרדה חברתית...',
        author: 'ד"ר שרה כהן',
        date: '15 בינואר 2025',
        tags: ['חרדה', 'בריאות נפשית', 'טיפול'],
        readTime: '5 דקות קריאה',
        slug: 'how-to-deal-with-social-anxiety',
        forumCategory: {
          id: 1,
          name: 'Test Integration Forum',
          description: 'Forum for testing PostgreSQL integration',
          icon: '🧪',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [],
        totalTopics: 0,
        totalPosts: 0
      },
      {
        id: 2,
        title: 'טכניקות הרגעה למתח יומיומי',
        excerpt: 'שיטות פשוטות ויעילות להרגעה וניהול מתח בחיי היומיום...',
        content: 'תוכן מלא של המאמר על טכניקות הרגעה...',
        author: 'ד"ר דוד לוי',
        date: '14 בינואר 2025',
        tags: ['הרגעה', 'מתח', 'טכניקות'],
        readTime: '4 דקות קריאה',
        slug: 'relaxation-techniques-for-daily-stress',
        forumCategory: {
          id: 19,
          name: 'Critical Test Forum',
          description: 'Test forum for critical functionality',
          icon: '⚠️',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [],
        totalTopics: 0,
        totalPosts: 0
      },
      {
        id: 3,
        title: 'בניית מערכות יחסים בריאות',
        excerpt: 'כיצד לבנות ולשמור על מערכות יחסים בריאות ומספקות...',
        content: 'תוכן מלא של המאמר על מערכות יחסים...',
        author: 'ד"ר מיכל אברהם',
        date: '13 בינואר 2025',
        tags: ['יחסים', 'תקשורת', 'בריאות'],
        readTime: '6 דקות קריאה',
        slug: 'building-healthy-relationships',
        forumCategory: {
          id: 20,
          name: 'Critical Test Forum',
          description: 'Test forum for critical functionality',
          icon: '⚠️',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [],
        totalTopics: 0,
        totalPosts: 0
      },
      {
        id: 4,
        title: 'תמיכה הדדית בקהילה',
        excerpt: 'חשיבות התמיכה ההדדית ואיך לבנות קהילה תומכת...',
        content: 'תוכן מלא של המאמר על תמיכה הדדית...',
        author: 'ד"ר יוסי כהן',
        date: '12 בינואר 2025',
        tags: ['תמיכה', 'קהילה', 'הדדיות'],
        readTime: '3 דקות קריאה',
        slug: 'mutual-support-in-community',
        forumCategory: {
          id: 1,
          name: 'Test Integration Forum',
          description: 'Forum for testing PostgreSQL integration',
          icon: '🧪',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [],
        totalTopics: 0,
        totalPosts: 0
      }
    ]

    // Initialize empty forum categories - will be populated dynamically
    const forumCategories: ForumCategory[] = []

    return { blogPosts, forumCategories }
  }

  const { blogPosts, forumCategories } = initializeForumCategories()

  // Helper function to get forum icon based on name
  const getForumIcon = (forumName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Test Integration Forum': '🧪',
      'Critical Test Forum': '⚠️',
      'Anonymous Test Forum': '👤',
      'Test Forum': '📝',
      'General': '💬'
    }
    return iconMap[forumName] || '💬'
  }

  return {
    blogPosts,
    forumCategories,
    isLoading: false,
    error: null,

    fetchForums: async () => {
      try {
        set({ isLoading: true, error: null })
        
        console.log('Fetching forums from backend...')
        
        // Try to fetch forums from backend
        let response
        try {
          response = await apiClient.get('/forums')
          console.log('Forums response:', response)
        } catch (forumError: any) {
          console.warn('Forums endpoint not available, using fallback categories')
          
          // Fallback to hardcoded categories if forums endpoint doesn't exist
          const fallbackForums: ForumCategory[] = [
            {
              id: 34,
              name: 'חרדה ודיכאון',
              description: 'שיתוף חוויות וטיפים להתמודדות עם חרדה ודיכאון',
              icon: '😰',
              topics: [],
              totalPosts: 0,
              totalTopics: 0
            },
            {
              id: 35,
              name: 'טכניקות הרגעה',
              description: 'שיטות וטכניקות להרגעה וניהול מתח',
              icon: '🧘‍♀️',
              topics: [],
              totalPosts: 0,
              totalTopics: 0
            }
          ]
          
          set({
            forumCategories: fallbackForums,
            isLoading: false
          })
          return
        }
        
        // Check if response is an array or has forums property
        if (!Array.isArray(response)) {
          console.warn('Forums response is not an array:', response)
          
          // If response is an object with forums property, use that
          if (response && typeof response === 'object' && response.forums) {
            response = response.forums
            console.log('Extracted forums from response:', response)
          } else {
            // Fallback to empty array if no forums available
            const fallbackForums: ForumCategory[] = []
            
            set({
              forumCategories: fallbackForums,
              isLoading: false
            })
            return
          }
        }
        
        // Transform backend forums to frontend format
        const transformedForums: ForumCategory[] = response.map((forum: any) => ({
          id: forum.id,
          name: forum.name,
          description: forum.description || '',
          icon: getForumIcon(forum.name),
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        }))

        console.log('Transformed forums:', transformedForums)
        
        set({
          forumCategories: transformedForums,
          isLoading: false
        })
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch forums'
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        console.error('Error fetching forums:', error)
      }
    },

    initializeStore: async () => {
      try {
        set({ isLoading: true, error: null })
        
        // First fetch forums to get dynamic categories
        await get().fetchForums()
        
        // Then fetch topics from backend
        let response
        try {
          response = await apiClient.get('/topics')
          console.log('Topics response:', response)
        } catch (topicError: any) {
          console.warn('Topics endpoint not available, using empty array')
          response = []
        }
        
        // Check if response is an array
        if (!Array.isArray(response)) {
          console.warn('Topics response is not an array:', response)
          response = []
        }
        
        // Transform the backend response to match our frontend format
        const transformedTopics = response.map((topic: any) => ({
          id: topic.id,
          title: topic.title,
          content: topic.content,
          author: topic.author,
          date: topic.date,
          tags: topic.tags || [],
          replies: topic.replies || 0,
          views: topic.views || 0,
          lastActivity: topic.lastActivity || 'Recently',
          category: topic.category || 'General',
          isHot: topic.isHot || false,
          posts: topic.posts || [],
          upvotes: topic.upvotes || 0,
          downvotes: topic.downvotes || 0,
          slug: topic.slug || `topic-${topic.id}`
        }))

        // Group topics by category with dynamic mapping
        const categoryMap = new Map()
        console.log('Starting category mapping...')
        console.log('Available forum categories:', get().forumCategories.map(c => c.name))
        
        transformedTopics.forEach((topic: any) => {
          const backendCategoryName = topic.category
          console.log(`Processing topic ${topic.id} with category: ${backendCategoryName}`)
          
          // Map backend category names to frontend category names
          let frontendCategoryName = backendCategoryName
          
          // Use the backend category name directly - no mapping needed
          // The backend now returns actual forum names, so we can use them directly
          frontendCategoryName = backendCategoryName
          console.log(`Using backend category: ${backendCategoryName}`)
          
          if (!categoryMap.has(frontendCategoryName)) {
            categoryMap.set(frontendCategoryName, [])
          }
          categoryMap.get(frontendCategoryName).push(topic)
        })
        
        console.log('🔍 Store Debug:')
        console.log('transformedTopics:', transformedTopics)
        console.log('categoryMap:', categoryMap)
        console.log('categoryMap keys:', Array.from(categoryMap.keys()))
        console.log('Final categoryMap entries:')
        categoryMap.forEach((topics, category) => {
          console.log(`  ${category}: ${topics.length} topics`)
        })

        // Update blog posts and forum categories with backend topics
        set(state => {
          const updatedBlogPosts = state.blogPosts.map(post => {
            const backendTopics = categoryMap.get(post.forumCategory.name) || []
            return {
              ...post,
              topics: backendTopics,
              totalTopics: backendTopics.length,
              totalPosts: backendTopics.reduce((sum: number, topic: any) => 
                sum + (topic.posts?.length || 0), 0)
            }
          })

          // Also update forum categories with the same topics
          const updatedForumCategories = state.forumCategories.map(category => {
            const backendTopics = categoryMap.get(category.name) || []
            console.log(`Updating category ${category.name} with ${backendTopics.length} topics`)
            return {
              ...category,
              topics: backendTopics,
              totalTopics: backendTopics.length,
              totalPosts: backendTopics.reduce((sum: number, topic: any) => 
                sum + (topic.posts?.length || 0), 0)
            }
          })

          return {
            blogPosts: updatedBlogPosts,
            forumCategories: updatedForumCategories,
            isLoading: false
          }
        })
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to initialize store'
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        console.error('Error initializing store:', error)
      }
    },

    getBlogPostBySlug: (slug: string) => {
      return get().blogPosts.find(post => post.slug === slug)
    },

    getForumCategoryById: (id: number) => {
      return get().forumCategories.find(category => category.id === id)
    },

    getBlogPostByCategoryId: (categoryId: number) => {
      const state = get()
      const category = state.forumCategories.find(cat => cat.id === categoryId)
      if (!category) return undefined
      
      // Find blog post by matching forum category name
      return state.blogPosts.find(post => post.forumCategory.name === category.name)
    },

    getTopicBySlug: (slug: string) => {
      const state = get()
      for (const post of state.blogPosts) {
        const topic = post.topics.find(t => t.slug === slug)
        if (topic) return topic
      }
      return undefined
    },

    addTopicToCategory: async (categoryId: number, topic: Topic) => {
      try {
        set({ isLoading: true, error: null })
        
        // Get the category for the backend
        const state = get()
        const category = state.forumCategories.find(cat => cat.id === categoryId)
        
        if (!category) {
          throw new Error('Category not found')
        }
        
        console.log('Creating topic with data:', {
          title: topic.title,
          content: topic.content,
          author: topic.author,
          categoryId: categoryId,
          categoryName: category.name,
          tags: topic.tags
        })
        
        // API call to create topic with forum ID from backend
        const topicData = {
          title: topic.title,
          content: topic.content,
          author: topic.author,
          categoryId: categoryId, // This is now the actual forum ID from backend
          tags: topic.tags || [],
          userId: 999 // Anonymous user ID
        }
        
        console.log('Sending topic data:', topicData)
        
        const response = await apiClient.post('/topics', topicData)

        console.log('Topic created successfully:', response)
        const createdTopic = response

        // Refresh topics to get updated data from backend
        console.log('About to refresh topics after creating topic...')
        await get().fetchTopics()
        console.log('Topics refreshed after creating topic')

        set({ isLoading: false })
      } catch (error: any) {
        console.error('Error creating topic:', error)
        
        let errorMessage = 'Failed to create topic'
        
        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.error || `Server error: ${error.response.status}`
        } else if (error.request) {
          // Network error - no response received
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          // Other error
          errorMessage = error.message || 'An unexpected error occurred'
        }
        
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        throw new Error(errorMessage)
      }
    },

    addPostToTopic: async (topicId: number, post: Post) => {
      try {
        set({ isLoading: true, error: null })
        
        // Try different possible endpoints for posts
        let response
        try {
          response = await apiClient.post(`/topics/${topicId}/posts`, {
            content: post.content,
            author: post.author,
            userId: 999 // Anonymous user ID
          })
        } catch (postError: any) {
          // If posts endpoint doesn't exist, try creating a reply as a new topic
          console.warn('Posts endpoint not found, creating as new topic')
          // Get the first available forum as default
          const state = get()
          const defaultCategory = state.forumCategories[0]
          const defaultCategoryId = defaultCategory ? defaultCategory.id : 1
          
          response = await apiClient.post('/topics', {
            title: `Reply to topic ${topicId}`,
            content: post.content,
            author: post.author,
            categoryId: defaultCategoryId,
            tags: ['reply'],
            userId: 999 // Anonymous user ID
          })
        }

        const createdPost = response

        // Update local state
        set(state => {
          const updatedBlogPosts = state.blogPosts.map(post => ({
            ...post,
            topics: post.topics.map(topic =>
              topic.id === topicId
                ? {
                    ...topic,
                    posts: [...topic.posts, createdPost],
                    replies: topic.replies + 1
                  }
                : topic
            )
          }))

          const updatedForumCategories = state.forumCategories.map(category => {
            const relatedBlogPost = updatedBlogPosts.find(
              post => post.forumCategory.id === category.id
            )
            
            return {
              ...category,
              topics: category.topics.map(topic =>
                topic.id === topicId
                  ? {
                      ...topic,
                      posts: [...topic.posts, createdPost],
                      replies: topic.replies + 1
                    }
                  : topic
              ),
              totalPosts: relatedBlogPost ? 
                relatedBlogPost.topics.reduce((sum, topic) => 
                  sum + topic.posts.length, 0) : category.totalPosts
            }
          })

          return {
            blogPosts: updatedBlogPosts,
            isLoading: false
          }
        })
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to create post'
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        throw new Error(errorMessage)
      }
    },

    voteOnTopic: async (topicId: number, isUpvote: boolean) => {
      try {
        set({ isLoading: true, error: null })
        
        // API call to vote on topic
        await apiClient.post(`/topics/${topicId}/vote`, {
          isUpvote
        })

        // Update local state
        set(state => ({
          blogPosts: state.blogPosts.map(post => ({
            ...post,
            topics: post.topics.map(topic =>
              topic.id === topicId
                ? {
                    ...topic,
                    upvotes: isUpvote ? (topic.upvotes || 0) + 1 : (topic.upvotes || 0),
                    downvotes: isUpvote ? (topic.downvotes || 0) : (topic.downvotes || 0) + 1
                  }
                : topic
            )
          })),
          isLoading: false
        }))
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to vote on topic'
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        throw new Error(errorMessage)
      }
    },

    voteOnPost: async (postId: number, isUpvote: boolean) => {
      try {
        set({ isLoading: true, error: null })
        
        // API call to vote on post
        await apiClient.post(`/posts/${postId}/vote`, {
          isUpvote
        })

        // Update local state
        set(state => ({
          blogPosts: state.blogPosts.map(post => ({
            ...post,
            topics: post.topics.map(topic => ({
              ...topic,
              posts: topic.posts.map(post =>
                post.id === postId
                  ? {
                      ...post,
                      upvotes: isUpvote ? (post.upvotes || 0) + 1 : (post.upvotes || 0),
                      downvotes: isUpvote ? (post.downvotes || 0) : (post.downvotes || 0) + 1
                    }
                  : post
              )
            }))
          })),
          isLoading: false
        }))
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to vote on post'
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        throw new Error(errorMessage)
      }
    },

    calculateCategoryStats: (categoryId: number) => {
      const state = get()
      const category = state.forumCategories.find(cat => cat.id === categoryId)
      if (!category) return { totalTopics: 0, totalPosts: 0 }
      
      return {
        totalTopics: category.totalTopics,
        totalPosts: category.totalPosts
      }
    },

    getTotalStats: () => {
      const state = get()
      const totalTopics = state.forumCategories.reduce((sum, cat) => sum + cat.totalTopics, 0)
      const totalPosts = state.forumCategories.reduce((sum, cat) => sum + cat.totalPosts, 0)
      const totalMembers = 1250 // Mock data - would come from auth store in real app
      
      // Calculate new topics from all topics across blog posts
      const allTopics = state.blogPosts.flatMap(post => post.topics)
      const newTopics = allTopics.filter(topic => 
        new Date(topic.date).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length
      
      return { totalTopics, totalPosts, totalMembers, newTopics }
    },

    getRecentTopics: () => {
      const state = get()
      const allTopics: Topic[] = []
      
      state.blogPosts.forEach(post => {
        allTopics.push(...post.topics)
      })
      
      return allTopics.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 10)
    },

    fetchTopics: async () => {
      try {
        set({ isLoading: true, error: null })
        
        let response
        try {
          response = await apiClient.get('/topics')
          console.log('FetchTopics response:', response)
        } catch (topicError: any) {
          console.warn('Topics endpoint not available, using empty array')
          response = []
        }
        
        // Check if response is an array
        if (!Array.isArray(response)) {
          console.warn('Topics response is not an array:', response)
          response = []
        }
        
        // Transform the backend response to match our frontend format
        const transformedTopics = response.map((topic: any) => ({
          id: topic.id,
          title: topic.title,
          content: topic.content,
          author: topic.author,
          date: topic.date,
          tags: topic.tags || [],
          replies: topic.replies || 0,
          views: topic.views || 0,
          lastActivity: topic.lastActivity || 'Recently',
          category: topic.category || 'General',
          isHot: topic.isHot || false,
          posts: topic.posts || [],
          upvotes: topic.upvotes || 0,
          downvotes: topic.downvotes || 0,
          slug: topic.slug || `topic-${topic.id}`
        }))

        // Group topics by category using dynamic forum names
        const categoryMap = new Map()
        
        transformedTopics.forEach((topic: any) => {
          const categoryName = topic.category
          
          if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, [])
          }
          categoryMap.get(categoryName).push(topic)
        })

        // Update forum categories with backend data
        set(state => {
          const updatedForumCategories = state.forumCategories.map(category => {
            const backendTopics = categoryMap.get(category.name) || []
            
            const totalPosts = backendTopics.reduce((sum: number, topic: any) => 
              sum + (topic.posts?.length || 0), 0)
            
            return {
              ...category,
              topics: backendTopics,
              totalTopics: backendTopics.length,
              totalPosts: totalPosts
            }
          })

          return {
            forumCategories: updatedForumCategories,
            isLoading: false
          }
        })
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch topics'
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        console.error('Error fetching topics:', error)
      }
    },

    fetchPosts: async (topicId: number) => {
      try {
        set({ isLoading: true, error: null })
        
        // Try different possible endpoints for posts
        let response
        try {
          response = await apiClient.get(`/topics/${topicId}/posts`)
        } catch (error: any) {
          // If posts endpoint doesn't exist, try getting the topic with posts
          console.warn('Posts endpoint not found, trying to get topic with posts')
          response = await apiClient.get(`/topics/${topicId}`)
          response = response.posts || []
        }
        
        // Update the topic with fetched posts
        set(state => ({
          blogPosts: state.blogPosts.map(post => ({
            ...post,
            topics: post.topics.map(topic => ({
              ...topic,
              posts: topic.id === topicId ? response : topic.posts
            }))
          })),
          forumCategories: state.forumCategories.map(category => ({
            ...category,
            topics: category.topics.map(topic => ({
              ...topic,
              posts: topic.id === topicId ? response : topic.posts
            }))
          })),
          isLoading: false
        }))
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch posts'
        set({ 
          isLoading: false, 
          error: errorMessage 
        })
        console.error('Error fetching posts:', error)
      }
    },

    clearError: () => {
      set({ error: null })
    },

    testApiConnection: async () => {
      try {
        console.log('Testing API connection...')
        console.log('Current API base URL:', (api as any).defaults?.baseURL)
        console.log('Current window location:', window.location.href)
        
        const response = await apiClient.get('/topics')
        console.log('API connection successful:', response.length, 'topics found')
        
        // Test creating a simple topic
        console.log('Testing topic creation...')
        
        // Get the first available forum as default
        const state = get()
        const defaultCategory = state.forumCategories[0]
        const defaultCategoryId = defaultCategory ? defaultCategory.id : 1
        
        const testTopic = await apiClient.post('/topics', {
          title: 'Test Topic',
          content: 'Test content',
          author: 'Anonymous',
          categoryId: defaultCategoryId,
          tags: ['test']
        })
        console.log('Topic creation test successful:', testTopic)
        
        return true
      } catch (error: any) {
        console.error('API connection failed:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          fullUrl: error.config?.baseURL + error.config?.url
        })
        return false
      }
    }
  }
})