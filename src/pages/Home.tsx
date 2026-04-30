import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { type Post, CATEGORIES } from '../types'
import PostCard from '../components/PostCard'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const { user, signInWithGoogle } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[]
        setPosts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-brand-400 text-xs font-mono uppercase tracking-widest">The Dad Community</span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-700 text-white mb-4 leading-tight">
          <span style={{color:"#111827"}}>Every shift counts.</span><br />
          <span className="text-brand-400">All of them.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Real stories from dads who move through many roles — partner, son, brother, friend — carrying care and presence into the lives they touch, without seeking applause or the spotlight.
        </p>
        {!user && (
          <button onClick={signInWithGoogle} className="btn-primary mt-8 mx-auto text-base px-8 py-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Share Your Story
          </button>
        )}
        {user && (
          <Link to="/write" className="btn-primary mt-8 mx-auto text-base px-8 py-3 inline-flex">
            ✍️ Write Your Story
          </Link>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`tag border transition-all ${activeCategory === 'all' ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600'}`}
        >
          All Stories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`tag border transition-all ${activeCategory === cat.value ? cat.color : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600'}`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">👨‍👧‍👦</p>
          <p className="text-slate-400 text-lg mb-2">No stories yet in this category.</p>
          <p className="text-slate-600 text-sm">Be the first dad to share here.</p>
          {user && <Link to="/write" className="btn-primary mt-6 mx-auto inline-flex">Write the first one</Link>}
        </div>
      )}

      {!loading && featured && (
        <div className="mb-6">
          <PostCard post={featured} featured />
        </div>
      )}

      {!loading && rest.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
