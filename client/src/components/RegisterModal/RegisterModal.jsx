import { useState } from 'react';
import axios from 'axios';
import styles from './RegisterModal.module.scss';
import googleLogo from '../../assets/google-logo.png'; // добавь логотип

export default function RegisterModal({
                                          isOpen,
                                          onClose,
                                          navigate,
                                          onSwitchToLogin,
                                          onLoginSuccess,
                                      }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post('/api/users/register', formData);

            const userInfo = {
                user: {
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                },
                token: response.data.token,
            };

            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            onLoginSuccess && onLoginSuccess(userInfo);
            setLoading(false);
            onClose();

            const selectedEventId = localStorage.getItem('selectedEventId');
            navigate('/profile', { state: { eventId: selectedEventId } });
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Registration failed');
            console.error('Registration error:', err);
        }
    };

    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/google`, '_self');
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        required
                        value={formData.name}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        value={formData.email}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        value={formData.password}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </form>

                <div className={styles.divider}>or</div>

                <button className={styles.googleButton} onClick={handleGoogleLogin}>
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        className={styles.googleLogo} />
                    Continue with Google
                </button>

                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <button
                        onClick={() => {
                            onClose();
                            onSwitchToLogin && onSwitchToLogin();
                        }}
                        className={styles.switchButton}
                        type="button"
                    >
                        Log in here
                    </button>
                </p>
            </div>
        </div>
    );
}
