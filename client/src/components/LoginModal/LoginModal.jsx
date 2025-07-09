import { useState } from 'react';
import axios from 'axios';
import styles from './LoginModal.module.scss';

export default function LoginModal({ isOpen, onClose, navigate, onSwitchToRegister }) {
    const [formData, setFormData] = useState({
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
            const response = await axios.post('/api/users/login', formData);
            console.log('Login successful:', response.data);

            // Сохраняем токен в localStorage
            localStorage.setItem('token', response.data.token);

            setLoading(false);
            onClose();
            navigate('/profile');
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
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                </form>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => {
                            onClose();
                            onSwitchToRegister();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#0066ff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0,
                            fontSize: '0.9rem',
                        }}
                    >
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
}
