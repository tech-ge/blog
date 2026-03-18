/**
 * api/posts.js
 * GET    /api/posts              — get all posts (public sees only public, token sees all)
 * GET    /api/posts?id=xxx       — get single post
 * POST   /api/posts              — create post (admin only)
 * PUT    /api/posts?id=xxx       — update post (admin only)
 * DELETE /api/posts?id=xxx       — delete post (admin only)
 */

const jwt = require('jsonwebtoken');
const { connectDB, Post } = require('../lib/db');

const JWT_SECRET = process.env.JWT_SECRET || 'techgeo_secret';

function getUser(req) {
    try {
        const auth = req.headers.authorization || '';
        const token = auth.replace('Bearer ', '');
        return jwt.verify(token, JWT_SECRET);
    } catch { return null; }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await connectDB();
        const user = getUser(req);
        const { id } = req.query;

        /* ── GET single post ── */
        if (req.method === 'GET' && id) {
            const post = await Post.findById(id).lean();
            if (!post) return res.status(404).json({ error: 'Post not found' });
            if (post.visibility === 'members' && (!user || user.role === 'guest'))
                return res.status(403).json({ error: 'Members only' });
            return res.status(200).json(post);
        }

        /* ── GET all posts ── */
        if (req.method === 'GET') {
            const filter = (user && user.role === 'admin') ? {} : { visibility: 'public' };
            const posts  = await Post.find(filter).sort({ createdAt: -1 }).lean();
            // Add a derived `id` field matching our frontend convention
            const mapped = posts.map(p => ({ ...p, id: 'post-' + p._id }));
            return res.status(200).json(mapped);
        }

        /* ── ADMIN ONLY below ── */
        if (!user || user.role !== 'admin')
            return res.status(403).json({ error: 'Admin access required' });

        /* ── CREATE post ── */
        if (req.method === 'POST') {
            const { title, section, visibility, mediaType, media, caption, content } = req.body;
            if (!title || !section || !content)
                return res.status(400).json({ error: 'title, section and content are required' });

            const post = await Post.create({
                title, section,
                visibility: visibility || 'public',
                mediaType:  mediaType  || 'none',
                media:      media      || '',
                caption:    caption    || '',
                content,
                author: user.name,
                date:   new Date().toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }),
            });
            return res.status(201).json({ ...post.toObject(), id: 'post-' + post._id });
        }

        /* ── UPDATE post ── */
        if (req.method === 'PUT' && id) {
            const updated = await Post.findByIdAndUpdate(id, req.body, { new: true }).lean();
            if (!updated) return res.status(404).json({ error: 'Post not found' });
            return res.status(200).json({ ...updated, id: 'post-' + updated._id });
        }

        /* ── DELETE post ── */
        if (req.method === 'DELETE' && id) {
            await Post.findByIdAndDelete(id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        console.error('Posts error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};
