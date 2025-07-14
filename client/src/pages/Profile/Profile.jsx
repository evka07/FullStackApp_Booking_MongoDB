import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import SeatRow from '../../components/SeatRow/SeatRow';
import styles from './Profile.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Profile() {
    const navigate = useNavigate();

    // user теперь состояние, инициализируется из localStorage один раз
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

    const today = () => new Date();
    const [date, setDate] = useState(today());
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [allEvents, setAllEvents] = useState([]);

    // Получение всех событий
    useEffect(() => {
        async function listAllEvents() {
            try {
                const response = await axiosInstance.get('/api/events');
                setAllEvents(response.data);
            } catch (error) {
                console.error('Error loading events:', error);
            }
        }
        listAllEvents();
    }, []);

    // Найти событие на выбранную дату
    const eventToday = allEvents.find(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        const selectedDate = date.toISOString().split('T')[0];
        return eventDate === selectedDate;
    });

    // Получить забронированные места
    useEffect(() => {
        async function fetchBookedSeats() {
            if (!eventToday) return;

            try {
                const formattedDate = date.toISOString().split('T')[0];
                const response = await axiosInstance.get('/api/bookings', {
                    params: { date: formattedDate, event: eventToday._id },
                });
                setBookedSeats(response.data.map(b => `${b.row}-${b.seat}`));
                setSelectedSeats([]);
            } catch (error) {
                console.error('Error loading booked seats:', error);
                if (error.response?.status === 401) {
                    alert('Please log in to view bookings.');
                    setUser(null);      // <--- сбрасываем user при 401
                    navigate('/');
                }
            }
        }

        fetchBookedSeats();
    }, [date, eventToday, navigate]);

    const handleToggleSeat = (row, seat) => {
        const seatId = `${row}-${seat}`;
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    const handleBuy = async () => {
        if (!eventToday) {
            alert('Please select a date with an event.');
            return;
        }

        try {
            const formattedDate = date.toISOString().split('T')[0];
            for (const seatId of selectedSeats) {
                const [row, seat] = seatId.split('-').map(Number);
                await axiosInstance.post('/api/bookings', {
                    row,
                    seat,
                    date: formattedDate,
                    event: eventToday._id,
                });
            }

            alert('Booking successful!');
            setSelectedSeats([]);

            const response = await axiosInstance.get('/api/bookings', {
                params: { date: formattedDate, event: eventToday._id },
            });
            setBookedSeats(response.data.map(b => `${b.row}-${b.seat}`));
        } catch (error) {
            console.error('Booking error:', error);
            if (error.response?.status === 401) {
                alert('Please log in to book seats.');
                setUser(null);   // <--- сброс user при 401
                navigate('/');
            } else {
                alert('Failed to book seats. Please try again.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedEventId');
        setUser(null); // <--- сброс состояния
        navigate('/');
    };

    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.profileContainer}>
                    <p className={styles.noEventMessage}>Please, login or register first.</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.profileContainer}>
                <h1 className={styles.welcomeHeader}>
                    Welcome, {user.name} 👋
                </h1>
                <p className={styles.userEmail}>
                    Logged in as <strong>{user.email}</strong>
                </p>

                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>

                <label htmlFor="booking-date">Select date:</label>
                <DatePicker
                    id="booking-date"
                    selected={date}
                    onChange={setDate}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date('2025-01-01')}
                    maxDate={new Date('2025-12-31')}
                    includeDates={allEvents.map(e => new Date(e.date))}
                    className={styles.bookingDate}
                />

                {eventToday ? (
                    <>
                        <div className={styles.seatingSection}>
                            <div className={styles.stage}>Stage</div>

                            {[...Array(9)].map((_, index) => (
                                <SeatRow
                                    key={index + 1}
                                    rowNumber={index + 1}
                                    seatsCount={20}
                                    bookedSeats={bookedSeats}
                                    selectedSeats={selectedSeats}
                                    onToggleSeat={handleToggleSeat}
                                    seatPrice={50}
                                />
                            ))}
                        </div>

                        <div className={styles.selectedSeatsText}>
                            Selected seats:{' '}
                            {selectedSeats.length > 0
                                ? selectedSeats.join(', ')
                                : 'None'}
                        </div>

                        <button
                            className={styles.buyButton}
                            onClick={handleBuy}
                            disabled={selectedSeats.length === 0}
                        >
                            Buy {selectedSeats.length} seat(s)
                        </button>
                    </>
                ) : (
                    <p className={styles.noEventMessage}>
                        📅 There are no events on this date.
                    </p>
                )}
            </div>
        </main>
    );
}
