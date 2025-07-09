import { useState } from 'react';
import axios from 'axios';
import styles from './RegisterModal.module.scss';

export default function RegisterModal({ isOpen, onClose, navigate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
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

            // ✅ Сохраняем токен в localStorage
            localStorage.setItem('token', response.data.token);

            console.log('Registration successful:', response.data);
            setLoading(false);
            onClose();
            navigate('/profile');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Registration failed');
            console.error('Registration error:', err);
        }
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
            </div>
        </div>
    );
}
