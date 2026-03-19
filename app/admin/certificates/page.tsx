'use client'
import { useState, useEffect } from 'react'
import TagSearchInput from '@/components/TagSearchInput'

interface ICertificate {
  id: number
  title: string
  issuer: string
  issue_date: string
  credential_url?: string
  description?: string
  tags?: string[]
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
    description: '',
    tags: ''
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCertificates()
    
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

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates')
      if (!res.ok) {
        console.error('Failed to fetch certificates', res.status)
        setCertificates([])
        return
      }
      const text = await res.text()
      if (!text) {
        setCertificates([])
        return
      }
      const data = JSON.parse(text)
      setCertificates(data)
    } catch (err) {
      console.error('Error fetching certificates', err)
      setCertificates([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const body = {
      title: formData.title,
      issuer: formData.issuer,
      issue_date: formData.issue_date,
      credential_url: formData.credential_url || null,
      description: formData.description || '',
      tags: tags
    }

    try {
      if (editingId) {
        const res = await fetch('/api/admin/certificates', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, updates: body })
        })
        if (res.ok) {
          setEditingId(null)
          setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', description: '', tags: '' })
          fetchCertificates()
          setStatusMsg({ type: 'success', text: 'Certificate updated successfully!' })
        } else {
          const errText = await res.text()
          console.error('Failed to update certificate', errText)
          setStatusMsg({ type: 'error', text: 'Failed to update certificate.' })
        }
      } else {
        const res = await fetch('/api/admin/certificates', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (res.ok) {
          setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', description: '', tags: '' })
          fetchCertificates()
          setStatusMsg({ type: 'success', text: 'Certificate added successfully!' })
        } else {
          const errText = await res.text()
          console.error('Failed to create certificate', errText)
          setStatusMsg({ type: 'error', text: 'Failed to create certificate.' })
        }
      }
    } catch (err) {
      console.error('Error saving certificate', err)
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCertificates()
        setStatusMsg({ type: 'success', text: 'Certificate deleted successfully!' })
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to delete certificate.' })
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (cert: ICertificate) => {
    setEditingId(String(cert.id))
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issue_date ? new Date(cert.issue_date).toISOString().split('T')[0] : '',
      credential_url: cert.credential_url || '',
      description: cert.description || '',
      tags: cert.tags?.join(', ') || ''
    })
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Manage Certificates</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className={`p-8 rounded-lg shadow-md border space-y-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Certificate Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., AWS Certified Solutions Architect"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Issuer *</label>
            <input
              type="text"
              required
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g., Amazon Web Services"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Issue Date *</label>
            <input
              type="date"
              required
              value={formData.issue_date}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-black'}`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Credential URL (optional)</label>
            <input
              type="url"
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              placeholder="https://credentials.example.com/..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
            />
          </div>
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the certificate or skills verified"
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
        </div>

        <div>
          <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Technologies/Skills (optional)</label>
          <TagSearchInput
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            placeholder="e.g., AWS, Python, Machine Learning, Cloud Architecture"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-black placeholder-gray-400'}`}
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comma-separated list of technologies</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-semibold disabled:opacity-50 transition-transform duration-300 ease-out hover:scale-105 flex items-center gap-2 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Publishing...' : editingId ? 'Update Certificate' : 'Add Certificate'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', description: '', tags: '' })
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

      {/* Certificates List */}
      <div className="grid gap-4">
        {certificates.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No certificates yet.</p>
        ) : (
          certificates.map((cert) => (
            <div key={String(cert.id)} className={`rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cert.title}</h3>
                  <p className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{cert.issuer}</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-sm transition-transform duration-300 ease-out hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(String(cert.id))}
                    disabled={deletingId === String(cert.id)}
                    className={`px-3 py-1 bg-red-500 text-white rounded font-semibold text-sm transition-transform duration-300 ease-out hover:scale-105 flex items-center gap-1 disabled:opacity-50 ${deletingId === String(cert.id) ? '' : 'hover:bg-red-600'}`}
                  >
                    {deletingId === String(cert.id) && <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {deletingId === String(cert.id) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              {cert.description && (
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cert.description}</p>
              )}

              {cert.tags && cert.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {cert.tags.map((tag, idx) => (
                    <span key={idx} className={`px-2 py-1 text-xs rounded font-medium ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition hover:underline ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}`}
                >
                  View Credential →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
