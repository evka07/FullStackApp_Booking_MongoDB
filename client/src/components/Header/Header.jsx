import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import RegisterModal from '../RegisterModal/RegisterModal.jsx';
import LoginModal from '../LoginModal/LoginModal.jsx';
import styles from './Header.module.scss';

const Header = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const navigate = useNavigate();

    const openRegisterModal = () => setIsRegisterOpen(true);
    const closeRegisterModal = () => setIsRegisterOpen(false);

    const openLoginModal = () => setIsLoginOpen(true);
    const closeLoginModal = () => setIsLoginOpen(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.name;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedEventId');
        navigate('/');
    };

    return (
        <>
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
                    <Navbar
                        onRegisterClick={openRegisterModal}
                        onLoginClick={openLoginModal}
                        isLoggedIn={!!token}
                        userName={userName}
                        onLogout={handleLogout}
                    />
                </nav>
            </header>

            {!token && (
                <>
                    <RegisterModal
                        isOpen={isRegisterOpen}
                        onClose={closeRegisterModal}
                        navigate={navigate}
                    />
                    <LoginModal
                        isOpen={isLoginOpen}
                        onClose={closeLoginModal}
                        navigate={navigate}
                    />
                </>
            )}
        </>
    );
};

export default Header;
