import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa'

const ProjectCard = ({ project }) => {
    return (
        <motion.div
            className="project-card"
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="project-header">
                <h3>{project.title}</h3>
                {project.student && (
                    <span className="project-author">by {project.student.name}</span>
                )}
            </div>
            <p className="project-description">{project.description}</p>

            <div className="project-tech">
                {project.techStack.map((tech) => (
                    <span key={tech} className="tech-badge">
                        <FaCode className="tech-icon" /> {tech}
                    </span>
                ))}
            </div>

            <div className="project-links">
                {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="icon-link">
                        <FaGithub /> Code
                    </a>
                )}
                {project.demoLink && (
                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="icon-link primary">
                        <FaExternalLinkAlt /> Live Demo
                    </a>
                )}
            </div>
        </motion.div>
    )
}

export default ProjectCard
