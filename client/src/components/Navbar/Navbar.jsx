import styles from "./Navbar.module.scss";

const Navbar = ({ onRegisterClick, onLoginClick }) => {
    return (
        <nav className={styles.navBar}>
            <a href="/" className={styles.link}>Home</a>
            <button onClick={onRegisterClick} className={styles.link} type="button">Register</button>
            <button onClick={onLoginClick} className={styles.link} type="button">Login</button>
            <a href="/profile" className={styles.link}>Profile</a>
        </nav>
    );
};

export default Navbar;
