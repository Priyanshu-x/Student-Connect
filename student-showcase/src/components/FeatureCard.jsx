import { motion } from 'framer-motion'
import '../App.css'

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

export default FeatureCard
