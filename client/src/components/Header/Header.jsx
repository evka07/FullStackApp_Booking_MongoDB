import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import RegisterModal from '../RegisterModal/RegisterModal.jsx';
import LoginModal from '../LoginModal/LoginModal.jsx';

import styles from './Header.module.scss';
import { loginSuccess, logout } from '../../redux/userSlice';

const Header = ({
                    isLoginOpen,
                    setIsLoginOpen,
                    isRegisterOpen,
                    setIsRegisterOpen,
                    onLoginSuccess,
                    navigate,
                }) => {
    const dispatch = useDispatch();
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
