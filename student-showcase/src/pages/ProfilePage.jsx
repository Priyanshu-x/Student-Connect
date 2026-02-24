import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { FaUserCheck, FaShieldAlt, FaArrowLeft, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import LoadingScreen from '../components/LoadingScreen'
import '../App.css'

const ProfilePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { profiles, projects, isLoadingData } = useData()
    const { user } = useAuth()

    const profile = profiles.find(p => p._id === id || p.id === id)

    // Filter projects for this user
    const userProjects = projects.filter(p =>
        (p.student === profile?._id) ||
        (p.student?._id === profile?._id) ||
        (p.author === profile?._id) // Fallback for legacy
    )

    if (isLoadingData) return <LoadingScreen />

    if (!profile) {
        return (
            <div className="app">
                <Navbar />
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h2>Profile Not Found</h2>
                    <button className="primary-btn" onClick={() => navigate('/')}>Return Home</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
                <button
                    className="ghost-btn compact"
                    onClick={() => navigate('/')}
                    style={{ marginBottom: '1rem' }}
                >
                    <FaArrowLeft /> Back to Directory
                </button>

                <div className="profile-modal" style={{ maxWidth: '100%', marginBottom: '3rem' }}>
                    <div className="profile-banner">
                        <div className="score-badge">
                            {profile.score} Activity Score
                        </div>
                    </div>

                    <div className="profile-header-content">
                        <img
                            src={profile.avatar || profile.profileImage}
                            alt={profile.name}
                            className="profile-avatar-large"
                        />
                        <div className="profile-actions">
                            {!profile.isClaimed && (
                                <button
                                    className="claim-btn-small"
                                    onClick={() => navigate('/signup')}
                                >
                                    <FaShieldAlt /> Claim This Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="modal-body-scroll" style={{ maxHeight: 'none', paddingBottom: '0' }}>
                        <div className="profile-name-section">
                            <h3>
                                {profile.name}
                                {profile.isClaimed ? (
                                    <FaUserCheck className="verified-badge" title="Verified Student" />
                                ) : null}
                            </h3>
                            <p>{profile.department || profile.major} • {profile.collegeId}</p>
                            <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: 'var(--text)' }}>
                                "{profile.tagline || 'Ready to make an impact.'}"
                            </p>
                        </div>

                        <div className="badge-row" style={{ marginTop: '1rem' }}>
                            {(profile.badges || []).map((badge) => (
                                <span key={badge}>{badge}</span>
                            ))}
                        </div>

                        <div className="info-grid" style={{ marginBottom: '2rem' }}>
                            <div className="info-card">
                                <h4>Hobbies & Interests</h4>
                                <ul>
                                    {(Array.isArray(profile.hobbies) ? profile.hobbies : [profile.hobbies]).map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="info-card">
                                <h4>Clubs & Chapters</h4>
                                <ul>
                                    {(Array.isArray(profile.clubs) ? profile.clubs : [profile.clubs]).map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="info-card full-width">
                                <h4>Recent Achievements</h4>
                                <ul>
                                    {(Array.isArray(profile.achievements) ? profile.achievements : [profile.achievements]).map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <section>
                    <div className="section-header">
                        <h2>Projects Showcase</h2>
                    </div>
                    {userProjects.length > 0 ? (
                        <div className="projects-grid">
                            {userProjects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="feature-card" style={{ textAlign: 'center', minHeight: 'auto', padding: '3rem' }}>
                            <p style={{ color: 'var(--muted)' }}>No projects added yet.</p>
                            {/* If this is the logged-in user's profile, prompt them to add one? For now, keep it simple. */}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default ProfilePage
