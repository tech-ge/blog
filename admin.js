/* =====================================================
   admin.js — TechGeo Admin Dashboard
   Talks to /api/* Vercel serverless functions
   which connect to MongoDB Atlas.
===================================================== */

/* ── API base URL (auto-detects local vs Vercel) ── */
const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

/* ═══════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════ */
let adminToken = null;
let adminUser  = null;
let allAdminPosts = [];
let allAdminUsers = [];
let allAdminSubs  = [];
let editingPostId = null;   // MongoDB _id of post being edited
let uploadedMediaUrl = '';  // final media URL (from link or cloudinary upload)
let mediaTabMode = 'link';  // 'link' | 'upload'

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function adminToast(msg, type = 'info') {
    const t = document.getElementById('admin-toast');
    t.textContent = msg;
    t.style.background = type === 'success' ? '#1a4a08' : type === 'error' ? '#7a0000' : '#333';
    t.style.display = 'block';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => { t.style.display = 'none'; }, 3500);
}

async function apiFetch(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;
    const res = await fetch(API + path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

function saveAdminSession(token, user) {
    adminToken = token;
    adminUser  = user;
    sessionStorage.setItem('techgeo_admin_token', token);
    sessionStorage.setItem('techgeo_admin_user',  JSON.stringify(user));
}

function loadAdminSession() {
    const token = sessionStorage.getItem('techgeo_admin_token');
    const user  = sessionStorage.getItem('techgeo_admin_user');
    if (token && user) {
        adminToken = token;
        adminUser  = JSON.parse(user);
        return true;
    }
    return false;
}

function clearAdminSession() {
    adminToken = null; adminUser = null;
    sessionStorage.removeItem('techgeo_admin_token');
    sessionStorage.removeItem('techgeo_admin_user');
}

/* ═══════════════════════════════════════════════════
   LOGIN GATE
═══════════════════════════════════════════════════ */
document.getElementById('gate-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('gate-email').value.trim();
    const password = document.getElementById('gate-password').value;
    const btn      = document.getElementById('gate-btn');
    const errEl    = document.getElementById('gate-error');
    errEl.style.display = 'none';
    btn.textContent = 'Signing in…'; btn.disabled = true;

    try {
        const data = await apiFetch('/auth?action=login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.user.role !== 'admin') {
            errEl.textContent = '⛔ Access denied. Admin accounts only.';
            errEl.style.display = 'block';
            clearAdminSession();
            btn.textContent = 'Login'; btn.disabled = false;
            return;
        }

        saveAdminSession(data.token, data.user);
        showDashboard();

    } catch (err) {
        errEl.textContent = '❌ ' + err.message;
        errEl.style.display = 'block';
    }

    btn.textContent = 'Login'; btn.disabled = false;
});

/* ═══════════════════════════════════════════════════
   SHOW DASHBOARD
═══════════════════════════════════════════════════ */
function showDashboard() {
    document.getElementById('admin-login-gate').style.display = 'none';
    document.getElementById('admin-dashboard').style.display  = 'flex';
    document.getElementById('admin-name-display').textContent  = adminUser.name;
    document.getElementById('admin-greeting-name').textContent = adminUser.name.split(' ')[0];
    loadOverview();
}

/* ═══════════════════════════════════════════════════
   LOGOUT
═══════════════════════════════════════════════════ */
document.getElementById('admin-logout-btn').addEventListener('click', () => {
    clearAdminSession();
    document.getElementById('admin-dashboard').style.display  = 'none';
    document.getElementById('admin-login-gate').style.display = 'flex';
    document.getElementById('gate-password').value = '';
});

/* ═══════════════════════════════════════════════════
   PANEL NAVIGATION
═══════════════════════════════════════════════════ */
const PANEL_TITLES = {
    overview:    'Overview',
    posts:       'All Posts',
    'new-post':  'New Post',
    users:       'Users',
    subscribers: 'Subscribers',
};

document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showPanel(link.dataset.panel);
    });
});

