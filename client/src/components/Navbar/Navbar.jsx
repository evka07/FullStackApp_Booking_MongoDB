import styles from "./Navbar.module.scss";

const Navbar = ({ onRegisterClick, onLoginClick, isLoggedIn, userName, onLogout }) => {
    return (
        <nav className={styles.navBar}>
            <a href="/" className={styles.link}>Home</a>

            {!isLoggedIn && (
                <>
                    <button onClick={onRegisterClick} className={styles.link} type="button">Register</button>
                    <button onClick={onLoginClick} className={styles.link} type="button">Login</button>
                </>
            )}

            {isLoggedIn && (
                <>
                    {userName && (
                        <span className={styles.userGreeting}>Hi, {userName}</span>
                    )}
                    <button onClick={onLogout} className={styles.link} type="button">Logout</button>
                </>
            )}

            <a href="/profile" className={styles.link}>Profile</a>
        </nav>
    );
};

export default Navbar;
