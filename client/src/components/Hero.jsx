import { useNavigate } from "react-router-dom";

export default function Hero({ setAuthModal }) {
  const navigate = useNavigate(); // ✅ ADD

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-badge">Welcome to</div>

        <h1>
          Tourist Safety<br />
          in <span className="highlight">Northeast India</span><br />
          — Reimagined
        </h1>

        <p>
          Real-time tracking, AI-powered threat detection, geo-fencing alerts,
          and instant SOS response — keeping every tourist safe, every step of the journey.
        </p>

        <div className="hero-btns">
          {/* ✅ FIX HERE */}
          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
          >
            🚀 Get Started
          </button>

          <a href="#features" className="btn-outline-hero">
            ▼ Explore Features
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">24/7</div>
            <div className="stat-label">Live Monitoring</div>
          </div>
          <div className="stat">
            <div className="stat-num">&lt;30s</div>
            <div className="stat-label">SOS Response</div>
          </div>
          <div className="stat">
            <div className="stat-num">100%</div>
            <div className="stat-label">Secure Digital ID</div>
          </div>
        </div>
      </div>

      {/* Live Map Card */}
      <div className="hero-visual">
        <div className="map-card">
          <div className="map-header">
            <span className="map-title">📍 Live Tourist Map — NE India</span>
            <span className="live-dot"><span className="dot" /> LIVE</span>
          </div>

          <div className="fake-map">
            <div className="map-pin pin-safe" />
            <div className="map-pin pin-danger" />
            <div className="map-pin pin-sos" />
          </div>

          <div className="tourist-cards">
            {[
              { init: 'AK', bg: '#1d4ed8', name: 'Arjun Kumar',  loc: 'Kaziranga Zone A',    badge: 'safe-badge',  status: 'Safe'  },
              { init: 'PS', bg: '#7c3aed', name: 'Priya Sharma', loc: 'Tawang — Danger Zone', badge: 'alert-badge', status: 'Alert' },
              { init: 'RV', bg: '#b45309', name: 'Rahul Verma',  loc: 'SOS Activated!',       badge: 'sos-badge',   status: 'SOS'   },
            ].map(t => (
              <div className="tourist-item" key={t.name}>
                <div className="tourist-avatar" style={{ background: t.bg, color: 'white' }}>{t.init}</div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-loc">{t.loc}</div>
                </div>
                <span className={`status-badge ${t.badge}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}