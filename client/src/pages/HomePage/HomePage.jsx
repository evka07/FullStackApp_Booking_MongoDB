import { useEffect, useState } from 'react';
import axios from 'axios';
import BannerVideo from "../../components/BannerVideo/BannerVideo";
import styles from "./HomePage.module.scss";

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                setEvents(data);
            } catch (error) {
                console.error('Error loading events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <p>Loading events...</p>;

    return (
        <div>
            <section className={styles.videoBanner}>
                <BannerVideo />
            </section>
            <div className={styles.eventsGrid}>
                {events.map((event) => (
                    <div key={event._id} className={styles.eventCard}>
                        <h2>{event.title}</h2>
                        <p>{event.date.slice(0, 10)} • {event.time}</p>
                        <p>{event.venue}</p>
                        <p>{event.description}</p>
                        <p><strong>{event.price} PLN</strong></p>
                        <button>Book Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
