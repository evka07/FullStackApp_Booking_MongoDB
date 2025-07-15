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
        price: {
            amount: 120,
            label: 'From 120 PLN',
            currency: 'PLN',
        },
    },
    {
        title: 'Guns N’ Roses',
        date: new Date('2025-12-30'),
        time: '18:00',
        venue: 'Tauron Arena Kraków',
        description: 'World Tour 2025',
        price: {
            amount: 250,
            label: 'From 250 PLN',
            currency: 'PLN',
        },
    },
    {
        title: 'AC/DC ',
        date: new Date('2025-11-13'),
        time: '18:00',
        venue: 'PGE Narodowym w Warszawie',
        description: 'POWER UP Tour',
        price: {
            amount: 180,
            label: 'From 180 PLN',
            currency: 'PLN',
        },
    },
    {
        title: 'Iron Maiden',
        date: new Date('2025-09-02'),
        time: '20:00',
        venue: 'PGE Narodowym w Warszawie',
        description: 'World Tour 2025',
        price: {
            amount: 120,
            label: 'From 120 PLN',
            currency: 'PLN',
        },
    },
    {
        title: 'Hamlet — Teatr Słowackiego',
        date: new Date('2025-08-25'),
        time: '18:00',
        venue: 'Teatr Słowackiego, Kraków',
        description: 'A classical play in a modern interpretation',
        price: {
            amount: 90,
            label: 'From 90 PLN',
            currency: 'PLN',
        },
    },
    {
        title: 'Scorpions',
        date: new Date('2025-10-10'),
        time: '20:00',
        venue: 'Tauron Arena Kraków',
        description: 'World Tour, The End Of The Era',
        price: {
            amount: 200,
            label: 'From 200 PLN',
            currency: 'PLN',
        },
    },
    {
        title: 'The Offspring',
        date: new Date('2025-10-26'),
        time: '20:00',
        venue: 'Łódź Atlas, Arena',
        description: 'The Offspring wracają z nowym albumem i zapowiadają kolejną trasę koncertową',
        price: {
            amount: 180,
            label: 'From 180 PLN',
            currency: 'PLN',
        },
    },
    {
        title: 'Wawel Castle & Cathedral Guided Tour',
        date: new Date('2025-09-01'),
        time: '10:00',
        venue: 'Wawel Castle, Kraków',
        description: 'Explore the Wawel Castle & Cathedral on a guided tour, steeped in history and brimming with artistic wonders',
        price: {
            amount: 90,
            label: 'From 90 PLN',
            currency: 'PLN',
        },
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
