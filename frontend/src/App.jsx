// src/App.jsx
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom'

import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import AdminPanel from './components/AdminPanel'

function AppLayout({ children, backendAvailable, backendUrl, theme, onToggleTheme }) {
  const themeClass = theme === 'light' ? 'theme-light ' : ''
  return (
    <div className={`${themeClass}min-h-screen bg-slate-950 text-slate-50`}>
      {/* Top nav / brand bar */}
      <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-lg font-semibold">⭐</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight uppercase text-indigo-100">
                Review Aggregator
              </div>
              <div className="text-xs text-indigo-100/80">
                Compare product reviews across platforms
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm font-medium text-indigo-50/90">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}`
              }
              end
            >
              Products
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}`
              }
            >
              Analytics
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}`
              }
            >
              Admin
            </NavLink>
          </nav>

          <div className="text-xs sm:text-sm text-indigo-100/80 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Backend: {backendAvailable === false ? 'Offline' : 'Online'}
            </span>
            <span className="opacity-80 break-all sm:break-normal">API: {backendUrl}</span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-lg bg-white/20 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
            >
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {backendAvailable === false && (
          <div className="mb-6 p-4 bg-yellow-100/10 border border-yellow-500/60 rounded-lg">
            <p className="text-sm text-yellow-100">
              Heads up: Backend server is not available. Make sure it&apos;s running on{' '}
              <span className="font-mono">{backendUrl}</span>
            </p>
          </div>
        )}

        {/* Card wrapper for main content */}
        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl shadow-xl backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  )
}

function App() {
  const [categories, setCategories] = useState([])
  const [backendAvailable, setBackendAvailable] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [theme, setTheme] = useState('dark')

  const rawBackend = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
  const backendUrl = rawBackend.endsWith('/api') ? rawBackend : `${rawBackend.replace(/\/+$/, '')}/api`

  // load categories once for ProductList
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${backendUrl}/categories`)
        if (res.ok) {
          const body = await res.json()
          const list = Array.isArray(body) ? body : body.data || []
          setCategories(list)
          setBackendAvailable(true)
        } else {
          setBackendAvailable(false)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setBackendAvailable(false)
      }
    }

    fetchCategories()
  }, [backendUrl])

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      return next
    })
  }

  return (
    <Router>
      <Routes>
        {/* Home: product list */}
        <Route
          path="/"
          element={
            <AppLayout
              backendAvailable={backendAvailable}
              backendUrl={backendUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
            >
              <div className="px-6 py-6 sm:px-8 sm:py-8">
                {/* Title + search */}
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-50">
                    Products
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 mb-5 max-w-2xl">
                    Browse the catalog and select a product to fetch and view aggregated
                    reviews from Amazon, BestBuy, Walmart and more.
                  </p>

                  {/* Product search box */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="sm:flex-1">
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                          {/* search icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Search products by name or description..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 justify-end">
                      <label
                        htmlFor="category-filter"
                        className="text-sm font-medium text-slate-200 whitespace-nowrap"
                      >
                        Filter by category
                      </label>
                      <select
                        id="category-filter"
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="border border-slate-600 bg-slate-900/60 text-slate-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All categories</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <ProductList
                  categories={categories}
                  backend={backendUrl}
                  backendAvailable={backendAvailable}
                  searchTerm={searchTerm}
                  categoryFilter={categoryFilter}
                />
              </div>
            </AppLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <AppLayout
              backendAvailable={backendAvailable}
              backendUrl={backendUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
            >
              <AnalyticsDashboard backend={backendUrl} backendAvailable={backendAvailable} />
            </AppLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <AppLayout
              backendAvailable={backendAvailable}
              backendUrl={backendUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
            >
              <AdminPanel
                backend={backendUrl}
                backendAvailable={backendAvailable}
                categories={categories}
              />
            </AppLayout>
          }
        />

        {/* Product detail page + Fetch Reviews */}
        <Route
          path="/products/:id"
          element={
            <AppLayout
              backendAvailable={backendAvailable}
              backendUrl={backendUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
            >
              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <ProductDetail backend={backendUrl} backendAvailable={backendAvailable} />
              </div>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
