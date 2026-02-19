import { supabase } from '../lib/supabaseServer'
import TagBadge from '../components/TagBadge'
import ScrollToContactButton from '../components/ScrollToContactButton'
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { SiHuggingface, SiKaggle, SiMedium } from 'react-icons/si'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  let projects: any[] = []
  let experiences: any[] = []
  let certificates: any[] = []
  let articles: any[] = []

  // Fetch projects directly from Supabase (server-side)
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      projects = data
    }
  } catch (err) {
    console.log('Failed to fetch projects:', err)
  }

  // Fetch experiences directly from Supabase (server-side)
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })
    
    if (!error && data) {
      // Sort: Present entries first, then by start_date descending
      experiences = data.sort((a: any, b: any) => {
        const aIsPresent = a.end_date === 'Present'
        const bIsPresent = b.end_date === 'Present'
        
        if (aIsPresent && !bIsPresent) return -1
        if (!aIsPresent && bIsPresent) return 1
        
        // If both are present or both have dates, sort by start_date descending
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      })
    }
  } catch (err) {
    console.log('Failed to fetch experiences:', err)
  }

  // Fetch articles directly from Supabase (server-side)
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      articles = data
    }
  } catch (err) {
    console.log('Failed to fetch articles:', err)
  }

  // Fetch certificates directly from Supabase (server-side)
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false })
    
    if (!error && data) {
      // Sort by issue_date descending (newest first)
      certificates = data.sort((a: any, b: any) => {
        return new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
      })
    }
  } catch (err) {
    console.log('Failed to fetch certificates:', err)
  }

  return (
    <div id="top" className="space-y-20">
      {/* Hero Section */}
      <section className="py-20 fade-in">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 items-stretch w-full">
          <div className="animated-border-card w-full">
            <div className="relative z-10 h-full rounded-2xl bg-gray-900/70 p-6 sm:p-8 md:p-10 backdrop-blur flex flex-col">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome to my Portfolio
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                I’m an AI and Full-Stack Engineer focused on building intelligent systems using machine learning and deep learning. I specialize in developing end-to-end AI solutions, from data preprocessing to model optimization and deployment, and I’m passionate about solving real-world problems with data-driven approaches.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300"
                >
                  View My Projects
                </a>
                <a
                  href="#experience"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300"
                >
                  See Experience
                </a>
                <a
                  href="#articles"
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300"
                >
                  Articles
                </a>
                <a
                  href="#certifications"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300"
                >
                  Certifications
                </a>
              </div>
            </div>
          </div>

          <div id="contact-card" className="animated-border-card w-full">
            <div className="relative z-10 h-full rounded-2xl bg-gray-900/70 p-6 sm:p-8 md:p-10 backdrop-blur flex flex-col">
              <h2 className="text-2xl font-semibold text-white mb-6">Contact & Profiles</h2>
              <div className="space-y-4 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">Location</span>
                  <span className="text-gray-200 inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right">
                    <FaMapMarkerAlt className="text-blue-300" />
                    Ajman, UAE
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">Phone Number</span>
                  <a href="tel:+971509669311" className="text-blue-300 hover:text-blue-200 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right">
                    <FaPhoneAlt />
                    +971 50 966 9311
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">Email</span>
                  <a href="mailto:ai.omar.rehan@gmail.com" className="text-blue-300 hover:text-blue-200 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right">
                    <FaEnvelope />
                    ai.omar.rehan@gmail.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">GitHub</span>
                  <a
                    href="https://github.com/AIOmarRehan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right"
                  >
                    <FaGithub />
                    github.com/AIOmarRehan
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">LinkedIn</span>
                  <a
                    href="https://linkedin.com/in/omar-rehan-47b98636a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right"
                  >
                    <FaLinkedin />
                    linkedin.com/in/omar-rehan-47b98636a
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">Kaggle</span>
                  <a
                    href="https://kaggle.com/aiomarrehan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right"
                  >
                    <SiKaggle />
                    kaggle.com/aiomarrehan
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">HuggingFace</span>
                  <a
                    href="https://huggingface.co/AIOmarRehan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right"
                  >
                    <SiHuggingface />
                    huggingface.co/AIOmarRehan
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">Medium</span>
                  <a
                    href="https://medium.com/@ai.omar.rehan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 transition inline-flex items-center gap-2 break-words w-full sm:w-auto sm:justify-end sm:text-right"
                  >
                    <SiMedium />
                    medium.com/@ai.omar.rehan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="fade-in">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold">Featured Projects</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {projects.map((p: any, idx: number) => (
              <div
                key={String(p.id)}
                className="group hover-scale p-5 sm:p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl hover:border-blue-500 transition duration-300 flex flex-col w-full"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {p.image && (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 sm:h-48">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
              <div className="mb-4">
                <h3 className="text-xl font-semibold group-hover:text-blue-400 transition duration-300 break-words">
                  {p.title}
                </h3>
              </div>
                {p.description && (
                  <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                )}
                
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tags.map((tag: string, tIdx: number) => (
                      <TagBadge key={tIdx} tag={tag} variant="blue" />
                    ))}
                  </div>
                )}
                
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition duration-300 text-sm font-semibold"
                  >
                    {p.url.includes('github.com') ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0.5C5.5 0.5 0.5 5.5 0.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.3 0-1.2.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.6 5-5.1 5.3.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.5-5-11.5-12-11.5z" />
                      </svg>
                    ) : p.url.includes('huggingface') ? (
                      <span className="text-lg">🤗</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 9h4v6h-4z"/>
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                      </svg>
                    )}
                    <span>View Project</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
            <p className="text-gray-400">No projects yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section id="experience" className="fade-in">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold">Experience</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
        </div>
        
        {experiences.length > 0 ? (
          <div className="space-y-6">
            {experiences.map((exp: any, idx: number) => (
              <div
                key={String(exp.id)}
                className="p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl hover:border-green-500 transition duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white">{exp.title}</h3>
                    <p className="text-green-400 font-semibold text-lg">{exp.organization}</p>
                    {exp.location && <p className="text-gray-400 text-sm">{exp.location}</p>}
                  </div>
                  <p className="text-sm text-gray-400 whitespace-nowrap">
                    {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {' - '}
                    {exp.end_date === 'Present' ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {exp.description && (
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{exp.description}</p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {exp.highlights.map((highlight: string, hIdx: number) => (
                      <li key={hIdx} className="text-gray-400 text-sm flex items-start gap-3">
                        <span className="text-green-400 font-bold mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.tags && exp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                    {exp.tags.map((tag: string, tIdx: number) => (
                      <TagBadge key={tIdx} tag={tag} variant="gray" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
            <p className="text-gray-400">No experience yet.</p>
          </div>
        )}
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="fade-in">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold">Certifications</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded"></div>
        </div>
        
        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert: any, idx: number) => (
              <div
                key={String(cert.id)}
                className="group hover-scale p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl hover:border-yellow-500 transition duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">🏆</div>
                  <h3 className="text-lg font-semibold group-hover:text-yellow-400 transition duration-300 flex-1">
                    {cert.title}
                  </h3>
                </div>
                
                {cert.issuer && (
                  <p className="text-yellow-400 font-semibold text-sm mb-2">{cert.issuer}</p>
                )}
                {cert.description && (
                  <p className="text-gray-400 text-sm mb-4">{cert.description}</p>
                )}

                {cert.tags && cert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.tags.map((tag: string, tIdx: number) => (
                      <TagBadge key={tIdx} tag={tag} variant="yellow" />
                    ))}
                  </div>
                )}
                
                {cert.issue_date && (
                  <p className="text-gray-500 text-xs mb-3">
                    {new Date(cert.issue_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition duration-300 text-sm font-semibold"
                  >
                    View Certificate →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
            <p className="text-gray-400">No certifications yet.</p>
          </div>
        )}
      </section>

      {/* Articles Section */}
      <section id="articles" className="fade-in">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold">Published Articles</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded"></div>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any, idx: number) => (
              <div
                key={String(article.id)}
                className="group hover-scale p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl hover:border-pink-500 transition duration-300 flex flex-col"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {article.image && (
                  <div className="mb-4 rounded-lg overflow-hidden h-48">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold group-hover:text-pink-400 transition duration-300">
                    {article.title}
                  </h3>
                </div>
                
                {article.description && (
                  <p className="text-gray-400 text-sm mb-4">{article.description}</p>
                )}
                
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag: string, tIdx: number) => (
                      <TagBadge key={tIdx} tag={tag} variant="pink" />
                    ))}
                  </div>
                )}
                
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition duration-300 text-sm font-semibold mt-auto"
                  >
                    {article.url.includes('medium') ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8m4.95 0c0 2.34-1.01 4.236-2.256 4.236S9.463 10.339 9.463 8c0-2.34 1.01-4.236 2.256-4.236S13.975 5.661 13.975 8M16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795" />
                      </svg>
                    ) : null}
                    <span>Read Article</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
            <p className="text-gray-400">No articles yet. Stay tuned!</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl text-center fade-in">
        <h2 className="text-3xl font-bold mb-4">Interested in collaborating?</h2>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          I'm always open to new opportunities and interesting projects. Feel free to reach out!
        </p>
        <ScrollToContactButton />
      </section>
    </div>
  )
}
