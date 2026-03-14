import TagBadge from '../components/TagBadge'
import ContactForm from '../components/ContactForm'
import ScrollToContactButton from '../components/ScrollToContactButton'
import LazyVideo from '../components/LazyVideo'
import HeroTitle from '../components/HeroSection'
import Typewriter from '../components/Typewriter'
import ContactCard from '../components/ContactCard'
import QRSection from '../components/QRSection'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { SiHuggingface } from 'react-icons/si'
import { supabase } from '@/lib/supabaseServer'

// Revalidate page every hour
export const revalidate = 3600

// Fetch data from Supabase
async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data || []
}

async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
  return data || []
}

async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }
  return data || []
}

async function getCertificates() {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('issue_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching certificates:', error)
    return []
  }
  return data || []
}

async function getFullstackProjects() {
  const { data, error } = await supabase
    .from('fullstack_projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching fullstack projects:', error)
    return []
  }
  return data || []
}

async function getSiteCards() {
  const { data, error } = await supabase
    .from('site_cards')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching site cards:', error)
    return []
  }
  return data || []
}

// Mock data removed - now using real DB queries
const mockProjects = [
  {
    id: 1,
    title: "AI-Powered Sentiment Analysis",
    description: "Deep learning model for real-time sentiment analysis using BERT transformers",
    image: "https://via.placeholder.com/400x300?text=Sentiment+Analysis",
    demo_video: null,
    url: "https://github.com/AIOmarRehan/sentiment-analysis",
    tags: ["PyTorch", "BERT", "NLP", "Deep Learning"],
    created_at: "2025-12-01"
  },
  {
    id: 2,
    title: "Computer Vision Object Detection",
    description: "Custom YOLOv8 model for multi-class object detection with real-time inference",
    image: "https://via.placeholder.com/400x300?text=Object+Detection",
    demo_video: null,
    url: "https://github.com/AIOmarRehan/object-detection",
    tags: ["YOLOv8", "OpenCV", "Python", "Computer Vision"],
    created_at: "2025-11-15"
  },
  {
    id: 3,
    title: "Full-Stack Chat Application",
    description: "Real-time chat app with WebSocket integration, MongoDB backend, and React frontend",
    image: "https://via.placeholder.com/400x300?text=Chat+App",
    demo_video: null,
    url: "https://github.com/AIOmarRehan/chat-app",
    tags: ["React", "Node.js", "MongoDB", "WebSocket"],
    created_at: "2025-10-20"
  },
  {
    id: 4,
    title: "Time Series Forecasting Model",
    description: "LSTM neural network for stock price prediction with 94% accuracy",
    image: "https://via.placeholder.com/400x300?text=Time+Series",
    demo_video: null,
    url: "https://huggingface.co/AIOmarRehan/time-series",
    tags: ["LSTM", "TensorFlow", "Time Series", "Forecasting"],
    created_at: "2025-09-10"
  },
  {
    id: 5,
    title: "Generative AI Image Editor",
    description: "AI-powered image manipulation tool using Stable Diffusion with inpainting",
    image: "https://via.placeholder.com/400x300?text=Image+Editor",
    demo_video: null,
    url: "https://github.com/AIOmarRehan/image-editor",
    tags: ["Stable Diffusion", "Python", "FastAPI", "AI/ML"],
    created_at: "2025-08-05"
  },
  {
    id: 6,
    title: "Recommendation Engine",
    description: "Collaborative filtering recommendation system serving 100K+ users",
    image: "https://via.placeholder.com/400x300?text=Recommendation",
    demo_video: null,
    url: "https://github.com/AIOmarRehan/rec-engine",
    tags: ["Recommendation Systems", "Scikit-learn", "Python", "ML"],
    created_at: "2025-07-15"
  }
]

