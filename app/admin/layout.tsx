export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="neo-admin max-w-6xl mx-auto px-6 pb-12 pt-20">
      {children}
    </div>
  )
}
