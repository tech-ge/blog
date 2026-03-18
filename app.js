/* =====================================================
   app.js  —  TechGeo Blog Application Logic
   content.js must load before this file (provides allPosts)
===================================================== */

/* ═══════════════════════════════════════════════════
   SECTION METADATA  (no emojis — clean labels)
═══════════════════════════════════════════════════ */
const sectionMeta = {
    sports:    { label: 'Sports',    public: true  },
    health:    { label: 'Health',    public: true  },
    finance:   { label: 'Finance',   public: true  },
    politics:  { label: 'Politics',  public: true  },
    religion:  { label: 'Religion',  public: true  },
    economics: { label: 'Economics', public: true  },
    news:      { label: 'News',      public: true  },
    updates:   { label: 'Updates',   public: true  },
    articles:  { label: 'Articles',  public: true  },
    education: { label: 'Education', public: false },
    love:      { label: 'Love',      public: false },
    stories:   { label: 'Stories',   public: false },
    memes:     { label: 'Memes',     public: false },
    quotes:    { label: 'Quotes',    public: false },
    darkside:  { label: 'Dark Side', public: false },
    crime:     { label: 'Crime',     public: false },
};

/* ═══════════════════════════════════════════════════
   AUTH  —  STATE  (all calls go to /api/auth MongoDB)
═══════════════════════════════════════════════════ */
const API_BASE = '/api';

let currentUser  = null;
let currentToken = null;

function isLoggedIn() { return currentUser !== null; }

function saveSession(user, token) {
    currentUser  = user;
    currentToken = token;
    sessionStorage.setItem('techgeo_user',  JSON.stringify(user));
    sessionStorage.setItem('techgeo_token', token);
}

function loadSession() {
    const savedUser  = sessionStorage.getItem('techgeo_user');
    const savedToken = sessionStorage.getItem('techgeo_token');
    if (savedUser && savedToken) {
        currentUser  = JSON.parse(savedUser);
        currentToken = savedToken;
        updateNavForLoggedInUser();
    }
}