const mockExperiences = [
  {
    id: 1,
    title: "AI/ML Engineer",
    organization: "Tech Innovations Ltd",
    location: "Ajman, UAE",
    start_date: "2024-06-01",
    end_date: "Present",
    description: "Leading AI/ML initiatives for enterprise automation and data pipeline optimization",
    highlights: [
      "Developed and deployed 5+ machine learning models in production",
      "Optimized data pipelines reducing processing time by 60%",
      "Led a team of 3 junior engineers on computer vision projects",
      "Implemented real-time inference system handling 10K+ requests/sec"
    ],
    tags: ["Python", "TensorFlow", "PyTorch", "AWS", "Kubernetes"]
  },
  {
    id: 2,
    title: "Full-Stack Developer",
    organization: "Digital Solutions Corp",
    location: "Dubai, UAE",
    start_date: "2023-03-15",
    end_date: "2024-05-30",
    description: "Built scalable web applications and microservices for 50+ enterprise clients",
    highlights: [
      "Developed 15+ full-stack applications using Next.js and Node.js",
      "Improved application performance by 45% through optimization",
      "Implemented CI/CD pipelines reducing deployment time by 80%",
      "Designed and maintained MongoDB database schemas"
    ],
    tags: ["Next.js", "Node.js", "React", "MongoDB", "Docker"]
  },
  {
    id: 3,
    title: "Junior Data Scientist",
    organization: "Analytics Hub",
    location: "Abu Dhabi, UAE",
    start_date: "2022-01-10",
    end_date: "2023-03-10",
    description: "Conducted statistical analysis and built predictive models for business insights",
    highlights: [
      "Created 20+ analytical reports for C-level decision making",
      "Built predictive models achieving 92% accuracy on test set",
      "Automated data collection reducing manual work by 70%",
      "Trained stakeholders on data literacy and analytics best practices"
    ],
    tags: ["Python", "SQL", "Pandas", "Scikit-learn", "Tableau"]
  }
]

const mockArticles = [
  {
    id: 1,
    title: "Getting Started with Transformer Models",
    description: "A comprehensive guide to understanding BERT and GPT architectures",
    image: "https://via.placeholder.com/400x300?text=Transformers",
    url: "https://medium.com/@ai.omar.rehan/transformers",
    tags: ["NLP", "Transformers", "Deep Learning", "Tutorial"]
  },
  {
    id: 2,
    title: "Deep Learning for Computer Vision",
    description: "Practical approaches to CNN architectures and their real-world applications",
    image: "https://via.placeholder.com/400x300?text=Computer+Vision",
    url: "https://medium.com/@ai.omar.rehan/computer-vision",
    tags: ["Computer Vision", "CNN", "Deep Learning", "PyTorch"]
  },
  {
    id: 3,
    title: "Production ML: From Training to Deployment",
    description: "Best practices for deploying machine learning models at scale",
    image: "https://via.placeholder.com/400x300?text=Production+ML",
    url: "https://medium.com/@ai.omar.rehan/production-ml",
    tags: ["MLOps", "Deployment", "Cloud", "Best Practices"]
  }
]

const mockCertificates = [
  {
    id: 1,
    title: "Deep Learning Specialization",
    issuer: "Coursera (Andrew Ng)",
    issue_date: "2025-06-15",
    description: "5-course specialization in neural networks and deep learning",
    credential_url: "https://coursera.org/verify/specialization/deep-learning",
    tags: ["Deep Learning", "Neural Networks", "TensorFlow"]
  },
  {
    id: 2,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issue_date: "2025-05-20",
    description: "Professional certification for AWS cloud architecture design",
    credential_url: "https://aws.amazon.com/certification/certified-solutions-architect",
    tags: ["AWS", "Cloud", "Architecture"]
  },
  {
    id: 3,
    title: "Google Cloud Professional Data Engineer",
    issuer: "Google Cloud",
    issue_date: "2025-03-10",
    description: "Professional certification in Google Cloud data engineering",
    credential_url: "https://cloud.google.com/certification/data-engineer",
    tags: ["GCP", "Data Engineering", "BigQuery"]
  }
]

