import { useState } from 'react';
import axios from 'axios';
import styles from './LoginModal.module.scss';

export default function LoginModal({ isOpen, onClose, navigate, onSwitchToRegister }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await axios.post('/api/users/login', formData);

            // Сохраняем токен и объект пользователя (с именем и email)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));

            // fallback: если событие не выбрано, получаем первое
            let selectedEventId = localStorage.getItem('selectedEventId');
            if (!selectedEventId) {
                const eventsResponse = await axios.get('/api/events');
                if (eventsResponse.data?.length > 0) {
                    selectedEventId = eventsResponse.data[0]._id;
                    localStorage.setItem('selectedEventId', selectedEventId);
                }
            }

            setLoading(false);
            onClose();

            // Переходим в профиль с выбранным eventId
            navigate('/profile', { state: { eventId: selectedEventId } });
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Login failed');
            console.error('Login error:', err);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
                <h2>Log In</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </form>

                <p className={styles.switchText}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => {
                            onClose();
                            onSwitchToRegister();
                        }}
                        className={styles.switchButton}
                    >
                        Register here
                    </button>
                </p>

            </div>
        </div>
    );
}
