import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import SignInButton from "./SignInButton"
import { supabase } from "../../lib/supabaseServer"
import type { Session } from "next-auth"

export default async function AdminPage() {
  const session: Session | null = await getServerSession(authOptions)

  // Check login
  if (!session?.user?.email) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-2 text-gray-600">
          This route is hidden. Sign in to continue.
        </p>
        <SignInButton />
      </section>
    )
  }

  // Check admin role
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You do not have permission to access this page.
        </p>
      </section>
    )
  }

  // Fetch data
  let projects = []
  let fullstackProjects = []
  let dataAnalyticsProjects = []
  let articles = []
  let experiences = []
  let certificates = []
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      projects = data
    }
  } catch (err) {
    console.log('Failed to fetch projects')
  }

  try {
    const { data, error } = await supabase
      .from('fullstack_projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      fullstackProjects = data
    }
  } catch (err) {
    console.log('Failed to fetch fullstack projects')
  }

  try {
    const { data, error } = await supabase
      .from('data_analytics_projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      dataAnalyticsProjects = data
    }
  } catch (err) {
    console.log('Failed to fetch data analytics projects')
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      articles = data
    }
  } catch (err) {
    console.log('Failed to fetch articles')
  }

  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
    
    if (!error && data) {
      // Sort with "Present" entries first, then by start_date descending
      experiences = data.sort((a, b) => {
        // If both are "Present" or both are not, sort by start_date
        if ((a.end_date === 'Present' && b.end_date === 'Present') || 
            (a.end_date !== 'Present' && b.end_date !== 'Present')) {
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        }
        // Otherwise, "Present" comes first
        return a.end_date === 'Present' ? -1 : 1
      })
    }
  } catch (err) {
    console.log('Failed to fetch experiences')
  }

  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false })
    
    if (!error && data) {
      certificates = data
    }
  } catch (err) {
    console.log('Failed to fetch certificates')
  }

  return (
    <section>
      <h1 className="text-3xl font-extrabold inline-block bg-neo-yellow border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Admin Dashboard</h1>
      <p className="mt-6 font-semibold text-[color:var(--neo-ink-soft)]">
        Welcome! Use the navigation above to manage your portfolio content.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="neo-card neo-interactive p-6">
          <h3 className="font-extrabold text-lg mb-2">AI Projects</h3>
          <p className="text-sm mb-4 text-[color:var(--neo-ink-soft)]">{projects.length} projects</p>
          <a href="/admin/projects" className="neo-btn neo-btn-blue text-sm py-2">Manage →</a>
        </div>
        <div className="neo-card neo-interactive p-6">
          <h3 className="font-extrabold text-lg mb-2">Full-Stack Projects</h3>
          <p className="text-sm mb-4 text-[color:var(--neo-ink-soft)]">{fullstackProjects.length} projects</p>
          <a href="/admin/fullstack-projects" className="neo-btn neo-btn-cyan text-sm py-2">Manage →</a>
        </div>
        <div className="neo-card neo-interactive p-6">
          <h3 className="font-extrabold text-lg mb-2">Data Analytics Projects</h3>
          <p className="text-sm mb-4 text-[color:var(--neo-ink-soft)]">{dataAnalyticsProjects.length} projects</p>
          <a href="/admin/data-analytics-projects" className="neo-btn neo-btn-orange text-sm py-2">Manage →</a>
        </div>
        <div className="neo-card neo-interactive p-6">
          <h3 className="font-extrabold text-lg mb-2">Experience</h3>
          <p className="text-sm mb-4 text-[color:var(--neo-ink-soft)]">{experiences.length} positions</p>
          <a href="/admin/experience" className="neo-btn neo-btn-lime text-sm py-2">Manage →</a>
        </div>
        <div className="neo-card neo-interactive p-6">
          <h3 className="font-extrabold text-lg mb-2">Articles</h3>
          <p className="text-sm mb-4 text-[color:var(--neo-ink-soft)]">{articles.length} articles</p>
          <a href="/admin/articles" className="neo-btn neo-btn-pink text-sm py-2">Manage →</a>
        </div>
        <div className="neo-card neo-interactive p-6">
          <h3 className="font-extrabold text-lg mb-2">Certificates</h3>
          <p className="text-sm mb-4 text-[color:var(--neo-ink-soft)]">{certificates.length} certificates</p>
          <a href="/admin/certificates" className="neo-btn neo-btn-yellow text-sm py-2">Manage →</a>
        </div>
      </div>
    </section>
  )
}