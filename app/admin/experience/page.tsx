'use client'
import { useState, useEffect } from 'react'
import TagSearchInput from '@/components/TagSearchInput'

interface IExperience {
  id: number
  title: string
  organization: string
  location?: string
  start_date: string
  end_date: string
  description?: string
  highlights?: string[]
  tags?: string[]
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<IExperience[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    start_date: '',
    end_date: 'Present',
    description: '',
    highlights: '',
    tags: ''
  })
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    fetchExperiences()
    
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience')
      if (!res.ok) {
        console.error('Failed to fetch experiences', res.status)
        setExperiences([])
        return
      }
      const text = await res.text()
      if (!text) {
        setExperiences([])
        return
      }
      const data = JSON.parse(text)
      setExperiences(data)
    } catch (err) {
      console.error('Error fetching experiences', err)
      setExperiences([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      title: formData.title,
      organization: formData.organization,
      location: formData.location,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description,
      highlights: formData.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    try {
      if (editingId) {
        const res = await fetch('/api/admin/experience', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, updates: body })
        })
        if (res.ok) {
          setEditingId(null)
          setFormData({ title: '', organization: '', location: '', start_date: '', end_date: 'Present', description: '', highlights: '', tags: '' })
          fetchExperiences()
        } else {
          console.error('Failed to update experience', await res.text())
        }
      } else {
        const res = await fetch('/api/admin/experience', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (res.ok) {
          setFormData({ title: '', organization: '', location: '', start_date: '', end_date: 'Present', description: '', highlights: '', tags: '' })
          fetchExperiences()
        } else {
          console.error('Failed to create experience', await res.text())
        }
      }
    } catch (err) {
      console.error('Error saving experience', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const res = await fetch(`/api/admin/experience?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchExperiences()
  }

  const handleEdit = (exp: IExperience) => {
    setEditingId(String(exp.id))
    setFormData({
      title: exp.title,
      organization: exp.organization,
      location: exp.location || '',
      start_date: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : '',
      end_date: exp.end_date || 'Present',
      description: exp.description || '',
      highlights: exp.highlights?.join('\n') || '',
      tags: exp.tags?.join(', ') || ''
    })
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Manage Experience</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className={`p-8 rounded-lg shadow-md border space-y-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Job Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior AI Engineer"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Organization *</label>
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g., Tech Company"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            />
          </div>
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., San Francisco, CA"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Start Date *</label>
            <input
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-black'}`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>End Date</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    checked={formData.end_date === 'Present'}
                    onChange={() => setFormData({ ...formData, end_date: 'Present' })}
                  />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Present</span>
                </label>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    checked={formData.end_date !== 'Present'}
                    onChange={() => setFormData({ ...formData, end_date: '' })}
                  />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Specific Date</span>
                </label>
              </div>
              {formData.end_date !== 'Present' && (
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-black'}`}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief overview of your role and responsibilities"
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Key Highlights (one per line)</label>
          <textarea
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            placeholder="Led AI model implementation&#10;Improved performance by 40%&#10;Managed team of 5 engineers"
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Technologies/Skills (comma-separated)</label>
          <TagSearchInput
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            placeholder="Python, TensorFlow, React, Node.js, AWS, Machine Learning"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Supported: Python, JavaScript, TypeScript, React, Node.js, TensorFlow, PyTorch, Docker, AWS, GCP, Azure, SQL, MongoDB, PostgreSQL, Git, and more</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-semibold disabled:opacity-50 transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {editingId ? 'Update Experience' : 'Add Experience'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setFormData({ title: '', organization: '', location: '', start_date: '', end_date: 'Present', description: '', highlights: '', tags: '' })
              }}
              className={`px-6 py-2 text-white rounded-lg font-semibold transition-transform duration-300 ease-out hover:scale-105 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-400 hover:bg-gray-500'}`}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Experiences List */}
      <div className="grid gap-4">
        {experiences.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No experience yet.</p>
        ) : (
          experiences.map((exp) => (
            <div key={String(exp.id)} className={`rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{exp.title}</h3>
                  <p className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{exp.organization}</p>
                  {exp.location && <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{exp.location}</p>}
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {' - '}
                    {exp.end_date === 'Present' ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-sm transition-transform duration-300 ease-out hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(String(exp.id))}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm transition-transform duration-300 ease-out hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {exp.description && (
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{exp.description}</p>
              )}

              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-1 mb-3">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className={`text-sm flex items-start gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className={`font-bold mt-0.5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {exp.tags && exp.tags.length > 0 && (
                <div className={`flex flex-wrap gap-2 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {exp.tags.map((tag, idx) => (
                    <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
