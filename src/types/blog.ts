export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  tags: string[]
  readTime: string
  slug: string
  forumCategory: ForumCategory
  topics: Topic[]
  totalPosts: number
  totalTopics: number
}

export interface ForumCategory {
  id: number
  name: string
  description: string
  icon: string
  topics: Topic[]
  totalPosts: number
  totalTopics: number
}

export interface Topic {
  id: number
  title: string
  content: string
  author: string
  date: string
  tags: string[]
  replies: number
  views: number
  lastActivity: string
  category: string
  isHot: boolean
  posts: Post[]
  upvotes: number
  downvotes: number
  slug: string
}

export interface Post {
  id: number
  content: string
  author: string
  date: string
  topicId: number
  upvotes: number
  downvotes: number
  parentId?: number // For nested replies
}

export interface User {
  id: number
  name: string
  score: number
  avatar?: string
} 