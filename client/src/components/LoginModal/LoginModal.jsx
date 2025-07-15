import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import styles from './LoginModal.module.scss';

export default function LoginModal({
                                       isOpen,
                                       onClose,
                                       navigate,
                                       onSwitchToRegister,
                                       onLoginSuccess,
                                   }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axiosInstance.post('/api/users/login', formData);

            const userInfo = {
                user: {
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                },
                token: response.data.token,
            };

            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            onLoginSuccess(userInfo);

            let selectedEventId = localStorage.getItem('selectedEventId');
            if (!selectedEventId) {
                const eventsResponse = await axiosInstance.get('/api/events');
                if (eventsResponse.data?.length > 0) {
                    selectedEventId = eventsResponse.data[0]._id;
                    localStorage.setItem('selectedEventId', selectedEventId);
                }
            }

            setLoading(false);
            onClose();
            navigate('/profile', { state: { eventId: selectedEventId } });
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Login failed');
            console.error('Login error:', err);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/auth/google`;
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
                    ×
                </button>
                <h2>Log In</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        className={styles.modalInput}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                    <input
                        className={styles.modalInput}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </form>

                <div className={styles.divider}>or</div>

                <button className={styles.googleButton} onClick={handleGoogleLogin}>
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        className={styles.googleLogo}
                    />
                    Continue with Google
                </button>

                <p className={styles.switchText}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => {
                            onClose();
                            onSwitchToRegister && onSwitchToRegister();
                        }}
                        className={styles.switchButton}
                        type="button"
                    >
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
}
