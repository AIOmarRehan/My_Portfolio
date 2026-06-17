'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaCog, FaTimes, FaPlus, FaTrash, FaSave } from 'react-icons/fa'
import { SiHuggingface, SiKaggle, SiMedium } from 'react-icons/si'
import { IoLogoTableau } from 'react-icons/io5'
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
  tableau: <IoLogoTableau />,
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
    <div id="contact-card" className="neo-card neo-card-alt w-full">
      <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold inline-block bg-neo-cyan border-neo border-neo-border px-3 py-1 shadow-neo-sm -rotate-1">
            Contact &amp; Profiles
          </h2>
          {showAdminControls && (
            <button
              onClick={() => setEditing(!editing)}
              className="neo-btn neo-btn-yellow w-10 h-10 !p-0"
              aria-label={editing ? 'Close editor' : 'Edit contact card'}
            >
              {editing ? <FaTimes className="w-4 h-4" /> : <FaCog className="w-4 h-4" />}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 flex-1 overflow-y-auto">
            {links.map((link, idx) => (
              <div key={idx} className="neo-panel p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Link #{idx + 1}</span>
                  <button onClick={() => removeLink(idx)} className="neo-btn neo-btn-red w-8 h-8 !p-0">
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
                <input type="text" value={link.label} onChange={(e) => updateLink(idx, 'label', e.target.value)} placeholder="Label (e.g. GitHub)" className="neo-input !py-1.5 text-sm" />
                <input type="text" value={link.href} onChange={(e) => updateLink(idx, 'href', e.target.value)} placeholder="URL (e.g. https://github.com/user)" className="neo-input !py-1.5 text-sm" />
                <input type="text" value={link.displayText} onChange={(e) => updateLink(idx, 'displayText', e.target.value)} placeholder="Display text (e.g. github.com/user)" className="neo-input !py-1.5 text-sm" />
                <select value={link.icon} onChange={(e) => updateLink(idx, 'icon', e.target.value)} className="neo-select !py-1.5 text-sm">
                  {Object.keys(iconMap).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            ))}

            <button onClick={addLink} className="neo-btn neo-btn-lime w-full py-2 text-sm">
              <FaPlus className="w-3 h-3" /> Add New Link
            </button>

            <div className="neo-panel p-3 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">CV Download Path</span>
              <input type="text" value={cvPath} onChange={(e) => setCvPath(e.target.value)} placeholder="/cv/Omar_Rehan_CV.pdf" className="neo-input !py-1.5 text-sm" />
            </div>

            <button onClick={handleSave} disabled={saving} className="neo-btn neo-btn-cyan w-full py-2 text-sm">
              <FaSave className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 text-sm" role="list">
              {links.map((link, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6 border-b-2 border-dashed border-[color:var(--neo-border)] pb-2 last:border-0" role="listitem">
                  <span className="font-extrabold uppercase tracking-widest text-xs">{link.label}</span>
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-semibold hover:bg-neo-yellow transition-colors inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right"
                    >
                      {iconMap[link.icon] || null}
                      {link.displayText}
                    </a>
                  ) : (
                    <span className="font-semibold inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right">
                      {iconMap[link.icon] || null}
                      {link.displayText}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6" style={{ borderTop: 'var(--neo-bw) solid var(--neo-border)' }}>
              <CVDownloadButton buttonSize="lg" cvUrl={cvPath} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
