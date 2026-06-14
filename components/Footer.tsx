import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { SiKaggle, SiMedium, SiHuggingface } from 'react-icons/si'

const socials = [
  { href: 'https://github.com/AIOmarRehan', label: 'GitHub', Icon: FaGithub, cls: 'neo-tag-yellow' },
  { href: 'https://kaggle.com/aiomarrehan', label: 'Kaggle', Icon: SiKaggle, cls: 'neo-tag-cyan' },
  { href: 'https://medium.com/@ai.omar.rehan', label: 'Medium', Icon: SiMedium, cls: 'neo-tag-lime' },
  { href: 'https://huggingface.co/AIOmarRehan', label: 'HuggingFace', Icon: SiHuggingface, cls: 'neo-tag-pink' },
  { href: 'https://linkedin.com/in/omar-rehan-47b98636a', label: 'LinkedIn', Icon: FaLinkedin, cls: 'neo-tag-blue' },
  { href: 'mailto:ai.omar.rehan@gmail.com', label: 'Email', Icon: FaEnvelope, cls: 'neo-tag-purple' },
  { href: 'tel:+971509669311', label: 'Phone', Icon: FaPhoneAlt, cls: 'neo-tag-yellow' },
]

const quickLinks = [
  { href: '#projects', label: 'AI Projects' },
  { href: '#fullstack-projects', label: 'Full-Stack Projects' },
  { href: '#data-analytics-projects', label: 'Data Analytics Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#articles', label: 'Articles' },
]

export default function Footer() {
  return (
    <footer
      className="relative z-20 mt-10"
      style={{ background: 'var(--neo-surface)', borderTop: 'var(--neo-bw) solid var(--neo-border)' }}
    >
      <div className="w-full max-w-none md:max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* About */}
          <div className="text-center md:text-left">
            <h3 className="inline-block bg-neo-yellow border-2 border-neo-border px-2 py-1 font-extrabold mb-3 text-sm uppercase">About</h3>
            <p className="text-sm leading-relaxed font-medium text-[color:var(--neo-ink-soft)]">
              AI Engineer focused on building intelligent machine learning and deep learning solutions for real-world problems.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="inline-block bg-neo-cyan border-2 border-neo-border px-2 py-1 font-extrabold mb-3 text-sm uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-semibold hover:bg-neo-yellow hover:px-1 transition-all duration-100">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="text-center md:text-left">
            <h3 className="inline-block bg-neo-pink border-2 border-neo-border px-2 py-1 font-extrabold mb-3 text-sm uppercase">Connect</h3>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {socials.map(({ href, label, Icon, cls }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`neo-tag ${cls} w-9 h-9 !p-0 justify-center`}
                  title={label}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5 text-center" style={{ borderTop: '2px solid var(--neo-border)' }}>
          <p className="text-sm font-semibold text-[color:var(--neo-ink-soft)]">
            © 2026 Omar Rehan. All Rights Reserved. Designed &amp; Developed by Omar Rehan.
          </p>
        </div>
      </div>
    </footer>
  )
}
