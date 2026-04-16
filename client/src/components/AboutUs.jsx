const team = [
  { init: 'AS', name: 'Ankit Sinha',     role: 'Full Stack Developer', color: '#1d4ed8' },
  { init: 'AP', name: 'Ashutosh Pandey', role: 'UI & Presentation',    color: '#7c3aed' },
  { init: 'AR', name: 'Aryan Singh',     role: 'Research & Demo',      color: '#0f766e' },
  { init: 'PS', name: 'Praveen Sharma',  role: 'Docs & GitHub',        color: '#b45309' },
]

export default function AboutUs() {
  return (
    <section id="about" style={{
      background: '#0a0f1c',
      padding: '80px 5%',
      borderTop: '1px solid rgba(255,255,255,0.06)'
    }}>

      {/* Header */}
      <span style={{
        fontSize: '0.78rem', fontWeight: 600,
        color: '#60a5fa',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        display: 'block', marginBottom: '0.75rem'
      }}>About Us</span>

      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
        fontWeight: 800, color: '#ffffff',
        marginBottom: '1rem', lineHeight: 1.2
      }}>Built for Bharat's Travellers</h2>

      <p style={{
        fontSize: '1rem', color: 'rgba(255,255,255,0.55)',
        maxWidth: '560px', lineHeight: 1.7,
        marginBottom: '3rem'
      }}>
        A passionate team solving real safety problems for tourists in Northeast India.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'start'
      }} className="about-grid">

        {/* Left — Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            "SafeYatra is a full-stack MERN + AI project built by a passionate team of developers. Our mission is to make Northeast India's incredible tourist destinations accessible and safe for every traveller through smart technology.",
            "Northeast India receives millions of tourists annually — but lacks a unified digital safety infrastructure. SafeYatra bridges this gap using React.js, Node.js, MongoDB, Socket.io, Google Maps API, and AI-based anomaly detection.",
            "We believe safety should be invisible — always present, never intrusive. SafeYatra works silently in the background so tourists can focus on the experience, not the risks."
          ].map((text, i) => (
            <p key={i} style={{
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.8,
              fontSize: '0.95rem'
            }}>{text}</p>
          ))}

          {/* Stats Row */}
          <div style={{
            display: 'flex', gap: '2rem',
            marginTop: '1.5rem', flexWrap: 'wrap'
          }}>
            {[
              { num: 'MERN', label: 'Tech Stack' },
              { num: 'AI', label: 'Powered' },
              { num: '24/7', label: 'Monitoring' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1.6rem', fontWeight: 800,
                  color: '#60a5fa'
                }}>{s.num}</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: '2px'
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Team */}
        <div>
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.76rem', fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
            display: 'block'
          }}>Our Team</span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            {team.map((t, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '14px',
                  padding: '18px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transitionDelay: `${i * 0.08}s`,
                  transition: 'background 0.2s, border-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                {/* Avatar */}
                <div style={{
                  width: '46px', height: '46px',
                  borderRadius: '50%',
                  background: t.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: '0.82rem',
                  color: 'white', flexShrink: 0
                }}>{t.init}</div>

                {/* Info */}
                <div>
                  <div style={{
                    fontWeight: 600, fontSize: '0.88rem',
                    color: '#ffffff', marginBottom: '3px'
                  }}>{t.name}</div>
                  <div style={{
                    fontSize: '0.73rem',
                    color: 'rgba(255,255,255,0.4)'
                  }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Badge */}
          <div style={{
            marginTop: '1.5rem',
            background: 'rgba(96,165,250,0.08)',
            border: '1px solid rgba(96,165,250,0.2)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '2rem' }}>🏆</div>
            <div>
              <div style={{
                color: '#93c5fd', fontWeight: 700,
                fontSize: '0.88rem',
                fontFamily: "'Syne', sans-serif"
              }}>W3 Schools Full Stack Training Project</div>
              <div style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.76rem', marginTop: '3px'
              }}>Presented to CEO & Directors — April 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}