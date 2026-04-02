'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FaCog, FaTimes, FaSave } from 'react-icons/fa'
import WhatsAppButton from './WhatsAppButton'
import AnimatedTechCards from './AnimatedTechCards'

interface QRCard {
  label: string
  imageSrc: string
  borderColor: string
  textColor: string
  buttonType: 'cv' | 'whatsapp'
  linkUrl: string
}

const defaultCards: QRCard[] = [
  {
    label: 'CV QR Code',
    imageSrc: '/qr_code/CV.svg',
    borderColor: 'cyan',
    textColor: 'cyan',
    buttonType: 'cv',
    linkUrl: '/cv/Omar_Rehan_CV.pdf',
  },
  {
    label: 'WhatsApp QR Code',
    imageSrc: '/qr_code/WhatsApp.svg',
    borderColor: 'purple',
    textColor: 'purple',
    buttonType: 'whatsapp',
    linkUrl: 'https://wa.me/971509669311',
  },
]

interface QRSectionProps {
  initialCards?: QRCard[]
}

export default function QRSection({ initialCards }: QRSectionProps) {
  const { data: session } = useSession()
  const isAdmin = !!session?.user?.email
  const isProduction = process.env.NODE_ENV === 'production'
  const showAdminControls = isAdmin && !isProduction

  const [editing, setEditing] = useState(false)
  const [cards, setCards] = useState<QRCard[]>(initialCards && initialCards.length > 0 ? initialCards : defaultCards)
  const [saving, setSaving] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Track dark mode
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Sync with server-provided data when it changes
  useEffect(() => {
    if (initialCards && initialCards.length > 0) {
      setCards(initialCards)
    }
  }, [initialCards])

  const updateCard = (index: number, field: keyof QRCard, value: string) => {
    setCards(prev => prev.map((card, i) => i === index ? { ...card, [field]: value } : card))
  }

  const [uploading, setUploading] = useState<number | null>(null)

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(index)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload-qr', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      updateCard(index, 'imageSrc', url)
    } catch (err) {
      console.error('Image upload error:', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'qr',
          cards: cards.map((card, i) => ({
            card_data: card,
            sort_order: i,
          })),
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setEditing(false)
    } catch (err) {
      console.error('Error saving QR cards:', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getCardClasses = (card: QRCard) => {
    const borderMap: Record<string, string> = {
      cyan: 'border-cyan-300/25 light:border-cyan-500/30',
      purple: 'border-purple-300/25 light:border-purple-500/30',
    }
    return borderMap[card.borderColor] || borderMap.cyan
  }

  const getTextClasses = (card: QRCard) => {
    const textMap: Record<string, string> = {
      cyan: 'text-cyan-300 light:text-cyan-700',
      purple: 'text-purple-300 light:text-purple-700',
    }
    return textMap[card.textColor] || textMap.cyan
  }

  const getDividerClasses = (card: QRCard) => {
    const dividerMap: Record<string, string> = {
      cyan: 'border-cyan-300/20',
      purple: 'border-purple-300/20',
    }
    return dividerMap[card.borderColor] || dividerMap.cyan
  }

  return (
    <section
      className="py-12 px-6 qr-section-bg border border-cyan-400/30 light:border-purple-400/40 rounded-xl fade-in relative overflow-hidden"
      aria-label="QR codes for CV and WhatsApp"
    >
      {/* Animated background layer */}
      <div className="qr-animated-bg" aria-hidden="true" />

      <div className="relative z-10">
        <div className="text-center mb-8 flex items-center justify-center gap-3">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-white light:text-gray-900">Scan & Connect</h3>
            <p className="text-gray-300 light:text-gray-700">Use these QR codes for my CV and WhatsApp contact.</p>
          </div>
          {showAdminControls && (
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 text-gray-400 hover:text-white transition duration-300"
              aria-label={editing ? 'Close editor' : 'Edit QR codes'}
            >
              {editing ? <FaTimes className="w-4 h-4" /> : <FaCog className="w-4 h-4" />}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 max-w-lg mx-auto">
            {cards.map((card, idx) => (
              <div key={idx} className="p-4 bg-gray-800/70 rounded-lg space-y-3 border border-gray-700">
                <span className="text-sm text-gray-300 font-semibold">{card.label}</span>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Label</label>
                  <input
                    type="text"
                    value={card.label}
                    onChange={(e) => updateCard(idx, 'label', e.target.value)}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">QR Code Image</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[idx]?.click()}
                      disabled={uploading === idx}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded transition"
                    >
                      {uploading === idx ? 'Uploading...' : 'Upload New QR'}
                    </button>
                    <input
                      ref={el => { fileInputRefs.current[idx] = el }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(idx, e)}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-400 truncate max-w-[200px]">{card.imageSrc.startsWith('data:') ? 'Custom upload' : card.imageSrc}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Or use image URL</label>
                  <input
                    type="text"
                    value={card.imageSrc.startsWith('data:') ? '' : card.imageSrc}
                    onChange={(e) => updateCard(idx, 'imageSrc', e.target.value)}
                    placeholder="/qr_code/My_CV-1024.svg"
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                  />
                </div>
                {card.imageSrc && (
                  <img src={card.imageSrc} alt="QR Preview" className="w-24 h-24 mx-auto rounded border border-gray-600" />
                )}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Scan URL (where the QR code points to)</label>
                  <input
                    type="text"
                    value={card.linkUrl}
                    onChange={(e) => updateCard(idx, 'linkUrl', e.target.value)}
                    placeholder="https://example.com or /cv/file.pdf"
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400"
                  />
                </div>
              </div>
            ))}
            <button onClick={handleSave} disabled={saving} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2">
              <FaSave className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
            {cards.map((card, idx) => (
              <div key={idx} className={`qr-theme-card rounded-2xl p-5 border ${getCardClasses(card)}`}>
                <div className="qr-theme-card-content rounded-xl p-5">
                  <h4 className={`text-sm font-semibold mb-4 ${getTextClasses(card)}`}>{card.label}</h4>
                  <div className="qr-dynamic-glow rounded-xl p-4 bg-gray-900/50 light:bg-white/60 flex justify-center">
                    <img
                      src={card.imageSrc}
                      alt={`QR code for ${card.label}`}
                      className="w-52 h-52 max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className={`mt-4 pt-4 border-t ${getDividerClasses(card)}`}>
                    {card.buttonType === 'cv' ? (
                      <a
                        href={card.linkUrl || '/cv/Omar_Rehan_CV.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 w-full text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-transform duration-300 ease-out hover:scale-105"
                        style={{
                          background: isDarkMode
                            ? 'linear-gradient(45deg, #93c5fd, #e9d5ff)'
                            : 'linear-gradient(45deg, #0284c7, #7c3aed)',
                          color: isDarkMode ? '#000000' : '#ffffff',
                          boxShadow: isDarkMode
                            ? '0 0 20px #93c5fd, 0 0 40px #e9d5ff, inset 0 0 20px rgba(147, 197, 253, 0.3)'
                            : '0 0 20px #0284c7, 0 0 40px #7c3aed, inset 0 0 20px rgba(2, 132, 199, 0.2)',
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View CV
                      </a>
                    ) : (
                      <WhatsAppButton href={card.linkUrl} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Animated tech cards filler */}
        {!editing && <AnimatedTechCards />}
      </div>
    </section>
  )
}
