const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Events');

dotenv.config();

const events = [
    {
        title: 'Imagine Dragons Live',
        date: new Date('2025-09-10'),
        time: '19:00',
        venue: 'Tauron Arena Kraków',
        description: 'World Tour 2025',
        price: 120,
    },
    {
        title: 'Hamlet — Teatr Wielki',
        date: new Date('2025-08-25'),
        time: '18:00',
        venue: 'Teatr Wielki, Warsaw',
        description: 'A classical play in a modern interpretation',
        price: 90,
    },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Event.deleteMany(); // clear the collection
        await Event.insertMany(events);
        console.log('✅ Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
