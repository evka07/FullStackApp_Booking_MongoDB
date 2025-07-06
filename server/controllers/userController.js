const User = require('../models/User'); // модель пользователя
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Регистрация нового пользователя
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверка обязательных полей
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Проверяем, есть ли пользователь с таким email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Хешируем пароль
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создаём нового пользователя
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Если пользователь успешно создан — возвращаем данные и токен
        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Логин пользователя
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверяем наличие пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Сравниваем пароль с хешем в базе
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Генерируем токен и возвращаем данные
        const token = generateToken(user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Получение профиля текущего пользователя
const getUserProfile = async (req, res) => {
    try {
        // req.user должен быть установлен в middleware защиты маршрута
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Функция для генерации JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // срок действия токена
    });
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
