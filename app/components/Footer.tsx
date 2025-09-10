export default function Footer() {
    return (
      <footer className="w-full bg-white">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-start">
          {/* Social Column */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/heartlandcommunitynetwork"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                {/* LinkedIn Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.82v2.11h.05c.53-1.01 1.84-2.11 3.78-2.11C20.45 8.5 22 11.02 22 15v9h-4v-8.1c0-1.94-.7-3.27-2.48-3.27-1.36 0-2.17.91-2.53 1.79-.13.31-.16.75-.16 1.18V24h-4s.05-13 0-15.5z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                {/* Facebook Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 3h-2.4v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.heartlandnet.com/"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                {/* Globe Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>
              </a>
            </div>
          </div>
  
          {/* Page Links Column */}
          <div className="flex flex-col space-y-2 text-gray-600 text-right">
            <a href="/sector-1" className="hover:text-blue-600">
            sector-1
            </a>
            <a href="/sector-2" className="hover:text-blue-600">
            sector-2
            </a>
            <a href="/sector-3" className="hover:text-blue-600">
            sector-3
            </a>
            <a href="/sector-4" className="hover:text-blue-600">
            sector-4
            </a>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="w-full bg-blue-50 py-6 flex flex-col items-center text-center">
          <span className="text-blue-600 font-bold">hcn dl</span>
          <p className="text-sm text-gray-500 mt-1">
            © 2025 Heartland Community Network. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  
  