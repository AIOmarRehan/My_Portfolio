'use client'
import { useState, useEffect } from 'react'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import TagSearchInput from '@/components/TagSearchInput'

interface IFullstackProject {
  id: number
  title: string
  description?: string
  github_url?: string
  live_project_link?: string
  tags?: string[]
  image?: string
  demo_video?: string
}

export default function AdminFullstackProjectsPage() {
  const [projects, setProjects] = useState<IFullstackProject[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '', github_url: '', live_project_link: '', tags: '', image: '', demo_video: '' })
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    fetchProjects()

    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/fullstack-projects')
      if (!res.ok) {
        console.error('Failed to fetch fullstack projects', res.status)
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
      console.error('Error fetching fullstack projects', err)
      setProjects([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const body = {
      title: formData.title,
      description: formData.description,
      github_url: formData.github_url || null,
      live_project_link: formData.live_project_link || null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: formData.image || '',
      demo_video: formData.demo_video || ''
    }

    try {
      if (editingId) {
        const res = await fetch('/api/admin/fullstack-projects', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, updates: body, image: body.image, demo_video: body.demo_video })
        })
        if (res.ok) {
          setEditingId(null)
          setFormData({ title: '', description: '', github_url: '', live_project_link: '', tags: '', image: '', demo_video: '' })
          setImageInputMethod('upload')
          fetchProjects()
        } else {
          console.error('Failed to update project', await res.text())
        }
      } else {
        const res = await fetch('/api/admin/fullstack-projects', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (res.ok) {
          setFormData({ title: '', description: '', github_url: '', live_project_link: '', tags: '', image: '', demo_video: '' })
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
    const res = await fetch(`/api/admin/fullstack-projects?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchProjects()
  }

  const handleEdit = (proj: IFullstackProject) => {
    setEditingId(String(proj.id))
    const imageValue = proj.image || ''
    setImageInputMethod(imageValue.startsWith('http') ? 'url' : 'upload')
    setFormData({
      title: proj.title,
      description: proj.description || '',
      github_url: proj.github_url || '',
      live_project_link: proj.live_project_link || '',
      tags: (proj.tags || []).join(', '),
      image: imageValue,
      demo_video: proj.demo_video || ''
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 3 * 1024 * 1024
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      alert(`Video file is ${sizeMB}MB. Maximum allowed is 50MB. Please use a smaller file or compress the video.`)
      e.target.value = ''
      return
    }

    setUploadingVideo(true)
    try {
      const fd = new FormData()
      fd.append('video', file)

      const res = await fetch('/api/admin/upload-video', {
        method: 'POST',
        credentials: 'include',
        body: fd
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Failed to upload video: ${error.error || 'Unknown error'}`)
        e.target.value = ''
        return
      }

      const data = await res.json()
      setFormData(prev => ({ ...prev, demo_video: data.path }))
      alert('Video uploaded successfully!')
    } catch (err) {
      console.error('Video upload error:', err)
      alert('Failed to upload video. Please try again.')
      e.target.value = ''
    } finally {
      setUploadingVideo(false)
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Full-Stack Projects</h1>

      <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-sm border space-y-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div>
          <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>
        <div>
          <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2 border rounded h-24 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>
        <div>
          <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>GitHub Repository URL (Optional)</label>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            placeholder="https://github.com/username/repo"
            className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>
        <div>
          <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>Live Project URL (Optional)</label>
          <input
            type="url"
            value={formData.live_project_link}
            onChange={(e) => setFormData({ ...formData, live_project_link: e.target.value })}
            placeholder="https://myproject.vercel.app"
            className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>
        <div>
          <label className={`block font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>Tags (comma separated)</label>
          <TagSearchInput
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            placeholder="React, Next.js, TypeScript"
          />
        </div>
        <div>
          <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>Image / GIF</label>

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
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload File (max 3MB)</span>
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
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use URL (CatBox, Imgur, etc.)</span>
            </label>
          </div>

          {imageInputMethod === 'upload' && (
            <div className="flex items-center gap-4">
              <label htmlFor="fs-project-image" className={`px-4 py-2 rounded cursor-pointer transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
                Choose File
              </label>
              <input id="fs-project-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formData.image && !formData.image.startsWith('http') ? 'File selected' : 'No file chosen'}</span>
            </div>
          )}

          {imageInputMethod === 'url' && (
            <input
              type="url"
              placeholder="https://files.catbox.moe/abc123.gif"
              value={formData.image?.startsWith('http') ? formData.image : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            />
          )}

          {formData.image && (
            <img src={formData.image} alt="preview" className="mt-2 max-h-40 rounded" onError={(e) => {
              e.currentTarget.src = ''
              e.currentTarget.alt = 'Failed to load image'
            }} />
          )}
        </div>

        {/* Video upload section */}
        <div>
          <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>Demo Video (Optional)</label>
          <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload a video to showcase your project. Videos are stored as static assets for fast loading. Max 50MB. Supported: MP4, WebM, OGG, MOV.</p>

          <div className="flex items-center gap-4">
            <label htmlFor="fs-project-video" className={`px-4 py-2 rounded cursor-pointer disabled:opacity-50 transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90'}`}>
              {uploadingVideo ? 'Uploading...' : 'Choose Video'}
            </label>
            <input
              id="fs-project-video"
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
              className="hidden"
            />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {formData.demo_video ? formData.demo_video.split('/').pop() : 'No video chosen'}
            </span>
            {formData.demo_video && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, demo_video: '' }))}
                className="text-xs text-red-600 hover:text-red-800 transition-transform duration-300 ease-out hover:scale-105"
              >
                Remove
              </button>
            )}
          </div>

          {formData.demo_video && (
            <video
              src={formData.demo_video}
              autoPlay
              muted
              loop
              playsInline
              className={`mt-3 max-h-60 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
              onError={() => {
                console.error('Video preview error')
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded disabled:opacity-50 transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-cyan-700 text-white hover:bg-cyan-600' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
        >
          {editingId ? 'Update' : 'Create'} Project
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setFormData({ title: '', description: '', github_url: '', live_project_link: '', tags: '', image: '', demo_video: '' })
              setImageInputMethod('upload')
            }}
            className={`ml-2 px-4 py-2 rounded transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-400 text-white hover:bg-gray-500'}`}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={String(proj.id)} className={`p-4 rounded-lg shadow-sm border overflow-hidden flex justify-between items-start gap-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex gap-4 items-start min-w-0 flex-1">
              {proj.demo_video ? (
                <video src={proj.demo_video} className="w-32 h-24 object-cover rounded flex-shrink-0" autoPlay muted loop playsInline />
              ) : proj.image ? (
                <img src={proj.image} alt={proj.title} className="w-32 h-24 object-cover rounded flex-shrink-0" />
              ) : (
                <div className={`w-32 h-24 rounded flex-shrink-0 flex items-center justify-center text-sm ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>No Media</div>
              )}
              <div className="min-w-0">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{proj.title}</h3>
                {proj.description && <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{proj.description}</p>}
                {proj.tags && proj.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.tags.map((tag, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-100 text-cyan-700'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {(proj.github_url || proj.live_project_link) && (
                  <div className="mt-2 flex items-center gap-3">
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        <FaGithub className="w-4 h-4" />
                        <span>Repo</span>
                      </a>
                    )}
                    {proj.live_project_link && (
                      <a href={proj.live_project_link} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 text-sm hover:underline ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        <FaExternalLinkAlt className="w-3.5 h-3.5" />
                        <span>Live Project</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleEdit(proj)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm transition-transform duration-300 ease-out hover:scale-105"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(String(proj.id))}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm transition-transform duration-300 ease-out hover:scale-105"
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
