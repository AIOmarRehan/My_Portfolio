'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { SiTableau } from 'react-icons/si'
import SvgIcon from '@/components/icons/SvgIcon'
import LazyVideo from '@/components/LazyVideo'
import TagBadge from '@/components/TagBadge'
import ProjectCarousel, { type CarouselItem } from '@/components/ProjectCarousel'
import NeoLoader from '@/components/NeoLoader'
import Link from 'next/link'

interface IProject {
  id: number
  title: string
  description?: string
  github_url?: string
  tableau_url?: string
  powerbi_url?: string
  tags?: string[]
  image?: string
  demo_video?: string
}

export default function DataAnalyticsDetailsPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<IProject | null>(null)
  const [allProjects, setAllProjects] = useState<IProject[]>([])
  const [aiProjects, setAiProjects] = useState<CarouselItem[]>([])
  const [fullstackProjects, setFullstackProjects] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const [daRes, aiRes, fsRes] = await Promise.all([
          fetch('/api/data-analytics-projects'),
          fetch('/api/projects'),
          fetch('/api/fullstack-projects'),
        ])
        const data: IProject[] = await daRes.json()
        const aiData: CarouselItem[] = await aiRes.json()
        const fsData: CarouselItem[] = await fsRes.json()
        if (!active) return
        setProject(data.find((p) => p.id === parseInt(projectId)) || null)
        setAllProjects(data)
        setAiProjects(aiData)
        setFullstackProjects(fsData)
        window.scrollTo(0, 0)
      } catch (err) {
        console.error('Failed to fetch project data', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [projectId])

  const others = useMemo(
    () => allProjects.filter((p) => p.id !== parseInt(projectId)),
    [allProjects, projectId]
  )

  if (loading) {
    return <NeoLoader />
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="neo-card neo-card-alt text-center px-10 py-12 -rotate-1">
          <h1 className="text-3xl font-extrabold mb-6">Project Not Found</h1>
          <Link href="/" className="neo-btn neo-btn-orange">Back to Home Page</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pb-12 overflow-x-clip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        <div className="mb-12">
          <Link href="/" className="neo-btn neo-btn-orange mb-6 text-sm">← Back to Home Page</Link>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 break-words mt-6">{project.title}</h1>

          {project.description && (
            <p className="text-lg mb-8 leading-relaxed text-[color:var(--neo-ink-soft)] font-medium">{project.description}</p>
          )}

          {(project.github_url || project.tableau_url || project.powerbi_url) && (
            <div className="flex flex-wrap gap-4 mb-8">
              {project.tableau_url && (
                <a href={project.tableau_url} target="_blank" rel="noopener noreferrer" className="neo-btn neo-btn-orange">
                  <SiTableau className="w-5 h-5" />
                  <span>View Dashboard</span>
                </a>
              )}
              {project.powerbi_url && (
                <a href={project.powerbi_url} target="_blank" rel="noopener noreferrer" className="neo-btn" style={{ background: 'linear-gradient(135deg, #F2C811, #E6AD10, #C97D0E)', color: '#000' }}>
                  <SvgIcon name="powerbi" className="w-5 h-5" />
                  <span>View Report</span>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="neo-btn neo-btn-ink">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0.5C5.5 0.5 0.5 5.5 0.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.3 0-1.2.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.6 5-5.1 5.3.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.5-5-11.5-12-11.5z" /></svg>
                  <span>View Repository</span>
                </a>
              )}
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6" style={{ borderTop: 'var(--neo-bw) solid var(--neo-border)' }}>
              {project.tags.map((tag, idx) => (
                <TagBadge key={idx} tag={tag} variant="yellow" />
              ))}
            </div>
          )}
        </div>

        {project.demo_video && (
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold mb-6 inline-block bg-neo-orange border-neo border-neo-border px-3 py-1.5 shadow-neo-sm -rotate-1">Demo Video</h2>
            <div className="neo-card overflow-hidden p-0">
              <LazyVideo src={project.demo_video} alt={`${project.title} demo video`} className="w-full h-auto" />
            </div>
          </div>
        )}

        {project.image && !project.demo_video && (
          <div className="mb-16 neo-card overflow-hidden p-0">
            <img src={project.image} alt={project.title} className="w-full h-auto object-cover" decoding="async" fetchPriority="high" />
          </div>
        )}

        <ProjectCarousel title="More Data Analytics Projects" items={others as CarouselItem[]} hrefBase="/data-analytics-projects" accent="orange" />
        <ProjectCarousel title="AI Projects" items={aiProjects} hrefBase="/projects" accent="blue" />
        <ProjectCarousel title="Full-Stack Projects" items={fullstackProjects} hrefBase="/fullstack-projects" accent="cyan" />
      </div>
    </main>
  )
}
