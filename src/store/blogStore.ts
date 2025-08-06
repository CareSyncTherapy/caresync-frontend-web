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
  clearError: () => void
  testApiConnection: () => Promise<boolean>
}


export const useBlogStore = create<BlogStore>((set, get) => {
  // Initialize forum categories with correct counts from blog posts
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
          name: 'חרדה ודיכאון',
          description: 'שיתוף חוויות וטיפים להתמודדות עם חרדה ודיכאון',
          icon: '😰',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [
          {
            id: 1,
            title: 'איך להתמודד עם חרדה חברתית?',
            content: 'אני מתקשה מאוד במצבים חברתיים. האם יש למישהו טיפים שיכולים לעזור?',
            author: 'משתמש אנונימי',
            date: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            tags: ['חרדה', 'חברתי', 'טיפים'],
            replies: 2,
            views: 45,
            lastActivity: 'עכשיו',
            category: 'חרדה ודיכאון',
            isHot: true,
            posts: [
              {
                id: 1,
                content: 'אני ממליץ על טכניקות נשימה. נסה לנשום עמוק 4 שניות, להחזיק 4 שניות, ולשחרר 6 שניות.',
                author: 'ד"ר כהן',
                date: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
                topicId: 1,
                upvotes: 5,
                downvotes: 0
              },
              {
                id: 2,
                content: 'תרגול חשיפה הדרגתית עזר לי מאוד. התחל במצבים קטנים ובנה את הביטחון שלך.',
                author: 'משתמש אנונימי',
                date: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
                topicId: 1,
                upvotes: 3,
                downvotes: 0
              }
            ],
            upvotes: 8,
            downvotes: 0,
            slug: 'how-to-deal-with-social-anxiety'
          }
        ],
        totalTopics: 1,
        totalPosts: 2
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
          id: 2,
          name: 'טכניקות הרגעה',
          description: 'שיטות וטכניקות להרגעה וניהול מתח',
          icon: '🧘‍♀️',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [
          {
            id: 2,
            title: 'איזה טכניקות הרגעה עובדות הכי טוב?',
            content: 'אני מחפש טכניקות הרגעה יעילות למתח יומיומי. מה עובד אצלכם?',
            author: 'משתמש אנונימי',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            tags: ['הרגעה', 'מתח', 'טכניקות'],
            replies: 2,
            views: 32,
            lastActivity: 'לפני שעה',
            category: 'טכניקות הרגעה',
            isHot: false,
            posts: [
              {
                id: 3,
                content: 'מדיטציה מודרכת עובדת אצלי הכי טוב. יש הרבה אפליקציות טובות.',
                author: 'משתמש אנונימי',
                date: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 minutes ago
                topicId: 2,
                upvotes: 4,
                downvotes: 0
              },
              {
                id: 4,
                content: 'תרגילי נשימה פשוטים עוזרים לי מאוד. נסה 4-7-8: שאיפה ל-4, החזקה ל-7, נשיפה ל-8.',
                author: 'ד"ר לוי',
                date: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 60 minutes ago
                topicId: 2,
                upvotes: 6,
                downvotes: 0
              }
            ],
            upvotes: 6,
            downvotes: 0,
            slug: 'which-relaxation-techniques-work-best'
          }
        ],
        totalTopics: 1,
        totalPosts: 2
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
          id: 3,
          name: 'יחסים ומשפחה',
          description: 'דיונים על יחסים, משפחה וקשרים בין-אישיים',
          icon: '👨‍👩‍👧‍👦',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [
          {
            id: 3,
            title: 'איך לשפר תקשורת בזוגיות?',
            content: 'אני מרגיש שיש בעיות תקשורת ביחסים שלי. איך אפשר לשפר את זה?',
            author: 'משתמש אנונימי',
            date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            tags: ['יחסים', 'תקשורת', 'זוגיות'],
            replies: 2,
            views: 28,
            lastActivity: 'לפני 3 שעות',
            category: 'יחסים ומשפחה',
            isHot: false,
            posts: [
              {
                id: 5,
                content: 'תקשורת פתוחה וכנה היא המפתח. נסה לדבר על הרגשות שלך במקום להאשים.',
                author: 'ד"ר אברהם',
                date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
                topicId: 3,
                upvotes: 7,
                downvotes: 0
              },
              {
                id: 6,
                content: 'טכניקת "אני מרגיש" עוזרת מאוד. במקום "אתה תמיד..." תגיד "אני מרגיש כש..."',
                author: 'משתמש אנונימי',
                date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
                topicId: 3,
                upvotes: 5,
                downvotes: 0
              }
            ],
            upvotes: 12,
            downvotes: 0,
            slug: 'how-to-improve-communication-in-relationships'
          }
        ],
        totalTopics: 1,
        totalPosts: 2
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
          id: 4,
          name: 'תמיכה הדדית',
          description: 'מרחב לתמיכה הדדית ושיתוף חוויות',
          icon: '🤝',
          topics: [],
          totalPosts: 0,
          totalTopics: 0
        },
        topics: [
          {
            id: 4,
            title: 'איך לבנות קהילה תומכת?',
            content: 'אני רוצה ליצור מרחב בטוח לתמיכה הדדית. מה הדרך הטובה ביותר?',
            author: 'משתמש אנונימי',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            tags: ['תמיכה', 'קהילה', 'בטיחות'],
            replies: 2,
            views: 19,
            lastActivity: 'לפני יום',
            category: 'תמיכה הדדית',
            isHot: false,
            posts: [
              {
                id: 7,
                content: 'התחיל בקבוצה קטנה של אנשים שאתה סומך עליהם. בנה אמון הדרגתי.',
                author: 'ד"ר כהן',
                date: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // 23 hours ago
                topicId: 4,
                upvotes: 8,
                downvotes: 0
              },
              {
                id: 8,
                content: 'כללי התנהגות ברורים חשובים מאוד. הגדר גבולות וצפי שהם יישמרו.',
                author: 'משתמש אנונימי',
                date: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
                topicId: 4,
                upvotes: 4,
                downvotes: 0
              }
            ],
            upvotes: 15,
            downvotes: 0,
            slug: 'how-to-build-supportive-community'
          }
        ],
        totalTopics: 1,
        totalPosts: 2
      }
    ]

    // Calculate forum categories with correct counts from blog posts
    const forumCategories = [
      {
        id: 1,
        name: 'חרדה ודיכאון',
        description: 'שיתוף חוויות וטיפים להתמודדות עם חרדה ודיכאון',
        icon: '😰',
        topics: [],
        totalPosts: 2,
        totalTopics: 1
      },
      {
        id: 2,
        name: 'טכניקות הרגעה',
        description: 'שיטות וטכניקות להרגעה וניהול מתח',
        icon: '🧘‍♀️',
        topics: [],
        totalPosts: 2,
        totalTopics: 1
      },
      {
        id: 3,
        name: 'יחסים ומשפחה',
        description: 'דיונים על יחסים, משפחה וקשרים בין-אישיים',
        icon: '👨‍👩‍👧‍👦',
        topics: [],
        totalPosts: 2,
        totalTopics: 1
      },
      {
        id: 4,
        name: 'תמיכה הדדית',
        description: 'מרחב לתמיכה הדדית ושיתוף חוויות',
        icon: '🤝',
        topics: [],
        totalPosts: 2,
        totalTopics: 1
      }
    ]

    // Update forum categories with counts from blog posts
    blogPosts.forEach(post => {
      const category = forumCategories.find(cat => cat.id === post.forumCategory.id)
      if (category) {
        category.totalTopics = post.topics.length
        category.totalPosts = post.topics.reduce((sum, topic) => 
          sum + topic.posts.length, 0)
      }
    })

    return { blogPosts, forumCategories }
  }

  const { blogPosts, forumCategories } = initializeForumCategories()

  return {
    blogPosts,
    forumCategories,
    isLoading: false,
    error: null,

    getBlogPostBySlug: (slug: string) => {
      return get().blogPosts.find(post => post.slug === slug)
    },

    getForumCategoryById: (id: number) => {
      return get().forumCategories.find(category => category.id === id)
    },

    getBlogPostByCategoryId: (categoryId: number) => {
      return get().blogPosts.find(post => post.forumCategory.id === categoryId)
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
        
        console.log('Creating topic with data:', {
          title: topic.title,
          content: topic.content,
          author: topic.author,
          categoryId: categoryId,
          tags: topic.tags
        })
        
        // API call to create topic with simpler data format
        const topicData = {
          title: topic.title,
          content: topic.content,
          author: topic.author,
          categoryId: categoryId,
          tags: topic.tags || []
        }
        
        console.log('Sending topic data:', topicData)
        
        const response = await apiClient.post('/topics', topicData)

        console.log('Topic created successfully:', response)
        const createdTopic = response

        // Update local state
        set(state => {
          const updatedBlogPosts = state.blogPosts.map(post =>
            post.forumCategory.id === categoryId
              ? {
                  ...post,
                  topics: [...post.topics, createdTopic],
                  totalTopics: post.topics.length + 1
                }
              : post
          )

          const updatedForumCategories = state.forumCategories.map(category => {
            if (category.id === categoryId) {
              const relatedBlogPost = updatedBlogPosts.find(
                post => post.forumCategory.id === categoryId
              )
              return {
                ...category,
                topics: [...category.topics, createdTopic],
                totalTopics: relatedBlogPost ? relatedBlogPost.topics.length : 
                  category.topics.length + 1,
                totalPosts: relatedBlogPost ? 
                  relatedBlogPost.topics.reduce((sum, topic) => 
                    sum + topic.posts.length, 0) : category.totalPosts
              }
            }
            return category
          })

          return {
            blogPosts: updatedBlogPosts,
            forumCategories: updatedForumCategories,
            isLoading: false
          }
        })
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
            author: post.author
          })
        } catch (postError: any) {
          // If posts endpoint doesn't exist, try creating a reply as a new topic
          console.warn('Posts endpoint not found, creating as new topic')
          response = await apiClient.post('/topics', {
            title: `Reply to topic ${topicId}`,
            content: post.content,
            author: post.author,
            categoryId: 1, // Default category
            tags: ['reply']
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
            forumCategories: updatedForumCategories,
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
        
        const response = await apiClient.get('/topics')
        
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

        // Group topics by category
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
        
        const response = await apiClient.get('/topics')
        console.log('API connection successful:', response.length, 'topics found')
        
        // Test creating a simple topic
        console.log('Testing topic creation...')
        const testTopic = await apiClient.post('/topics', {
          title: 'Test Topic',
          content: 'Test content',
          author: 'Anonymous',
          categoryId: 1,
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
          baseURL: error.config?.baseURL
        })
        return false
      }
    }
  }
})