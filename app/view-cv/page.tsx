import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Omar Rehan's CV",
  description: 'Omar Rehan - CV',
}

export default function CVPage() {
  return (
    <div className="w-full min-h-[85vh] p-4" style={{ background: 'var(--neo-bg)' }}>
      <div className="neo-card w-full h-[85vh] overflow-hidden p-0">
        <iframe
          src="/cv/Omar_Rehan_CV.pdf"
          className="w-full h-full border-none"
          title="Omar Rehan's CV"
        />
      </div>
    </div>
  )
}
