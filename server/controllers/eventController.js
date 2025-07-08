const Event = require('../models/Events');

const getEvents = async (req, res, next) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        next(error);
    }
};

module.exports = { getEvents };
