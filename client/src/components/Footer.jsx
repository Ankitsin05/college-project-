const nav = [
  { label: 'Home',         href: '#home'         },
  { label: 'Features',     href: '#features'     },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About Us',     href: '#about'        },
  { label: 'Tech Stack',   href: '#tech'         },
  { label: 'Feedback',     href: '#feedback'     },
  { label: 'Contact',      href: '#contact'      },
]

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-brand">🛡️ SafeYatra</div>
          <div className="footer-tagline">
            Smart Tourist Safety System for Northeast India.<br />
            MERN + AI Full Stack Project.
          </div>
        </div>

        <div className="footer-links">
          <h4>Navigate</h4>
          <ul>
            {nav.slice(0, 4).map(l => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h4>More</h4>
          <ul>
            {nav.slice(4).map(l => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub Repo</a></li>
            <li><a href="#contact">Email Us</a></li>
            <li><a href="#feedback">Leave Feedback</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2025 SafeYatra Team. All rights reserved.</div>
        <div className="footer-badges">
          <span className="badge">MERN Stack</span>
          <span className="badge">AI Powered</span>
          <span className="badge">Real-time</span>
          <span className="badge">Offline Ready</span>
        </div>
      </div>
    </footer>
  )
}