import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { SiKaggle, SiMedium, SiHuggingface } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-300 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <p className="text-sm leading-relaxed">
              AI Engineer focused on building intelligent machine learning and deep learning solutions for real-world problems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#projects" className="hover:text-blue-400 transition duration-300">
                  Projects
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-blue-400 transition duration-300">
                  Experience
                </a>
              </li>
              <li>
                <a href="#certifications" className="hover:text-blue-400 transition duration-300">
                  Certifications
                </a>
              </li>
              <li>
                <a href="#articles" className="hover:text-blue-400 transition duration-300">
                  Articles
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://github.com/AIOmarRehan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                title="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://kaggle.com/aiomarrehan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                title="Kaggle"
              >
                <SiKaggle className="w-5 h-5" />
              </a>
              <a
                href="https://medium.com/@ai.omar.rehan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                title="Medium"
              >
                <SiMedium className="w-5 h-5" />
              </a>
              <a
                href="https://huggingface.co/AIOmarRehan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                title="HuggingFace"
              >
                <SiHuggingface className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/omar-rehan-47b98636a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                title="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:ai.omar.rehan@gmail.com"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                title="Email"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
              <a
                href="tel:+971509669311"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                title="Phone"
              >
                <FaPhoneAlt className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2026 Omar Rehan. All Rights Reserved. Designed & Developed by Omar Rehan.
          </p>
        </div>
      </div>
    </footer>
  )
}
