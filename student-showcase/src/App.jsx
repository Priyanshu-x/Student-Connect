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

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Leaderboard', href: '#leaderboard' },
]

const profiles = [
  {
    id: 1,
    name: 'Anika Verma',
    major: 'Computer Science • 2025',
    tagline: 'AI Research Fellow',
    avatar: 'https://i.pravatar.cc/150?img=47',
    hobbies: ['Digital Art', 'Trail Running'],
    clubs: ['AI Collective', 'Women Who Code'],
    achievements: [
      'Built campus-wide hackathon analytics tool',
      'Finalist @ Smart India Hackathon',
    ],
    badges: ['Innovation', 'Team Catalyst'],
    score: 982,
    verified: true,
  },
  {
    id: 2,
    name: 'Riaan Dsouza',
    major: 'Electronics • 2026',
    tagline: 'Robotics Captain',
    avatar: 'https://i.pravatar.cc/150?img=12',
    hobbies: ['FPV Drones', 'Bass Guitar'],
    clubs: ['Robotics Society', 'Music Ensemble'],
    achievements: [
      'Lead builder of autonomous rover',
      'Winner @ Technovation League',
    ],
    badges: ['Builder', 'Mentor'],
    score: 912,
    verified: true,
  },
  {
    id: 3,
    name: 'Meera Khanna',
    major: 'Business Analytics • 2025',
    tagline: 'Community Strategist',
    avatar: 'https://i.pravatar.cc/150?img=32',
    hobbies: ['Storyboard Writing', 'Bouldering'],
    clubs: ['Entrepreneurship Cell', 'Adventure Guild'],
    achievements: [
      'Curated 14-campus founder summit',
      'Google Women Techmakers Scholar',
    ],
    badges: ['Community', 'Leadership'],
    score: 888,
    verified: false,
  },
  {
    id: 4,
    name: 'Dev Narayan',
    major: 'Mechanical • 2024',
    tagline: 'Auto-Design Innovator',
    avatar: 'https://i.pravatar.cc/150?img=59',
    hobbies: ['Sketching', 'Sim Racing'],
    clubs: ['SAE Baja', 'Design Forge'],
    achievements: [
      'Formula-E style electric prototype',
      'Patented a modular hinge system',
    ],
    badges: ['Trailblazer', 'Patent Holder'],
    score: 861,
    verified: true,
  },
  {
    id: 5,
    name: 'Ria Paul',
    major: 'Information Science • 2026',
    tagline: 'Cybersecurity Evangelist',
    avatar: 'https://i.pravatar.cc/150?img=21',
    hobbies: ['CTF Challenges', 'Mixed Media'],
    clubs: ['CyberSec Ninjas', 'Art Haus'],
    achievements: [
      'Secured campus Wi-Fi redesign',
      'Defcon India CTF finalist',
    ],
    badges: ['Cyber Shield', 'Coach'],
    score: 847,
    verified: false,
  },
]

const leaderboard = [
  { name: 'Anika Verma', dept: 'CSE', score: 982, badge: 'Innovation Ace' },
  { name: 'Riaan Dsouza', dept: 'EEE', score: 912, badge: 'Robotics Lead' },
  { name: 'Meera Khanna', dept: 'Mgmt', score: 888, badge: 'Community Star' },
  { name: 'Dev Narayan', dept: 'Mech', score: 861, badge: 'Design Pro' },
  { name: 'Ria Paul', dept: 'ISE', score: 847, badge: 'Security Guru' },
  { name: 'Harshautam Singh', dept: 'Civil', score: 822, badge: 'Event Lead' },
  { name: 'Zara Khan', dept: 'BioTech', score: 811, badge: 'Health Innovator' },
]

const events = [
  {
    title: 'Campus Hack Sprint 4.0',
    date: 'Nov 28 - 30',
    description:
      '48 hours of prototyping with mentors from Google, Atlassian and alumni founders.',
    contacts: ['hackathon@univ.edu', '+91 90120 44566'],
  },
  {
    title: 'Green Impact Challenge',
    date: 'Dec 05',
    description:
      'Pitch sustainable ideas to win incubation credits & leadership badges.',
    contacts: ['impact-lab@univ.edu'],
  },
]

const notifications = [
  'New badge unlocked: Collaboration Catalyst',
  '3 open slots for UX Research Sprint this weekend',
  'Update your profile to stay ranked on December leaderboard',
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
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationStep, setVerificationStep] = useState('method')
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false)
  const [activeNav, setActiveNav] = useState(navLinks[0].href)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup'

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

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
    if (!query.trim()) return profiles
    const term = query.toLowerCase()
    return profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(term) ||
        profile.major.toLowerCase().includes(term) ||
        profile.clubs.some((club) => club.toLowerCase().includes(term)) ||
        profile.achievements.some((item) => item.toLowerCase().includes(term))
    )
  }, [query])

  const landingContent = (
    <>
      <motion.div
        className="cursor-orb"
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{ type: 'spring', stiffness: 120, damping: 30 }}
      />
      <AnimatePresence mode="wait">{isLoading && <LoadingScreen />}</AnimatePresence>

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
        animate={isLoading ? 'hidden' : 'visible'}
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
            {filteredProfiles.map((profile) => (
              <motion.button
                key={profile.id}
                className="profile-card"
                whileHover={{ y: -8 }}
                onClick={() => setSelectedProfile(profile)}
              >
                <img src={profile.avatar} alt={profile.name} />
                <div className="profile-info">
                  <div className="badge-row">
                    {profile.badges.map((badge) => (
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
            ))}
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
                  <button className="ghost-btn compact">Notify Me</button>
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
            onClick={() => setShowVerification(false)}
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
                onClick={() => setShowVerification(false)}
              >
                ×
              </button>
              <div className="verification-header">
                <FaUserCheck />
                <div>
                  <p className="hero-tag">Profile Verification</p>
                  <h3>Authenticate your identity</h3>
                </div>
              </div>
              {verificationStep === 'method' && (
                <div className="verification-content">
                  <p>Select a method to continue</p>
                  <div className="verification-grid">
                    <button onClick={() => setVerificationStep('otp')}>
                      Email OTP
                    </button>
                    <button onClick={() => setVerificationStep('sso')}>
                      University SSO
                    </button>
                    <button onClick={() => setVerificationStep('docs')}>
                      Document Upload
                    </button>
                  </div>
                </div>
              )}
              {verificationStep === 'otp' && (
                <div className="verification-content">
                  <p>Enter the 6-digit OTP sent to your university email.</p>
                  <input placeholder="Enter OTP" />
                  <button
                    className="primary-btn"
                    onClick={() => setVerificationStep('success')}
                  >
                    Verify
                  </button>
                </div>
              )}
              {verificationStep === 'sso' && (
                <div className="verification-content">
                  <p>Redirecting to secure university sign-on.</p>
                  <button
                    className="primary-btn"
                    onClick={() => setVerificationStep('success')}
                  >
                    Continue
                  </button>
                </div>
              )}
              {verificationStep === 'docs' && (
                <div className="verification-content">
                  <p>Upload student ID or transcript for manual review.</p>
                  <input type="file" />
                  <button
                    className="primary-btn"
                    onClick={() => setVerificationStep('success')}
                  >
                    Submit
                  </button>
                </div>
              )}
              {verificationStep === 'success' && (
                <div className="verification-success">
                  <FaShieldAlt />
                  <h4>You're all set!</h4>
                  <p>
                    Access granted to edit badges, upload resumes & manage your
                    showcase.
                  </p>
                  <button
                    className="primary-btn"
                    onClick={() => setShowVerification(false)}
                  >
                    Go to Dashboard
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
