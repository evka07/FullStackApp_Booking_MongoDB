import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

import BannerVideo from "../../components/BannerVideo/BannerVideo";
import QRCodeComponent from "../../components/QRcode/QRСodeComponent";
import PaymentIcons from "../../components/PaymentIcons/PaymentIcons";
import LoginModal from "../../components/LoginModal/LoginModal";
import RegisterModal from "../../components/RegisterModal/RegisterModal";

import styles from "./HomePage.module.scss";

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchEvents() {
            try {
                const { data } = await axiosInstance.get('/api/events');
                setEvents(data);
            } catch (error) {
                console.error('Error loading events:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    const handleBookNowClick = (eventId) => {
        const token = localStorage.getItem('token');

        // Сохраняем выбранный eventId, чтобы использовать при логине или регистрации
        localStorage.setItem('selectedEventId', eventId);

        if (token) {
            navigate('/profile', { state: { eventId } });
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
                            <button onClick={() => handleBookNowClick(event._id)}>
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <section className={styles.thingsSection}>
                <h2>Things to do in Krakow</h2>
                <div className={styles.categories}>
                    <div>
                        <h3>Top Attractions:</h3>
                        <ul>
                            <li><a href="https://www.wieliczka-saltmine.com/" target="_blank" rel="noopener noreferrer">Wieliczka Salt Mine</a></li>
                            <li><a href="https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera" target="_blank" rel="noopener noreferrer">Schindler's Factory</a></li>
                            <li><a href="https://mariacki.com/" target="_blank" rel="noopener noreferrer">St. Mary's Basilica</a></li>
                            <li><a href="https://wawel.krakow.pl/" target="_blank" rel="noopener noreferrer">Wawel Castle</a></li>
                            <li><a href="https://cskshooting.pl/en/" target="_blank" rel="noopener noreferrer">Shooting Range</a></li>
                            <li><a href="https://visit.auschwitz.org/" target="_blank" rel="noopener noreferrer">Krakow to Auschwitz</a></li>
                            <li><a href="https://www.zakopane-tickets.com/" target="_blank" rel="noopener noreferrer">Zakopane Tour</a></li>
                            <li><a href="https://plaszow.org/en/history-of-the-camp" target="_blank" rel="noopener noreferrer">Plaszow Concentration Camp</a></li>
                            <li><a href="https://muzeumkrakowa.pl/en/branches/rynek-underground" target="_blank" rel="noopener noreferrer">Rynek Underground Museum</a></li>
                            <li><a href="https://rejsy.krakow.pl/" target="_blank" rel="noopener noreferrer">River Cruises</a></li>
                            <li><a href="https://energylandia.pl/en/" target="_blank" rel="noopener noreferrer">Energylandia Amusement Park</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Transportation Services:</h3>
                        <ul>
                            <li><a href="https://krakowshuttle.com/krakow-airport-transfers/" target="_blank" rel="noopener noreferrer">Krakow Airport Transfers</a></li>
                            <li><a href="https://www.tickets-krakow.com/john-paul-ii-international-airport-transfers/" target="_blank" rel="noopener noreferrer">John Paul II International Airport Transfers</a></li>
                            <li><a href="https://www.katowice-airport.com/" target="_blank" rel="noopener noreferrer">Katowice Pyrzowice Airport Transfers</a></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className={styles.downloadSection}>
                <div className={styles.downloadWrapper}>

                    <div className={styles.logoColumn}>
                        <div className={styles.logoRow}>
                            <h3>Tickets Krakow</h3>
                            <div className={styles.qrCodeWrapper}>
                                <QRCodeComponent />
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactColumn}>
                        <h3>Get help 24/7</h3>
                        <ul>
                            <li><a href="#">Chat with us</a></li>
                            <li><a href="tel:+4834567890">Call us</a></li>
                            <li><a href="mailto:doetest@gmail.com">Email us</a></li>
                        </ul>
                    </div>

                    <div className={styles.companyColumn}>
                        <h3>Company details</h3>
                        <ul>
                            <li><a href="/privacy-policy">Privacy policy</a></li>
                            <li><a href="/terms">Terms of usage</a></li>
                            <li><a href="/cancellation-policy">Cancellation policy</a></li>
                        </ul>
                    </div>

                    <div className={styles.paymentColumn}>
                        <h3>We accept</h3>
                        <PaymentIcons />
                    </div>

                </div>
            </section>

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
