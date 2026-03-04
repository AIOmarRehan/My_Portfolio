import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Omar Rehan's CV",
  description: 'Omar Rehan - CV',
}

export default function CVPage() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <iframe
        src="/cv/Omar_Rehan_CV.pdf"
        className="w-full h-full border-none"
        title="Omar Rehan's CV"
      />
    </div>
  )
}
