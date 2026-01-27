import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, token, updateUser } = useAuth()
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

      updateUser(data) // Update user context
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

      updateUser(data.user) // Update user context with new file paths
      setMessage('Files uploaded successfully!')
      // Clear file inputs after successful upload
      setProfileImage(null)
      setResume(null)
      setCertificates([])
    } catch (err) {
      setError(err.message || 'An error occurred during file upload')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="dashboard-page">
      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="hero-tag mini">Your Portal</p>
        <h2>Welcome to SGSU Dashboard, {user?.name || 'User'}</h2>
        <p>Manage your profile, achievements, and uploads here.</p>

        {isLoading && <p className="loading-message">Loading...</p>}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="dashboard-sections">
          <section className="profile-edit-section">
            <h3>Edit Profile</h3>
            <form onSubmit={handleSubmitProfile} className="profile-form">
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </label>
              <label>
                Department:
                <input type="text" name="department" value={formData.department} onChange={handleChange} />
              </label>
              <label>
                Year:
                <input type="text" name="year" value={formData.year} onChange={handleChange} />
              </label>
              <label>
                Hobbies (comma-separated):
                <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} />
              </label>
              <label>
                Clubs (comma-separated):
                <input type="text" name="clubs" value={formData.clubs} onChange={handleChange} />
              </label>
              <button type="submit" className="primary-btn" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </section>

          <section className="media-upload-section">
            <h3>Upload Media</h3>
            <form onSubmit={handleUploadFiles} className="upload-form">
              <label>
                Profile Image:
                <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />
              </label>
              {user?.profileImage && (
                <div className="current-file">
                  Current: <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/${user.profileImage}`} target="_blank" rel="noopener noreferrer">View Image</a>
                </div>
              )}

              <label>
                Resume (PDF):
                <input type="file" name="resume" accept=".pdf" onChange={handleFileChange} />
              </label>
              {user?.resume && (
                <div className="current-file">
                  Current: <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/${user.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a>
                </div>
              )}

              <label>
                Certificates (Max 5, images/PDFs):
                <input type="file" name="certificates" accept="image/*,.pdf" multiple onChange={handleFileChange} />
              </label>
              {user?.certificates && user.certificates.length > 0 && (
                <div className="current-file">
                  Current: {user.certificates.map((cert, index) => (
                    <a key={index} href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/${cert}`} target="_blank" rel="noopener noreferrer">Cert {index + 1}</a>
                  ))}
                </div>
              )}
              <button type="submit" className="primary-btn" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload Files'}
              </button>
            </form>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard