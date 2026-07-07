const steps = [
  { num: '01', icon: '📝', title: 'Register & Get Digital ID', desc: 'Tourist registers and instantly receives a unique QR-based Digital ID — verifiable by any authority anywhere.', color: '#3b82f6' },
  { num: '02', icon: '📍', title: 'Enable Live Tracking', desc: 'With one tap, location sharing starts. The system monitors movement and zone boundaries in real time.', color: '#22c55e' },
  { num: '03', icon: '🤖', title: 'AI Monitors in Background', desc: 'Smart JS-based AI watches for anomalies — unusual stops, restricted zones, suspicious patterns.', color: '#a855f7' },
  { num: '04', icon: '🚨', title: 'Alert or SOS Triggered', desc: 'Danger detected or SOS pressed — instant alerts fire to authorities with live location and tourist details.', color: '#ef4444' },
  { num: '05', icon: '👮', title: 'Authority Responds', desc: 'Police dashboard shows the incident live. Response team dispatched, tourist contacted immediately.', color: '#f59e0b' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      background: '#050b15',
      padding: '100px 6%',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{
          fontSize: '0.75rem', fontWeight: 700,
          color: '#a78bfa', textTransform: 'uppercase',
          letterSpacing: '0.15em', display: 'block', marginBottom: '1rem'
        }}>How It Works</span>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800, color: 'white',
          marginBottom: '1rem', lineHeight: 1.15
        }}>Simple. Fast.<br/>Life-Saving.</h2>
        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '1rem', maxWidth: '480px',
          margin: '0 auto', lineHeight: 1.7
        }}>From registration to emergency response — the entire SafeYatra flow in 5 steps.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem', position: 'relative'
      }}>
        {steps.map((s, i) => (
          <div key={i} className="fade-up" style={{
            textAlign: 'center', padding: '32px 20px',
            transitionDelay: `${i * 0.1}s`,
            position: 'relative'
          }}>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute', top: '52px',
                right: '-1rem', width: '2rem',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)',
                display: 'none'
              }}/>
            )}

            {/* Number circle */}
            <div style={{
              width: '60px', height: '60px',
              background: `linear-gradient(135deg, ${s.color}25, ${s.color}10)`,
              border: `2px solid ${s.color}40`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.9rem', fontWeight: 800,
              color: s.color,
              boxShadow: `0 0 24px ${s.color}20`
            }}>{s.num}</div>

            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{s.icon}</div>

            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.95rem', fontWeight: 700,
              color: 'white', marginBottom: '10px'
            }}>{s.title}</h3>

            <p style={{
              fontSize: '0.83rem',
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.7
            }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}