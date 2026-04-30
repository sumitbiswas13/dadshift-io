import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { type Post, CATEGORIES } from '../types'

interface Props {
  post: Post
  featured?: boolean
}

export default function PostCard({ post, featured = false }: Props) {
  const category = CATEGORIES.find(c => c.value === post.category)
  const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date()

  if (featured) {
    return (
      <Link to={`/post/${post.id}`} className="block group">
        <div className="card p-8 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -translate-y-32 translate-x-32 group-hover:bg-brand-500/10 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <span className={`tag border ${category?.color}`}>
                {category?.emoji} {category?.label}
              </span>
              <span className="text-slate-600 text-xs font-mono">{post.readTime} min read</span>
            </div>
            <h2 className="font-display text-3xl font-600 text-white mb-3 leading-tight group-hover:text-brand-300 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.author.photoURL} alt={post.author.displayName} className="w-9 h-9 rounded-full border border-slate-700" />
                <div>
                  <p className="text-sm font-500 text-slate-200">{post.author.displayName}</p>
                  <p className="text-xs text-slate-500">{formatDistanceToNow(date, { addSuffix: true })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes.length}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.commentsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/post/${post.id}`} className="block group">
      <div className="card p-6 hover:border-slate-700 transition-all duration-300 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className={`tag border ${category?.color}`}>
            {category?.emoji} {category?.label}
          </span>
          <span className="text-slate-600 text-xs font-mono ml-auto">{post.readTime}m</span>
        </div>
        <h3 className="font-display text-xl font-600 text-white mb-2 leading-snug group-hover:text-brand-300 transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <img src={post.author.photoURL} alt={post.author.displayName} className="w-7 h-7 rounded-full border border-slate-700" />
          <span className="text-xs text-slate-400 flex-1">{post.author.displayName}</span>
          <div className="flex items-center gap-3 text-slate-600 text-xs">
            <span className="flex items-center gap-1">❤️ {post.likes.length}</span>
            <span className="flex items-center gap-1">💬 {post.commentsCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
