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

  useEffect(() => {
    fetchArticles()
  }, [])

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
        } else {
          console.error('Failed to update article', await res.text())
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
        } else {
          console.error('Failed to create article', await res.text())
        }
      }
    } catch (err) {
      console.error('Error saving article', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const res = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchArticles()
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
    // Auto-detect image input method
    if (article.image?.startsWith('http')) {
      setImageInputMethod('url')
    } else {
      setImageInputMethod('upload')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (3MB max)
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
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Article title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Article description"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">URL *</label>
          <input
            type="url"
            required
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://medium.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Tags (comma-separated)</label>
          <TagSearchInput
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            placeholder="AI, Machine Learning, Python"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Input - Upload or URL */}
        <div className="space-y-3">
          <label className="block text-gray-700 font-semibold mb-2">Image</label>
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
              <span className="text-gray-700">Upload File (max 3MB)</span>
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
              <span className="text-gray-700">Use URL (CatBox, Imgur, etc.)</span>
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
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {editingId ? 'Update Article' : 'Create Article'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setFormData({ title: '', description: '', url: '', tags: '', image: '' })
                setImageInputMethod('upload')
              }}
              className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Articles List */}
      <div className="grid gap-4">
        {articles.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No articles yet.</p>
        ) : (
          articles.map((article) => (
            <div key={String(article.id)} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition p-4 flex gap-4">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{article.title}</h3>
                {article.description && <p className="text-gray-600 text-sm mt-1">{article.description}</p>}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
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
                      className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
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
              <div className="flex flex-col gap-2 justify-start">
                <button
                  onClick={() => handleEdit(article)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(String(article.id))}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm transition"
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