export default async function Home() {
  // Fetch all data from database
  const projects = await getProjects()
  const fullstackProjects = await getFullstackProjects()
  const experiences = await getExperiences()
  const articles = await getArticles()
  const certificates = await getCertificates()
  const siteCards = await getSiteCards()

  // Parse contact and QR card data from the database
  const contactRow = siteCards.find((c: { section: string }) => c.section === 'contact')
  const contactData = contactRow?.card_data as { links?: Array<{ label: string; href: string; icon: string; displayText: string }>; cvPath?: string } | undefined
  const contactLinks = contactData?.links
  const contactCvPath = contactData?.cvPath

  const qrRows = siteCards.filter((c: { section: string }) => c.section === 'qr')
  const qrCards = qrRows.length > 0
    ? qrRows.map((r: { card_data: Record<string, unknown> }) => r.card_data as { label: string; imageSrc: string; borderColor: string; textColor: string; buttonType: 'cv' | 'whatsapp'; linkUrl: string })
    : undefined

  return (
    <div id="top" className="space-y-20">
      {/* Hero Section */}
      <section id="hero" className="py-20 fade-in overflow-visible" aria-label="Welcome section">
        <Typewriter 
          sentences={[
            "Hello, I'm Omar Rehan.",
            "AI & Full Stack Engineer.",
            "Machine Learning & Deep Learning Specialist.",
            "I build intelligent systems.",
            "From models to production.",
            "Engineering real-world AI solutions."
          ]}
          typingSpeed={80}
          deletingSpeed={40}
          pauseDuration={2500}
        />
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 items-stretch w-full overflow-visible">
          <div className="animated-border-card hero-theme-card w-full">
            <div className="hero-theme-card-content relative z-10 h-full rounded-2xl bg-gray-900/70 light:bg-white/90 p-6 sm:p-8 md:p-10 backdrop-blur flex flex-col">
              <HeroTitle description="I'm an AI and Full-Stack Engineer focused on building intelligent systems using machine learning and deep learning. I specialize in developing end-to-end AI solutions, from data preprocessing to model optimization and deployment, and I'm passionate about solving real-world problems with data-driven approaches." />
              <div className="flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="px-6 py-3 min-h-[44px] bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center"
                  aria-label="Navigate to AI projects section"
                >
                  AI Projects
                </a>
                <a
                  href="#fullstack-projects"
                  className="px-6 py-3 min-h-[44px] bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 flex items-center justify-center"
                  aria-label="Navigate to full-stack projects section"
                >
                  Full-Stack Projects
                </a>
                <a
                  href="#experience"
                  className="px-6 py-3 min-h-[44px] bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 flex items-center justify-center"
                  aria-label="Navigate to experience section"
                >
                  See Experience
                </a>
                <a
                  href="#articles"
                  className="px-6 py-3 min-h-[44px] bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 flex items-center justify-center"
                  aria-label="Navigate to articles section"
                >
                  Articles
                </a>
                <a
                  href="#certifications"
                  className="px-6 py-3 min-h-[44px] bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-300 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 flex items-center justify-center"
                  aria-label="Navigate to certifications section"
                >
                  Certifications
                </a>
              </div>
            </div>
          </div>

          <ContactCard initialLinks={contactLinks} initialCvPath={contactCvPath} />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="fade-in overflow-visible" aria-label="AI projects">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold text-white light:text-gray-900">AI Projects</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full overflow-visible" role="list">
            {projects.map((p: any, idx: number) => (
              <div
                key={String(p.id)}
                className="group hover-scale p-5 sm:p-6 bg-gray-800/50 light:bg-white/90 backdrop-blur border border-gray-700 light:border-gray-300 rounded-xl hover:border-blue-500 transition duration-300 flex flex-col w-full"
                role="listitem"
              >
                {/* Project Image - No autoplay */}
                {p.image ? (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 sm:h-48 bg-gray-700 flex items-center justify-center">
                    <img src={p.image} alt={`Screenshot of ${p.title} project`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  </div>
                ) : p.demo_video ? (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 sm:h-48 bg-gray-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                ) : (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 sm:h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-center px-4 font-semibold">{p.title}</span>
                  </div>
                )}
                
              <div className="mb-4">
                <h3 className="text-xl font-semibold group-hover:text-blue-400 transition duration-300 break-words" id={`project-${p.id}`}>
                  {p.title}
                </h3>
              </div>
                {p.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                )}
                
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tags.map((tag: string, tIdx: number) => (
                      <TagBadge key={tIdx} tag={tag} variant="blue" />
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3 mt-auto">
                  {/* Details Link */}
                  <a
                    href={`/projects/${p.id}`}
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition duration-300 text-sm font-semibold hover:underline"
                  >
                    <span>Details →</span>
                  </a>
                  
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition duration-300 text-sm font-semibold"
                      aria-label={`View ${p.title} repository`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0.5C5.5 0.5 0.5 5.5 0.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.3 0-1.2.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.6 5-5.1 5.3.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.5-5-11.5-12-11.5z" />
                      </svg>
                      <span>Repo</span>
                    </a>
                  )}
                  {p.huggingface_url && (
                    <a
                      href={p.huggingface_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition duration-300 text-sm font-semibold"
                      aria-label={`View ${p.title} live project`}
                    >
                      <SiHuggingface className="w-4 h-4" />
                      <span>Live Project</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
            <p className="text-gray-400">No projects yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Full-Stack Projects Section */}
      <section id="fullstack-projects" className="fade-in overflow-visible" aria-label="Full-Stack projects">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold text-white light:text-gray-900">Full-Stack Projects</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-cyan-500 to-teal-600 rounded"></div>
        </div>
        
        {fullstackProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full overflow-visible" role="list">
            {fullstackProjects.map((p: any, idx: number) => (
              <div
                key={String(p.id)}
                className="group hover-scale p-5 sm:p-6 bg-gray-800/50 light:bg-white/90 backdrop-blur border border-gray-700 light:border-gray-300 rounded-xl hover:border-cyan-500 transition duration-300 flex flex-col w-full"
                role="listitem"
              >
                {/* Project Image */}
                {p.image ? (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 sm:h-48 bg-gray-700 flex items-center justify-center">
                    <img src={p.image} alt={`Screenshot of ${p.title} project`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  </div>
                ) : p.demo_video ? (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 sm:h-48 bg-gray-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                ) : (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 sm:h-48 bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center">
                    <span className="text-white text-center px-4 font-semibold">{p.title}</span>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition duration-300 break-words">
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
                
                <div className="flex flex-wrap gap-3 mt-auto">
                  {/* Details Link */}
                  <a
                    href={`/fullstack-projects/${p.id}`}
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition duration-300 text-sm font-semibold hover:underline"
                  >
                    <span>Details →</span>
                  </a>
                  
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition duration-300 text-sm font-semibold"
                      aria-label={`View ${p.title} repository on GitHub`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                      <span>Repo</span>
                    </a>
                  )}
                  {p.live_project_link && (
                    <a
                      href={p.live_project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition duration-300 text-sm font-semibold"
                      aria-label={`View ${p.title} live`}
                    >
                      <FaExternalLinkAlt className="w-3.5 h-3.5" />
                      <span>Live Project</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
            <p className="text-gray-400">No full-stack projects yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section id="experience" className="fade-in" aria-label="Work experience">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold">Experience</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
        </div>
        
        {experiences.length > 0 ? (
          <div className="space-y-6" role="list">
            {experiences.map((exp: any, idx: number) => (
              <div
                key={String(exp.id)}
                className="p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl hover:border-green-500 transition duration-300"
                role="listitem"
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
                        <span className="text-green-400 font-bold mt-0.5">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.tags && exp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                    {exp.tags.map((tag: string, tIdx: number) => (
                      <TagBadge key={tIdx} tag={tag} variant="green" />
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
      <section id="certifications" className="fade-in overflow-visible" aria-label="Certifications and credentials">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold">Certifications</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded"></div>
        </div>
        
        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible" role="list">
            {certificates.map((cert: any, idx: number) => (
              <div
                key={String(cert.id)}
                className="group hover-scale p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl hover:border-yellow-500 transition duration-300"
                role="listitem"
              >
                <div className="flex items-start gap-3 mb-3">
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
                    aria-label={`View ${cert.title} certification credential`}
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
      <section id="articles" className="fade-in overflow-visible" aria-label="Published articles and blog posts">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold">Published Articles</h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded"></div>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible" role="list">
            {articles.map((article: any, idx: number) => (
              <div
                key={String(article.id)}
                className="group hover-scale p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl hover:border-pink-500 transition duration-300 flex flex-col"
                role="listitem"
              >
                {article.image && (
                  <div className="mb-4 rounded-lg overflow-hidden h-48">
                    <img src={article.image} alt={`Featured image for ${article.title} article`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
                    aria-label={`Read ${article.title} article`}
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

      {/* Bottom Section Grid - Contact & QR Codes Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CTA Section - Left */}
        <section className="py-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl fade-in" aria-label="Contact form section">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Interested in collaborating?</h2>
            <p className="text-gray-400 mb-2 max-w-xl mx-auto">
              I'm always open to new opportunities and interesting projects.
            </p>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Feel free to reach out!
            </p>
            <div className="mb-8">
              <ScrollToContactButton />
            </div>
          </div>
          <ContactForm />
        </section>

        {/* QR Section - Right */}
        <QRSection initialCards={qrCards} />
      </div>
    </div>
  )
}
