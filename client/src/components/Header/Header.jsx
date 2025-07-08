import Navbar from '../Navbar/Navbar.jsx';
import styles from './Header.module.scss';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.StyledRizLogoWrapper}>
                <canvas
                    width="224"
                    height="80"
                    style={{ verticalAlign: 'top', width: '112px', height: '40px' }}
                />
            </div>

            <div className={styles.titleWrapper}>
                <p className={styles.cityName}>KRAKOW</p>
                <p className={styles.name}>TICKETS</p>
            </div>

            <nav className={styles.navbar}>
                <Navbar />
            </nav>
        </header>
    );
};

export default Header;
