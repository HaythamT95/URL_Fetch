import rateLimit from "express-rate-limit";
import session from 'express-session';
import dotenv from "dotenv"

dotenv.config()

const globalLimiter = rateLimit({
	windowMs: 1000,
	limit: 5,
	handler: (req, res) => {
		logger.error(`Rate limit exceeded for IP: ${req.ip}`)
		return res.status(429).json({ error: 'Too many requests, please try again later.' });
	},
});

const session_ = session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: true, // Only send over HTTPS
		httpOnly: true,
		sameSite: 'strict', // CSRF protection
	},
})

export {globalLimiter, session_};