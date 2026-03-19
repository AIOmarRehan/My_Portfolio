'use client'
import { useState, useEffect } from 'react'
import TagSearchInput from '@/components/TagSearchInput'

interface IArticle {
  id: number
  title: string
  description?: string
  url?: string
  tags?: string[]
  image?: string
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<IArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '', url: '', tags: '', image: '' })
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchArticles()
    
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!statusMsg) return
    const t = setTimeout(() => setStatusMsg(null), 5000)
    return () => clearTimeout(t)
  }, [statusMsg])

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles')
      if (!res.ok) {
        console.error('Failed to fetch articles', res.status)
        setArticles([])
        return
      }
      const text = await res.text()
      if (!text) {
        setArticles([])
        return
      }
      const data = JSON.parse(text)
      setArticles(data)
    } catch (err) {
      console.error('Error fetching articles', err)
      setArticles([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      title: formData.title,
      description: formData.description,
      url: formData.url,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: formData.image || ''
    }

    try {
      if (editingId) {
        const res = await fetch('/api/admin/articles', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, updates: body, image: body.image })
        })
        if (res.ok) {
          setEditingId(null)
          setFormData({ title: '', description: '', url: '', tags: '', image: '' })
          setImageInputMethod('upload')
          fetchArticles()
          setStatusMsg({ type: 'success', text: 'Article updated successfully!' })
        } else {
          const errText = await res.text()
          console.error('Failed to update article', errText)
          setStatusMsg({ type: 'error', text: 'Failed to update article.' })
        }
      } else {
        const res = await fetch('/api/admin/articles', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (res.ok) {
          setFormData({ title: '', description: '', url: '', tags: '', image: '' })
          setImageInputMethod('upload')
          fetchArticles()
          setStatusMsg({ type: 'success', text: 'Article created successfully!' })
        } else {
          const errText = await res.text()
          console.error('Failed to create article', errText)
          setStatusMsg({ type: 'error', text: 'Failed to create article.' })
        }
      }
    } catch (err) {
      console.error('Error saving article', err)
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchArticles()
        setStatusMsg({ type: 'success', text: 'Article deleted successfully!' })
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to delete article.' })
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    }
  }

  const handleEdit = (article: IArticle) => {
    setEditingId(String(article.id))
    setFormData({
      title: article.title,
      description: article.description || '',
      url: article.url || '',
      tags: article.tags?.join(', ') || '',
      image: article.image || ''
    })
    // Auto-detect URL or base64
    if (article.image?.startsWith('http')) {
      setImageInputMethod('url')
    } else {
      setImageInputMethod('upload')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 3MB max
    if (file.size > 3 * 1024 * 1024) {
      alert('File size must be less than 3MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData({ ...formData, image: event.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData({ ...formData, image: url })
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Manage Articles</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className={`p-8 rounded-lg shadow-md border space-y-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Article title"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Article description"
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>URL *</label>
          <input
            type="url"
            required
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://medium.com/..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tags (comma-separated)</label>
          <TagSearchInput
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            placeholder="AI, Machine Learning, Python"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        {/* Image Input - Upload or URL */}
        <div className="space-y-3">
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Image</label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageMethod"
                value="upload"
                checked={imageInputMethod === 'upload'}
                onChange={() => {
                  setImageInputMethod('upload')
                  setFormData({ ...formData, image: '' })
                }}
              />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Upload File (max 3MB)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageMethod"
                value="url"
                checked={imageInputMethod === 'url'}
                onChange={() => {
                  setImageInputMethod('url')
                  setFormData({ ...formData, image: '' })
                }}
              />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Use URL (CatBox, Imgur, etc.)</span>
            </label>
          </div>

          {imageInputMethod === 'upload' ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="articleImageUpload"
              />
              <button
                type="button"
                onClick={() => document.getElementById('articleImageUpload')?.click()}
                className={`px-4 py-2 text-white rounded-lg transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                Choose File
              </button>
              {formData.image && (
                <div className="mt-3">
                  <img src={formData.image} alt="Preview" className="h-32 rounded-lg" />
                </div>
              )}
            </div>
          ) : (
            <input
              type="url"
              value={formData.image}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            />
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-semibold disabled:opacity-50 transition-transform duration-300 ease-out hover:scale-105 flex items-center gap-2 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Publishing...' : editingId ? 'Update Article' : 'Create Article'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setFormData({ title: '', description: '', url: '', tags: '', image: '' })
                setImageInputMethod('upload')
              }}
              className={`px-6 py-2 text-white rounded-lg font-semibold transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-400 hover:bg-gray-500'}`}
            >
              Cancel
            </button>
          )}
        </div>

        {statusMsg && (
          <div className={`mt-4 px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-50 text-green-700 border border-green-300'
              : isDarkMode ? 'bg-red-900/50 text-red-300 border border-red-700' : 'bg-red-50 text-red-700 border border-red-300'
          }`}>
            {statusMsg.type === 'success' ? '✓' : '✕'} {statusMsg.text}
          </div>
        )}
      </form>

      {/* Articles List */}
      <div className="grid gap-4">
        {articles.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No articles yet.</p>
        ) : (
          articles.map((article) => (
            <div key={String(article.id)} className={`rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition p-4 flex gap-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{article.title}</h3>
                {article.description && <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{article.description}</p>}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-semibold flex items-center gap-1 hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                      {article.url.includes('medium') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8m4.95 0c0 2.34-1.01 4.236-2.256 4.236S9.463 10.339 9.463 8c0-2.34 1.01-4.236 2.256-4.236S13.975 5.661 13.975 8M16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795" />
                        </svg>
                      ) : null}
                      View Link
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-start flex-shrink-0">
                <button
                  onClick={() => handleEdit(article)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-sm transition-transform duration-300 ease-out hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(String(article.id))}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm transition-transform duration-300 ease-out hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
