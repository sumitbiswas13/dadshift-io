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

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
          <span className="text-orange-500 text-xs font-mono uppercase tracking-widest">The Dad Community</span>
        </div>
        <h1 className="font-bold text-5xl sm:text-6xl mb-4 leading-tight" style={{fontFamily:'Playfair Display,serif', color:'#111827'}}>
          Every shift counts.<br />
          <span style={{color:'#f97316'}}>All of them.</span><br />
          <span className="text-3xl sm:text-4xl font-normal italic" style={{color:'#6b7280'}}>That is what Dads do!</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto leading-relaxed mt-4" style={{color:'#374151'}}>
          Real stories from dads who move through many roles — partner, son, brother, friend — carrying care and presence into the lives they touch, without seeking applause or the spotlight.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-10 mb-14">
        <div className="bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 px-8 py-8">
              <p className="text-base leading-relaxed mb-4" style={{color:'#374151'}}>
                A space built for dads — not the highlight reel kind, but the real kind. Come share the wins you are proud of, the moments you wish you had handled differently, the lessons that only fatherhood could teach you, and the times you simply needed to ask for help.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{color:'#374151'}}>
                No judgment here. Only dads who get it — because we are all carrying the same weight, showing up the same way, one day at a time.
              </p>
              <p className="font-semibold text-lg" style={{fontFamily:'Playfair Display,serif', color:'#f97316'}}>
                You are not alone in this shift.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center px-8 py-8 bg-orange-50 border-t md:border-t-0 md:border-l border-orange-100 gap-4 min-w-fit">
              <p className="text-sm text-center" style={{color:'#6b7280'}}>Ready to share your story?</p>
              {!user && (
                <button onClick={signInWithGoogle} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-200">
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
                <Link to="/write" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-200">
                  ✍️ Share Your Story
                </Link>
              )}
              <p className="text-xs text-center" style={{color:'#9ca3af'}}>Sign in with Google · Free forever</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${activeCategory === 'all' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
        >
          All Stories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${activeCategory === cat.value ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">👨‍👧‍👦</p>
          <p className="text-lg mb-2" style={{color:'#374151'}}>No stories yet in this category.</p>
          <p className="text-sm" style={{color:'#6b7280'}}>Be the first dad to share here.</p>
          {user && <Link to="/write" className="bg-orange-500 hover:bg-orange-600 text-white mt-6 mx-auto inline-flex px-6 py-2.5 rounded-xl">Write the first one</Link>}
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
