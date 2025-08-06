import { create } from 'zustand'
import { BlogPost, ForumCategory, Topic, Post } from '../types/blog'

interface BlogStore {
  blogPosts: BlogPost[]
  forumCategories: ForumCategory[]
  getBlogPostBySlug: (slug: string) => BlogPost | undefined
  getForumCategoryById: (id: number) => ForumCategory | undefined
  getBlogPostByCategoryId: (categoryId: number) => BlogPost | undefined
  getTopicBySlug: (slug: string) => Topic | undefined
  addTopicToCategory: (categoryId: number, topic: Topic) => void
  addPostToTopic: (topicId: number, post: Post) => void
  voteOnTopic: (topicId: number, isUpvote: boolean) => void
  voteOnPost: (postId: number, isUpvote: boolean) => void
  calculateCategoryStats: (categoryId: number) => { totalTopics: number; totalPosts: number }
  getTotalStats: () => { totalTopics: number; totalPosts: number; totalMembers: number; newTopics: number }
  getRecentTopics: () => Topic[]
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
            title: 'איך להתמודד עם חרדה לפני מבחנים?',
            content: 'שלום לכולם! אני מתמודדת עם חרדה לפני מבחנים כבר שנים. יש לי מבחן חשוב בעוד שבוע ואני מרגישה שהחרדה משתלטת עליי. האם יש לכם טיפים או טכניקות שעוזרות לכם להתמודד עם זה? אני מחפשת דרכים מעשיות להרגעה ולמיקוד.',
            author: 'שירה כהן',
            date: '2025-01-15T10:00:00Z',
            tags: ['חרדה', 'מבחנים', 'טכניקות הרגעה'],
            replies: 12,
            views: 89,
            lastActivity: 'לפני שעה',
            category: 'חרדה ודיכאון',
            isHot: true,
            posts: [
              {
                id: 1,
                content: 'אני גם מתמודד עם זה! מה שעוזר לי זה נשימות עמוקות - 4 שניות שאיפה, 4 שניות החזקה, 4 שניות נשיפה. זה ממש עוזר להרגעה.',
                author: 'דן לוי',
                date: '15 בינואר 2025',
                topicId: 1,
                upvotes: 8,
                downvotes: 0
              },
              {
                id: 2,
                content: 'תנסי טכניקת 5-4-3-2-1: תסתכלי על 5 דברים שאת רואה, תשמעי 4 צלילים, תגעי ב-3 דברים, תריחי 2 ריחות, ותטעמי דבר אחד. זה עוזר לחזור להווה.',
                author: 'מיכל גולדברג',
                date: '15 בינואר 2025',
                topicId: 1,
                upvotes: 15,
                downvotes: 1
              }
            ],
            upvotes: 25,
            downvotes: 2,
            slug: 'how-to-deal-with-exam-anxiety'
          },
          {
            id: 2,
            title: 'טיפים לחרדה חברתית',
            content: 'אני מתקשה מאוד במצבים חברתיים. מרגיש שאני תמיד אומר את הדבר הלא נכון או שאנשים שופטים אותי. האם יש לכם טיפים איך להתגבר על זה? אני רוצה להיות יותר בטוח בעצמי.',
            author: 'דן לוי',
            date: '2025-01-14T15:30:00Z',
            tags: ['חרדה חברתית', 'ביטחון עצמי', 'יחסים'],
            replies: 8,
            views: 67,
            lastActivity: 'לפני 3 שעות',
            category: 'חרדה ודיכאון',
            isHot: false,
            posts: [
              {
                id: 3,
                content: 'תזכור שרוב האנשים עסוקים בעצמם ולא שמים לב לטעויות קטנות. נסה להתמקד במה שאתה רוצה להגיד ולא איך זה יישמע.',
                author: 'שירה כהן',
                date: '14 בינואר 2025',
                topicId: 2,
                upvotes: 12,
                downvotes: 0
              }
            ],
            upvotes: 18,
            downvotes: 1,
            slug: 'social-anxiety-tips'
          }
        ],
        totalPosts: 20,
        totalTopics: 2
      },
      {
        id: 2,
        title: 'השפעת הטכנולוגיה על בריאות הנפש',
        excerpt: 'כיצד השימוש בסמארטפונים ורשתות חברתיות משפיע על בריאותנו הנפשית...',
        content: 'תוכן מלא של המאמר על השפעת הטכנולוגיה...',
        author: 'פרופ׳ דוד לוי',
        date: '12 בינואר 2025',
        tags: ['טכנולוגיה', 'בריאות נפשית', 'מחקר'],
        readTime: '7 דקות קריאה',
        slug: 'technology-impact-on-mental-health',
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
            id: 3,
            title: 'טיפים לשיפור השינה',
            content: 'אני מתקשה לישון בלילה. יש לכם טיפים לשיפור איכות השינה?',
            author: 'דן לוי',
            date: '2025-01-12T09:15:00Z',
            tags: ['שינה', 'בריאות'],
            replies: 8,
            views: 67,
            lastActivity: 'לפני 3 שעות',
            category: 'טכניקות הרגעה',
            isHot: false,
            posts: [],
            upvotes: 5,
            downvotes: 0,
            slug: 'sleep-improvement-tips'
          }
        ],
        totalPosts: 8,
        totalTopics: 1
      },
      {
        id: 3,
        title: 'טיפים לשיפור איכות השינה',
        excerpt: 'מדריך מעשי לשיפור איכות השינה ויצירת שגרת שינה בריאה...',
        content: 'תוכן מלא של המאמר על שיפור השינה...',
        author: 'ד"ר מיכל גולדברג',
        date: '10 בינואר 2025',
        tags: ['שינה', 'בריאות', 'אורח חיים'],
        readTime: '4 דקות קריאה',
        slug: 'tips-for-better-sleep',
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
            id: 4,
            title: 'איך להתמודד עם לחץ בעבודה?',
            content: 'אני מרגיש שהעבודה משתלטת על החיים שלי. יש לכם טיפים איך להתמודד עם לחץ בעבודה?',
            author: 'משתמש אנונימי',
            date: '2025-01-16T14:20:00Z',
            tags: ['לחץ', 'עבודה', 'איזון'],
            replies: 1,
            views: 0,
            lastActivity: 'עכשיו',
            category: 'יחסים ומשפחה',
            isHot: false,
            posts: [
              {
                id: 4,
                content: 'תנסה לקחת הפסקות קצרות כל שעה. זה עוזר מאוד!',
                author: 'יוסי כהן',
                date: '2025-01-16T14:25:00Z',
                topicId: 4,
                upvotes: 3,
                downvotes: 0
              }
            ],
            upvotes: 7,
            downvotes: 0,
            slug: 'work-stress-management'
          }
        ],
        totalPosts: 1,
        totalTopics: 1
      }
    ]

    // Calculate forum categories with correct counts
    const forumCategories = [
      {
        id: 1,
        name: 'חרדה ודיכאון',
        description: 'שיתוף חוויות וטיפים להתמודדות עם חרדה ודיכאון',
        icon: '😰',
        topics: [],
        totalPosts: 0,
        totalTopics: 0
      },
      {
        id: 2,
        name: 'טכניקות הרגעה',
        description: 'שיטות וטכניקות להרגעה וניהול מתח',
        icon: '🧘‍♀️',
        topics: [],
        totalPosts: 0,
        totalTopics: 0
      },
      {
        id: 3,
        name: 'יחסים ומשפחה',
        description: 'דיונים על יחסים, משפחה וקשרים בין-אישיים',
        icon: '👨‍👩‍👧‍👦',
        topics: [],
        totalPosts: 0,
        totalTopics: 0
      },
      {
        id: 4,
        name: 'תמיכה הדדית',
        description: 'מרחב לתמיכה הדדית ושיתוף חוויות',
        icon: '🤝',
        topics: [],
        totalPosts: 0,
        totalTopics: 0
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

  addTopicToCategory: (categoryId: number, topic: Topic) => {
    set(state => {
      // Update blog posts first
      const updatedBlogPosts = state.blogPosts.map(post =>
        post.forumCategory.id === categoryId
          ? {
              ...post,
              topics: [...post.topics, topic],
              totalTopics: post.topics.length + 1
            }
          : post
      )

      // Update forum categories with correct counts from blog posts
      const updatedForumCategories = state.forumCategories.map(category => {
        if (category.id === categoryId) {
          const relatedBlogPost = updatedBlogPosts.find(
            post => post.forumCategory.id === categoryId
          )
          return {
            ...category,
            topics: [...category.topics, topic],
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
        forumCategories: updatedForumCategories
      }
    })
  },

  addPostToTopic: (topicId: number, post: Post) => {
    set(state => {
      // Update blog posts first
      const updatedBlogPosts = state.blogPosts.map(post => ({
        ...post,
        topics: post.topics.map(topic =>
          topic.id === topicId
            ? {
                ...topic,
                posts: [...topic.posts, post],
                replies: topic.replies + 1
              }
            : topic
        )
      }))

      // Update forum categories with correct counts from blog posts
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
                  posts: [...topic.posts, post],
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
        forumCategories: updatedForumCategories
      }
    })
  },

  voteOnTopic: (topicId: number, isUpvote: boolean) => {
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
      }))
    }))
  },

  voteOnPost: (postId: number, isUpvote: boolean) => {
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
      }))
    }))
  },

  calculateCategoryStats: (categoryId: number) => {
    const category = get().getForumCategoryById(categoryId)
    if (!category) return { totalTopics: 0, totalPosts: 0 }

    const totalTopics = category.topics.length
    const totalPosts = category.topics.reduce((sum, topic) => 
      sum + topic.posts.length, 0)

    return { totalTopics, totalPosts }
  },

  getTotalStats: () => {
    const state = get()
    
    // Calculate totals from blog posts to ensure accuracy
    const totalTopics = state.blogPosts.reduce((sum, post) => 
      sum + post.topics.length, 0)
    const totalPosts = state.blogPosts.reduce((sum, post) => 
      sum + post.topics.reduce((topicSum, topic) => 
        topicSum + topic.posts.length, 0), 0)
    const totalMembers = 1234 // This would come from auth store in real app
    
    // Calculate new topics from all topics across blog posts
    const allTopics = state.blogPosts.flatMap(post => post.topics)
    const newTopics = allTopics.filter(topic => 
      new Date(topic.lastActivity).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length

    return { totalTopics, totalPosts, totalMembers, newTopics }
  },

  getRecentTopics: () => {
    const state = get()
    const allTopics: Topic[] = []
    
    state.blogPosts.forEach(post => {
      post.topics.forEach(topic => {
        allTopics.push({
          ...topic,
          category: post.forumCategory.name
        })
      })
    })
    
    // Sort by creation date (date field) in descending order (newest first)
    return allTopics.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 10)
  }
}))