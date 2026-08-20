import HomeContactQR from '../components/HomeContactQR'
import HeroTitle from '../components/HeroSection'
import Typewriter from '../components/Typewriter'
import ContactCard from '../components/ContactCard'
import CardSection from '@/components/CardSection'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import CertificatesGrid from '@/components/CertificatesGrid'
import TerminalEasterEgg from '@/components/TerminalEasterEgg'
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
  
  if (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
  
  // Sort with "Present" entries first, then by start_date descending
  const sorted = (data || []).sort((a, b) => {
    // If both are "Present" or both are not, sort by start_date
    if ((a.end_date === 'Present' && b.end_date === 'Present') || 
        (a.end_date !== 'Present' && b.end_date !== 'Present')) {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    }
    // Otherwise, "Present" comes first
    return a.end_date === 'Present' ? -1 : 1
  })
  
  return sorted
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

async function getDataAnalyticsProjects() {
  try {
    const { data, error } = await supabase
      .from('data_analytics_projects')
      .select('*')
      .order('created_at', { ascending: false })

    // Table may not exist yet — fail soft (don't trigger the dev error overlay)
    if (error) return []
    return data || []
  } catch {
    return []
  }
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
  // Fetch all data from database in parallel
  const [projects, fullstackProjects, dataAnalyticsProjects, experiences, articles, certificates, siteCards] =
    await Promise.all([
      getProjects(),
      getFullstackProjects(),
      getDataAnalyticsProjects(),
      getExperiences(),
      getArticles(),
      getCertificates(),
      getSiteCards(),
    ])

  // Replace base64 images with Supabase Storage URLs so the ISR page stays
  // under Vercel's 19 MB limit — images are served directly from CDN instead.
  // Run `node scripts/migrate-base64-to-storage.mjs` once to upload any
  // existing base64 images that are still stored inline in the database.
  const replaceBase64Images = <T extends { id: number; image?: string }>(
    items: T[],
    table: string
  ): T[] =>
    items.map(item => {
      if (typeof item.image === 'string' && item.image.startsWith('data:')) {
        return { ...item, image: `/api/media/${table}/${item.id}` }
      }
      return item
    })

  const safeProjects = replaceBase64Images(projects as any[], 'projects') as typeof projects
  const safeFullstackProjects = replaceBase64Images(fullstackProjects as any[], 'fullstack_projects') as typeof fullstackProjects
  const safeDataAnalytics = replaceBase64Images(dataAnalyticsProjects as any[], 'data_analytics_projects') as typeof dataAnalyticsProjects
  const safeArticles = replaceBase64Images(articles as any[], 'articles') as typeof articles

  // Parse contact and QR card data from the database
  const contactRow = siteCards.find((c: { section: string }) => c.section === 'contact')
  const contactData = contactRow?.card_data as { links?: Array<{ label: string; href: string; icon: string; displayText: string }>; cvPath?: string } | undefined
  const contactLinks = contactData?.links
  const contactCvPath = contactData?.cvPath

  const qrRows = siteCards.filter((c: { section: string }) => c.section === 'qr')
  const qrCards = qrRows.length > 0
    ? qrRows.map((r: { card_data: Record<string, unknown> }) => {
        const card = r.card_data as { label: string; imageSrc: string; borderColor: string; textColor: string; buttonType: 'cv' | 'whatsapp'; linkUrl: string }
        // Strip base64 data URLs to prevent oversized ISR pages
        if (card.imageSrc?.startsWith('data:')) {
          card.imageSrc = card.buttonType === 'cv'
            ? '/qr_code/CV.svg'
            : '/qr_code/WhatsApp.svg'
        }
        return card
      })
    : undefined

  return (
    <div id="top" className="space-y-20">
      {/* Preload only the cards visible on first paint (3 per section). The
          remaining cards mount when "Show All" is pressed and load their own
          images then, so we no longer flood the connection up front. */}
      {safeProjects.slice(0, 3).map((p: any) =>
        p.image ? (
          <link key={`preload-p-${p.id}`} rel="preload" as="image" href={p.image} fetchPriority="high" />
        ) : null
      )}
      {safeFullstackProjects.slice(0, 3).map((p: any) =>
        p.image ? (
          <link key={`preload-fp-${p.id}`} rel="preload" as="image" href={p.image} fetchPriority="high" />
        ) : null
      )}
      {safeDataAnalytics.slice(0, 3).map((p: any) =>
        p.image ? (
          <link key={`preload-da-${p.id}`} rel="preload" as="image" href={p.image} fetchPriority="high" />
        ) : null
      )}
      {safeArticles.slice(0, 3).map((a: any) =>
        a.image ? (
          <link key={`preload-a-${a.id}`} rel="preload" as="image" href={a.image} fetchPriority="high" />
        ) : null
      )}
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
          <div className="neo-card w-full">
            <div className="relative z-10 h-full p-6 sm:p-8 md:p-10 flex flex-col">
              <HeroTitle description="I am an AI, Full-Stack, and Data Analyst professional focused on building smart, data-driven solutions. I work with machine learning, software development, and data analytics to turn data into useful insights and practical applications. I enjoy solving real-world problems and building end-to-end solutions from data processing to deployment and visualization." />
              <div className="flex flex-wrap gap-3">
                <a href="#projects" className="neo-btn neo-btn-blue min-h-[44px]" aria-label="Navigate to AI projects section">
                  AI Projects
                </a>
                <a href="#fullstack-projects" className="neo-btn neo-btn-cyan min-h-[44px]" aria-label="Navigate to full-stack projects section">
                  Full-Stack Projects
                </a>
                <a href="#data-analytics-projects" className="neo-btn neo-btn-orange min-h-[44px]" aria-label="Navigate to data analytics projects section">
                  Data Analytics
                </a>
                <a href="#experience" className="neo-btn neo-btn-lime min-h-[44px]" aria-label="Navigate to experience section">
                  See Experience
                </a>
                <a href="#articles" className="neo-btn neo-btn-pink min-h-[44px]" aria-label="Navigate to articles section">
                  Articles
                </a>
                <a href="#certifications" className="neo-btn neo-btn-yellow min-h-[44px]" aria-label="Navigate to certifications section">
                  Certifications
                </a>
              </div>
              <div className="mt-auto pt-4">
                <TerminalEasterEgg />
              </div>
            </div>
          </div>

          <ContactCard initialLinks={contactLinks} initialCvPath={contactCvPath} />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="fade-in overflow-visible" aria-label="AI projects">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-blue border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">AI Projects</h2>
          <div className="neo-rule"></div>
        </div>
        
        <CardSection
          items={safeProjects as any}
          accent="blue"
          categoryLabel="AI / ML"
          tagVariant="blue"
          hrefBase="/projects"
          initialCount={3}
          itemNoun="AI Projects"
          emptyMessage="No projects yet. Check back soon!"
        />
      </section>

      {/* Full-Stack Projects Section */}
      <section id="fullstack-projects" className="fade-in overflow-visible" aria-label="Full-Stack projects">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-cyan border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Full-Stack Projects</h2>
          <div className="neo-rule"></div>
        </div>
        
        <CardSection
          items={safeFullstackProjects as any}
          accent="cyan"
          categoryLabel="Full Stack"
          tagVariant="gray"
          hrefBase="/fullstack-projects"
          gridClassName="grid-cols-1 md:grid-cols-3"
          emptyMessage="No full-stack projects yet. Check back soon!"
        />
      </section>

      {/* Data Analytics Projects Section */}
      <section id="data-analytics-projects" className="fade-in overflow-visible" aria-label="Data Analytics projects">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-orange border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Data Analytics Projects</h2>
          <div className="neo-rule"></div>
        </div>

        <CardSection
          items={safeDataAnalytics as any}
          accent="orange"
          categoryLabel="Analytics"
          tagVariant="yellow"
          hrefBase="/data-analytics-projects"
          gridClassName="grid-cols-1 md:grid-cols-3"
          emptyMessage="No data analytics projects yet. Check back soon!"
        />
      </section>

      {/* Experience Section */}
      <section id="experience" className="fade-in" aria-label="Work experience">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-lime border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Experience</h2>
          <div className="neo-rule"></div>
        </div>
        
        <ExperienceTimeline experiences={experiences as any} />
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="fade-in overflow-visible" aria-label="Certifications and credentials">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-yellow border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Certifications</h2>
          <div className="neo-rule"></div>
        </div>
        
        <CertificatesGrid certificates={certificates as any} />
      </section>

      {/* Articles Section */}
      <section id="articles" className="fade-in overflow-visible" aria-label="Published articles and blog posts">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-pink border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Published Articles</h2>
          <div className="neo-rule"></div>
        </div>
        
        <CardSection
          items={safeArticles as any}
          accent="pink"
          categoryLabel="Article"
          tagVariant="pink"
          initialCount={3}
          itemNoun="Articles"
          emptyMessage="No articles yet. Stay tuned!"
        />
      </section>

      {/* Bottom Section Grid - Contact & QR Codes Side by Side (lazy-mounted) */}
      <HomeContactQR qrCards={qrCards as any} />
    </div>
  )
}
