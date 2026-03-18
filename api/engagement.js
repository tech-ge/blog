/**
 * api/engagement.js
 *
 * POST /api/engagement?action=view     — record a view (public, no auth needed)
 * POST /api/engagement?action=like     — toggle like   (auth required)
 * POST /api/engagement?action=love     — toggle love   (auth required)
 * POST /api/engagement?action=comment  — add comment   (auth required)
 * GET  /api/engagement?postId=xxx      — get engagement for a post
 */

const jwt = require('jsonwebtoken');
const { connectDB, Engagement } = require('../lib/db');
const JWT_SECRET = process.env.JWT_SECRET || 'techgeo_secret';

function getUser(req) {
    try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        if (!token) return null;
        return jwt.verify(token, JWT_SECRET);
    } catch { return null; }
}

/* ensure engagement doc exists for a post */
async function ensureDoc(postId) {
    let doc = await Engagement.findOne({ postId });
    if (!doc) {
        doc = await Engagement.create({
            postId, views: 0, likes: 0, loves: 0,
            likedBy: [], lovedBy: [], comments: []
        });
    }
    return doc;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await connectDB();
        const user   = getUser(req);
        const action = req.query.action;
        const postId = req.query.postId || (req.body && req.body.postId);

        /* ── GET engagement for a post ── */
        if (req.method === 'GET') {
            if (!postId) return res.status(400).json({ error: 'postId required' });
            const doc = await ensureDoc(postId);
            return res.status(200).json(formatDoc(doc, user));
        }

        if (req.method !== 'POST')
            return res.status(405).json({ error: 'Method not allowed' });

        /* ── RECORD VIEW (no auth needed) ── */
        if (action === 'view') {
            if (!postId) return res.status(400).json({ error: 'postId required' });
            const doc = await Engagement.findOneAndUpdate(
                { postId },
                { $inc: { views: 1 }, $setOnInsert: { likes: 0, loves: 0, likedBy: [], lovedBy: [], comments: [] } },
                { new: true, upsert: true }
            );
            return res.status(200).json({ views: doc.views });
        }

        /* ── AUTH REQUIRED below ── */
        if (!user) return res.status(401).json({ error: 'Login required' });
        const userId = user.id || user._id;

        /* ── TOGGLE LIKE ── */
        if (action === 'like') {
            if (!postId) return res.status(400).json({ error: 'postId required' });
            const doc    = await ensureDoc(postId);
            const idx    = doc.likedBy.indexOf(userId);
            if (idx === -1) {
                doc.likedBy.push(userId);
                doc.likes = Math.max(0, (doc.likes || 0) + 1);
            } else {
                doc.likedBy.splice(idx, 1);
                doc.likes = Math.max(0, (doc.likes || 0) - 1);
            }
            await doc.save();
            return res.status(200).json(formatDoc(doc, user));
        }

        /* ── TOGGLE LOVE ── */
        if (action === 'love') {
            if (!postId) return res.status(400).json({ error: 'postId required' });
            const doc = await ensureDoc(postId);
            const idx = doc.lovedBy.indexOf(userId);
            if (idx === -1) {
                doc.lovedBy.push(userId);
                doc.loves = Math.max(0, (doc.loves || 0) + 1);
            } else {
                doc.lovedBy.splice(idx, 1);
                doc.loves = Math.max(0, (doc.loves || 0) - 1);
            }
            await doc.save();
            return res.status(200).json(formatDoc(doc, user));
        }

        /* ── ADD COMMENT ── */
        if (action === 'comment') {
            const text = req.body && req.body.text;
            if (!postId) return res.status(400).json({ error: 'postId required' });
            if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });
            const doc = await ensureDoc(postId);
            const comment = {
                userId,
                name: user.name,
                text: text.trim(),
                time: new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
            };
            doc.comments.push(comment);
            await doc.save();
            return res.status(200).json(formatDoc(doc, user));
        }

        return res.status(400).json({ error: 'Unknown action' });

    } catch (err) {
        console.error('Engagement error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

/* Format doc for frontend — include per-user reaction state */
function formatDoc(doc, user) {
    const userId = user ? (user.id || user._id) : null;
    return {
        postId:      doc.postId,
        views:       doc.views   || 0,
        likes:       doc.likes   || 0,
        loves:       doc.loves   || 0,
        comments:    doc.comments || [],
        userLiked:   userId ? doc.likedBy.includes(userId)  : false,
        userLoved:   userId ? doc.lovedBy.includes(userId)  : false,
        commentCount: (doc.comments || []).length,
    };
}