function showPanel(panelId) {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
    const panel = document.getElementById('panel-' + panelId);
    if (panel) panel.classList.add('active');
    const link = document.querySelector('[data-panel="' + panelId + '"]');
    if (link) link.classList.add('active');
    document.getElementById('panel-title').textContent = PANEL_TITLES[panelId] || panelId;

    if (panelId === 'overview')    loadOverview();
    if (panelId === 'posts')       loadPosts();
    if (panelId === 'users')       loadUsers();
    if (panelId === 'subscribers') loadSubscribers();
    if (panelId === 'new-post')    { editingPostId = null; resetPostForm(); }
}

/* ═══════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════ */
async function loadOverview() {
    try {
        const [posts, users, subs] = await Promise.all([
            apiFetch('/posts'),
            apiFetch('/users'),
            apiFetch('/subscribers'),
        ]);
        allAdminPosts = posts;
        allAdminUsers = users;
        allAdminSubs  = subs;

        document.getElementById('stat-posts').textContent  = posts.length;
        document.getElementById('stat-users').textContent  = users.length;
        document.getElementById('stat-subs').textContent   = subs.length;
        document.getElementById('stat-members-posts').textContent =
            posts.filter(p => p.visibility === 'members').length;

        const recent = posts.slice(0, 8);
        const list   = document.getElementById('overview-posts-list');
        if (recent.length === 0) {
            list.innerHTML = '<p class="loading-msg">No posts yet. Create your first one!</p>';
            return;
        }
        list.innerHTML = recent.map(p =>
            '<div class="overview-item">' +
                '<span class="ov-title">' + escHtml(p.title) + '</span>' +
                '<span class="ov-section">' + p.section + '</span>' +
                '<span class="ov-vis">' + (p.visibility === 'members' ? '🔒' : '🌐') + ' ' + p.date + '</span>' +
            '</div>'
        ).join('');
    } catch (err) {
        adminToast('Failed to load overview: ' + err.message, 'error');
    }
}

/* ═══════════════════════════════════════════════════
   POSTS TABLE
═══════════════════════════════════════════════════ */
async function loadPosts() {
    const wrap = document.getElementById('posts-table-wrap');
    wrap.innerHTML = '<p class="loading-msg">Loading posts…</p>';
    try {
        allAdminPosts = await apiFetch('/posts');
        renderPostsTable(allAdminPosts);
    } catch (err) {
        wrap.innerHTML = '<p class="loading-msg" style="color:var(--red)">Error: ' + err.message + '</p>';
    }
}

function renderPostsTable(posts) {
    const wrap = document.getElementById('posts-table-wrap');
    if (posts.length === 0) {
        wrap.innerHTML = '<p class="loading-msg">No posts found.</p>'; return;
    }
    wrap.innerHTML =
        '<table class="admin-table">' +
        '<thead><tr>' +
            '<th>Title</th><th>Section</th><th>Visibility</th><th>Date</th><th>Actions</th>' +
        '</tr></thead>' +
        '<tbody>' +
        posts.map(p =>
            '<tr>' +
                '<td class="td-title">' + escHtml(p.title) + '</td>' +
                '<td><span class="badge ' + p.visibility + '">' + p.section + '</span></td>' +
                '<td><span class="badge ' + p.visibility + '">' + (p.visibility === 'members' ? '🔒 Members' : '🌐 Public') + '</span></td>' +
                '<td>' + (p.date || '—') + '</td>' +
                '<td class="td-actions">' +
                    '<button class="admin-btn warning sm" onclick="editPost(\'' + p._id + '\')"><i class="fas fa-edit"></i> Edit</button>' +
                    '<button class="admin-btn danger sm" onclick="deletePost(\'' + p._id + '\', \'' + escHtml(p.title).replace(/'/g, "\\'") + '\')"><i class="fas fa-trash"></i></button>' +
                '</td>' +
            '</tr>'
        ).join('') +
        '</tbody></table>';
}

/* Search + filter posts */
document.getElementById('posts-search').addEventListener('input', filterPostsTable);
document.getElementById('posts-filter-section').addEventListener('change', filterPostsTable);
document.getElementById('posts-filter-vis').addEventListener('change', filterPostsTable);

function filterPostsTable() {
    const q   = document.getElementById('posts-search').value.toLowerCase();
    const sec = document.getElementById('posts-filter-section').value;
    const vis = document.getElementById('posts-filter-vis').value;
    const filtered = allAdminPosts.filter(p =>
        (!q   || p.title.toLowerCase().includes(q) || p.section.includes(q)) &&
        (!sec || p.section === sec) &&
        (!vis || p.visibility === vis)
    );
    renderPostsTable(filtered);
}

/* ═══════════════════════════════════════════════════
   CREATE / EDIT POST
═══════════════════════════════════════════════════ */
function toggleMediaInput() {
    const type = document.getElementById('pf-media-type').value;
    const show = type !== 'none';
    document.getElementById('media-source-wrap').style.display = show ? 'block' : 'none';
    document.getElementById('caption-wrap').style.display      = show ? 'block' : 'none';
}

function switchMediaTab(mode) {
    mediaTabMode = mode;
    document.getElementById('tab-link').classList.toggle('active',   mode === 'link');
    document.getElementById('tab-upload').classList.toggle('active', mode === 'upload');
    document.getElementById('media-link-wrap').style.display   = mode === 'link'   ? 'block' : 'none';
    document.getElementById('media-upload-wrap').style.display = mode === 'upload' ? 'block' : 'none';
}

/* Drag-and-drop */
const dropZone = document.getElementById('upload-drop-zone');
dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
});
dropZone.addEventListener('click', () => document.getElementById('pf-media-file').click());
document.getElementById('pf-media-file').addEventListener('change', e => {
    if (e.target.files[0]) handleFileSelected(e.target.files[0]);
});

