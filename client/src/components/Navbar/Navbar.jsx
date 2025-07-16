import { useState } from "react";
import { Menu, X } from "lucide-react"; // Иконки меню
import styles from "./Navbar.module.scss";

const Navbar = ({ onRegisterClick, onLoginClick, isLoggedIn, userName, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <div className={styles.navWrapper}>
            <button className={styles.burgerButton} onClick={toggleMenu}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`${styles.navBar} ${isOpen ? styles.open : ""}`}>
                <a href="/" className={styles.link} onClick={closeMenu}>Home</a>

                {!isLoggedIn ? (
                    <>
                        <button onClick={() => { onRegisterClick(); closeMenu(); }} className={styles.link}>Register</button>
                        <button onClick={() => { onLoginClick(); closeMenu(); }} className={styles.link}>Login</button>
                    </>
                ) : (
                    <>
                        {userName && <span className={styles.userGreeting}>Hi, {userName}</span>}
                        <button onClick={() => { onLogout(); closeMenu(); }} className={styles.link}>Logout</button>
                    </>
                )}

                <a href="/profile" className={styles.link} onClick={closeMenu}>Profile</a>
            </nav>
        </div>
    );
};

export default Navbar;
