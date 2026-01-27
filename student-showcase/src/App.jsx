import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaCrown,
  FaPlayCircle,
  FaSearch,
  FaShieldAlt,
  FaUserCheck,
} from 'react-icons/fa'
import './App.css'
import AuthPage from './components/AuthPage'
import Dashboard from './pages/Dashboard'
import { useData } from './context/DataContext' // Import useData
import { useAuth } from './context/AuthContext' // Import useAuth

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Leaderboard', href: '#leaderboard' },
]


const LoadingScreen = () => {
  const colors = ['#7c5dff', '#ff6ec7', '#37d1ff', '#f4c542']
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <motion.div
        className="sgsu-logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {['S', 'G', 'S', 'U'].map((letter, index) => (
          <motion.span
            key={letter + index}
            className="sgsu-letter"
            style={{ color: colors[index % colors.length] }}
            animate={{
              y: [-6, 6, -6],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              delay: index * 0.15,
              ease: 'easeInOut',
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
      <p>Launching SGSU experience...</p>
    </motion.div>
  )
}

const FeatureCard = ({ title, detail, icon }) => (
  <motion.div
    className="feature-card"
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="feature-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{detail}</p>
  </motion.div>
)

const typewriterPhrases = [
  'Spotlight every achievement',
  'Ignite campus community',
  'Discover student potential',
  'Celebrate student excellence',
]

const TypewriterHeroText = ({ phrases }) => {
  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]

    if (!isDeleting && displayText === currentPhrase) {
      const timeout = setTimeout(() => setIsDeleting(true), 1400)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
      return
    }

    const timeout = setTimeout(() => {
      const nextLength = displayText.length + (isDeleting ? -1 : 1)
      setDisplayText(currentPhrase.slice(0, nextLength))
    }, isDeleting ? 55 : 110)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, phraseIndex, phrases])

  return (
    <div className="typewriter-wrapper">
      <motion.h1
        className="hero-type gradient-heading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span>{displayText}</span>
        <span className="typewriter-caret" />
      </motion.h1>
      <p className="hero-type-sub">Built for Scope Global Skills University</p>
    </div>
  )
}

const ActivityFeedCard = ({ items }) => {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState([])

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10
    setTilt({ x, y })
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  const handleLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rippleId = Date.now()
    setRipples((prev) => [...prev, { id: rippleId, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== rippleId))
    }, 600)
  }

  return (
    <motion.div
      className={`hero-panel activity-card ${hovered ? 'glass-card-hover' : ''}`}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      animate={{
        rotateX: tilt.y,
        rotateY: -tilt.x,
        scale: hovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onClick={handleClick}
    >
      <div className="activity-glow" />
      <div
        className="glass-pointer"
        style={{ left: pointer.x, top: pointer.y, opacity: hovered ? 1 : 0 }}
      />
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="glass-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
      <div className="panel-header">
        <span>Live Activity Feed</span>
        <FaShieldAlt />
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span className="pulse" />
            {item}
          </li>
        ))}
      </ul>
      <div className="panel-footer">
        <span>Synced with campus activity radar</span>
      </div>
    </motion.div>
  )
}

const contentVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut' },
  },
}

