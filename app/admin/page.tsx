import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import SignInButton from "./SignInButton"
import { supabase } from "../../lib/supabaseServer"
import type { Session } from "next-auth"

export default async function AdminPage() {
  const session: Session | null = await getServerSession(authOptions)

  // Not signed in
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

  // Not admin
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

  // Admin access
  let projects = []
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
      .order('start_date', { ascending: false })
    
    if (!error && data) {
      experiences = data
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
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-4 text-gray-400">
        Welcome! Use the navigation above to manage your portfolio content.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <h3 className="font-semibold text-lg mb-2 text-white">Projects</h3>
          <p className="text-gray-400 text-sm mb-4">{projects.length} projects</p>
          <a href="/admin/projects" className="text-blue-400 hover:text-blue-300">
            Manage →
          </a>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <h3 className="font-semibold text-lg mb-2 text-white">Experience</h3>
          <p className="text-gray-400 text-sm mb-4">{experiences.length} positions</p>
          <a href="/admin/experience" className="text-green-400 hover:text-green-300">
            Manage →
          </a>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <h3 className="font-semibold text-lg mb-2 text-white">Articles</h3>
          <p className="text-gray-400 text-sm mb-4">{articles.length} articles</p>
          <a href="/admin/articles" className="text-pink-400 hover:text-pink-300">
            Manage →
          </a>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <h3 className="font-semibold text-lg mb-2 text-white">Certificates</h3>
          <p className="text-gray-400 text-sm mb-4">{certificates.length} certificates</p>
          <a href="/admin/certificates" className="text-yellow-400 hover:text-yellow-300">
            Manage →
          </a>
        </div>
      </div>
    </section>
  )
}