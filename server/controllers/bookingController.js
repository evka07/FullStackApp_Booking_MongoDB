const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { row, seat, date, event } = req.body;

        if (!row || !seat) {
            return res.status(400).json({ message: 'Row and seat are required.' });
        }

        if (!date || isNaN(new Date(date).getTime())) {
            return res.status(400).json({ message: 'Valid date is required.' });
        }

        if (!event) {
            return res.status(400).json({ message: 'Event ID is required.' });
        }

        const bookingDate = new Date(date);

        const existingBooking = await Booking.findOne({
            row,
            seat,
            date: bookingDate,
            event,
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Seat already booked for this event and date.' });
        }

        const booking = new Booking({
            row,
            seat,
            date: bookingDate,
            event,
            user: req.user._id,
        });

        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
};

// @desc    Get all bookings (optionally filtered)
// @route   GET /api/bookings
// @access  Private
const getAllBookings = async (req, res) => {
    try {
        const { date, event } = req.query;

        if (!event) {
            return res.status(400).json({ message: 'Event ID is required.' });
        }

        let filter = { event };

        if (date) {
            const bookingDate = new Date(date);
            if (isNaN(bookingDate.getTime())) {
                return res.status(400).json({ message: 'Valid date is required.' });
            }

            const start = new Date(bookingDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(bookingDate);
            end.setHours(23, 59, 59, 999);

            filter.date = { $gte: start, $lte: end };
        }

        const bookings = await Booking.find(filter).populate('user', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user', 'name email');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({ message: 'Server error while fetching booking.' });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
};
