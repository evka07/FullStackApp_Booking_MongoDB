const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getBookingById,
} = require('../controllers/bookingController');
const { protectMiddleware } = require('../middleware/authMiddleware');

// Все маршруты защищены — нужен авторизованный пользователь
router.route('/').post(protectMiddleware, createBooking).get(protectMiddleware, getAllBookings);
router.route('/:id').get(protectMiddleware, getBookingById);

module.exports = router;
