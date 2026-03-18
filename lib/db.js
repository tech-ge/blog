/**
 * lib/db.js
 * Shared MongoDB connection for Vercel serverless functions.
 * Compatible with Mongoose 8+ (no deprecated options).
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
    if (isConnected && mongoose.connection.readyState === 1) return;

    if (!MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not set');
    }

    try {
        await mongoose.connect(MONGO_URI); // Mongoose 8 — no extra options needed
        isConnected = true;
        console.log('MongoDB connected');
    } catch (err) {
        isConnected = false;
        console.error('MongoDB connection failed:', err.message);
        throw err;
    }
}

/* ══════════════════════════════
   SCHEMAS
══════════════════════════════ */

const userSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ['admin', 'member'], default: 'member' },
    phone:     { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
    title:      { type: String, required: true },
    section:    { type: String, required: true },
    visibility: { type: String, enum: ['public', 'members'], default: 'public' },
    mediaType:  { type: String, enum: ['image', 'video', 'none'], default: 'none' },
    media:      { type: String, default: '' },
    caption:    { type: String, default: '' },
    content:    { type: String, required: true },
    date:       { type: String, default: () => new Date().toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }) },
    author:     { type: String, default: 'TechGeo' },
    createdAt:  { type: Date, default: Date.now },
});

const subscriberSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    createdAt: { type: Date, default: Date.now },
});

const engagementSchema = new mongoose.Schema({
    postId:   { type: String, required: true, unique: true },
    views:    { type: Number, default: 0 },
    likes:    { type: Number, default: 0 },
    loves:    { type: Number, default: 0 },
    likedBy:  { type: [String], default: [] },
    lovedBy:  { type: [String], default: [] },
    comments: {
        type: [{
            userId: String,
            name:   String,
            text:   String,
            time:   String,
            _id:    false,
        }],
        default: [],
    },
});

/* Guard against model re-compilation in hot reload */
const User       = mongoose.models.User       || mongoose.model('User',       userSchema);
const Post       = mongoose.models.Post       || mongoose.model('Post',       postSchema);
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
const Engagement = mongoose.models.Engagement || mongoose.model('Engagement', engagementSchema);

module.exports = { connectDB, User, Post, Subscriber, Engagement };
