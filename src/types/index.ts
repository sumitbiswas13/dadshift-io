export type Category = 'balance' | 'wins' | 'tough-days' | 'work-life' | 'milestones' | 'advice'

export const CATEGORIES: { value: Category; label: string; emoji: string; color: string }[] = [
  { value: 'balance', label: 'Balance', emoji: '⚖️', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'wins', label: 'Dad Wins', emoji: '🏆', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { value: 'tough-days', label: 'Tough Days', emoji: '🌧️', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { value: 'work-life', label: 'Work & Life', emoji: '💼', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { value: 'milestones', label: 'Milestones', emoji: '🎯', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { value: 'advice', label: 'Advice', emoji: '💡', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
]

export interface Author {
  uid: string
  displayName: string
  photoURL: string
  email: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  category: Category
  author: Author
  createdAt: any
  updatedAt: any
  likes: string[]
  commentsCount: number
  readTime: number
}

export interface Comment {
  id: string
  postId: string
  content: string
  author: Author
  createdAt: any
  likes: string[]
}