async function attemptLogin(email, password) {
    const res  = await fetch(API_BASE + '/auth?action=login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    saveSession({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role, avatar: 'User' }, data.token);
    authForm.style.display = 'none';
    updateNavForLoggedInUser();
    showToast('Welcome back, ' + data.user.name.split(' ')[0] + '!', 'success');
}

async function attemptRegister(name, email, phone, password) {
    if (!name || !email || !password) { showToast('Please fill in all required fields.', 'error'); return; }
    const res  = await fetch(API_BASE + '/auth?action=register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    saveSession({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role, avatar: 'User' }, data.token);
    authForm.style.display = 'none';
    updateNavForLoggedInUser();
    showToast('Account created! Welcome, ' + data.user.name.split(' ')[0] + '!', 'success');
}

function logout() {
    currentUser = null; currentToken = null;
    sessionStorage.removeItem('techgeo_user');
    sessionStorage.removeItem('techgeo_token');
    updateNavForGuest();
    showToast('You have been logged out.', 'info');
}

function updateNavForLoggedInUser() {
    const dashLink = currentUser.role === 'admin'
        ? ' <a href="admin.html" class="admin-dash-link" title="Admin Dashboard">&#9881;</a>' : '';
    loginLink.innerHTML =
        currentUser.avatar + ' ' + currentUser.name.split(' ')[0] +
        dashLink + ' <span class="logout-btn" id="logout-btn">Logout</span>';
    document.getElementById('logout-btn').addEventListener('click', e => {
        e.stopPropagation(); e.preventDefault(); logout();
    });
    document.querySelectorAll('.hidden-link').forEach(l => { l.style.opacity = '1'; l.title = 'Click to open'; });
}

function updateNavForGuest() {
    loginLink.innerHTML = 'User Login';
    document.querySelectorAll('.hidden-link').forEach(l => { l.style.opacity = '0.7'; l.title = 'Login required'; });
}

/* ── Utilities ── */
function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(message, type) {
    type = type || 'info';
    const existing = document.getElementById('toast-msg');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.textContent = message;
    const bg = type === 'success' ? '#1a3b0a' : type === 'error' ? '#7a0000' : '#333';
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:' + bg +
        ';color:#fff;padding:12px 24px;border-radius:50px;font-size:14px;font-weight:600;z-index:9999;' +
        'box-shadow:0 4px 20px rgba(0,0,0,.25);animation:toastIn .3s ease;';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity .4s'; setTimeout(() => toast.remove(), 400); }, 3000);
}

/* ═══════════════════════════════════════════════════
   AUTH  —  UI WIRING
═══════════════════════════════════════════════════ */
const loginLink    = document.getElementById('login-link');
const authForm     = document.getElementById('auth-form');
const loginForm    = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginLink.addEventListener('click', e => {
    e.preventDefault();
    if (isLoggedIn()) return;
    authForm.style.display = authForm.style.display === 'none' ? 'block' : 'none';
    showLogin();
});

document.addEventListener('click', e => {
    if (!authForm.contains(e.target) && e.target !== loginLink) authForm.style.display = 'none';
});

function showLogin()    { loginForm.style.display = 'block';  registerForm.style.display = 'none'; }
function showRegister() { loginForm.style.display = 'none';   registerForm.style.display = 'block'; }

document.getElementById('login-tab').addEventListener('click', showLogin);
document.getElementById('register-tab').addEventListener('click', showRegister);
document.getElementById('login-tab-2').addEventListener('click', showLogin);
document.getElementById('register-tab-2').addEventListener('click', showRegister);
document.getElementById('to-register').addEventListener('click', e => { e.preventDefault(); showRegister(); });
document.getElementById('to-login').addEventListener('click',    e => { e.preventDefault(); showLogin(); });

document.querySelector('#login-form form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.querySelector('#login-form .auth-submit');
    if (!email || !password) { showToast('Please enter your email and password.', 'error'); return; }
    btn.textContent = 'Checking...'; btn.disabled = true;
    try { await attemptLogin(email, password); }
    catch (err) { showToast(err.message, 'error'); document.getElementById('login-password').value = ''; }
    btn.textContent = 'Login'; btn.disabled = false;
});

document.querySelector('#register-form form').addEventListener('submit', async e => {
    e.preventDefault();
    const name     = document.querySelector('#register-form input[type="text"]').value.trim();
    const email    = document.querySelector('#register-form input[type="email"]').value.trim();
    const phone    = document.querySelector('#register-form input[type="tel"]').value.trim();
    const password = document.querySelector('#register-form input[type="password"]').value;
    const btn = document.querySelector('#register-form .auth-submit');
    btn.textContent = 'Creating...'; btn.disabled = true;
    try { await attemptRegister(name, email, phone, password); }
    catch (err) { showToast(err.message, 'error'); }
    btn.textContent = 'Create Account'; btn.disabled = false;
});

/* ═══════════════════════════════════════════════════
   ENGAGEMENT  —  MongoDB via /api/engagement
   • Bulk-fetched once after posts load (one API call)
   • Optimistic UI: update instantly, sync DB background
═══════════════════════════════════════════════════ */
const engCache = {};

function authHeader() {
    return currentToken ? { 'Authorization': 'Bearer ' + currentToken } : {};
}

function getCachedEngagement(postId) {
    return engCache[postId] || { views:0, likes:0, loves:0, comments:[], userLiked:false, userLoved:false, commentCount:0 };
}

/* Bulk-fetch engagement for all visible posts in one request */
async function fetchAllEngagement(postIds) {
    if (!postIds || postIds.length === 0) return;
    try {
        const res  = await fetch(API_BASE + '/engagement?postIds=' + postIds.join(','), {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        const map = await res.json();
        Object.assign(engCache, map);
        /* Update all visible cards with real counts */
        postIds.forEach(id => {
            const card = document.getElementById(id);
            if (card && engCache[id]) updateCardEngagement(card, engCache[id]);
        });
    } catch (err) { console.warn('Bulk engagement fetch failed:', err.message); }
}

/* Single fetch (used when opening Read More modal) */
async function fetchEngagement(postId) {
    try {
        const res  = await fetch(API_BASE + '/engagement?postId=' + postId, {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        const data = await res.json();
        engCache[postId] = data;
        return data;
    } catch { return getCachedEngagement(postId); }
}

async function recordView(postId) {
    /* Optimistic: increment locally immediately */
    if (!engCache[postId]) engCache[postId] = getCachedEngagement(postId);
    engCache[postId].views = (engCache[postId].views || 0) + 1;
    const optimisticViews = engCache[postId].views;
    /* Fire-and-forget to DB */
    fetch(API_BASE + '/engagement?action=view', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
    }).then(r => r.json()).then(d => {
        if (engCache[postId]) engCache[postId].views = d.views;
    }).catch(() => {});
    return optimisticViews;
}

async function toggleReaction(postId, type) {
    if (!isLoggedIn()) { openLoginPrompt(); return null; }

    /* Optimistic UI — flip state immediately */
    if (!engCache[postId]) engCache[postId] = getCachedEngagement(postId);
    const eng    = engCache[postId];
    const liked  = type === 'likes';
    const flag   = liked ? 'userLiked' : 'userLoved';
    const count  = liked ? 'likes'     : 'loves';
    const wasOn  = eng[flag];
    eng[flag]  = !wasOn;
    eng[count] = Math.max(0, (eng[count] || 0) + (wasOn ? -1 : 1));

    /* Sync to DB in background */
    fetch(API_BASE + '/engagement?action=' + (liked ? 'like' : 'love'), {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ postId })
    }).then(r => {
        if (r.status === 401) { openLoginPrompt(); return; }
        return r.json();
    }).then(data => {
        if (data) { engCache[postId] = data; syncModalEngagement(postId); }
    }).catch(() => {});

    return eng; /* return optimistic state immediately */
}

async function addComment(postId, text) {
    if (!isLoggedIn()) { openLoginPrompt(); return null; }
    if (!text.trim()) return null;

    /* Optimistic: add comment locally immediately */
    if (!engCache[postId]) engCache[postId] = getCachedEngagement(postId);
    const optimisticComment = {
        userId: currentUser.id,
        name:   currentUser.name,
        text:   text.trim(),
        time:   new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
    };
    engCache[postId].comments = [...(engCache[postId].comments || []), optimisticComment];
    engCache[postId].commentCount = engCache[postId].comments.length;

    /* Sync to DB */
    try {
        const res = await fetch(API_BASE + '/engagement?action=comment', {
            method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
            body: JSON.stringify({ postId, text: text.trim() })
        });
        if (res.status === 401) { openLoginPrompt(); return null; }
        const data = await res.json();
        engCache[postId] = data;
        return data;
    } catch { return engCache[postId]; }
}

/* ═══════════════════════════════════════════════════
   CARD  —  BUILD
═══════════════════════════════════════════════════ */
function getLabel(section) {
    return (sectionMeta[section] && sectionMeta[section].label) ? sectionMeta[section].label : section;
}

function buildEngagementBar(post) {
    const eng = getCachedEngagement(post.id);
    return (
        '<div class="eng-bar" data-post="' + post.id + '">' +
            '<span class="eng-views">Views: <span class="eng-views-count">' + eng.views + '</span></span>' +
            '<button class="eng-btn like-btn' + (eng.userLiked ? ' reacted' : '') + '">Like <span class="like-count">' + eng.likes + '</span></button>' +
            '<button class="eng-btn love-btn' + (eng.userLoved ? ' reacted' : '') + '">Love <span class="love-count">' + eng.loves + '</span></button>' +
            '<button class="eng-btn comment-trigger">Comments <span class="comment-count">' + eng.commentCount + '</span></button>' +
            '<button class="eng-btn share-btn">Share</button>' +
        '</div>'
    );
}

const CARD_FOOTER =
    '<div class="card-footer">' +
        '<span class="card-footer-brand"><span class="green">Tech</span><span class="red">Geo</span> &mdash; East Africa\'s Tech Blog</span>' +
        '<div class="card-footer-socials">' +
            '<a href="https://www.facebook.com/profile.php?id=61551668602567" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>' +
            '<a href="https://instagram.com/techg254" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>' +
            '<a href="https://wa.me/message/GLEMGMF4KOW4C1" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
            '<a href="https://youtube.com/@freelancer_ke1?si=xI40shhYNDqNOCK3" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>' +
            '<a href="https://www.tiktok.com/@geotechn?_t=ZM-90oyN5SDDDw&_r=1" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>' +
        '</div>' +
    '</div>';

function buildCard(post) {
    /* Only render media if there is actual media */
    const hasMedia  = post.mediaType && post.mediaType !== 'none' && post.media && post.media.trim() !== '';
    const mediaHTML = post.mediaType === 'video' && hasMedia
        ? '<iframe src="' + escHtml(post.media) + '" frameborder="0" allowfullscreen></iframe>'
        : post.mediaType === 'image' && hasMedia
        ? '<img src="' + escHtml(post.media) + '" alt="' + escHtml(post.caption || '') + '">'
        : '';

    const preview   = post.content.length > 400 ? post.content.slice(0, 400) + '...' : post.content;
    const dateBadge = post.date ? '<span class="post-date">' + escHtml(post.date) + '</span>' : '';
    const leftClass = hasMedia ? 'post-left' : 'post-left post-left-full';
    const rightCol  = hasMedia
        ? '<div class="post-right">' +
              '<div class="post-media">' + mediaHTML + '</div>' +
              '<p class="post-caption">' + escHtml(post.caption || '') + '</p>' +
          '</div>'
        : '';

    const card = document.createElement('article');
    card.className        = 'post-card';
    card.id               = post.id;
    card.dataset.section  = post.section;
    card.dataset.category = post.category || post.section;

    card.innerHTML =
        '<div class="post-card-header">' +
            '<div class="post-card-meta">' +
                '<span class="post-category-badge">' + escHtml(getLabel(post.section)) + '</span>' +
                dateBadge +
            '</div>' +
            '<h2 class="post-title">' + escHtml(post.title) + '</h2>' +
        '</div>' +
        '<div class="post-card-body">' +
            '<div class="' + leftClass + '">' +
                '<p class="post-content">' + escHtml(preview) + '</p>' +
                '<button class="read-more-btn">Read More</button>' +
            '</div>' +
            rightCol +
        '</div>' +
        buildEngagementBar(post) +
        CARD_FOOTER;

    /* Events */
    card.querySelector('.read-more-btn').addEventListener('click', async () => {
        const v = await recordView(post.id);
        const vc = card.querySelector('.eng-views-count');
        if (vc) vc.textContent = v;
        openReadMore(post);
    });

    card.querySelector('.like-btn').addEventListener('click', async e => {
        const eng = await toggleReaction(post.id, 'likes');
        if (!eng) return;
        e.currentTarget.classList.toggle('reacted', eng.userLiked);
        e.currentTarget.querySelector('.like-count').textContent = eng.likes;
        syncModalEngagement(post.id);
    });

    card.querySelector('.love-btn').addEventListener('click', async e => {
        const eng = await toggleReaction(post.id, 'loves');
        if (!eng) return;
        e.currentTarget.classList.toggle('reacted', eng.userLoved);
        e.currentTarget.querySelector('.love-count').textContent = eng.loves;
        syncModalEngagement(post.id);
    });

    card.querySelector('.share-btn').addEventListener('click', e => {
        e.stopPropagation(); openShareModal(post);
    });

    card.querySelector('.comment-trigger').addEventListener('click', async () => {
        const v = await recordView(post.id);
        const vc = card.querySelector('.eng-views-count');
        if (vc) vc.textContent = v;
        openReadMore(post, true);
    });

    return card;
}

function updateCardEngagement(card, eng) {
    if (!card || !eng) return;
    const vc = card.querySelector('.eng-views-count');  if (vc) vc.textContent = eng.views;
    const lc = card.querySelector('.like-count');        if (lc) lc.textContent = eng.likes;
    const oc = card.querySelector('.love-count');        if (oc) oc.textContent = eng.loves;
    const cc = card.querySelector('.comment-count');     if (cc) cc.textContent = eng.commentCount;
    const lb = card.querySelector('.like-btn');          if (lb) lb.classList.toggle('reacted', eng.userLiked);
    const vb = card.querySelector('.love-btn');          if (vb) vb.classList.toggle('reacted', eng.userLoved);
}

/* ═══════════════════════════════════════════════════
   MODAL  —  ENGAGEMENT SYNC
═══════════════════════════════════════════════════ */
async function syncModalEngagement(postId) {
    const eng = await fetchEngagement(postId);
    const get = id => document.getElementById(id);
    const lc = get('rm-like-count');    if (lc) lc.textContent = eng.likes;
    const vc = get('rm-love-count');    if (vc) vc.textContent = eng.loves;
    const cc = get('rm-comment-count'); if (cc) cc.textContent = eng.commentCount;
    const lb = get('rm-like-btn');      if (lb) lb.classList.toggle('reacted', eng.userLiked);
    const vb = get('rm-love-btn');      if (vb) vb.classList.toggle('reacted', eng.userLoved);
    renderModalComments(eng.comments || []);
    const card = document.getElementById(postId);
    if (card) updateCardEngagement(card, eng);
}

function renderModalComments(comments) {
    const list = document.getElementById('rm-comments-list');
    if (!list) return;
    if (!comments || comments.length === 0) {
        list.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>'; return;
    }
    list.innerHTML = comments.map(c =>
        '<div class="comment-item">' +
            '<div class="comment-meta">' +
                '<span class="comment-author">' + escHtml(c.name) + '</span>' +
                '<span class="comment-time">' + escHtml(c.time) + '</span>' +
            '</div>' +
            '<p class="comment-text">' + escHtml(c.text) + '</p>' +
        '</div>'
    ).join('');
}

/* ═══════════════════════════════════════════════════
   MODAL  —  OPEN READ MORE
═══════════════════════════════════════════════════ */
async function openReadMore(post, scrollToComments) {
    const hasMedia  = post.mediaType && post.mediaType !== 'none' && post.media && post.media.trim() !== '';
    const mediaHTML = post.mediaType === 'video' && hasMedia
        ? '<div class="rm-media"><iframe src="' + escHtml(post.media) + '" frameborder="0" allowfullscreen></iframe></div>'
        : post.mediaType === 'image' && hasMedia
        ? '<div class="rm-media"><img src="' + escHtml(post.media) + '" alt="' + escHtml(post.caption || '') + '"></div>'
        : '';

    const modal  = document.getElementById('read-more-modal');
    const cached = getCachedEngagement(post.id);

    document.getElementById('rm-badge').textContent    = getLabel(post.section);
    document.getElementById('rm-title').textContent    = post.title;
    const rmDate = document.getElementById('rm-date');
    if (rmDate) rmDate.textContent = post.date ? post.date : '';
    document.getElementById('rm-media-wrap').innerHTML = mediaHTML;
    document.getElementById('rm-caption').textContent  = post.caption || '';
    document.getElementById('rm-content').textContent  = post.content;

    document.getElementById('rm-views-count').textContent   = cached.views;
    document.getElementById('rm-like-count').textContent    = cached.likes;
    document.getElementById('rm-love-count').textContent    = cached.loves;
    document.getElementById('rm-comment-count').textContent = cached.commentCount;
    document.getElementById('rm-like-btn').classList.toggle('reacted', cached.userLiked);
    document.getElementById('rm-love-btn').classList.toggle('reacted', cached.userLoved);
    renderModalComments(cached.comments || []);

    modal.dataset.postId         = post.id;
    modal.dataset.postVisibility = post.visibility || 'public';

    const ci = document.getElementById('rm-comment-input-wrap');
    if (ci) ci.style.display = isLoggedIn() ? 'flex' : 'none';
    const cl = document.getElementById('rm-comment-login-note');
    if (cl) cl.style.display = isLoggedIn() ? 'none' : 'block';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    /* Refresh from DB quietly — don't block the modal opening */
    fetchEngagement(post.id).then(eng => {
        if (readMoreModal.dataset.postId !== post.id) return; /* modal changed */
        document.getElementById('rm-views-count').textContent   = eng.views;
        document.getElementById('rm-like-count').textContent    = eng.likes;
        document.getElementById('rm-love-count').textContent    = eng.loves;
        document.getElementById('rm-comment-count').textContent = eng.commentCount;
        document.getElementById('rm-like-btn').classList.toggle('reacted', eng.userLiked);
        document.getElementById('rm-love-btn').classList.toggle('reacted', eng.userLoved);
        renderModalComments(eng.comments || []);
    });

    if (scrollToComments) {
        setTimeout(() => {
            const cs = document.getElementById('rm-comments-section');
            if (cs) cs.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
    }
}

/* ═══════════════════════════════════════════════════
   MODAL  —  WIRING
═══════════════════════════════════════════════════ */
const readMoreModal = document.getElementById('read-more-modal');

document.getElementById('close-read-more').addEventListener('click', () => {
    readMoreModal.style.display = 'none'; document.body.style.overflow = '';
});
readMoreModal.addEventListener('click', e => {
    if (e.target === readMoreModal) { readMoreModal.style.display = 'none'; document.body.style.overflow = ''; }
});

document.getElementById('rm-like-btn').addEventListener('click', async () => {
    const postId = readMoreModal.dataset.postId; if (!postId) return;
    const eng = await toggleReaction(postId, 'likes'); if (eng) syncModalEngagement(postId);
});
document.getElementById('rm-love-btn').addEventListener('click', async () => {
    const postId = readMoreModal.dataset.postId; if (!postId) return;
    const eng = await toggleReaction(postId, 'loves'); if (eng) syncModalEngagement(postId);
});
document.getElementById('rm-comment-submit').addEventListener('click', async () => {
    const postId = readMoreModal.dataset.postId;
    const input  = document.getElementById('rm-comment-box');
    if (!postId || !input || !input.value.trim()) return;
    const result = await addComment(postId, input.value);
    if (result) { input.value = ''; syncModalEngagement(postId); showToast('Comment posted!', 'success'); }
});
document.getElementById('rm-comment-box').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('rm-comment-submit').click(); }
});
document.getElementById('rm-share-btn').addEventListener('click', () => {
    const postId = readMoreModal.dataset.postId; if (!postId) return;
    const post = livePosts.find(p => p.id === postId);
    if (post) openShareModal(post);
});
document.getElementById('rm-comment-login-note').addEventListener('click', () => {
    readMoreModal.style.display = 'none'; document.body.style.overflow = '';
    authForm.style.display = 'block'; showLogin();
});

/* ═══════════════════════════════════════════════════
   LIVE POSTS  —  DB posts + content.js merged
═══════════════════════════════════════════════════ */
let livePosts = [...allPosts];

async function fetchAndMergePosts() {
    try {
        const res = await fetch(API_BASE + '/posts', {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        if (!res.ok) throw new Error('API ' + res.status);
        const dbPosts = await res.json();

        const normalised = dbPosts.map(p => ({
            id:         'db-' + p._id,
            _mongoId:   p._id,
            section:    p.section,
            category:   p.section,
            visibility: p.visibility,
            title:      p.title,
            mediaType:  p.mediaType || 'none',
            media:      p.media     || '',
            caption:    p.caption   || '',
            content:    p.content   || '',
            date:       p.date      || '',
            author:     p.author    || 'TechGeo',
        }));

        /* DB posts first; static posts appended if not already in DB by title */
        const dbTitles  = new Set(normalised.map(p => p.title.toLowerCase()));
        const staticOnly = allPosts.filter(p => !dbTitles.has(p.title.toLowerCase()));
        livePosts = [...normalised, ...staticOnly];

    } catch (err) {
        console.warn('Using static posts only:', err.message);
        livePosts = [...allPosts];
    }
}

/* ═══════════════════════════════════════════════════
   PUBLIC FEED
═══════════════════════════════════════════════════ */
const blogFeed = document.getElementById('blog-feed');
let currentFilter = 'all';

function renderPublicFeed(filter, searchQuery) {
    blogFeed.innerHTML = '';
    let posts = livePosts.filter(p => p.visibility === 'public');

    if (filter && filter !== 'all') posts = posts.filter(p => p.section === filter);

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        posts = posts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.section.toLowerCase().includes(q)
        );
    }

    if (posts.length === 0) {
        blogFeed.innerHTML = '<p class="no-results">No posts found.</p>'; return;
    }

    if (!filter || filter === 'all') {
        const sections = [...new Set(posts.map(p => p.section))];
        sections.forEach(sec => {
            const h = document.createElement('p');
            h.className = 'feed-section-title';
            h.textContent = getLabel(sec);
            blogFeed.appendChild(h);
            posts.filter(p => p.section === sec).forEach(p => blogFeed.appendChild(buildCard(p)));
        });
    } else {
        posts.forEach(p => blogFeed.appendChild(buildCard(p)));
    }

    /* One bulk request for all visible posts */
    fetchAllEngagement(posts.map(p => p.id));
}

/* ═══════════════════════════════════════════════════
   RIGHT SIDEBAR  —  LATEST TOPICS
═══════════════════════════════════════════════════ */
const tocList = document.getElementById('toc-list');

function buildTOC() {
    tocList.innerHTML = '';
    livePosts
        .filter(p => p.visibility === 'public')
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .forEach(post => {
            const li = document.createElement('li');
            const a  = document.createElement('a');
            a.href = '#';
            a.innerHTML = '<span class="toc-cat">' + escHtml(getLabel(post.section)) + '</span>' + escHtml(post.title);
            a.addEventListener('click', e => {
                e.preventDefault();
                setFilter(post.section);
                setTimeout(() => {
                    const t = document.getElementById(post.id);
                    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            });
            li.appendChild(a);
            tocList.appendChild(li);
        });
}

/* ═══════════════════════════════════════════════════
   FILTER
═══════════════════════════════════════════════════ */
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active-filter'));
    const active = document.getElementById('link-' + filter);
    if (active) active.classList.add('active-filter');
    renderPublicFeed(filter, document.getElementById('search-box').value.trim());
    blogFeed.scrollTop = 0;
}

document.querySelectorAll('.filter-link').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); setFilter(link.dataset.filter); });
});
document.querySelectorAll('.nav-link[data-filter]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        setFilter(link.dataset.filter);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-nav'));
        link.classList.add('active-nav');
    });
});

