import { useState } from 'react'

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function Feedback() {
  const [rating, setRating]   = useState(0)
  const [hover, setHover]     = useState(0)
  const [form, setForm]       = useState({ name: '', category: '', comment: '' })
  const [toast, setToast]     = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = e => {
    e.preventDefault()
    if (!rating) { alert('Please select a star rating!'); return }
    setToast(true)
    setTimeout(() => setToast(false), 3000)
    setForm({ name: '', category: '', comment: '' })
    setRating(0)
  }

  return (
    <section id="feedback">
      <span className="section-label">Feedback</span>
      <div className="section-title">Share Your Thoughts</div>
      <p className="section-sub">Help us improve SafeYatra. Your feedback matters to us.</p>

      <div className="feedback-wrapper">
        <div className="rating-label">Rate Our Project</div>
        <div className="stars">
          {[1,2,3,4,5].map(v => (
            <span
              key={v}
              className={`star ${v <= (hover || rating) ? 'active' : ''}`}
              onClick={() => setRating(v)}
              onMouseEnter={() => setHover(v)}
              onMouseLeave={() => setHover(0)}
            >★</span>
          ))}
          {(hover || rating) > 0 && (
            <span style={{ marginLeft: 8, fontSize: '0.88rem', color: 'var(--muted)', alignSelf: 'center' }}>
              {LABELS[hover || rating]}
            </span>
          )}
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Your Name</label>
            <input name="name" type="text" placeholder="Enter your name" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handle} required>
              <option value="">Select a category</option>
              <option>Overall Experience</option>
              <option>UI/UX Design</option>
              <option>Technical Implementation</option>
              <option>Innovation & Idea</option>
              <option>Problem Statement</option>
            </select>
          </div>
          <div className="form-group">
            <label>Your Feedback</label>
            <textarea name="comment" placeholder="Write your thoughts here..." value={form.comment} onChange={handle} required />
          </div>
          <button type="submit" className="submit-btn">Submit Feedback →</button>
        </form>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>✅ Thank you for your feedback!</div>
    </section>
  )
}
