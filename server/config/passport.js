// config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                // Проверка: существует ли пользователь с таким email
                let user = await User.findOne({ email });

                if (user) {
                    // Если пользователь найден, но у него нет googleId — обновляем
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Если пользователь не найден — создаём нового
                user = await User.create({
                    name: profile.displayName,
                    email,
                    googleId: profile.id,
                    avatar: profile.photos?.[0]?.value, // если хочешь сохранить фото
                });

                return done(null, user);
            } catch (err) {
                console.error('GoogleStrategy error:', err);
                return done(err, null);
            }
        }
    )
);

// Сериализация пользователя
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Десериализация пользователя
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