/* ═══════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════ */
const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');

function doSearch() { renderPublicFeed(currentFilter, searchBox.value.trim()); }
searchBtn.addEventListener('click', doSearch);
searchBox.addEventListener('input',   doSearch);
searchBox.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

/* ═══════════════════════════════════════════════════
   HIDDEN SECTION PANEL
═══════════════════════════════════════════════════ */
const hiddenOverlay    = document.getElementById('hidden-overlay');
const hiddenPanelFeed  = document.getElementById('hidden-panel-feed');
const hiddenPanelTitle = document.getElementById('hidden-panel-title');
const closePanel       = document.getElementById('close-panel');

function openHiddenSection(sectionKey) {
    const posts = livePosts.filter(p => p.section === sectionKey);
    hiddenPanelTitle.textContent = getLabel(sectionKey);
    hiddenPanelFeed.innerHTML = '';
    if (posts.length === 0) {
        hiddenPanelFeed.innerHTML = '<p class="no-results">No posts in this section yet.</p>';
    } else {
        posts.forEach(p => hiddenPanelFeed.appendChild(buildCard(p)));
    }
    hiddenOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    /* Bulk fetch engagement for all posts in this section */
    if (posts.length > 0) fetchAllEngagement(posts.map(p => p.id));
}

closePanel.addEventListener('click', () => { hiddenOverlay.style.display='none'; document.body.style.overflow=''; });
hiddenOverlay.addEventListener('click', e => {
    if (e.target === hiddenOverlay) { hiddenOverlay.style.display='none'; document.body.style.overflow=''; }
});
document.querySelectorAll('.hidden-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        isLoggedIn() ? openHiddenSection(link.dataset.hidden) : openLoginPrompt();
    });
});
document.querySelectorAll('.nav-link[data-hidden]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        isLoggedIn() ? openHiddenSection(link.dataset.hidden) : openLoginPrompt();
    });
});

