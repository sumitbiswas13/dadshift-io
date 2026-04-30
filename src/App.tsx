import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Write from './pages/Write'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import Categories from './pages/Categories'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/write" element={<Write />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/profile/:uid" element={<Profile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:category" element={<Categories />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
