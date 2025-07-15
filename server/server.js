// server.js

const express = require('express');
const cors = require('cors');
const path = require('node:path');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 🔐 Passport config
require('./config/passport');

dotenv.config();
connectDB();

const app = express();

// CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Body parser
app.use(express.json());

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true в продакшене с HTTPS
        httpOnly: true,
    },
}));

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// 🔐 Google OAuth
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: true,
    }),
    (req, res) => {
        // Успешная авторизация — можно перенаправить на frontend
        res.redirect(`${CLIENT_URL}/profile`);
    }
);

// Logout
app.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.redirect(CLIENT_URL);
    });
});

// Custom file serve
app.use((req, res, next) => {
    res.show = (relativePath) => {
        const fullPath = path.join(__dirname, relativePath);
        res.sendFile(fullPath);
    };
    next();
});

app.get('/', (req, res) => {
    res.show('home.html');
});

// Errors
app.use(notFound);
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
