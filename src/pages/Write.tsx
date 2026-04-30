import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, type Category } from '../types'
import toast from 'react-hot-toast'

function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null
  const btn = (action: () => void, label: string, active?: boolean) => (
    <button
      onClick={action}
      className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${active ? 'bg-brand-500/20 text-brand-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
      {label}
    </button>
  )
  return (
    <div className="flex items-center gap-1 flex-wrap p-3 border-b border-slate-800">
      {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }))}
      {btn(() => editor.chain().focus().toggleBulletList().run(), '• List', editor.isActive('bulletList'))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), '❝', editor.isActive('blockquote'))}
    </div>
  )
}

export default function Write() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('balance')
  const [publishing, setPublishing] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Tell your story... What happened today? How did you balance it all? What did you learn?' }),
    ],
    editorProps: {
      attributes: { class: 'tiptap' },
    },
  })

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-slate-400">Sign in to share your story.</p>
      </div>
    )
  }

  const handlePublish = async () => {
    if (!title.trim()) { toast.error('Give your story a title'); return }
    const content = editor?.getHTML() || ''
    const text = editor?.getText() || ''
    if (text.trim().length < 50) { toast.error('Write a bit more — at least 50 characters'); return }

    setPublishing(true)
    try {
      const excerpt = text.slice(0, 200).trim() + (text.length > 200 ? '...' : '')
      const readTime = Math.max(1, Math.ceil(text.split(' ').length / 200))

      const ref = await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        content,
        excerpt,
        category,
        author: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: [],
        commentsCount: 0,
        readTime,
      })
      toast.success('Your story is live! 🎉')
      navigate(`/post/${ref.id}`)
    } catch (e) {
      toast.error('Something went wrong. Try again.')
      console.error(e)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-600 text-white">Share Your Story</h1>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publishing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : '🚀'}
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 block">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`tag border transition-all ${category === cat.value ? cat.color : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600'}`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Your story's headline..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-transparent font-display text-3xl font-600 text-white placeholder-slate-700 outline-none border-b border-slate-800 pb-4 focus:border-brand-500/50 transition-colors"
        />
      </div>

      {/* Editor */}
      <div className="card overflow-hidden">
        <MenuBar editor={editor} />
        <div className="p-6">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 text-slate-600 text-xs font-mono">
        <span>Writing as {user.displayName}</span>
        <span>{editor?.getText().split(' ').filter(Boolean).length || 0} words</span>
      </div>
    </div>
  )
}
