const steps = [
  { num: '01', icon: '📝', title: 'Register & Get Digital ID', desc: 'Tourist registers on SafeYatra and instantly receives a unique QR-based Digital ID — verifiable by any authority.' },
  { num: '02', icon: '📍', title: 'Enable Live Tracking', desc: 'With one tap, the tourist enables location sharing. The system begins monitoring movement and zone boundaries in real time.' },
  { num: '03', icon: '🤖', title: 'AI Monitors in Background', desc: 'Our smart JS-based AI silently watches for anomalies — unusual stops, restricted zones, or behavioural patterns.' },
  { num: '04', icon: '🚨', title: 'Alert or SOS Triggered', desc: 'If danger is detected or tourist presses SOS, instant alerts fire to authorities with live location and tourist details.' },
  { num: '05', icon: '👮', title: 'Authority Responds', desc: 'Police dashboard shows the incident live. Response team is dispatched and the tourist is contacted immediately.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: 'var(--white)', padding: '80px 5%' }}>
      <span className="section-label">How It Works</span>
      <div className="section-title">Simple. Fast. Life-Saving.</div>
      <p className="section-sub">From registration to emergency response — the entire SafeYatra flow in 5 steps.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem', marginTop: '3rem'
      }}>
        {steps.map((s, i) => (
          <div key={i} className="fade-up" style={{
            textAlign: 'center', padding: '24px 16px',
            transitionDelay: `${i * 0.08}s`
          }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontFamily: "'Syne', sans-serif",
              fontSize: '1rem', fontWeight: 800, color: 'white'
            }}>{s.num}</div>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{s.icon}</div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.95rem', fontWeight: 700,
              color: 'var(--dark)', marginBottom: '8px'
            }}>{s.title}</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}