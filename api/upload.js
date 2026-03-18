/**
 * api/upload.js
 * POST /api/upload  — upload image or video, returns public URL
 *
 * We use Cloudinary because Vercel serverless functions have no persistent disk.
 * Add to Vercel env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * npm install cloudinary
 *
 * Accepts multipart form-data with field "file".
 * Returns { url, publicId, resourceType }
 */

const cloudinary  = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'techgeo_secret';

function getUser(req) {
    try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        return jwt.verify(token, JWT_SECRET);
    } catch { return null; }
}

/* Parse raw multipart body — Vercel gives us req as a Node IncomingMessage */
function parseMultipart(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const user = getUser(req);
    if (!user || user.role !== 'admin')
        return res.status(403).json({ error: 'Admin access required' });

    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });

    try {
        /* Use busboy to parse multipart in Vercel serverless */
        const busboy = require('busboy');
        const bb = busboy({ headers: req.headers });

        let uploadResult = null;

        await new Promise((resolve, reject) => {
            bb.on('file', (name, file, info) => {
                const { mimeType } = info;
                const isVideo = mimeType.startsWith('video/');
                const resourceType = isVideo ? 'video' : 'image';

                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: resourceType, folder: 'techgeo' },
                    (err, result) => {
                        if (err) return reject(err);
                        uploadResult = {
                            url:          result.secure_url,
                            publicId:     result.public_id,
                            resourceType: result.resource_type,
                        };
                        resolve();
                    }
                );

                file.pipe(uploadStream);
            });

            bb.on('error', reject);
            req.pipe(bb);
        });

        if (!uploadResult)
            return res.status(400).json({ error: 'No file received' });

        return res.status(200).json(uploadResult);

    } catch (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
};

/* Tell Vercel not to parse the body — we handle it ourselves */
module.exports.config = { api: { bodyParser: false } };
