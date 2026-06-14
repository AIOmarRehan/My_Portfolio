import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="neo-card neo-card-alt px-8 sm:px-16 py-12 -rotate-1">
        <h1 className="text-[7rem] sm:text-[10rem] font-extrabold leading-none mb-2 bg-neo-pink inline-block px-6 border-neo border-neo-border shadow-neo-lg">
          404
        </h1>
        <p className="text-xl sm:text-2xl font-extrabold mt-8 mb-10 uppercase tracking-wide">
          Oops… Page not found
        </p>
        <Link href="/" className="neo-btn neo-btn-yellow px-8 py-3.5 uppercase tracking-wide">
          Back to Home
        </Link>
      </div>
    </section>
  )
}
