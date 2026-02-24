import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaUserEdit, FaCloudUploadAlt, FaMagic, FaSignOutAlt, FaRocket, FaHome } from 'react-icons/fa'
import '../App.css'

const Dashboard = () => {
  const { user, token, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    hobbies: '',
    clubs: '',
  })
  const [profileImage, setProfileImage] = useState(null)
  const [resume, setResume] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || '',
        year: user.year || '',
        hobbies: user.hobbies ? user.hobbies.join(', ') : '',
        clubs: user.clubs ? user.clubs.join(', ') : '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (name === 'profileImage') {
      setProfileImage(files[0])
    } else if (name === 'resume') {
      setResume(files[0])
    } else if (name === 'certificates') {
      setCertificates(Array.from(files))
    }
  }

  const handleSubmitProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const hobbiesArray = formData.hobbies.split(',').map((h) => h.trim()).filter(Boolean)
      const clubsArray = formData.clubs.split(',').map((c) => c.trim()).filter(Boolean)

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, hobbies: hobbiesArray, clubs: clubsArray }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      updateUser(data)
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadFiles = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const uploadData = new FormData()
      if (profileImage) uploadData.append('profileImage', profileImage)
      if (resume) uploadData.append('resume', resume)
      certificates.forEach((file) => {
        uploadData.append('certificates', file)
      })

      if (!profileImage && !resume && certificates.length === 0) {
        setError('No files selected for upload.')
        setIsLoading(false)
        return
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/profile/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload files')
      }

      updateUser(data.user)
      setMessage('Files uploaded successfully!')
      setProfileImage(null)
      setResume(null)
      setCertificates([])
    } catch (err) {
      setError(err.message || 'An error occurred during file upload')
    } finally {
      setIsLoading(false)
    }
  }

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    demoLink: '',
  })
  const [projectLoading, setProjectLoading] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')
  const [projectError, setProjectError] = useState('')

  const handleProjectChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value })
  }

  const handleSubmitProject = async (e) => {
    e.preventDefault()
    setProjectLoading(true)
    setProjectMessage('')
    setProjectError('')

    try {
      const techStackArray = projectData.techStack.split(',').map((t) => t.trim()).filter(Boolean)

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...projectData, techStack: techStackArray }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project')
      }

      setProjectMessage('Project added successfully!')
      setProjectData({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        demoLink: '',
      })
    } catch (err) {
      setProjectError(err.message || 'An error occurred')
    } finally {
      setProjectLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

        <motion.header
          className="dashboard-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1.8rem' }}>Student Studio</h1>
            <p style={{ color: 'var(--muted)' }}>Welcome back, {user?.name?.split(' ')[0] || 'Creator'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/')} className="ghost-btn compact">
              <FaHome /> Home
            </button>
            <button onClick={logout} className="primary-btn compact warning">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </motion.header>

        {(message || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ padding: '1rem', background: error ? '#fee2e2' : '#dcfce7', color: error ? '#991b1b' : '#166534', borderRadius: '12px', marginBottom: '2rem' }}
          >
            {message || error}
          </motion.div>
        )}

        <div className="dashboard-grid">
          {/* Left Column: Identity */}
          <div className="left-column">
            <motion.div
              className="studio-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3><FaUserEdit /> Edit Profile Details</h3>
              <form onSubmit={handleSubmitProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="modern-input" type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Department</label>
                    <input className="modern-input" type="text" name="department" value={formData.department} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input className="modern-input" type="text" name="year" value={formData.year} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hobbies (comma-separated)</label>
                  <input className="modern-input" type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="Photography, Coding..." />
                </div>
                <div className="form-group">
                  <label>Clubs (comma-separated)</label>
                  <input className="modern-input" type="text" name="clubs" value={formData.clubs} onChange={handleChange} placeholder="Debate Club, AI Society..." />
                </div>
                <button type="submit" className="primary-btn" style={{ width: '100%' }} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>

            <motion.div
              className="studio-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3><FaCloudUploadAlt /> Media Uploads</h3>
              <form onSubmit={handleUploadFiles}>
                <div className="form-group">
                  <label>Profile Picture</label>
                  <div className="file-drop-zone" onClick={() => document.getElementById('pfp-input').click()}>
                    <input id="pfp-input" type="file" name="profileImage" accept="image/*" onChange={handleFileChange} hidden />
                    <div className="file-drop-content">
                      <span>{profileImage ? profileImage.name : 'Click to upload new avatar'}</span>
                    </div>
                  </div>
                  {user?.profileImage && <div className="preview-chip">Current: Active</div>}
                </div>

                <div className="form-group">
                  <label>Resume (PDF)</label>
                  <div className="file-drop-zone" onClick={() => document.getElementById('resume-input').click()}>
                    <input id="resume-input" type="file" name="resume" accept=".pdf" onChange={handleFileChange} hidden />
                    <div className="file-drop-content">
                      <span>{resume ? resume.name : 'Click to update resume'}</span>
                    </div>
                  </div>
                  {user?.resume && <a href={`${import.meta.env.VITE_API_BASE_URL}/${user.resume}`} target="_blank" rel="noreferrer" className="preview-chip" style={{ textDecoration: 'none', color: 'inherit' }}>View Current Resume</a>}
                </div>

                <button type="submit" className="ghost-btn" style={{ width: '100%' }} disabled={isLoading}>
                  Upload Media
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right Column: Projects */}
          <div className="right-column">
            <motion.div
              className="studio-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3><FaRocket /> Launch New Project</h3>
              {projectMessage && <p className="success-message" style={{ marginBottom: '1rem' }}>{projectMessage}</p>}
              {projectError && <p className="error-message" style={{ marginBottom: '1rem' }}>{projectError}</p>}

              <form onSubmit={handleSubmitProject}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input className="modern-input" type="text" name="title" value={projectData.title} onChange={handleProjectChange} required placeholder="e.g. AI-Powered Chess Bot" />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="modern-textarea" name="description" value={projectData.description} onChange={handleProjectChange} required placeholder="Describe what you built..." />
                </div>

                <div className="form-group">
                  <label>Tech Stack</label>
                  <input className="modern-input" type="text" name="techStack" value={projectData.techStack} onChange={handleProjectChange} placeholder="React, Node.js, MongoDB..." />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input className="modern-input" type="url" name="githubLink" value={projectData.githubLink} onChange={handleProjectChange} placeholder="https://github.com/..." />
                  </div>
                  <div className="form-group">
                    <label>Live Demo URL</label>
                    <input className="modern-input" type="url" name="demoLink" value={projectData.demoLink} onChange={handleProjectChange} placeholder="https://..." />
                  </div>
                </div>

                <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '1rem' }} disabled={projectLoading}>
                  <FaMagic /> {projectLoading ? 'Launching...' : 'Publish Project'}
                </button>
              </form>
            </motion.div>

            <div className="studio-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
              <h3 style={{ border: 'none', marginBottom: '0.5rem' }}>Your Project Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-white)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                  <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--text)' }}>{user?.score || 0}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Score</span>
                </div>
                {/* We could add more stats here later */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard