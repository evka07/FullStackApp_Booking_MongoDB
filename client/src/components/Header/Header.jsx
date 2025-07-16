import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import RegisterModal from '../RegisterModal/RegisterModal.jsx';
import LoginModal from '../LoginModal/LoginModal.jsx';
import { logout } from '../../redux/userSlice';
import styles from './Header.module.scss';

const Header = ({
                    isLoginOpen,
                    setIsLoginOpen,
                    isRegisterOpen,
                    setIsRegisterOpen,
                    onLoginSuccess,
                }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user.userInfo);
    const token = userInfo?.token || null;
    const userName = userInfo?.user?.name || null;

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('selectedEventId');
        navigate('/');
    };

    const openRegisterModal = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    const openLoginModal = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.logoAndTitle}>
                    <div className={styles.titleWrapper}>
                        <p className={styles.cityName}>KRAKOW</p>
                        <p className={styles.name}>TICKETS</p>
                    </div>
                </div>

                <div className={styles.navWrapper}>
                    <Navbar
                        onRegisterClick={openRegisterModal}
                        onLoginClick={openLoginModal}
                        isLoggedIn={!!token}
                        userName={userName}
                        onLogout={handleLogout}
                    />
                </div>
            </header>

            {!token && (
                <>
                    <RegisterModal
                        isOpen={isRegisterOpen}
                        onClose={() => setIsRegisterOpen(false)}
                        navigate={navigate}
                        onLoginSuccess={onLoginSuccess}
                        onSwitchToLogin={openLoginModal}
                    />
                    <LoginModal
                        isOpen={isLoginOpen}
                        onClose={() => setIsLoginOpen(false)}
                        navigate={navigate}
                        onLoginSuccess={onLoginSuccess}
                        onSwitchToRegister={openRegisterModal}
                    />
                </>
            )}
        </>
    );
};

export default Header;