/* ═══════════════════════════════════════════════════
   LOGIN PROMPT
═══════════════════════════════════════════════════ */
const loginPrompt    = document.getElementById('login-prompt');
const closePrompt    = document.getElementById('close-prompt');
const promptLoginBtn = document.getElementById('prompt-login-btn');

function openLoginPrompt() { loginPrompt.style.display = 'flex'; }
closePrompt.addEventListener('click', () => { loginPrompt.style.display = 'none'; });
loginPrompt.addEventListener('click', e => { if (e.target === loginPrompt) loginPrompt.style.display = 'none'; });
promptLoginBtn.addEventListener('click', () => {
    loginPrompt.style.display = 'none'; authForm.style.display = 'block'; showLogin();
});

/* ═══════════════════════════════════════════════════
   SUBSCRIBE  —  MongoDB via /api/subscribers
═══════════════════════════════════════════════════ */
function openSubscribeModal() {
    document.getElementById('subscribe-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

document.getElementById('subscribe-nav-btn').addEventListener('click', openSubscribeModal);
document.getElementById('close-subscribe').addEventListener('click', () => {
    document.getElementById('subscribe-modal').style.display = 'none'; document.body.style.overflow = '';
});
document.getElementById('subscribe-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('subscribe-modal')) {
        document.getElementById('subscribe-modal').style.display = 'none'; document.body.style.overflow = '';
    }
});
document.getElementById('subscribe-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name  = document.getElementById('sub-name').value.trim();
    const email = document.getElementById('sub-email').value.trim();
    const btn   = document.getElementById('sub-btn');
    if (!name || !email) { showToast('Please fill in your name and email.', 'error'); return; }
    btn.textContent = 'Subscribing...'; btn.disabled = true;
    try {
        const res  = await fetch(API_BASE + '/subscribers', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        const data = await res.json();
        if (res.status === 409) showToast('You are already subscribed!', 'info');
        else if (!res.ok) throw new Error(data.error || 'Subscription failed');
        else {
            showToast('Welcome, ' + name.split(' ')[0] + '! You are now subscribed.', 'success');
            document.getElementById('subscribe-modal').style.display = 'none';
            document.body.style.overflow = '';
            document.getElementById('sub-name').value  = '';
            document.getElementById('sub-email').value = '';
        }
    } catch (err) { showToast(err.message, 'error'); }
    btn.textContent = 'Subscribe Now'; btn.disabled = false;
});

