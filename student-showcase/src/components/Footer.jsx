import '../App.css'

const Footer = () => {
    return (
        <footer>
            <p>© {new Date().getFullYear()} Astra University • Student Activity Showcase</p>
            <div>
                <a href="#home">Privacy</a>
                <a href="#home">Support</a>
                <a href="#home">Campus Ambassador</a>
            </div>
        </footer>
    )
}

export default Footer
