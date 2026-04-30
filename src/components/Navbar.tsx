import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, signInWithGoogle, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-display font-700 text-sm shadow-lg shadow-brand-500/25">
            D
          </div>
          <span className="font-display font-600 text-white text-lg">
            Dad<span className="text-brand-400">Shift</span>
            <span className="text-slate-500 text-sm font-body font-400">.io</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          <Link to="/" className="btn-ghost text-sm">Home</Link>
          <Link to="/categories" className="btn-ghost text-sm">Stories</Link>
          {user && (
            <button
              onClick={() => navigate('/write')}
              className="btn-ghost text-sm"
            >
              Write
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/write')}
                className="btn-primary text-sm hidden sm:flex"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Post
              </button>
              <Link to={`/profile/${user.uid}`}>
                <img
                  src={user.photoURL || ''}
                  alt={user.displayName || ''}
                  className="w-8 h-8 rounded-full border-2 border-slate-700 hover:border-brand-500 transition-colors cursor-pointer"
                />
              </Link>
              <button onClick={logout} className="btn-ghost text-sm text-slate-500">
                Out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="btn-primary text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Join the Shift
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
