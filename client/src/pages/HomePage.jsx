import { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div style={{ display: 'grid', gap: '1rem', padding: '2rem' }}>
            {events.map((event) => (
                <div
                    key={event._id}
                    style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}
                >
                    <h2>{event.title}</h2>
                    <p>{event.date.slice(0, 10)} • {event.time}</p>
                    <p>{event.venue}</p>
                    <p>{event.description}</p>
                    <p><strong>{event.price} PLN</strong></p>
                    <button>Book Now</button>
                </div>
            ))}
        </div>
    );
}
