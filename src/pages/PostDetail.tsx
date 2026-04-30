import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, collection, addDoc, query, where, orderBy, getDocs, updateDoc, arrayUnion, arrayRemove, serverTimestamp, increment } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { type Post, type Comment, CATEGORIES } from '../types'
import { useAuth } from '../hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!id) return
      try {
        const snap = await getDoc(doc(db, 'posts', id))
        if (snap.exists()) setPost({ id: snap.id, ...snap.data() } as Post)
        const cq = query(collection(db, 'comments'), where('postId', '==', id), orderBy('createdAt', 'asc'))
        const csnap = await getDocs(cq)
        setComments(csnap.docs.map(d => ({ id: d.id, ...d.data() })) as Comment[])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  const handleLike = async () => {
    if (!user || !post) return
    const ref = doc(db, 'posts', post.id)
    const liked = post.likes.includes(user.uid)
    await updateDoc(ref, { likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid) })
    setPost(p => p ? { ...p, likes: liked ? p.likes.filter(l => l !== user.uid) : [...p.likes, user.uid] } : p)
  }

  const handleComment = async () => {
    if (!user || !newComment.trim() || !post) return
    setSubmitting(true)
    try {
      const ref = await addDoc(collection(db, 'comments'), {
        postId: post.id,
        content: newComment.trim(),
        author: { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL, email: user.email },
        createdAt: serverTimestamp(),
        likes: [],
      })
      await updateDoc(doc(db, 'posts', post.id), { commentsCount: increment(1) })
      setComments(c => [...c, { id: ref.id, postId: post.id, content: newComment.trim(), author: { uid: user.uid, displayName: user.displayName || '', photoURL: user.photoURL || '', email: user.email || '' }, createdAt: { toDate: () => new Date() }, likes: [] }])
      setPost(p => p ? { ...p, commentsCount: p.commentsCount + 1 } : p)
      setNewComment('')
      toast.success('Comment posted!')
    } catch (e) { toast.error('Failed to post comment') }
    finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!post) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">🤔</p>
      <p className="text-slate-400">Story not found.</p>
      <Link to="/" className="btn-primary mt-4 inline-flex mx-auto">Back home</Link>
    </div>
  )

  const category = CATEGORIES.find(c => c.value === post.category)
  const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date()
  const liked = user ? post.likes.includes(user.uid) : false

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className={`tag border ${category?.color}`}>{category?.emoji} {category?.label}</span>
          <span className="text-slate-600 text-xs font-mono">{post.readTime} min read</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-700 text-white leading-tight mb-6">{post.title}</h1>
        <div className="flex items-center gap-4">
          <Link to={`/profile/${post.author.uid}`}>
            <img src={post.author.photoURL} alt={post.author.displayName} className="w-10 h-10 rounded-full border border-slate-700 hover:border-brand-500 transition-colors" />
          </Link>
          <div>
            <Link to={`/profile/${post.author.uid}`} className="text-slate-200 font-500 hover:text-brand-400 transition-colors">{post.author.displayName}</Link>
            <p className="text-slate-500 text-sm">{formatDistanceToNow(date, { addSuffix: true })}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 mb-8" />

      {/* Content */}
      <div
        className="prose-custom mb-10 text-slate-300 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="border-t border-slate-800 mb-8" />

      {/* Like & share */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${liked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}
        >
          <svg className={`w-5 h-5 ${liked ? 'fill-red-400' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
        </button>
        {!user && <p className="text-slate-600 text-sm">Sign in to like and comment</p>}
      </div>

      {/* Comments */}
      <div>
        <h2 className="font-display text-2xl font-600 text-white mb-6">
          {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
        </h2>

        {user && (
          <div className="card p-4 mb-6">
            <div className="flex gap-3">
              <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-slate-700 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Share your thoughts, fellow dad..."
                  rows={3}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-brand-500/50 transition-colors resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button onClick={handleComment} disabled={submitting || !newComment.trim()} className="btn-primary text-sm disabled:opacity-50">
                    {submitting ? 'Posting...' : 'Post comment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {comments.map(comment => {
            const cdate = comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date()
            return (
              <div key={comment.id} className="flex gap-3">
                <img src={comment.author.photoURL} alt="" className="w-8 h-8 rounded-full border border-slate-700 flex-shrink-0 mt-1" />
                <div className="flex-1 card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-500 text-slate-200">{comment.author.displayName}</span>
                    <span className="text-xs text-slate-600">{formatDistanceToNow(cdate, { addSuffix: true })}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            )
          })}
          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600 text-sm">No comments yet. Start the conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
