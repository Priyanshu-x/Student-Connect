import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

const fieldSets = {
  login: [
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@sgsu.edu' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
  ],
  signup: [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@sgsu.edu' },
    {
      key: 'department',
      label: 'Department',
      type: 'text',
      placeholder: 'e.g., Computer Science',
    },
    { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 3rd Year' },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create password',
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
  const fields = fieldSets[variant]
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

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
      const endpoint = `${API_BASE}/api/auth/${isLogin ? 'login' : 'signup'}`
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            year: formData.year,
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.')
      }

      localStorage.setItem('sgsu_token', data.token)
      setStatus({
        error: '',
        success: isLogin ? 'Login successful! Redirecting...' : 'Account created! Redirecting...',
      })

      setTimeout(() => {
        navigate('/dashboard')
      }, 800)
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
          <h2>{isLogin ? 'Welcome Back' : 'Create your profile'}</h2>
          <p>
            {isLogin
              ? 'Sign in to continue showcasing achievements and exploring peers.'
              : 'Sign up to publish achievements, earn badges and join the leaderboard.'}
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

          <NeonButton variant={isLogin ? 'primary' : 'secondary'} isLoading={isSubmitting}>
            {isLogin ? 'Login' : 'Sign up'}
          </NeonButton>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link to={isLogin ? '/signup' : '/login'}>
            {isLogin ? 'Create one' : 'Login'}
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

