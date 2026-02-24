import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import '../App.css'

const TypewriterHeroText = ({ phrases }) => {
    const [displayText, setDisplayText] = useState('')
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex]

        if (!isDeleting && displayText === currentPhrase) {
            const timeout = setTimeout(() => setIsDeleting(true), 1400)
            return () => clearTimeout(timeout)
        }

        if (isDeleting && displayText === '') {
            setIsDeleting(false)
            setPhraseIndex((prev) => (prev + 1) % phrases.length)
            return
        }

        const timeout = setTimeout(() => {
            const nextLength = displayText.length + (isDeleting ? -1 : 1)
            setDisplayText(currentPhrase.slice(0, nextLength))
        }, isDeleting ? 55 : 110)

        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, phraseIndex, phrases])

    return (
        <div className="typewriter-wrapper">
            <motion.h1
                className="hero-type gradient-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span>{displayText}</span>
                <span className="typewriter-caret" />
            </motion.h1>
            <p className="hero-type-sub">Built for Scope Global Skills University</p>
        </div>
    )
}

export default TypewriterHeroText
