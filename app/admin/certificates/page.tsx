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

  useEffect(() => {
    fetchCertificates()
  }, [])

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
        } else {
          console.error('Failed to update certificate', await res.text())
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
        } else {
          console.error('Failed to create certificate', await res.text())
        }
      }
    } catch (err) {
      console.error('Error saving certificate', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const res = await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchCertificates()
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
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Certificate Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., AWS Certified Solutions Architect"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Issuer *</label>
            <input
              type="text"
              required
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g., Amazon Web Services"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Issue Date *</label>
            <input
              type="date"
              required
              value={formData.issue_date}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Credential URL (optional)</label>
            <input
              type="url"
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              placeholder="https://credentials.example.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the certificate or skills verified"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Technologies/Skills (optional)</label>
          <TagSearchInput
            value={formData.tags}
            onChange={(value) => setFormData({ ...formData, tags: value })}
            placeholder="e.g., AWS, Python, Machine Learning, Cloud Architecture"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-xs mt-1">Comma-separated list of technologies</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {editingId ? 'Update Certificate' : 'Add Certificate'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', description: '', tags: '' })
              }}
              className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Certificates List */}
      <div className="grid gap-4">
        {certificates.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No certificates yet.</p>
        ) : (
          certificates.map((cert) => (
            <div key={String(cert.id)} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{cert.title}</h3>
                  <p className="text-blue-600 font-semibold">{cert.issuer}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(String(cert.id))}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {cert.description && (
                <p className="text-gray-700 text-sm mb-3">{cert.description}</p>
              )}

              {cert.tags && cert.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {cert.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
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
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-semibold transition"
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
