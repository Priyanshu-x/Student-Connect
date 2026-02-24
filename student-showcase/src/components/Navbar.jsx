import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../App.css'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Leaderboard', href: '#leaderboard' },
]

const Navbar = () => {
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState(navLinks[0].href)

    return (
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
    )
}

export default Navbar
