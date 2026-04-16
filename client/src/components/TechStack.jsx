const stack = [
  { icon: '⚛️',  name: 'React.js',     type: 'Frontend'             },
  { icon: '🟩',  name: 'Node.js',      type: 'Runtime'              },
  { icon: '🚂',  name: 'Express.js',   type: 'Backend Framework'    },
  { icon: '🍃',  name: 'MongoDB',      type: 'Database'             },
  { icon: '🔌',  name: 'Socket.io',    type: 'Real-time'            },
  { icon: '🗺️', name: 'Google Maps',  type: 'Maps & Geo-Fencing'   },
  { icon: '🔑',  name: 'JWT + QR',     type: 'Auth & Digital ID'    },
  { icon: '🤖',  name: 'AI Logic',     type: 'JS Anomaly Detection' },
]

export default function TechStack() {
  return (
    <section id="tech">
      <span className="section-label">Technology</span>
      <div className="section-title">Built With Modern Tech</div>
      <p className="section-sub">
        A powerful MERN stack application enhanced with real-time capabilities,
        intelligent AI logic, and offline-first design.
      </p>

      <div className="tech-grid">
        {stack.map((t, i) => (
          <div className="tech-card fade-up" key={i} style={{ transitionDelay: `${i * 0.06}s` }}>
            <div className="tech-icon">{t.icon}</div>
            <div className="tech-name">{t.name}</div>
            <div className="tech-type">{t.type}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
