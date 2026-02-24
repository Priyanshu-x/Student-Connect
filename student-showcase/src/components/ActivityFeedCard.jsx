import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt } from 'react-icons/fa'
import '../App.css'

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

export default ActivityFeedCard
