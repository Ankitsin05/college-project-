const features = [
  {
    icon: '🪪',
    bg: '#eff6ff',
    title: 'Digital Tourist ID',
    desc: 'Every tourist gets a unique QR-based digital identity on registration. Instantly verifiable by authorities at any checkpoint — no paperwork needed.',
  },
  {
    icon: '📍',
    bg: '#fef2f2',
    title: 'Geo-Fencing Alerts',
    desc: 'Predefined danger zones on the map. The moment a tourist enters a restricted or unsafe area, instant alerts are fired to both the tourist and authorities.',
  },
  {
    icon: '🤖',
    bg: '#f0fdf4',
    title: 'AI Pattern Detection',
    desc: 'Smart JS-based anomaly detection monitors tourist movement patterns. Unusual behaviour — like staying in one place too long — triggers proactive alerts.',
  },
  {
    icon: '🖥️',
    bg: '#fffbeb',
    title: 'Authority Dashboard',
    desc: 'Police and emergency teams get a live map dashboard showing all registered tourists, their status, alerts, and incident history in real time via Socket.io.',
  },
  {
    icon: '🆘',
    bg: '#fdf4ff',
    title: 'One-Tap SOS',
    desc: 'In any emergency, tourists press SOS — their live location is instantly broadcast to nearby authorities and emergency contacts.',
  },
  {
    icon: '🏥',
    bg: '#ecfdf5',
    title: 'Emergency Route Pre-Clear',
    desc: 'Registered hospitals and emergency zones are mapped. In critical incidents, the fastest route to help is pre-identified and highlighted instantly.',
  },
  {
    icon: '📴',
    bg: '#fff7ed',
    title: 'Offline Mode',
    desc: 'No internet? No problem. The app uses last known cached data so tourists always have access to emergency contacts and their Digital ID.',
  },
  {
    icon: '🔒',
    bg: '#f0f9ff',
    title: 'Secure Authentication',
    desc: 'JWT-based secure login and registration with gender-inclusive profile setup. Tourist data is encrypted and protected at every layer.',
  },
]

export default function Features() {
  return (
    <section id="features">
      <span className="section-label">Core Features</span>
      <div className="section-title">Everything Tourists Need to Stay Safe</div>
      <p className="section-sub">
        A complete safety ecosystem — from digital identity to real-time emergency response, all in one platform.
      </p>

      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card fade-up" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}