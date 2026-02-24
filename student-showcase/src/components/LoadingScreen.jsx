import { motion } from 'framer-motion'
import '../App.css'

const LoadingScreen = () => {
    const colors = ['#7c5dff', '#ff6ec7', '#37d1ff', '#f4c542']
    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
            <motion.div
                className="sgsu-logo"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {['S', 'G', 'S', 'U'].map((letter, index) => (
                    <motion.span
                        key={letter + index}
                        className="sgsu-letter"
                        style={{ color: colors[index % colors.length] }}
                        animate={{
                            y: [-6, 6, -6],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.6,
                            delay: index * 0.15,
                            ease: 'easeInOut',
                        }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
            <p>Launching SGSU experience...</p>
        </motion.div>
    )
}

export default LoadingScreen