async function handleFileSelected(file) {
    const preview   = document.getElementById('upload-preview');
    const progress  = document.getElementById('upload-progress');
    const fill      = document.getElementById('progress-fill');
    const status    = document.getElementById('upload-status');

    /* Local preview */
    preview.innerHTML = '';
    const objectUrl = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
        preview.innerHTML = '<img src="' + objectUrl + '" alt="preview">';
    } else if (file.type.startsWith('video/')) {
        preview.innerHTML = '<video src="' + objectUrl + '" controls></video>';
    }
    preview.style.display = 'block';

    /* Upload to Cloudinary via /api/upload */
    progress.style.display = 'block';
    fill.style.width = '30%';
    status.textContent = 'Uploading…';

    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(API + '/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + adminToken },
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        fill.style.width = '100%';
        status.textContent = '✅ Uploaded!';
        uploadedMediaUrl = data.url;

        /* Auto-set media type */
        const mt = document.getElementById('pf-media-type');
        mt.value = data.resourceType === 'video' ? 'video' : 'image';
        toggleMediaInput();

        adminToast('File uploaded successfully!', 'success');
    } catch (err) {
        status.textContent = '❌ ' + err.message;
        adminToast('Upload failed: ' + err.message, 'error');
    }
}

/* Character counter */
document.getElementById('pf-content').addEventListener('input', function() {
    document.getElementById('content-char-count').textContent = this.value.length;
});

/* Reset form */
function resetPostForm() {
    editingPostId    = null;
    uploadedMediaUrl = '';
    mediaTabMode     = 'link';
    document.getElementById('post-form').reset();
    document.getElementById('edit-post-id').value = '';
    document.getElementById('post-submit-btn').innerHTML = '<i class="fas fa-paper-plane"></i> Publish Post';
    document.getElementById('content-char-count').textContent = '0';
    document.getElementById('media-source-wrap').style.display  = 'none';
    document.getElementById('caption-wrap').style.display       = 'none';
    document.getElementById('upload-preview').style.display     = 'none';
    document.getElementById('upload-progress').style.display    = 'none';
    document.getElementById('media-link-wrap').style.display    = 'block';
    document.getElementById('media-upload-wrap').style.display  = 'none';
    document.getElementById('tab-link').classList.add('active');
    document.getElementById('tab-upload').classList.remove('active');
    document.getElementById('panel-title').textContent = 'New Post';
}

