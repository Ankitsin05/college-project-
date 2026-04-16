import { useState } from 'react'

const info = [
  { icon: '📧', label: 'Email',       value: 'safeyatra@team.com'              },
  { icon: '📱', label: 'Phone',       value: '+91 00000 00000'                 },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [toast, setToast] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = e => {
    e.preventDefault()
    setToast(true)
    setTimeout(() => setToast(false), 3000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section id="contact">
      <span className="section-label">Contact</span>
      <div className="section-title">Get In Touch</div>
      <p className="section-sub">Have questions about SafeYatra? Reach out to our team anytime.</p>

      <div className="contact-grid">
        <div className="contact-info">
          {info.map((c, i) => (
            <div className="contact-item fade-up" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="contact-icon">{c.icon}</div>
              <div>
                <div className="contact-label">{c.label}</div>
                <div className="contact-value">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form-box">
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Your Name</label>
              <input name="name" type="text" placeholder="Full name" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input name="subject" type="text" placeholder="What's this about?" value={form.subject} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" placeholder="Write your message..." value={form.message} onChange={handle} required />
            </div>
            <button type="submit" className="submit-btn">Send Message →</button>
          </form>
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>✅ Message sent! We'll get back to you soon.</div>
    </section>
  )
}
