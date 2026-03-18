/**
 * api/auth.js
 * POST /api/auth?action=login    — login
 * POST /api/auth?action=register — register new member
 */

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { connectDB, User } = require('../lib/db');

const JWT_SECRET = process.env.JWT_SECRET || 'techgeo_secret';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

    try {
        await connectDB();
        const action = req.query.action;

        /* ── LOGIN ── */
        if (action === 'login') {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ error: 'Email and password required' });

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user)
                return res.status(401).json({ error: 'Invalid email or password' });

            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return res.status(401).json({ error: 'Invalid email or password' });

            const token = jwt.sign(
                { id: user._id, name: user.name, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        }

        /* ── REGISTER ── */
        if (action === 'register') {
            const { name, email, password, phone } = req.body;
            if (!name || !email || !password)
                return res.status(400).json({ error: 'Name, email and password required' });

            const existing = await User.findOne({ email: email.toLowerCase() });
            if (existing)
                return res.status(409).json({ error: 'Email already registered' });

            const hash    = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hash, phone: phone || '', role: 'member' });

            const token = jwt.sign(
                { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(201).json({
                token,
                user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
            });
        }

        return res.status(400).json({ error: 'Unknown action. Use ?action=login or ?action=register' });

    } catch (err) {
        console.error('Auth error:', err.message, err.stack);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
