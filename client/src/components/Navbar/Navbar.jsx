import {Link} from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <nav className={styles.navBar}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/register" className={styles.link}>Register</Link>
            <Link to="/login" className={styles.link}>Login</Link>
            <Link to="/profile" className={styles.link}>Profile</Link>
        </nav>
    )
}

export default Navbar;