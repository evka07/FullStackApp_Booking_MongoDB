import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import SeatRow from '../../components/SeatRow/SeatRow';
import styles from './Profile.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { logout, loginSuccess } from '../../redux/userSlice';

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector(state => state.user.userInfo?.user);
    const passedEventId = location.state?.eventId || null;

    const [selectedEventId, setSelectedEventId] = useState(passedEventId);
    const [date, setDate] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [allEvents, setAllEvents] = useState([]);

    // 🟢 Google login handler: extract token from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            axiosInstance
                .get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(res => {
                    const userInfo = {
                        user: {
                            _id: res.data._id,
                            name: res.data.name,
                            email: res.data.email,
                        },
                        token,
                    };

                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    dispatch(loginSuccess(userInfo));

                    // Clean URL
                    navigate('/profile', { replace: true });
                })
                .catch(err => {
                    console.error('Google login error:', err);
                });
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        async function loadEvents() {
            try {
                const response = await axiosInstance.get('/api/events');
                setAllEvents(response.data);
            } catch (error) {
                console.error('Error loading events:', error);
            }
        }
        loadEvents();
    }, []);

    const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    useEffect(() => {
        if (!selectedEventId || allEvents.length === 0) return;

        const selectedEvent = allEvents.find(e => e._id === selectedEventId);
        if (selectedEvent) {
            const eventDate = new Date(selectedEvent.date);
            if (!date || !isSameDay(date, eventDate)) {
                setDate(eventDate);
            }
        }
    }, [selectedEventId, allEvents]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        if (!newDate) {
            setSelectedEventId(null);
            return;
        }

        const matchedEvent = allEvents.find(ev => isSameDay(new Date(ev.date), newDate));
        setSelectedEventId(matchedEvent ? matchedEvent._id : null);
    };

    const eventToday = allEvents.find(event => event._id === selectedEventId);

    useEffect(() => {
        if (!eventToday || !date) {
            setBookedSeats([]);
            setSelectedSeats([]);
            return;
        }

        async function fetchBookedSeats() {
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
                    dispatch(logout());
                    navigate('/');
                }
            }
        }

        fetchBookedSeats();
    }, [date, eventToday, dispatch, navigate]);

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
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
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
                dispatch(logout());
                navigate('/');
            } else {
                alert('Failed to book seats. Please try again.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('selectedEventId');
        dispatch(logout());
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
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date('2025-01-01')}
                    maxDate={new Date('2025-12-31')}
                    includeDates={allEvents.map(e => new Date(e.date))}
                    className={styles.bookingDate}
                    placeholderText="Select event date"
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
