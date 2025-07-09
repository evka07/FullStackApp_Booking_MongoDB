import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.scss';  // импортируем ваши стили

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please log in first.');
                    return;
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get('/api/users/profile', config);
                setUser(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err.response?.data?.message || 'Profile loading failed');
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    if (error) return <p className={styles.error}>{error}</p>;
    if (!user) return <p>Loading profile...</p>;

    return (
        <main className={styles.main}>
            <div className={styles.profileContainer}>
                <h2>Welcome, {user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: '1.5rem',
                        padding: '0.6rem 1.2rem',
                        backgroundColor: '#0066ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    Log Out
                </button>
            </div>
        </main>
    );
}
