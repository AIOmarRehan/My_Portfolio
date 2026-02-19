export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-12 pt-16">
      {children}
    </div>
  )
}
