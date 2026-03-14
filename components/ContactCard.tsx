'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaCog, FaTimes, FaPlus, FaTrash, FaSave } from 'react-icons/fa'
import { SiHuggingface, SiKaggle, SiMedium } from 'react-icons/si'
import CVDownloadButton from './CVDownloadButton'

interface ProfileLink {
  label: string
  href: string
  icon: string
  displayText: string
}

const iconMap: Record<string, React.ReactNode> = {
  location: <FaMapMarkerAlt className="text-blue-300 light:text-blue-600" />,
  phone: <FaPhoneAlt />,
  email: <FaEnvelope />,
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
  kaggle: <SiKaggle />,
  huggingface: <SiHuggingface />,
  medium: <SiMedium />,
}

const defaultLinks: ProfileLink[] = [
  { label: 'Location', href: '', icon: 'location', displayText: 'Ajman, UAE' },
  { label: 'Phone Number', href: 'tel:+971509669311', icon: 'phone', displayText: '+971 50 966 9311' },
  { label: 'Email', href: 'mailto:ai.omar.rehan@gmail.com', icon: 'email', displayText: 'ai.omar.rehan@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/AIOmarRehan', icon: 'github', displayText: 'github.com/AIOmarRehan' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/omar-rehan-47b98636a', icon: 'linkedin', displayText: 'linkedin.com/in/omar-rehan-47b98636a' },
  { label: 'Kaggle', href: 'https://kaggle.com/aiomarrehan', icon: 'kaggle', displayText: 'kaggle.com/aiomarrehan' },
  { label: 'HuggingFace', href: 'https://huggingface.co/AIOmarRehan', icon: 'huggingface', displayText: 'huggingface.co/AIOmarRehan' },
  { label: 'Medium', href: 'https://medium.com/@ai.omar.rehan', icon: 'medium', displayText: 'medium.com/@ai.omar.rehan' },
]

interface ContactCardProps {
  initialLinks?: ProfileLink[]
  initialCvPath?: string
}

export default function ContactCard({ initialLinks, initialCvPath }: ContactCardProps) {
  const { data: session } = useSession()
  const isAdmin = !!session?.user?.email
  const isProduction = process.env.NODE_ENV === 'production'
  const showAdminControls = isAdmin && !isProduction

  const [editing, setEditing] = useState(false)
  const [links, setLinks] = useState<ProfileLink[]>(initialLinks && initialLinks.length > 0 ? initialLinks : defaultLinks)
  const [cvPath, setCvPath] = useState(initialCvPath || '/cv/Omar_Rehan_CV.pdf')
  const [saving, setSaving] = useState(false)

  // Sync with server-provided data when it changes
  useEffect(() => {
    if (initialLinks && initialLinks.length > 0) {
      setLinks(initialLinks)
    }
    if (initialCvPath) {
      setCvPath(initialCvPath)
    }
  }, [initialLinks, initialCvPath])

  const updateLink = (index: number, field: keyof ProfileLink, value: string) => {
    setLinks(prev => prev.map((link, i) => i === index ? { ...link, [field]: value } : link))
  }

  const addLink = () => {
    setLinks(prev => [...prev, { label: '', href: '', icon: 'email', displayText: '' }])
  }

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'contact',
          cards: [
            {
              card_data: { links, cvPath },
              sort_order: 0,
            },
          ],
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setEditing(false)
    } catch (err) {
      console.error('Error saving contact card:', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div id="contact-card" className="animated-border-card hero-theme-card w-full">
      <div className="hero-theme-card-content relative z-10 h-full rounded-2xl bg-gray-900/70 light:bg-white/90 p-6 sm:p-8 md:p-10 backdrop-blur flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white light:text-gray-900">Contact & Profiles</h2>
          {showAdminControls && (
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 text-gray-400 hover:text-white transition duration-300"
              aria-label={editing ? 'Close editor' : 'Edit contact card'}
            >
              {editing ? <FaTimes className="w-4 h-4" /> : <FaCog className="w-4 h-4" />}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 flex-1 overflow-y-auto">
            {links.map((link, idx) => (
              <div key={idx} className="p-3 bg-gray-800/60 rounded-lg space-y-2 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Link #{idx + 1}</span>
                  <button onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-300 transition">
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(idx, 'label', e.target.value)}
                  placeholder="Label (e.g. GitHub)"
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateLink(idx, 'href', e.target.value)}
                  placeholder="URL (e.g. https://github.com/user)"
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  value={link.displayText}
                  onChange={(e) => updateLink(idx, 'displayText', e.target.value)}
                  placeholder="Display text (e.g. github.com/user)"
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                />
                <select
                  value={link.icon}
                  onChange={(e) => updateLink(idx, 'icon', e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                >
                  {Object.keys(iconMap).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            ))}

            <button onClick={addLink} className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500 transition text-sm flex items-center justify-center gap-2">
              <FaPlus className="w-3 h-3" /> Add New Link
            </button>

            <div className="p-3 bg-gray-800/60 rounded-lg space-y-2 border border-gray-700">
              <span className="text-xs text-gray-400 uppercase tracking-wider">CV Download Path</span>
              <input
                type="text"
                value={cvPath}
                onChange={(e) => setCvPath(e.target.value)}
                placeholder="/cv/Omar_Rehan_CV.pdf"
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
              />
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2">
              <FaSave className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 text-sm" role="list">
              {links.map((link, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6" role="listitem">
                  <span className="text-gray-300 light:text-gray-800 uppercase tracking-widest text-xs">{link.label}</span>
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-blue-300 hover:text-blue-200 light:text-blue-600 light:hover:text-blue-700 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right"
                    >
                      {iconMap[link.icon] || null}
                      {link.displayText}
                    </a>
                  ) : (
                    <span className="text-gray-200 light:text-gray-900 inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right">
                      {iconMap[link.icon] || null}
                      {link.displayText}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-700 light:border-gray-300">
              <CVDownloadButton buttonSize="lg" cvUrl={cvPath} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
