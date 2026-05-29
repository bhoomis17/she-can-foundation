import { useState } from 'react'
import './App.css'


const TOPICS = [
  { label: 'Volunteering',    icon: '🤝' },
  { label: 'Donating',        icon: '💜' },
  { label: 'Partnership',     icon: '🌐' },
  { label: 'Media / Press',   icon: '📢' },
  { label: 'Beneficiary support', icon: '🌸' },
  { label: 'General inquiry', icon: '💬' },
]

export default function ContactForm() {
  const [fname,     setFname]     = useState('')
  const [lname,     setLname]     = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [topic,     setTopic]     = useState('')
  const [message,   setMessage]   = useState('')
  const [consent,   setConsent]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [errors,    setErrors]    = useState({})

  // Calculate form progress (how many fields are filled)
  function getProgress() {
    let filled = 0
    if (fname.trim())            filled++
    if (lname.trim())            filled++
    if (email.trim())            filled++
    if (topic)                   filled++
    if (message.trim().length >= 10) filled++
    if (consent)                 filled++
    return Math.round((filled / 6) * 100)
  }

  function validate() {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!fname.trim())               newErrors.fname   = 'Please enter your first name.'
    if (!lname.trim())               newErrors.lname   = 'Please enter your last name.'
    if (!emailRegex.test(email))     newErrors.email   = 'Please enter a valid email.'
    if (!topic)                      newErrors.topic   = 'Please select a topic.'
    if (message.trim().length < 10)  newErrors.message = 'Please write at least 10 characters.'
    if (!consent)                    newErrors.consent = 'Please agree to continue.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
  if (!validate()) return

  setLoading(true)
  

  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        phone,
        topic,
        message
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      setLoading(false)
      return
    }

    setSubmitted(true)

  } catch (error) {
  console.log(error)

  alert(
    'Our servers are temporarily unavailable. Please try again in a few minutes.'
  )
}

  setLoading(false)
}

  function handleReset() {
    setFname(''); setLname(''); setEmail(''); setPhone('')
    setTopic(''); setMessage(''); setConsent(false)
    setErrors({}); setSubmitted(false)
  }

  const progress = getProgress()
  const charsLeft = 500 - message.length

  if (submitted) {
    return (
      <div className="card">
        <div className="hero">
          <div className="badge">She Can Foundation</div>
          <h1>Connect With <span>Us</span></h1>
          <p>Empowering underprivileged women through education, training and opportunity.</p>
          <div className="dots"><span></span><span></span><span></span></div>
        </div>
        <div className="success">
          <div className="success-icon">🌸</div>
          <h2>Form Submitted Successfully</h2>
          <p>Thank you for reaching out to She Can Foundation. We'll get back to you within 2–3 working days.</p>
          <button className="submit-btn" onClick={handleReset} style={{maxWidth: '280px', margin: '0 auto', display: 'block'}}>
            Submit another response
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">

      {/* Hero */}
      <div className="hero">
        <div className="hero-circle"></div>
        <div className="badge">She Can Foundation</div>
        <h1>Connect With <span>Us</span></h1>
        <p>Empowering underprivileged women through education, training and opportunity. Your message matters.</p>
        <div className="dots"><span></span><span></span><span></span></div>
      </div>

      {/* Progress bar */}
      <div className="progress-wrap">
        <div className="progress-label">
          <span>Form progress</span>
          <span>{progress}% complete</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: progress + '%' }}></div>
        </div>
      </div>

      <div className="form-body">

        <div className="section-label">Your details</div>

        <div className="row">
          <div className="field">
            <label>First name <span className="req">*</span></label>
            <input
              type="text" placeholder="Priya"
              value={fname} onChange={e => setFname(e.target.value)}
              className={errors.fname ? 'err' : ''}
            />
            {errors.fname && <div className="err-msg">⚠ {errors.fname}</div>}
          </div>
          <div className="field">
            <label>Last name <span className="req">*</span></label>
            <input
              type="text" placeholder="Sharma"
              value={lname} onChange={e => setLname(e.target.value)}
              className={errors.lname ? 'err' : ''}
            />
            {errors.lname && <div className="err-msg">⚠ {errors.lname}</div>}
          </div>
        </div>

        <div className="field">
          <label>Email address <span className="req">*</span></label>
          <input
            type="email" placeholder="priya@example.com"
            value={email} onChange={e => setEmail(e.target.value)}
            className={errors.email ? 'err' : ''}
          />
          {errors.email && <div className="err-msg">⚠ {errors.email}</div>}
        </div>

        <div className="field">
          <label>Phone number</label>
          <input
            type="tel" placeholder="+91 98765 43210"
            value={phone} onChange={e => setPhone(e.target.value)}
          />
          <p className="hint">Optional — we'll only call if needed</p>
        </div>

        <div className="divider"></div>
        <div className="section-label">How can we help?</div>

        {/* Interactive topic cards instead of a boring dropdown */}
        <div className="field">
          <label>I'm reaching out about <span className="req">*</span></label>
          <div className={`topic-grid ${errors.topic ? 'err-border' : ''}`}>
            {TOPICS.map(t => (
              <button
                key={t.label}
                type="button"
                className={`topic-card ${topic === t.label ? 'selected' : ''}`}
                onClick={() => setTopic(t.label)}
              >
                <span className="topic-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          {errors.topic && <div className="err-msg">⚠ {errors.topic}</div>}
        </div>

        <div className="divider"></div>

        <div className="field">
          <label>Your message <span className="req">*</span></label>
          <textarea
            placeholder="Tell us about yourself and how you'd like to get involved…"
            value={message} maxLength={500}
            onChange={e => setMessage(e.target.value)}
            className={errors.message ? 'err' : ''}
          />
          <div className={`char-count ${charsLeft < 50 ? 'warn' : ''}`}>
            {charsLeft} characters remaining
          </div>
          {errors.message && <div className="err-msg">⚠ {errors.message}</div>}
        </div>

        <div className="consent">
          <input
            type="checkbox" id="consent"
            checked={consent} onChange={e => setConsent(e.target.checked)}
          />
          <label htmlFor="consent" className="consent-text">
            I agree that She Can Foundation may store and use my information to respond to my inquiry. My data will not be shared with third parties.
          </label>
        </div>
        {errors.consent && <div className="err-msg" style={{marginTop: '-1rem', marginBottom: '1rem'}}>⚠ {errors.consent}</div>}

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending…  ⏳' : 'Send Message  →'}
        </button>

        <p className="footer-note">
          She Can Foundation · Registered under Indian Societies Registration Act, 1860
        </p>

      </div>
    </div>
  )
}