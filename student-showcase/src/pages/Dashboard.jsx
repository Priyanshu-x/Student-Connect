import { motion } from 'framer-motion'

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="hero-tag mini">Your Portal</p>
        <h2>Welcome to SGSU Dashboard</h2>
        <p>
          You&apos;re authenticated! Profile editing, submissions, and leaderboards will appear
          here as the platform expands.
        </p>
      </motion.div>
    </div>
  )
}

export default Dashboard

