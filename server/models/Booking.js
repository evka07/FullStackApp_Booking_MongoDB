const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema ({

    row: {
        type: Number,
        required: true,
    },
        seat: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
}, {
    timestamps: true,
    }
)

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking;