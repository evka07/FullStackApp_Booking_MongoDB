const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { row, seat, date } = req.body;

        const booking = new Booking({
            row,
            seat,
            date,
            user: req.user._id, // предполагается, что authMiddleware добавляет req.user
        });

        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
};

// @desc    Get single booking by ID
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
        res.status(500).json({ message: 'Server error while fetching booking.' });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
};
