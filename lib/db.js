/**
 * api/_db.js
 * Shared MongoDB connection for Vercel serverless functions.
 * Vercel reuses warm Lambda instances so we cache the connection.
 *
 * Set environment variable in Vercel dashboard:
 *   MONGO_URI = mongodb+srv://<user>:<pass>@cluster.mongodb.net/techgeo?retryWrites=true&w=majority
 *   JWT_SECRET = any_long_random_string
 */

const mongoose = require('mongoose');

let cached = global._mongoConn;

async function connectDB() {
    if (cached && mongoose.connection.readyState === 1) return cached;
    cached = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:    true,
        useUnifiedTopology: true,
    });
    global._mongoConn = cached;
    return cached;
}

/* ══════════════════════════════
   SCHEMAS
══════════════════════════════ */

/* User */
const userSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true },   // bcrypt hash
    role:      { type: String, enum: ['admin', 'member'], default: 'member' },
    createdAt: { type: Date, default: Date.now },
});

/* Post */
const postSchema = new mongoose.Schema({
    title:      { type: String, required: true },
    section:    { type: String, required: true },   // sports, health, finance …
    visibility: { type: String, enum: ['public', 'members'], default: 'public' },
    mediaType:  { type: String, enum: ['image', 'video', 'none'], default: 'none' },
    media:      { type: String, default: '' },      // URL or uploaded filename
    caption:    { type: String, default: '' },
    content:    { type: String, required: true },
    date:       { type: String, default: () => new Date().toLocaleDateString('en-KE', { day:'2-digit', month:'short', year:'numeric' }) },
    author:     { type: String, default: 'TechGeo' },
    createdAt:  { type: Date, default: Date.now },
});

/* Subscriber */
const subscriberSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    createdAt: { type: Date, default: Date.now },
});

/* Engagement */
const engagementSchema = new mongoose.Schema({
    postId:   { type: String, required: true, unique: true },
    views:    { type: Number, default: 0 },
    likes:    { type: Number, default: 0 },
    loves:    { type: Number, default: 0 },
    likedBy:  [String],   // user ids
    lovedBy:  [String],
    comments: [{
        userId: String,
        name:   String,
        text:   String,
        time:   String,
        _id:    false,
    }],
});

/* Export models (guard against re-compile in hot-reload) */
const User       = mongoose.models.User       || mongoose.model('User',       userSchema);
const Post       = mongoose.models.Post       || mongoose.model('Post',       postSchema);
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
const Engagement = mongoose.models.Engagement || mongoose.model('Engagement', engagementSchema);

module.exports = { connectDB, User, Post, Subscriber, Engagement };
