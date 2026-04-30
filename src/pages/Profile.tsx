import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { type Post } from '../types'
import PostCard from '../components/PostCard'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { uid } = useParams<{ uid: string }>()
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [authorPhoto, setAuthorPhoto] = useState('')

  const isOwn = user?.uid === uid

  useEffect(() => {
    const fetch = async () => {
      if (!uid) return
      try {
        const q = query(collection(db, 'posts'), where('author.uid', '==', uid), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[]
        setPosts(data)
        if (data.length > 0) {
          setAuthorName(data[0].author.displayName)
          setAuthorPhoto(data[0].author.photoURL)
        } else if (isOwn && user) {
          setAuthorName(user.displayName || '')
          setAuthorPhoto(user.photoURL || '')
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [uid])

  const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0)
  const totalComments = posts.reduce((sum, p) => sum + p.commentsCount, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile header */}
      <div className="card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative flex items-center gap-5">
          {authorPhoto ? (
            <img src={authorPhoto} alt={authorName} className="w-16 h-16 rounded-2xl border-2 border-slate-700" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl">👨</div>
          )}
          <div className="flex-1">
            <h1 className="font-display text-2xl font-600 text-white">{authorName || 'Dad'}</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {isOwn ? 'Your DadShift profile' : 'DadShift contributor'}
            </p>
          </div>
        </div>
        <div className="flex gap-6 mt-6 pt-6 border-t border-slate-800">
          <div>
            <p className="font-display text-2xl font-600 text-white">{posts.length}</p>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-wide">Stories</p>
          </div>
          <div>
            <p className="font-display text-2xl font-600 text-white">{totalLikes}</p>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-wide">Likes</p>
          </div>
          <div>
            <p className="font-display text-2xl font-600 text-white">{totalComments}</p>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-wide">Comments</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="font-display text-xl font-600 text-white mb-5">
        {isOwn ? 'Your Stories' : `Stories by ${authorName}`}
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16 card">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-slate-400">{isOwn ? "You haven't written anything yet." : 'No stories yet.'}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
