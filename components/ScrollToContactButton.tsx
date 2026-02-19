'use client'

export default function ScrollToContactButton() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    const contactCard = document.getElementById('contact-card')
    if (contactCard) {
      // Scroll to the card
      contactCard.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      
      // Add highlight animation
      contactCard.classList.add('highlight-pulse')
      
      // Remove animation after it completes
      setTimeout(() => {
        contactCard.classList.remove('highlight-pulse')
      }, 2000)
    }
  }

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
    >
      Get in Touch →
    </a>
  )
}
