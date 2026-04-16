import { useState } from 'react'
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const links = [
    { id: 'features',     label: 'Features'     },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about',        label: 'About'        },
    { id: 'feedback',     label: 'Feedback'     },
    { id: 'contact',      label: 'Contact'      },
  ]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10, 15, 28, 0.97)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 6%',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '68px',
    }}>

      {/* Brand */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', userSelect: 'none'
        }}
      >
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #0f4c81, #1a6db5)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px'
        }}>🛡️</div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.35rem', fontWeight: 800,
          color: 'white', letterSpacing: '-0.02em'
        }}>
          Safe<span style={{ color: '#e8401c' }}>Yatra</span>
        </span>
      </div>

      {/* Desktop Links */}
      <ul style={{
        display: 'flex', alignItems: 'center', gap: '2rem',
        listStyle: 'none', margin: 0, padding: 0,
      }} className="desktop-nav-links">
        {links.map(l => (
          <li key={l.id}>
            <button
              onClick={() => scrollTo(l.id)}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.88rem', fontWeight: 500,
                cursor: 'pointer', padding: '4px 0',
                transition: 'color 0.2s',
                fontFamily: "'DM Sans', sans-serif"
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
            >{l.label}</button>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!user ? (
          <>
            {/* 🔥 FIXED */}
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: '8px 18px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.8)',
                borderRadius: '8px',
                fontSize: '0.84rem', fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Syne', sans-serif"
              }}
            >Login</button>

            {/* 🔥 FIXED */}
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: '8px 18px',
                background: '#e8401c',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                fontSize: '0.84rem', fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Syne', sans-serif"
              }}
            >Register</button>
          </>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("user")
              navigate("/")
            }}
            style={{
              padding: '8px 18px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: '8px',
              fontSize: '0.84rem', fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Syne', sans-serif"
            }}
          >Logout</button>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none', border: 'none',
            color: 'white', fontSize: '1.4rem',
            cursor: 'pointer', padding: '4px'
          }}
          className="hamburger-btn"
        >{menuOpen ? '✕' : '☰'}</button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '68px', left: 0, right: 0,
          background: 'rgba(10,15,28,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '1.5rem 6%',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          zIndex: 999
        }}>
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '1rem', fontWeight: 500,
                cursor: 'pointer', textAlign: 'left',
                padding: '6px 0',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >{l.label}</button>
          ))}

          {!user && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => { navigate("/login"); setMenuOpen(false) }}
                style={{
                  flex: 1, padding: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'white', borderRadius: '8px'
                }}
              >Login</button>

              <button
                onClick={() => { navigate("/register"); setMenuOpen(false) }}
                style={{
                  flex: 1, padding: '10px',
                  background: '#e8401c', border: 'none',
                  color: 'white', borderRadius: '8px'
                }}
              >Register</button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}