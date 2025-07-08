const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    time: String,
    venue: String,
    description: String,
    price: Number,
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;