function App() {
  const { profiles, leaderboard, events, notifications, isLoadingData, error: dataError } = useData()
  const { user, token, updateUser } = useAuth() // Access auth context
  const [query, setQuery] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationStep, setVerificationStep] = useState('method')
  const [verificationOtp, setVerificationOtp] = useState('')
  const [verificationDocs, setVerificationDocs] = useState([])
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false)
  const [eventMessage, setEventMessage] = useState('') // New state for event feedback
  const [eventError, setEventError] = useState('') // New state for event errors
  const [eventLoading, setEventLoading] = useState(false); // New state for event loading
  const [activeNav, setActiveNav] = useState(navLinks[0].href)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup'

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000' // Define API_BASE

  // Removed local isLoading state and its useEffect, now using isLoadingData from context
  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000)
  //   return () => clearTimeout(timer)
  // }, [])

  useEffect(() => {
    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 40
      const y = (e.clientY / innerHeight - 0.5) * 40
      setCursorPos({ x, y })
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  const filteredProfiles = useMemo(() => {
    if (!query.trim()) return profiles || [] // Ensure profiles is an array
    const term = query.toLowerCase()
    return (profiles || []).filter(
      (profile) =>
        (profile.name && profile.name.toLowerCase().includes(term)) ||
        (profile.major && profile.major.toLowerCase().includes(term)) ||
        (profile.clubs && profile.clubs.some((club) => club.toLowerCase().includes(term))) ||
        (profile.achievements && profile.achievements.some((item) => item.toLowerCase().includes(term)))
    )
  }, [query, profiles]) // Add profiles to dependency array

  const landingContent = (
    <>
      <motion.div
        className="cursor-orb"
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{ type: 'spring', stiffness: 120, damping: 30 }}
      />
      <AnimatePresence mode="wait">{isLoadingData && <LoadingScreen />}</AnimatePresence>
      {dataError && <div className="error-message">Error: {dataError}</div>} {/* Display global data error */}
      {(eventMessage || eventError) && (
        <div className={`event-feedback ${eventError ? 'error' : 'success'}`}>
          {eventMessage || eventError}
        </div>
      )}

      <motion.header
        className="nav-wrapper"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } }}
      >
        <div className="auth-buttons">
          <button className="ghost-btn" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
          <button className="ghost-btn" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
        <nav>
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className={`nav-link ${activeNav === link.href ? 'active' : ''}`}
              onClick={() => setActiveNav(link.href)}
              onMouseEnter={() => setActiveNav(link.href)}
              whileHover={{ scale: 1.05 }}
            >
              {link.label}
              {activeNav === link.href && (
                <motion.span
                  layoutId="navIndicator"
                  className="nav-indicator"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </nav>
        <div className="logo">Scope Global Skills University</div>
      </motion.header>

      <motion.main
        id="home"
        variants={contentVariants}
        initial="hidden"
        animate={isLoadingData ? 'hidden' : 'visible'}
      >
        <section className="hero">
          <motion.div
            className="hero-text"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p className="hero-tag">Student Activity Showcase Portal</p>
            <TypewriterHeroText phrases={typewriterPhrases} />
            <p className="hero-description">
              Discover verified student stories, explore live leaderboards, and
              join events from one vibrant space built for collaboration,
              growth, and recognition.
            </p>
            <div className="hero-cta">
              <button className="primary-btn">
                Explore Profiles <FaArrowRight />
              </button>
              <button className="ghost-btn">
                <FaPlayCircle /> Watch Demo
              </button>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>4800+</strong>
                <span>Profiles Verified</span>
              </div>
              <div>
                <strong>320</strong>
                <span>Clubs & Chapters</span>
              </div>
              <div>
                <strong>96%</strong>
                <span>Engagement Spike</span>
              </div>
            </div>
          </motion.div>

          <ActivityFeedCard items={notifications} />
        </section>

        <section id="features" className="feature-grid">
          <FeatureCard
            title="Dynamic Profiles"
            detail="Search, explore and verify authentic stories, clubs and credentials."
            icon={<FaUserCheck />}
          />
          <FeatureCard
            title="Live Leaderboard"
            detail="Scores update from hackathons, clubs, sports and community impact."
            icon={<FaCrown />}
          />
          <FeatureCard
            title="Event Playbooks"
            detail="Call-to-action cards connect you to organizers with one tap."
            icon={<FaArrowRight />}
          />
        </section>

        <section className="search-section" id="about">
          <div className="search-header">
            <h2>Find any student in seconds</h2>
            <p>Search by name, club, hackathon, interest or badge.</p>
          </div>
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, club or interest..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="primary-btn compact">Discover</button>
          </div>

          <motion.div layout className="profile-grid">
            {filteredProfiles.map((profile) => {
              if (!profile || !profile.id) { // Ensure profile and profile.id exist
                return null; // Skip rendering if profile or its ID is undefined
              }
              return (
                <motion.button
                  key={profile.id}
                  className="profile-card"
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <img src={profile.avatar} alt={profile.name} />
                  <div className="profile-info">
                    <div className="badge-row">
                      {(profile.badges || []).map((badge) => (
                        <span key={badge}>{badge}</span>
                      ))}
                    </div>
                    <h3>{profile.name}</h3>
                    <p>{profile.major}</p>
                    <p className="tagline">{profile.tagline}</p>
                  </div>
                  <div className="profile-score">
                    <strong>{profile.score}</strong>
                    <span>activity score</span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        <section className="verify-banner">
          <div>
            <p className="hero-tag">Own your narrative</p>
            <h2>Verify and amplify your profile</h2>
            <p>
              Secure verification through university SSO, email OTP or document
              upload. Unlock editing, badge requests, resume & certificate
              uploads.
            </p>
          </div>
          <button
            className="primary-btn"
            onClick={() => {
              setShowVerification(true)
              setVerificationStep('method')
            }}
          >
            Verify My Profile
          </button>
        </section>

        <section id="leaderboard" className="leaderboard-section">
          <div className="section-header">
      <div>
              <p className="hero-tag">Trending Voices</p>
              <h2>Leaderboard · Top 5</h2>
      </div>
            <button
              className="ghost-btn"
              onClick={() => setShowFullLeaderboard(true)}
            >
              View More
        </button>
          </div>
          <div className="leaderboard-list">
            {leaderboard.slice(0, 5).map((student, index) => (
              <motion.div
                className="leaderboard-card"
                key={student.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="rank">
                  {index + 1}
                  {index < 3 && <FaCrown />}
                </div>
                <div>
                  <h4>{student.name}</h4>
                  <p>
                    {student.dept} • {student.badge}
        </p>
      </div>
                <strong>{student.score}</strong>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="events-section">
          <div className="section-header">
            <div>
              <p className="hero-tag">Call to Action</p>
              <h2>Live events & opportunities</h2>
            </div>
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <motion.div
                key={event.title}
                className="event-card"
                whileHover={{ translateY: -8 }}
              >
                <div className="event-top">
                  <span>{event.date}</span>
                  <button
                    className="ghost-btn compact"
                    onClick={async () => {
                      setEventLoading(true)
                      setEventMessage('')
                      setEventError('')
                      try {
                        if (!user || !token) {
                          throw new Error('Please log in to register for events.')
                        }
                        const response = await fetch(`${API_BASE}/api/events/${event._id}/register`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                        })
                        const data = await response.json()
                        if (!response.ok) throw new Error(data.message || 'Failed to register for event')
                        setEventMessage(`Successfully registered for ${event.title}!`)
                      } catch (err) {
                        setEventError(err.message || 'Error registering for event.')
                      } finally {
                        setEventLoading(false)
                      }
                    }}
                    disabled={eventLoading || !user || user.verified === false} // Disable if not logged in or not verified
                  >
                    Notify Me
                  </button>
                </div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-contacts">
                  {event.contacts.map((contact) => (
                    <span key={contact}>{contact}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.main>

      <footer>
        <p>© {new Date().getFullYear()} Astra University • Student Activity Showcase</p>
        <div>
          <a href="#home">Privacy</a>
          <a href="#home">Support</a>
          <a href="#home">Campus Ambassador</a>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              className="profile-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setSelectedProfile(null)}
              >
                ×
              </button>
              <div className="modal-header">
                <img src={selectedProfile.avatar} alt={selectedProfile.name} />
                <div>
                  <h3>{selectedProfile.name}</h3>
                  <p>{selectedProfile.major}</p>
                  <div className="badge-row">
                    {selectedProfile.badges.map((badge) => (
                      <span key={badge}>{badge}</span>
                    ))}
                  </div>
                </div>
                <div className="profile-score">
                  <strong>{selectedProfile.score}</strong>
                  <span>activity score</span>
                </div>
              </div>
              <div className="modal-body">
                <div>
                  <h4>Hobbies</h4>
                  <ul>
                    {selectedProfile.hobbies.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Clubs & Chapters</h4>
                  <ul>
                    {selectedProfile.clubs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Achievements</h4>
                  <ul>
                    {selectedProfile.achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button className="ghost-btn">View Public Profile</button>
                <button
                  className="primary-btn"
                  onClick={() => {
                    setShowVerification(true)
                    setVerificationStep('method')
                  }}
                >
                  Verify Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVerification && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!verificationLoading) setShowVerification(false)
            }}
          >
            <motion.div
              className="verification-modal"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => {
                  if (!verificationLoading) {
                    setShowVerification(false)
                    setVerificationMessage('')
                    setVerificationError('')
                    setVerificationOtp('')
                    setVerificationDocs([])
                  }
                }}
                disabled={verificationLoading}
              >
                ×
              </button>
              <div className="verification-header">
                <FaUserCheck />
                <div>
                  <p className="hero-tag">Profile Verification</p>
                  <h3>Authenticate your identity</h3>
                  {user?.verified && <p className="verified-status">✅ Verified</p>}
                </div>
              </div>

              {(verificationMessage || verificationError) && (
                <div className={`verification-feedback ${verificationError ? 'error' : 'success'}`}>
                  {verificationMessage || verificationError}
                </div>
              )}

              {verificationStep === 'method' && (
                <div className="verification-content">
                  <p>Select a method to continue</p>
                  <div className="verification-grid">
                    <button onClick={async () => {
                      setVerificationLoading(true)
                      setVerificationMessage('')
                      setVerificationError('')
                      try {
                        const response = await fetch(`${API_BASE}/api/verify/otp/send`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        })
                        const data = await response.json()
                        if (!response.ok) throw new Error(data.message || 'Failed to send OTP')
                        setVerificationMessage('OTP sent to your registered email.')
                        setVerificationStep('otp')
                      } catch (err) {
                        setVerificationError(err.message || 'Error sending OTP.')
                      } finally {
                        setVerificationLoading(false)
                      }
                    }} disabled={!user || user.verified || verificationLoading}>
                      Email OTP
                    </button>
                    <button onClick={async () => {
                      setVerificationLoading(true)
                      setVerificationMessage('')
                      setVerificationError('')
                      try {
                        // This is a placeholder for actual SSO flow
                        // In a real app, this would redirect to an SSO provider
                        const response = await fetch(`${API_BASE}/api/verify/sso/callback`, {
                          method: 'GET', // Or appropriate method for SSO initiation/callback
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        })
                        const data = await response.json()
                        if (!response.ok) throw new Error(data.message || 'SSO verification failed')
                        updateUser({ verified: true })
                        setVerificationMessage('University SSO verification successful!')
                        setVerificationStep('success')
                      } catch (err) {
                        setVerificationError(err.message || 'Error with SSO verification.')
                      } finally {
                        setVerificationLoading(false)
                      }
                    }} disabled={!user || user.verified || verificationLoading}>
                      University SSO
                    </button>
                    <button onClick={() => setVerificationStep('docs')} disabled={!user || user.verified || verificationLoading}>
                      Document Upload
                    </button>
                  </div>
                </div>
              )}
              {verificationStep === 'otp' && (
                <div className="verification-content">
                  <p>Enter the 6-digit OTP sent to your university email.</p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={verificationOtp}
                    onChange={(e) => setVerificationOtp(e.target.value)}
                    maxLength="6"
                    disabled={verificationLoading}
                  />
                  <button
                    className="primary-btn"
                    onClick={async () => {
                      setVerificationLoading(true)
                      setVerificationMessage('')
                      setVerificationError('')
                      try {
                        const response = await fetch(`${API_BASE}/api/verify/otp/verify`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ otp: verificationOtp }),
                        })
                        const data = await response.json()
                        if (!response.ok) throw new Error(data.message || 'OTP verification failed')
                        updateUser({ verified: true })
                        setVerificationMessage('Profile verified successfully!')
                        setVerificationStep('success')
                      } catch (err) {
                        setVerificationError(err.message || 'Invalid or expired OTP.')
                      } finally {
                        setVerificationLoading(false)
                      }
                    }}
                    disabled={verificationOtp.length !== 6 || verificationLoading}
                  >
                    {verificationLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              )}
              {verificationStep === 'docs' && (
                <div className="verification-content">
                  <p>Upload student ID or transcript for manual review.</p>
                  <input
                    type="file"
                    name="verificationDocs"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(e) => setVerificationDocs(Array.from(e.target.files))}
                    disabled={verificationLoading}
                  />
                  <button
                    className="primary-btn"
                    onClick={async () => {
                      setVerificationLoading(true)
                      setVerificationMessage('')
                      setVerificationError('')
                      try {
                        const formData = new FormData()
                        verificationDocs.forEach((file) => {
                          formData.append('verificationDocs', file)
                        })

                        if (verificationDocs.length === 0) {
                          throw new Error('Please select documents to upload.')
                        }

                        const response = await fetch(`${API_BASE}/api/verify/docs/upload`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        })
                        const data = await response.json()
                        if (!response.ok) throw new Error(data.message || 'Document upload failed')
                        // User's verified status will be updated by an admin manually in this flow
                        setVerificationMessage('Documents uploaded for review. Status pending.')
                        setVerificationStep('success')
                      } catch (err) {
                        setVerificationError(err.message || 'Error uploading documents.')
                      } finally {
                        setVerificationLoading(false)
                      }
                    }}
                    disabled={verificationDocs.length === 0 || verificationLoading}
                  >
                    {verificationLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              )}
              {verificationStep === 'success' && (
                <div className="verification-success">
                  <FaShieldAlt />
                  <h4>{user?.verified ? "You're all set!" : "Documents submitted!"}</h4>
                  <p>
                    {user?.verified
                      ? 'Access granted to edit badges, upload resumes & manage your showcase.'
                      : 'Your documents are under review. You will be notified once verified.'}
                  </p>
                  <button
                    className="primary-btn"
                    onClick={() => {
                      setShowVerification(false)
                      setVerificationMessage('')
                      setVerificationError('')
                      setVerificationOtp('')
                      setVerificationDocs([])
                      if (user?.verified) navigate('/dashboard') // Redirect to dashboard if verified
                    }}
                  >
                    {user?.verified ? 'Go to Dashboard' : 'Close'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFullLeaderboard && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullLeaderboard(false)}
          >
            <motion.div
              className="leaderboard-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setShowFullLeaderboard(false)}
              >
                ×
              </button>
              <h3>University Leaderboard</h3>
              <p>
                Scores update every hour based on hackathons, events, club
                impact, certifications & peer recognition.
              </p>
              <div className="leaderboard-table">
                {leaderboard.map((student, index) => (
                  <div key={student.name} className="leaderboard-row">
                    <span>#{index + 1}</span>
                    <div>
                      <strong>{student.name}</strong>
                      <p>
                        {student.dept} • {student.badge}
                      </p>
                    </div>
                    <span>{student.score}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <div className={`app ${isAuthPage ? 'auth-mode' : ''}`}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={landingContent} />
          <Route path="/login" element={<AuthPage variant="login" />} />
          <Route path="/signup" element={<AuthPage variant="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