/* ═══════════════════════════════════════════════════
   SHARE
═══════════════════════════════════════════════════ */
function buildShareUrl(post) {
    const base = window.location.href.split('?')[0].split('#')[0];
    return base + '?post=' + post.id + '&section=' + post.section + '&vis=' + post.visibility;
}

function openShareModal(post) {
    const url    = buildShareUrl(post);
    const text   = encodeURIComponent('Check this out on TechGeo: ' + post.title);
    const encUrl = encodeURIComponent(url);

    document.getElementById('share-post-title').textContent = post.title;
    document.getElementById('share-link-input').value = url;
    document.getElementById('share-private-note').style.display = post.visibility === 'members' ? 'block' : 'none';
    document.getElementById('share-wa').href = 'https://wa.me/?text=' + text + '%20' + encUrl;
    document.getElementById('share-fb').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encUrl;
    document.getElementById('share-tw').href = 'https://twitter.com/intent/tweet?text=' + text + '&url=' + encUrl;
    document.getElementById('share-tg').href = 'https://t.me/share/url?url=' + encUrl + '&text=' + text;
    document.getElementById('share-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

document.getElementById('close-share').addEventListener('click', () => {
    document.getElementById('share-modal').style.display = 'none'; document.body.style.overflow = '';
});
document.getElementById('share-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('share-modal')) {
        document.getElementById('share-modal').style.display = 'none'; document.body.style.overflow = '';
    }
});
document.getElementById('copy-link-btn').addEventListener('click', () => {
    const input = document.getElementById('share-link-input');
    input.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(() => showToast('Link copied!', 'success'));
    } else { document.execCommand('copy'); showToast('Link copied!', 'success'); }
});

