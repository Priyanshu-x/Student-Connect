import '../App.css'

const Footer = () => {
    return (
        <footer>
            <p>© {new Date().getFullYear()} Scopr Global Skills University • Student Activity Showcase</p>
            <div>
                <a href="#home">Privacy</a>
                <a href="#home">Support</a>
                <a href="#home">Campus Ambassador</a>
            </div>
        </footer>
    )
}

export default Footer
