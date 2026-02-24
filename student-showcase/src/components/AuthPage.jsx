import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const fieldSets = {
  login: [
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@college.edu' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
  ],
  signup: [ // Renamed conceptually to 'Claim', but keeping key 'signup' for router compatibility if needed, or switching logic below
    { key: 'collegeId', label: 'College ID', type: 'text', placeholder: 'e.g., CS2025001' },
    { key: 'email', label: 'College Email', type: 'email', placeholder: 'Verify your identity' },
    {
      key: 'password',
      label: 'New Password',
      type: 'password',
      placeholder: 'Set a secure password',
    },
  ],
}

const createInitialState = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})

const NeonInput = ({ label, type = 'text', placeholder, value, onChange, name }) => (
  <label className="neon-field">
    <span>{label}</span>
    <input
      className="neon-input"
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
  </label>
)

const NeonButton = ({ children, variant = 'primary', isLoading, ...props }) => (
  <motion.button
    className={`neon-button ${variant}`}
    whileHover={{ scale: isLoading ? 1 : 1.03 }}
    whileTap={{ scale: isLoading ? 1 : 0.98 }}
    disabled={isLoading}
    {...props}
  >
    {isLoading ? 'Please wait...' : children}
  </motion.button>
)

const AuthPage = ({ variant = 'login' }) => {
  const isLogin = variant === 'login'
  const navigate = useNavigate()
  const fields = fieldSets[isLogin ? 'login' : 'signup']
  const { login, claimProfile, isLoading: authLoading } = useAuth()

  const [formData, setFormData] = useState(() => createInitialState(fields))
  const [status, setStatus] = useState({ error: '', success: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFormData(createInitialState(fields))
    setStatus({ error: '', success: '' })
    setIsSubmitting(false)
  }, [variant])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ error: '', success: '' })

    const required = fields.filter((field) => field.required !== false)
    for (const field of required) {
      if (!formData[field.key]?.trim()) {
        return setStatus({ error: `${field.label} is required`, success: '' })
      }
    }

    if (formData.password && formData.password.length < 6) {
      return setStatus({ error: 'Password must be at least 6 characters.', success: '' })
    }

    try {
      setIsSubmitting(true)
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        // Call claimProfile instead of signup
        result = await claimProfile(
          formData.collegeId,
          formData.email,
          formData.password
        )
      }

      if (result.success) {
        setStatus({
          error: '',
          success: isLogin
            ? 'Login successful! Redirecting...'
            : 'Profile claimed! Redirecting...',
        })
        // Redirection handled by AuthContext
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setStatus({ error: error.message, success: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-backdrop">
        <span className="auth-orb orb-one" />
        <span className="auth-orb orb-two" />
        <span className="auth-grid" />
      </div>
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="auth-card-header">
          <p className="hero-tag mini">Scope Global Skills University</p>
          <h2>{isLogin ? 'Welcome Back' : 'Claim Your Profile'}</h2>
          <p>
            {isLogin
              ? 'Sign in to manage your portfolio and events.'
              : 'Enter your College ID to activate your pre-listed profile.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <NeonInput
              key={field.key}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
            />
          ))}
          {isLogin && (
            <a className="auth-link" href="#">
              Forgot password?
            </a>
          )}

          {status.error && <p className="auth-error">{status.error}</p>}
          {status.success && <p className="auth-success">{status.success}</p>}

          <NeonButton
            variant={isLogin ? 'primary' : 'secondary'}
            isLoading={isSubmitting || authLoading}
          >
            {isLogin ? 'Login' : 'Claim Profile'}
          </NeonButton>
        </form>

        <p className="auth-switch">
          {isLogin ? "Not active yet?" : 'Already claimed?'}
          {' '}
          <Link to={isLogin ? '/signup' : '/login'}>
            {isLogin ? 'Claim Profile' : 'Login'}
          </Link>
        </p>
        <Link to="/" className="auth-home-link">
          ← Back to home
        </Link>
      </motion.div>
    </div>
  )
}

export default AuthPage