/* ═══════════════════════════════════════════════════
   DEEP-LINK ROUTING
═══════════════════════════════════════════════════ */
function handleDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (!postId) return;
    const post = livePosts.find(p => p.id === postId);
    if (!post) return;
    if (post.visibility === 'members' && !isLoggedIn()) {
        setTimeout(() => { openLoginPrompt(); showToast('Login to view this members-only post.', 'info'); }, 400);
        return;
    }
    setTimeout(() => openReadMore(post), 300);
}

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
loadSession();

/* Show loading state immediately */
blogFeed.innerHTML = '<p class="no-results" id="loading-msg">Loading posts...</p>';

/* Render static posts right away so page is never blank */
renderPublicFeed('all', '');
buildTOC();

/* Then fetch DB posts and re-render */
fetchAndMergePosts().then(() => {
    renderPublicFeed(currentFilter, document.getElementById('search-box').value.trim());
    buildTOC();
    handleDeepLink();
}).catch(err => {
    console.error('Init error:', err);
    /* Still show static content even if DB fails */
    renderPublicFeed(currentFilter, '');
    buildTOC();
});

/* Hamburger menu toggle (mobile) */
const hamburger = document.getElementById('nav-hamburger');
const navUl     = document.querySelector('.ul');
if (hamburger && navUl) {
    hamburger.addEventListener('click', e => {
        e.stopPropagation();
        navUl.classList.toggle('nav-open');
    });
    document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !navUl.contains(e.target)) {
            navUl.classList.remove('nav-open');
        }
    });
}
