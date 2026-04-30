import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { type Post, CATEGORIES, type Category } from '../types'
import PostCard from '../components/PostCard'

export default function Categories() {
  const { category } = useParams<{ category?: string }>()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const active = (category as Category) || 'balance'

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'posts'), where('category', '==', active), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [active])

  const activeCat = CATEGORIES.find(c => c.value === active)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-700 text-white mb-8">Stories</h1>
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => navigate(`/categories/${cat.value}`)}
            className={`tag border transition-all text-sm ${active === cat.value ? cat.color : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600'}`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className={`tag border ${activeCat?.color}`}>{activeCat?.emoji} {activeCat?.label}</span>
        <span className="text-slate-500 text-sm">{posts.length} {posts.length === 1 ? 'story' : 'stories'}</span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">{activeCat?.emoji}</p>
          <p className="text-slate-400">No stories in this category yet.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}
