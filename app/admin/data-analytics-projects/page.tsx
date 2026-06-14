'use client'
import { useState, useEffect } from 'react'
import { SiTableau } from 'react-icons/si'
import TagSearchInput from '@/components/TagSearchInput'

interface IProject {
  id: number
  title: string
  description?: string
  github_url?: string
  tableau_url?: string
  tags?: string[]
  image?: string
  demo_video?: string
}

const empty = { title: '', description: '', github_url: '', tableau_url: '', tags: '', image: '', demo_video: '' }

export default function AdminDataAnalyticsPage() {
  const [projects, setProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ ...empty })
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchProjects() }, [])
  useEffect(() => {
    if (!statusMsg) return
    const t = setTimeout(() => setStatusMsg(null), 5000)
    return () => clearTimeout(t)
  }, [statusMsg])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/data-analytics-projects')
      if (!res.ok) { setProjects([]); return }
      const text = await res.text()
      setProjects(text ? JSON.parse(text) : [])
    } catch {
      setProjects([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.github_url?.trim() && !formData.tableau_url?.trim()) {
      alert('At least one URL (GitHub or Tableau Public) is required')
      return
    }
    setLoading(true)
    const body = {
      title: formData.title,
      description: formData.description,
      github_url: formData.github_url,
      tableau_url: formData.tableau_url,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      image: formData.image || '',
      demo_video: formData.demo_video || '',
    }
    try {
      const res = await fetch('/api/admin/data-analytics-projects', {
        method: editingId ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingId
            ? { id: editingId, updates: body, image: body.image, demo_video: body.demo_video }
            : body
        ),
      })
      if (res.ok) {
        setEditingId(null)
        setFormData({ ...empty })
        setImageInputMethod('upload')
        fetchProjects()
        setStatusMsg({ type: 'success', text: editingId ? 'Project updated!' : 'Project created!' })
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to save project.' })
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/data-analytics-projects?id=${id}`, { method: 'DELETE' })
      setStatusMsg(res.ok ? { type: 'success', text: 'Project deleted!' } : { type: 'error', text: 'Failed to delete.' })
      if (res.ok) fetchProjects()
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (proj: IProject) => {
    setEditingId(String(proj.id))
    const imageValue = proj.image || ''
    setImageInputMethod(imageValue.startsWith('http') ? 'url' : 'upload')
    setFormData({
      title: proj.title,
      description: proj.description || '',
      github_url: proj.github_url || '',
      tableau_url: proj.tableau_url || '',
      tags: (proj.tags || []).join(', '),
      image: imageValue,
      demo_video: proj.demo_video || '',
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Maximum allowed is 5MB.'); e.target.value = ''; return }
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'data-analytics')
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setFormData((prev) => ({ ...prev, image: url }))
    } catch {
      alert('Failed to upload image.')
      e.target.value = ''
    } finally {
      setUploadingImage(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { alert('Maximum allowed is 50MB.'); e.target.value = ''; return }
    setUploadingVideo(true)
    try {
      const fd = new FormData()
      fd.append('video', file)
      const res = await fetch('/api/admin/upload-video', { method: 'POST', credentials: 'include', body: fd })
      if (!res.ok) { alert('Failed to upload video.'); e.target.value = ''; return }
      const data = await res.json()
      setFormData((prev) => ({ ...prev, demo_video: data.path }))
    } catch {
      alert('Failed to upload video.')
      e.target.value = ''
    } finally {
      setUploadingVideo(false)
    }
  }

  return (
    <section className="space-y-6">
      <h1>Manage Data Analytics Projects</h1>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 h-24" />
        </div>
        <div>
          <label className="block mb-1">GitHub Repository URL (Optional)</label>
          <input type="url" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} placeholder="https://github.com/username/repo" className="w-full px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Tableau Public URL (Optional)</label>
          <input type="url" value={formData.tableau_url} onChange={(e) => setFormData({ ...formData, tableau_url: e.target.value })} placeholder="https://public.tableau.com/app/profile/.../viz/..." className="w-full px-3 py-2" />
          <p className="text-xs mt-1 opacity-70">At least one URL is required (GitHub repo and/or Tableau Public dashboard).</p>
        </div>
        <div>
          <label className="block mb-1">Tags (comma separated)</label>
          <TagSearchInput value={formData.tags} onChange={(value) => setFormData({ ...formData, tags: value })} className="w-full px-3 py-2" placeholder="Tableau, SQL, Power BI, Python" />
        </div>
        <div>
          <label className="block mb-2">Image / GIF</label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2"><input type="radio" name="imageMethod" checked={imageInputMethod === 'upload'} onChange={() => { setImageInputMethod('upload'); setFormData((p) => ({ ...p, image: '' })) }} /><span className="text-sm">Upload File (max 5MB)</span></label>
            <label className="flex items-center gap-2"><input type="radio" name="imageMethod" checked={imageInputMethod === 'url'} onChange={() => { setImageInputMethod('url'); setFormData((p) => ({ ...p, image: '' })) }} /><span className="text-sm">Use URL</span></label>
          </div>
          {imageInputMethod === 'upload' ? (
            <div className="flex items-center gap-4">
              <label htmlFor="da-image" className="neo-btn neo-btn-cyan text-sm py-2 cursor-pointer">{uploadingImage ? 'Uploading...' : 'Choose File'}</label>
              <input id="da-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className="text-sm">{formData.image && !formData.image.startsWith('http') ? 'File selected' : 'No file chosen'}</span>
            </div>
          ) : (
            <input type="url" placeholder="https://files.catbox.moe/abc.png" value={formData.image?.startsWith('http') ? formData.image : ''} onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))} className="w-full px-3 py-2" />
          )}
          {formData.image && <img src={formData.image} alt="preview" className="mt-2 max-h-40 rounded border-neo border-neo-border" />}
        </div>
        <div>
          <label className="block mb-2">Demo Video (Optional)</label>
          <div className="flex items-center gap-4">
            <label htmlFor="da-video" className="neo-btn neo-btn-purple text-sm py-2 cursor-pointer">{uploadingVideo ? 'Uploading...' : 'Choose Video'}</label>
            <input id="da-video" type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={handleVideoUpload} disabled={uploadingVideo} className="hidden" />
            <span className="text-sm">{formData.demo_video ? formData.demo_video.split('/').pop() : 'No video chosen'}</span>
            {formData.demo_video && <button type="button" onClick={() => setFormData((p) => ({ ...p, demo_video: '' }))} className="neo-btn neo-btn-red text-xs py-1">Remove</button>}
          </div>
          {formData.demo_video && <video src={formData.demo_video} autoPlay muted loop playsInline className="mt-3 max-h-60 rounded border-neo border-neo-border" />}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="neo-btn neo-btn-orange py-2">
            {loading ? 'Publishing...' : editingId ? 'Update Project' : 'Create Project'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ ...empty }); setImageInputMethod('upload') }} className="neo-btn py-2">Cancel</button>
          )}
        </div>

        {statusMsg && (
          <div className={`mt-2 px-4 py-3 font-bold text-sm border-neo border-neo-border ${statusMsg.type === 'success' ? 'bg-neo-lime' : 'bg-neo-red'}`}>
            {statusMsg.type === 'success' ? '✓' : '✕'} {statusMsg.text}
          </div>
        )}
      </form>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={String(proj.id)} className="p-4 rounded-lg flex justify-between items-start gap-4">
            <div className="flex gap-4 items-start min-w-0 flex-1">
              {proj.demo_video ? (
                <video src={proj.demo_video} className="w-32 h-24 object-cover rounded flex-shrink-0" autoPlay muted loop playsInline />
              ) : proj.image ? (
                <img src={proj.image} alt={proj.title} className="w-32 h-24 object-cover rounded flex-shrink-0" />
              ) : (
                <div className="w-32 h-24 rounded flex-shrink-0 flex items-center justify-center text-sm bg-[color:var(--neo-surface-2)]">No Media</div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold">{proj.title}</h3>
                {proj.description && <p className="text-sm">{proj.description}</p>}
                {proj.tags && proj.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs rounded bg-neo-orange">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-3">
                  {proj.tableau_url && (
                    <a href={proj.tableau_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold hover:underline">
                      <SiTableau className="w-4 h-4" /> Dashboard
                    </a>
                  )}
                  {proj.github_url && (
                    <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-sm font-bold hover:underline">Repo</a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(proj)} className="neo-btn neo-btn-yellow text-sm py-1 px-3">Edit</button>
              <button onClick={() => handleDelete(String(proj.id))} disabled={deletingId === String(proj.id)} className="neo-btn neo-btn-red text-sm py-1 px-3">
                {deletingId === String(proj.id) ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
