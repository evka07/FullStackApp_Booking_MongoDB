const express = require('express');
const cors = require('cors');
const path = require('node:path');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
console.log('CLIENT_URL for CORS:', process.env.CLIENT_URL);

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));


app.use(express.json());

// Подключение роутов с правильными префиксами
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);       // <--- здесь ожидается /register и /login
app.use('/api/bookings', bookingRoutes);

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

// Обработка 404 и ошибок
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
