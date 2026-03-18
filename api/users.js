/**
 * api/users.js
 * GET    /api/users          — list all users (admin only)
 * PUT    /api/users?id=xxx   — update role (admin only)
 * DELETE /api/users?id=xxx   — delete user  (admin only)
 */

const jwt = require('jsonwebtoken');
const { connectDB, User } = require('./_db');
const JWT_SECRET = process.env.JWT_SECRET || 'techgeo_secret';

function getUser(req) {
    try { return jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), JWT_SECRET); }
    catch { return null; }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const user = getUser(req);
    if (!user || user.role !== 'admin')
        return res.status(403).json({ error: 'Admin access required' });

    try {
        await connectDB();
        const { id } = req.query;

        if (req.method === 'GET') {
            const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
            return res.status(200).json(users);
        }

        if (req.method === 'PUT' && id) {
            const { role } = req.body;
            if (!['admin', 'member'].includes(role))
                return res.status(400).json({ error: 'Invalid role' });
            const updated = await User.findByIdAndUpdate(id, { role }, { new: true, select: '-password' }).lean();
            if (!updated) return res.status(404).json({ error: 'User not found' });
            return res.status(200).json(updated);
        }

        if (req.method === 'DELETE' && id) {
            if (id === user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
            await User.findByIdAndDelete(id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('Users error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};