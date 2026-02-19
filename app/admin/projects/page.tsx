'use client'
import { useState, useEffect } from 'react'
import TagSearchInput from '@/components/TagSearchInput'

interface IProject {
  id: number
  title: string
  description?: string
  url?: string
  tags?: string[]
  image?: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '', url: '', tags: '', image: '' })
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) {
        console.error('Failed to fetch projects', res.status)
        setProjects([])
        return
      }
      const text = await res.text()
      if (!text) {
        setProjects([])
        return
      }
      const data = JSON.parse(text)
      setProjects(data)
    } catch (err) {
      console.error('Error fetching projects', err)
      setProjects([])
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
        const res = await fetch('/api/admin/projects', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, updates: body, image: body.image })
        })
        if (res.ok) {
          setEditingId(null)
          setFormData({ title: '', description: '', url: '', tags: '', image: '' })
          setImageInputMethod('upload')
          fetchProjects()
        } else {
          console.error('Failed to update project', await res.text())
        }
      } else {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (res.ok) {
          setFormData({ title: '', description: '', url: '', tags: '', image: '' })
          setImageInputMethod('upload')
          fetchProjects()
        } else {
          console.error('Failed to create project', await res.text())
        }
      }
    } catch (err) {
      console.error('Error saving project', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchProjects()
  }

  const handleEdit = (proj: IProject) => {
    setEditingId(String(proj.id))
    const imageValue = proj.image || ''
    // Detect if image is a URL or base64
    setImageInputMethod(imageValue.startsWith('http') ? 'url' : 'upload')
    setFormData({
      title: proj.title,
      description: proj.description || '',
      url: proj.url || '',
      tags: (proj.tags || []).join(', '),
      image: imageValue
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Enforce 3MB limit for base64 storage (becomes ~4MB after encoding)
    const maxSize = 3 * 1024 * 1024 // 3MB
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      alert(`File size is ${sizeMB}MB. Maximum allowed is 3MB due to database limits. Please use a smaller file or compress the GIF.`)
      e.target.value = ''
      return
    }
    
    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: String(reader.result) }))
    }
    reader.onerror = () => {
      alert('Failed to read file. Please try again.')
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Projects</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block font-medium mb-1 text-black">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded h-24 text-black placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black">Tags (comma separated)</label>
          <TagSearchInput
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-400"
            placeholder="React, Next.js, TypeScript"
          />
        </div>
        <div>
          <label className="block font-medium mb-2 text-black">Image / GIF</label>
          
          {/* Image input method selector */}
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageMethod"
                checked={imageInputMethod === 'upload'}
                onChange={() => {
                  setImageInputMethod('upload')
                  setFormData(prev => ({ ...prev, image: '' }))
                }}
                className="cursor-pointer"
              />
              <span className="text-sm text-gray-700">Upload File (max 3MB)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageMethod"
                checked={imageInputMethod === 'url'}
                onChange={() => {
                  setImageInputMethod('url')
                  setFormData(prev => ({ ...prev, image: '' }))
                }}
                className="cursor-pointer"
              />
              <span className="text-sm text-gray-700">Use URL (CatBox, Imgur, etc.)</span>
            </label>
          </div>

          {/* File upload option */}
          {imageInputMethod === 'upload' && (
            <div className="flex items-center gap-4">
              <label htmlFor="project-image" className="px-4 py-2 bg-gray-200 text-gray-900 rounded cursor-pointer hover:bg-gray-300">
                Choose File
              </label>
              <input id="project-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className="text-sm text-gray-700">{formData.image && !formData.image.startsWith('http') ? 'File selected' : 'No file chosen'}</span>
            </div>
          )}

          {/* URL input option */}
          {imageInputMethod === 'url' && (
            <input
              type="url"
              placeholder="https://files.catbox.moe/abc123.gif"
              value={formData.image?.startsWith('http') ? formData.image : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-400"
            />
          )}

          {/* Image preview */}
          {formData.image && (
            <img src={formData.image} alt="preview" className="mt-2 max-h-40 rounded" onError={(e) => {
              e.currentTarget.src = ''
              e.currentTarget.alt = 'Failed to load image'
            }} />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {editingId ? 'Update' : 'Create'} Project
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setFormData({ title: '', description: '', url: '', tags: '', image: '' })
              setImageInputMethod('upload')
            }}
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={String(proj.id)} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-between items-start gap-4">
            <div className="flex gap-4 items-start">
              {proj.image ? (
                <img src={proj.image} alt={proj.title} className="w-24 h-24 object-cover rounded" />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">No Image</div>
              )}
              <div>
                <h3 className="font-semibold">{proj.title}</h3>
                {proj.description && <p className="text-gray-600 text-sm">{proj.description}</p>}
                {proj.tags && proj.tags.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {proj.url && (
                  <div className="mt-2 flex items-center gap-2">
                    <a href={proj.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      {proj.url.includes('github.com') ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
                          <path d="M12 0.5C5.5 0.5 0.5 5.5 0.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.3 0-1.2.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.6 5-5.1 5.3.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.5-5-11.5-12-11.5z" />
                        </svg>
                      ) : proj.url.includes('huggingface') ? (
                        <span className="text-lg">🤗</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
                          <path d="M10 9h4v6h-4z"/>
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                        </svg>
                      )}
                      <span>View Project</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(proj)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(String(proj.id))}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