/* EDIT post — fill form */
async function editPost(mongoId) {
    showPanel('new-post');
    editingPostId = mongoId;

    try {
        const post = allAdminPosts.find(p => p._id === mongoId)
            || await apiFetch('/posts?id=' + mongoId);

        document.getElementById('edit-post-id').value = mongoId;
        document.getElementById('pf-title').value     = post.title;
        document.getElementById('pf-section').value   = post.section;
        document.getElementById('pf-visibility').value= post.visibility;
        document.getElementById('pf-media-type').value= post.mediaType || 'none';
        document.getElementById('pf-caption').value   = post.caption || '';
        document.getElementById('pf-content').value   = post.content;
        document.getElementById('content-char-count').textContent = post.content.length;

        uploadedMediaUrl = post.media || '';
        if (post.media) document.getElementById('pf-media-url').value = post.media;

        toggleMediaInput();
        document.getElementById('post-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Post';
        document.getElementById('panel-title').textContent   = 'Edit Post';
    } catch (err) {
        adminToast('Failed to load post: ' + err.message, 'error');
    }
}

/* SUBMIT post form */
document.getElementById('post-form').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('post-submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';

    const mediaType = document.getElementById('pf-media-type').value;
    let media = '';
    if (mediaType !== 'none') {
        media = mediaTabMode === 'upload'
            ? uploadedMediaUrl
            : document.getElementById('pf-media-url').value.trim();
    }

    const payload = {
        title:      document.getElementById('pf-title').value.trim(),
        section:    document.getElementById('pf-section').value,
        visibility: document.getElementById('pf-visibility').value,
        mediaType,
        media,
        caption:  document.getElementById('pf-caption').value.trim(),
        content:  document.getElementById('pf-content').value.trim(),
    };

    try {
        if (editingPostId) {
            await apiFetch('/posts?id=' + editingPostId, { method: 'PUT', body: JSON.stringify(payload) });
            adminToast('✅ Post updated!', 'success');
        } else {
            await apiFetch('/posts', { method: 'POST', body: JSON.stringify(payload) });
            adminToast('🎉 Post published!', 'success');
        }
        resetPostForm();
        showPanel('posts');
    } catch (err) {
        adminToast('❌ ' + err.message, 'error');
    }

    btn.disabled = false;
    btn.innerHTML = editingPostId
        ? '<i class="fas fa-save"></i> Update Post'
        : '<i class="fas fa-paper-plane"></i> Publish Post';
});

/* DELETE post */
function deletePost(mongoId, title) {
    showConfirm(
        'Delete Post',
        'Delete "' + title + '"? This cannot be undone.',
        async () => {
            try {
                await apiFetch('/posts?id=' + mongoId, { method: 'DELETE' });
                adminToast('🗑️ Post deleted.', 'success');
                loadPosts();
            } catch (err) {
                adminToast('❌ ' + err.message, 'error');
            }
        }
    );
}

/* ═══════════════════════════════════════════════════
   USERS TABLE
═══════════════════════════════════════════════════ */
async function loadUsers() {
    const wrap = document.getElementById('users-table-wrap');
    wrap.innerHTML = '<p class="loading-msg">Loading users…</p>';
    try {
        allAdminUsers = await apiFetch('/users');
        renderUsersTable(allAdminUsers);
    } catch (err) {
        wrap.innerHTML = '<p class="loading-msg" style="color:var(--red)">Error: ' + err.message + '</p>';
    }
}

function renderUsersTable(users) {
    const wrap = document.getElementById('users-table-wrap');
    if (users.length === 0) { wrap.innerHTML = '<p class="loading-msg">No users found.</p>'; return; }
    wrap.innerHTML =
        '<table class="admin-table"><thead><tr>' +
            '<th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>' +
        '</tr></thead><tbody>' +
        users.map(u =>
            '<tr>' +
                '<td>' + escHtml(u.name) + '</td>' +
                '<td>' + escHtml(u.email) + '</td>' +
                '<td><span class="badge ' + u.role + '">' + u.role + '</span></td>' +
                '<td>' + new Date(u.createdAt).toLocaleDateString('en-KE') + '</td>' +
                '<td class="td-actions">' +
                    (u.role === 'member'
                        ? '<button class="admin-btn warning sm" onclick="changeRole(\'' + u._id + '\', \'admin\')">Make Admin</button>'
                        : '<button class="admin-btn secondary sm" onclick="changeRole(\'' + u._id + '\', \'member\')">Make Member</button>') +
                    '<button class="admin-btn danger sm" onclick="deleteUser(\'' + u._id + '\', \'' + escHtml(u.name).replace(/'/g, "\\'") + '\')"><i class="fas fa-trash"></i></button>' +
                '</td>' +
            '</tr>'
        ).join('') +
        '</tbody></table>';
}

document.getElementById('users-search').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    renderUsersTable(allAdminUsers.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ));
});

