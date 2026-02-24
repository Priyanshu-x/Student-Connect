import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    FaArrowRight,
    FaCrown,
    FaPlayCircle,
    FaSearch,
    FaUserCheck,
    FaShieldAlt,
} from 'react-icons/fa'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'
import ProjectCard from '../components/ProjectCard'
import TypewriterHeroText from '../components/TypewriterHeroText'
import ActivityFeedCard from '../components/ActivityFeedCard'
import LoadingScreen from '../components/LoadingScreen'
import '../App.css'

const typewriterPhrases = [
    'Spotlight every achievement',
    'Ignite campus community',
    'Discover student potential',
    'Celebrate student excellence',
]

const contentVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: 'easeOut' },
    },
}

const Home = () => {
    const { profiles, leaderboard, events, notifications, isLoadingData, error: dataError } = useData()
    const { user, token, updateUser } = useAuth()
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [selectedProfile, setSelectedProfile] = useState(null)

    // Verification State (Removed)

    // Other State
    const [showFullLeaderboard, setShowFullLeaderboard] = useState(false)
    const [eventMessage, setEventMessage] = useState('')
    const [eventError, setEventError] = useState('')
    const [eventLoading, setEventLoading] = useState(false)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [showDirectory, setShowDirectory] = useState(false)

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

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
        if (!query.trim()) return profiles || []
        const term = query.toLowerCase()
        return (profiles || []).filter(
            (profile) =>
                (profile.name && profile.name.toLowerCase().includes(term)) ||
                (profile.department && profile.department.toLowerCase().includes(term)) ||
                (profile.collegeId && profile.collegeId.toLowerCase().includes(term)) ||
                (profile.hobbies && Array.isArray(profile.hobbies) && profile.hobbies.some((hobby) => hobby.toLowerCase().includes(term)))
        )
    }, [query, profiles])

    const isDirectoryVisible = showDirectory || query.length > 0

    return (
        <>
            <motion.div
                className="cursor-orb"
                animate={{ x: cursorPos.x, y: cursorPos.y }}
                transition={{ type: 'spring', stiffness: 120, damping: 30 }}
            />
            <AnimatePresence mode="wait">{isLoadingData && <LoadingScreen />}</AnimatePresence>
            {dataError && <div className="error-message">Error: {dataError}</div>}
            {(eventMessage || eventError) && (
                <div className={`event-feedback ${eventError ? 'error' : 'success'}`}>
                    {eventMessage || eventError}
                </div>
            )}

            <Navbar />

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

                <section className="projects-section">
                    <div className="section-header">
                        <div>
                            <p className="hero-tag">Student Innovation</p>
                            <h2>Featured Projects</h2>
                        </div>
                    </div>
                    <div className="projects-grid">
                        {useData().projects?.slice(0, 3).map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
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
                    <div className="search-bar-container" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
                        <div className="search-bar" style={{ margin: '0 0 1rem 0' }}>
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search by name, college ID, or hobby..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                className="ghost-btn compact"
                                onClick={() => setShowDirectory(!showDirectory)}
                                style={{ opacity: 0.8 }}
                            >
                                {showDirectory ? 'Hide Directory ⬆' : 'View Full Student Directory ⬇'}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isDirectoryVisible && (
                            <motion.div
                                layout
                                className="profile-grid"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {filteredProfiles.map((profile) => {
                                    if (!profile || !profile._id && !profile.id) return null
                                    return (
                                        <motion.button
                                            key={profile._id || profile.id}
                                            className="profile-card"
                                            whileHover={{ y: -8 }}
                                            onClick={() => setSelectedProfile(profile)}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <img src={profile.avatar || profile.profileImage} alt={profile.name} />
                                            <div className="profile-info">
                                                <div className="badge-row">
                                                    {(profile.badges || []).map((badge) => (
                                                        <span key={badge}>{badge}</span>
                                                    ))}
                                                </div>
                                                <h3>{profile.name}</h3>
                                                <p>{profile.department || profile.major}</p>
                                                <p className="tagline">{profile.tagline}</p>
                                            </div>
                                            <div className="profile-score">
                                                <strong>{profile.score}</strong>
                                                <span>activity score</span>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                                {filteredProfiles.length === 0 && (
                                    <div className="no-results">
                                        <p>No students found matching "{query}"</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                                key={student.name + index}
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
                                        {student.dept || student.department} • {student.badge || (student.badges && student.badges[0])}
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
                                        disabled={eventLoading || !user || user.verified === false}
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

            <Footer />

            {/* Modals */}
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
                            <div className="profile-banner">
                                <div className="score-badge">
                                    {selectedProfile.score} Activity Score
                                </div>
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedProfile(null)}
                                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="profile-header-content">
                                <img
                                    src={selectedProfile.avatar || selectedProfile.profileImage}
                                    alt={selectedProfile.name}
                                    className="profile-avatar-large"
                                />
                                <div className="profile-actions">
                                    <button
                                        className="ghost-btn compact"
                                        onClick={() => navigate(`/profile/${selectedProfile._id || selectedProfile.id}`)}
                                    >
                                        <FaArrowRight /> View Full Profile
                                    </button>
                                    {!selectedProfile.isClaimed && (
                                        <button
                                            className="claim-btn-small"
                                            onClick={() => navigate('/signup')}
                                        >
                                            <FaShieldAlt /> Claim This Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="modal-body-scroll">
                                <div className="profile-name-section">
                                    <h3>
                                        {selectedProfile.name}
                                        {selectedProfile.isClaimed ? (
                                            <FaUserCheck className="verified-badge" title="Verified Student" />
                                        ) : null}
                                    </h3>
                                    <p>{selectedProfile.department || selectedProfile.major} • {selectedProfile.collegeId}</p>
                                    <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: 'var(--text)' }}>
                                        "{selectedProfile.tagline || 'Ready to make an impact.'}"
                                    </p>
                                </div>

                                <div className="badge-row" style={{ marginTop: '1rem' }}>
                                    {(selectedProfile.badges || []).map((badge) => (
                                        <span key={badge}>{badge}</span>
                                    ))}
                                </div>

                                <div className="info-grid">
                                    <div className="info-card">
                                        <h4>Hobbies & Interests</h4>
                                        <ul>
                                            {(Array.isArray(selectedProfile.hobbies) ? selectedProfile.hobbies : [selectedProfile.hobbies]).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="info-card">
                                        <h4>Clubs & Chapters</h4>
                                        <ul>
                                            {(Array.isArray(selectedProfile.clubs) ? selectedProfile.clubs : [selectedProfile.clubs]).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="info-card full-width">
                                        <h4>Recent Achievements</h4>
                                        <ul>
                                            {(Array.isArray(selectedProfile.achievements) ? selectedProfile.achievements : [selectedProfile.achievements]).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
                                                {student.dept || student.department} • {student.badge || (student.badges && student.badges[0])}
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
}

export default Home
