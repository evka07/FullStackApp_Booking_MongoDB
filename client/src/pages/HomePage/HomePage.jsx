import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BannerVideo from "../../components/BannerVideo/BannerVideo";
import QRCodeComponent from "../../components/QRcode/QRСodeComponent";
import PaymentIcons from "../../components/PaymentIcons/PaymentIcons";

import LoginModal from "../../components/LoginModal/LoginModal";
import RegisterModal from "../../components/RegisterModal/RegisterModal";

import styles from "./HomePage.module.scss";

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Управление модалками
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchEvents() {
            try {
                const { data } = await axios.get('/api/events');
                setEvents(data);
            } catch (error) {
                console.error('Error loading events:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    const handleBookNowClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/profile');
        } else {
            setIsLoginOpen(true);
        }
    };

    if (loading) return <p>Loading events...</p>;

    return (
        <div>
            <section className={styles.videoBanner}>
                <BannerVideo />
            </section>

            <div className={styles.eventsGrid}>
                {events.map(event => (
                    <div key={event._id} className={styles.eventCard}>
                        <div>
                            <h2>{event.title}</h2>
                            <p>{event.date.slice(0, 10)} • {event.time}</p>
                            <p>{event.venue}</p>
                            <p className={styles.description}>{event.description}</p>
                        </div>
                        <div className={styles.cardFooter}>
                            <p><strong>{event.price?.label}</strong></p>
                            <button onClick={handleBookNowClick}>Book Now</button>
                        </div>
                    </div>
                ))}
            </div>

            <section className={styles.thingsSection}>
                <h2>Things to do in Krakow</h2>
                <div className={styles.categories}>
                    {/* ...твой существующий контент категорий... */}
                </div>
            </section>

            <section className={styles.downloadSection}>
                <div className={styles.downloadWrapper}>
                    {/* ...твой существующий контент загрузочного раздела... */}
                </div>
            </section>

            {/* Модалки логина и регистрации */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
                navigate={navigate}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
                navigate={navigate}
            />
        </div>
    );
}
