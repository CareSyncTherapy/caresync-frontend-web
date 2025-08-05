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

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogPosts: [
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
          date: '15 בינואר 2025',
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
          date: '14 בינואר 2025',
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
          date: '12 בינואר 2025',
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
      topics: [],
      totalPosts: 0,
      totalTopics: 0
    }
  ],
  forumCategories: [
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
      name: 'יחסים ומשפחה',
      description: 'דיונים על יחסים, משפחה וקשרים בין-אישיים',
      icon: '👨‍👩‍👧‍👦',
      topics: [],
      totalPosts: 0,
      totalTopics: 0
    },
    {
      id: 3,
      name: 'טכניקות הרגעה',
      description: 'שיטות וטכניקות להרגעה וניהול מתח',
      icon: '🧘‍♀️',
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
  ],

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
    set(state => ({
      forumCategories: state.forumCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              topics: [...category.topics, topic],
              totalTopics: category.topics.length + 1,
              totalPosts: category.totalPosts
            }
          : category
      ),
      blogPosts: state.blogPosts.map(post =>
        post.forumCategory.id === categoryId
          ? {
              ...post,
              totalTopics: post.topics.length + 1,
              topics: [...post.topics, topic]
            }
          : post
      )
    }))
  },

  addPostToTopic: (topicId: number, post: Post) => {
    set(state => ({
      forumCategories: state.forumCategories.map(category => ({
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
        totalPosts: category.topics.reduce((sum, topic) => 
          sum + topic.posts.length + (topic.id === topicId ? 1 : 0), 0)
      })),
      blogPosts: state.blogPosts.map(post => ({
        ...post,
        totalPosts: post.topics.reduce((sum, topic) => 
          sum + topic.posts.length + (topic.id === topicId ? 1 : 0), 0),
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
    }))
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
    const totalTopics = state.forumCategories.reduce((sum, category) => 
      sum + category.totalTopics, 0)
    const totalPosts = state.forumCategories.reduce((sum, category) => 
      sum + category.totalPosts, 0)
    const totalMembers = 1234 // This would come from auth store in real app
    const newTopics = state.forumCategories.reduce((sum, category) => 
      sum + category.topics.filter(topic => 
        new Date(topic.lastActivity).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length, 0)

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
    
    return allTopics.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    ).slice(0, 10)
  }
})) 