import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import SeatRow from '../../components/SeatRow/SeatRow';
import styles from './Profile.module.scss';

export default function Profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const eventId = location.state?.eventId || localStorage.getItem('selectedEventId');
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.name;
    const userEmail = user?.email;

    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [date, setDate] = useState('2025-07-09');

    useEffect(() => {
        async function fetchBookedSeats() {
            if (!eventId) return;

            try {
                const response = await axiosInstance.get('/api/bookings', {
                    params: { date, event: eventId },
                });
                setBookedSeats(response.data.map(b => `${b.row}-${b.seat}`));
                setSelectedSeats([]);
            } catch (error) {
                console.error('Error loading booked seats:', error);
                if (error.response?.status === 401) {
                    alert('Please log in to view bookings.');
                    navigate('/');
                }
            }
        }

        fetchBookedSeats();
    }, [date, eventId, navigate]);

    const handleToggleSeat = (row, seat) => {
        const seatId = `${row}-${seat}`;
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    const handleBuy = async () => {
        if (!eventId) {
            alert('Please select an event first.');
            return;
        }

        try {
            for (const seatId of selectedSeats) {
                const [row, seat] = seatId.split('-').map(Number);
                await axiosInstance.post('/api/bookings', {
                    row,
                    seat,
                    date,
                    event: eventId,
                });
            }

            alert('Booking successful!');
            setSelectedSeats([]);

            const response = await axiosInstance.get('/api/bookings', {
                params: { date, event: eventId },
            });
            setBookedSeats(response.data.map(b => `${b.row}-${b.seat}`));
        } catch (error) {
            console.error('Booking error:', error);
            if (error.response?.status === 401) {
                alert('Please log in to book seats.');
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
        navigate('/');
    };

    return (
        <main className={styles.main}>
            <div className={styles.profileContainer}>
                <h1 className={styles.welcomeHeader}>
                    Welcome{userName ? `, ${userName}` : ''} 👋
                </h1>
                {userEmail && (
                    <p className={styles.userEmail}>
                        Logged in as <strong>{userEmail}</strong>
                    </p>
                )}

                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>

                {!eventId ? (
                    <div className={styles.noEventBlock}>
                        <p className={styles.noEventMessage}>
                            ⚠️ No event selected.
                        </p>
                        <p className={styles.hintText}>
                            Please choose an event to book your seats.
                        </p>
                        <button
                            className={styles.chooseEventButton}
                            onClick={() => navigate('/')}
                        >
                            🎟️ Choose Event
                        </button>
                    </div>
                ) : (
                    <>
                        <label htmlFor="booking-date">Select date:</label>
                        <input
                            id="booking-date"
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            min="2025-01-01"
                            max="2025-12-31"
                        />

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
                )}
            </div>
        </main>
    );
}
