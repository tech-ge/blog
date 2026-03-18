# TechGeo Blog — Setup & Deployment Guide

## File Structure
```
/
├── index.html          ← Main blog
├── style.css           ← Main styles
├── admin.html          ← Admin dashboard
├── admin.css           ← Admin styles
├── app.js              ← Blog frontend logic
├── admin.js            ← Admin frontend logic
├── content.js          ← Static post data (fallback)
├── package.json
├── vercel.json         ← Vercel routing
└── api/
    ├── _db.js          ← MongoDB connection + schemas
    ├── auth.js         ← Login / Register  (POST /api/auth)
    ├── posts.js        ← Post CRUD         (GET/POST/PUT/DELETE /api/posts)
    ├── upload.js       ← Media upload      (POST /api/upload)
    ├── users.js        ← User management   (GET/PUT/DELETE /api/users)
    └── subscribers.js  ← Newsletter        (GET/POST/DELETE /api/subscribers)
```

## 1. MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com → Create free cluster
2. Add a database user (username + password)
3. Whitelist all IPs: `0.0.0.0/0` (required for Vercel)
4. Get your connection string:
   `mongodb+srv://<user>:<pass>@cluster.mongodb.net/techgeo?retryWrites=true&w=majority`

## 2. Cloudinary Setup (for image/video uploads)
1. Go to https://cloudinary.com → Free account
2. Get your Cloud Name, API Key, API Secret from the dashboard

## 3. Create First Admin User
Run this once in MongoDB Atlas → Collections → Insert Document into `users`:
```json
{
  "name": "Geoffrey Muthoka",
  "email": "geoffreymuthoka200@gmail.com",
  "password": "$2a$10$HASH_HERE",
  "role": "admin",
  "createdAt": { "$date": "2026-03-18T00:00:00Z" }
}
```
Generate the bcrypt hash at: https://bcrypt-generator.com (use rounds: 10, password: admin123)

## 4. Deploy to Vercel
1. Push your project to GitHub
2. Go to https://vercel.com → Import project from GitHub
3. Add these Environment Variables in Vercel dashboard:

| Variable               | Value                                      |
|------------------------|--------------------------------------------|
| MONGO_URI              | mongodb+srv://...your Atlas URI...         |
| JWT_SECRET             | any_long_random_string_32chars_minimum     |
| CLOUDINARY_CLOUD_NAME  | your_cloud_name                            |
| CLOUDINARY_API_KEY     | your_api_key                               |
| CLOUDINARY_API_SECRET  | your_api_secret                            |

4. Click Deploy — Vercel auto-detects the `api/` folder as serverless functions

## 5. Admin Dashboard
- URL: `https://yoursite.vercel.app/admin`
- Login with your admin email + password
- Non-admins who try to login will be blocked with "Admin accounts only"

## 6. How Blog Posts Work
- Static posts in `content.js` always display (no database needed)
- Posts created in the Admin Dashboard are fetched from MongoDB via `/api/posts`
- Both sources render with the same card layout
- The frontend merges them: DB posts first (newest), then static content.js posts

## 7. Admin Features
- **New Post**: Title, section (16 options), visibility (public/members), media (URL or file upload), caption, content
- **Edit/Delete** any post
- **Users**: View all registered users, change roles (admin/member), delete users
- **Subscribers**: View all newsletter subscribers, search, export as CSV
- **Overview**: Live stats — total posts, users, subscribers, members-only posts