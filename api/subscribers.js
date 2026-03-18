/**
 * api/subscribers.js
 * GET    /api/subscribers  — list all subscribers (admin only)
 * POST   /api/subscribers  — subscribe (public)
 * DELETE /api/subscribers?id=xxx  — remove subscriber (admin)
 */

const jwt = require('jsonwebtoken');
const { connectDB, Subscriber } = require('../lib/db');
const JWT_SECRET = process.env.JWT_SECRET || 'techgeo_secret';

function getUser(req) {
    try { return jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), JWT_SECRET); }
    catch { return null; }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await connectDB();
        const user = getUser(req);

        /* Public subscribe */
        if (req.method === 'POST') {
            const { name, email } = req.body;
            if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
            const existing = await Subscriber.findOne({ email: email.toLowerCase() });
            if (existing) return res.status(409).json({ error: 'Already subscribed' });
            const sub = await Subscriber.create({ name, email });
            return res.status(201).json({ success: true, id: sub._id });
        }

        /* Admin only */
        if (!user || user.role !== 'admin')
            return res.status(403).json({ error: 'Admin access required' });

        if (req.method === 'GET') {
            const subs = await Subscriber.find({}).sort({ createdAt: -1 }).lean();
            return res.status(200).json(subs);
        }

        if (req.method === 'DELETE' && req.query.id) {
            await Subscriber.findByIdAndDelete(req.query.id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('Subscribers error:', err.message, err.stack);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
};