async function changeRole(userId, newRole) {
    try {
        await apiFetch('/users?id=' + userId, { method: 'PUT', body: JSON.stringify({ role: newRole }) });
        adminToast('Role updated to ' + newRole, 'success');
        loadUsers();
    } catch (err) { adminToast('❌ ' + err.message, 'error'); }
}

function deleteUser(userId, name) {
    showConfirm('Delete User', 'Delete user "' + name + '"? This cannot be undone.', async () => {
        try {
            await apiFetch('/users?id=' + userId, { method: 'DELETE' });
            adminToast('User deleted.', 'success');
            loadUsers();
        } catch (err) { adminToast('❌ ' + err.message, 'error'); }
    });
}

/* ═══════════════════════════════════════════════════
   SUBSCRIBERS TABLE
═══════════════════════════════════════════════════ */
async function loadSubscribers() {
    const wrap = document.getElementById('subs-table-wrap');
    wrap.innerHTML = '<p class="loading-msg">Loading subscribers…</p>';
    try {
        allAdminSubs = await apiFetch('/subscribers');
        renderSubsTable(allAdminSubs);
    } catch (err) {
        wrap.innerHTML = '<p class="loading-msg" style="color:var(--red)">Error: ' + err.message + '</p>';
    }
}

function renderSubsTable(subs) {
    const wrap = document.getElementById('subs-table-wrap');
    if (subs.length === 0) { wrap.innerHTML = '<p class="loading-msg">No subscribers yet.</p>'; return; }
    wrap.innerHTML =
        '<table class="admin-table"><thead><tr>' +
            '<th>Name</th><th>Email</th><th>Subscribed</th><th>Action</th>' +
        '</tr></thead><tbody>' +
        subs.map(s =>
            '<tr>' +
                '<td>' + escHtml(s.name) + '</td>' +
                '<td>' + escHtml(s.email) + '</td>' +
                '<td>' + new Date(s.createdAt).toLocaleDateString('en-KE') + '</td>' +
                '<td><button class="admin-btn danger sm" onclick="deleteSub(\'' + s._id + '\')"><i class="fas fa-trash"></i></button></td>' +
            '</tr>'
        ).join('') +
        '</tbody></table>';
}

document.getElementById('subs-search').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    renderSubsTable(allAdminSubs.filter(s =>
        s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    ));
});

async function deleteSub(subId) {
    try {
        await apiFetch('/subscribers?id=' + subId, { method: 'DELETE' });
        adminToast('Subscriber removed.', 'success');
        loadSubscribers();
    } catch (err) { adminToast('❌ ' + err.message, 'error'); }
}

/* Export subscribers as CSV */
document.getElementById('export-subs-btn').addEventListener('click', () => {
    if (!allAdminSubs.length) { adminToast('No subscribers to export.', 'info'); return; }
    const rows = [['Name', 'Email', 'Date'], ...allAdminSubs.map(s => [s.name, s.email, new Date(s.createdAt).toLocaleDateString()])];
    const csv  = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'techgeo-subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
});

/* ═══════════════════════════════════════════════════
   CONFIRM DIALOG
═══════════════════════════════════════════════════ */
let confirmCallback = null;

function showConfirm(title, msg, cb) {
    confirmCallback = cb;
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent   = msg;
    document.getElementById('confirm-dialog').style.display = 'flex';
}

document.getElementById('confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-dialog').style.display = 'none';
    confirmCallback = null;
});

document.getElementById('confirm-ok').addEventListener('click', () => {
    document.getElementById('confirm-dialog').style.display = 'none';
    if (confirmCallback) { confirmCallback(); confirmCallback = null; }
});

/* ═══════════════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════════════ */
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════════════
   INIT — check for existing admin session
═══════════════════════════════════════════════════ */
if (loadAdminSession() && adminUser && adminUser.role === 'admin') {
    showDashboard();
} else {
    document.getElementById('admin-login-gate').style.display = 'flex';
}