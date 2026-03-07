'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SiHuggingface } from 'react-icons/si'
import LazyVideo from '@/components/LazyVideo'
import TagBadge from '@/components/TagBadge'
import Link from 'next/link'

interface IProject {
  id: number
  title: string
  description?: string
  github_url?: string
  huggingface_url?: string
  tags?: string[]
  image?: string
  demo_video?: string
  created_at?: string
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<IProject | null>(null)
  const [allProjects, setAllProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
    fetchAllProjects()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const res = await fetch('/api/projects')
      const projects = await res.json()
      const found = projects.find((p: IProject) => p.id === parseInt(projectId))
      if (found) {
        setProject(found)
      }
    } catch (err) {
      console.error('Failed to fetch project', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const projects = await res.json()
      setAllProjects(projects)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    }
  }

  const otherProjects = allProjects.filter(p => p.id !== parseInt(projectId))

  const scroll = (direction: 'left' | 'right') => {
    const carousel = document.getElementById('carousel')
    if (carousel) {
      const scrollAmount = 400
      const currentPosition = carousel.scrollLeft
      const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
      const targetPosition = direction === 'left'
        ? currentPosition - scrollAmount
        : currentPosition + scrollAmount
      const newPosition = Math.min(maxScrollLeft, Math.max(0, targetPosition))

      carousel.scrollTo({ left: newPosition, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Project Not Found</h1>
          <Link href="/#projects" className="text-blue-400 hover:text-blue-300 underline">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/#projects"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-6"
          >
            ← Back to Projects
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          
          {project.description && (
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* External Links */}
          {(project.github_url || project.huggingface_url) && (
            <div className="flex flex-wrap gap-4 mb-8">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0.5C5.5 0.5 0.5 5.5 0.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.3 0-1.2.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.6 5-5.1 5.3.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.5-5-11.5-12-11.5z" />
                  </svg>
                  <span className="font-semibold">View Repository</span>
                </a>
              )}
              {project.huggingface_url && (
                <a
                  href={project.huggingface_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700 rounded-lg transition"
                >
                  <SiHuggingface className="w-5 h-5" />
                  <span className="font-semibold">View Live Demo</span>
                </a>
              )}
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-700">
              {project.tags.map((tag: string, idx: number) => (
                <TagBadge key={idx} tag={tag} variant="blue" />
              ))}
            </div>
          )}
        </div>

        {/* Demo Video Section */}
        {project.demo_video && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Demo Video</h2>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <LazyVideo
                src={project.demo_video}
                alt={`${project.title} demo video`}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Project Image */}
        {project.image && !project.demo_video && (
          <div className="mb-16">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}

        {/* Related Projects Carousel */}
        {otherProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-700">
            <h2 className="text-2xl font-bold mb-8">More Projects</h2>
            
            <div className="relative group">
              {/* Carousel */}
              <div
                id="carousel"
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
              >
                {otherProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex-shrink-0 w-80 group/card"
                  >
                    <div className="rounded-lg overflow-hidden bg-gray-800 group-hover/card:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer group-hover/card:border-blue-500 border border-gray-700">
                      {/* Image with optional play overlay */}
                      {p.image || p.demo_video ? (
                        <div className="h-48 overflow-hidden bg-gray-700 relative">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                          />
                          {/* Play Icon Overlay for Videos */}
                          {p.demo_video && (
                            <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/50 flex items-center justify-center transition-colors duration-300">
                              <svg 
                                className="w-12 h-12 text-white/80 group-hover/card:text-white transition-colors duration-300" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover/card:shadow-lg transition-all duration-300">
                          <span className="text-gray-200 text-center px-4">{p.title}</span>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg leading-snug whitespace-normal break-words text-white group-hover/card:text-blue-400 transition-colors duration-300 mb-2">
                            {p.title}
                          </h3>
                          {p.description && (
                            <p className="text-sm text-gray-400 group-hover/card:text-gray-300 line-clamp-2 transition-colors duration-300">
                              {p.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Tags */}
                        {p.tags && p.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {p.tags.slice(0, 2).map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded group-hover/card:bg-gray-600 transition-colors duration-300"
                              >
                                {tag}
                              </span>
                            ))}
                            {p.tags.length > 2 && (
                              <span className="text-xs px-2 py-1 text-gray-400 group-hover/card:text-gray-300 transition-colors duration-300">
                                +{p.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Carousel Controls */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-blue-600 hover:bg-blue-700 rounded-full p-3 opacity-0 group-hover:opacity-100 transition z-10"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-blue-600 hover:bg-blue-700 rounded-full p-3 opacity-0 group-hover:opacity-100 transition z-10"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
