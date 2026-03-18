/* =====================================================
   app.js  —  TechGeo Blog — Application Logic
   content.js must be loaded before this file (provides allPosts)
===================================================== */

/* ═══════════════════════════════════════════════════
   SECTION METADATA
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
   AUTH  —  STATE & HELPERS
   All login/register calls go to /api/auth (MongoDB)
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
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    saveSession(
        { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role, avatar: '👤' },
        data.token
    );
    authForm.style.display = 'none';
    updateNavForLoggedInUser();
    showToast('✅ Welcome back, ' + data.user.name.split(' ')[0] + '!', 'success');
}

async function attemptRegister(name, email, phone, password) {
    if (!name || !email || !password) {
        showToast('⚠️ Please fill in all required fields.', 'error');
        return;
    }
    const res  = await fetch(API_BASE + '/auth?action=register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    saveSession(
        { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role, avatar: '👤' },
        data.token
    );
    authForm.style.display = 'none';
    updateNavForLoggedInUser();
    showToast('🎉 Account created! Welcome, ' + data.user.name.split(' ')[0] + '!', 'success');
}

function logout() {
    currentUser  = null;
    currentToken = null;
    sessionStorage.removeItem('techgeo_user');
    sessionStorage.removeItem('techgeo_token');
    updateNavForGuest();
    showToast('👋 You have been logged out.', 'info');
}

function updateNavForLoggedInUser() {
    const dashLink = currentUser.role === 'admin'
        ? ' <a href="admin.html" class="admin-dash-link" title="Admin Dashboard">⚙️</a>' : '';
    loginLink.innerHTML =
        currentUser.avatar + ' ' + currentUser.name.split(' ')[0] +
        dashLink +
        ' <span class="logout-btn" id="logout-btn">· Logout</span>';
    document.getElementById('logout-btn').addEventListener('click', e => {
        e.stopPropagation(); e.preventDefault(); logout();
    });
    document.querySelectorAll('.hidden-link').forEach(l => {
        l.style.opacity = '1'; l.title = 'Click to open';
    });
}

function updateNavForGuest() {
    loginLink.innerHTML = '👤 Login';
    document.querySelectorAll('.hidden-link').forEach(l => {
        l.style.opacity = '0.7'; l.title = 'Login required';
    });
}

/* ── Toast notification ── */
function showToast(message, type = 'info') {
    const existing = document.getElementById('toast-msg');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.textContent = message;
    const bg = type === 'success' ? '#1a3b0a' : type === 'error' ? '#7a0000' : '#333';
    toast.style.cssText =
        'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);' +
        'background:' + bg + ';color:#fff;padding:12px 24px;border-radius:50px;' +
        'font-size:14px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.25);animation:toastIn .3s ease;';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transition = 'opacity .4s';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
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
    if (!authForm.contains(e.target) && e.target !== loginLink)
        authForm.style.display = 'none';
});

function showLogin()    { loginForm.style.display = 'block';  registerForm.style.display = 'none'; }
function showRegister() { loginForm.style.display = 'none';   registerForm.style.display = 'block'; }

document.getElementById('login-tab').addEventListener('click', showLogin);
document.getElementById('register-tab').addEventListener('click', showRegister);
document.getElementById('login-tab-2').addEventListener('click', showLogin);
document.getElementById('register-tab-2').addEventListener('click', showRegister);
document.getElementById('to-register').addEventListener('click', e => { e.preventDefault(); showRegister(); });
document.getElementById('to-login').addEventListener('click',    e => { e.preventDefault(); showLogin(); });

/* ── Login form submit ── */
document.querySelector('#login-form form').addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn      = document.querySelector('#login-form .auth-submit');
    if (!email || !password) { showToast('⚠️ Please enter your email and password.', 'error'); return; }
    btn.textContent = 'Checking...'; btn.disabled = true;
    try {
        await attemptLogin(email, password);
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
        document.getElementById('login-password').value = '';
    }
    btn.textContent = 'Login'; btn.disabled = false;
});

/* ── Register form submit ── */
document.querySelector('#register-form form').addEventListener('submit', async e => {
    e.preventDefault();
    const name     = document.querySelector('#register-form input[type="text"]').value.trim();
    const email    = document.querySelector('#register-form input[type="email"]').value.trim();
    const phone    = document.querySelector('#register-form input[type="tel"]').value.trim();
    const password = document.querySelector('#register-form input[type="password"]').value;
    const btn      = document.querySelector('#register-form .auth-submit');
    btn.textContent = 'Creating...'; btn.disabled = true;
    try {
        await attemptRegister(name, email, phone, password);
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
    }
    btn.textContent = 'Create Account'; btn.disabled = false;
});

/* ═══════════════════════════════════════════════════
   ENGAGEMENT STORE
   Stored in sessionStorage — persists on refresh,
   clears when the browser tab is closed.
═══════════════════════════════════════════════════ */
const ENG_KEY = 'techgeo_engagement';

function loadEngagement() {
    try { return JSON.parse(sessionStorage.getItem(ENG_KEY)) || {}; }
    catch { return {}; }
}

function saveEngagement(store) {
    sessionStorage.setItem(ENG_KEY, JSON.stringify(store));
}

function getPostEngagement(postId) {
    const store = loadEngagement();
    if (!store[postId])
        store[postId] = { views: 0, likes: 0, loves: 0, comments: [], likedBy: [], lovedBy: [] };
    saveEngagement(store);
    return store[postId];
}

function recordView(postId) {
    const store = loadEngagement();
    if (!store[postId])
        store[postId] = { views: 0, likes: 0, loves: 0, comments: [], likedBy: [], lovedBy: [] };
    store[postId].views = (store[postId].views || 0) + 1;
    saveEngagement(store);
    return store[postId].views;
}

function toggleReaction(postId, type) {
    if (!isLoggedIn()) { openLoginPrompt(); return null; }
    const store = loadEngagement();
    if (!store[postId])
        store[postId] = { views: 0, likes: 0, loves: 0, comments: [], likedBy: [], lovedBy: [] };
    const eng   = store[postId];
    const byKey = type === 'likes' ? 'likedBy' : 'lovedBy';
    if (!eng[byKey]) eng[byKey] = [];
    const idx = eng[byKey].indexOf(currentUser.id);
    if (idx === -1) {
        eng[byKey].push(currentUser.id);
        eng[type] = (eng[type] || 0) + 1;
    } else {
        eng[byKey].splice(idx, 1);
        eng[type] = Math.max(0, (eng[type] || 1) - 1);
    }
    saveEngagement(store);
    return eng;
}

function addComment(postId, text) {
    if (!isLoggedIn()) { openLoginPrompt(); return null; }
    if (!text.trim()) return null;
    const store = loadEngagement();
    if (!store[postId])
        store[postId] = { views: 0, likes: 0, loves: 0, comments: [], likedBy: [], lovedBy: [] };
    const comment = {
        id:     Date.now(),
        userId: currentUser.id,
        name:   currentUser.name,
        text:   text.trim(),
        time:   new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
    };
    store[postId].comments.push(comment);
    saveEngagement(store);
    return comment;
}

function userReacted(postId, type) {
    if (!isLoggedIn()) return false;
    const eng   = getPostEngagement(postId);
    const byKey = type === 'likes' ? 'likedBy' : 'lovedBy';
    return (eng[byKey] || []).includes(currentUser.id);
}

/* ═══════════════════════════════════════════════════
   CARD  —  HELPERS
═══════════════════════════════════════════════════ */
function getLabel(section) {
    return (sectionMeta[section] && sectionMeta[section].label) ? sectionMeta[section].label : section;
}

function buildEngagementBar(post) {
    const eng   = getPostEngagement(post.id);
    const liked = userReacted(post.id, 'likes');
    const loved = userReacted(post.id, 'loves');
    const loginHint = isLoggedIn() ? '' : 'Login to ';
    return (
        '<div class="eng-bar" data-post="' + post.id + '">' +
            '<span class="eng-views">👁 <span class="eng-views-count">' + eng.views + '</span> views</span>' +
            '<button class="eng-btn like-btn' + (liked ? ' reacted' : '') + '" title="' + loginHint + 'Like">' +
                '👍 <span class="like-count">' + eng.likes + '</span></button>' +
            '<button class="eng-btn love-btn' + (loved ? ' reacted' : '') + '" title="' + loginHint + 'Love">' +
                '❤️ <span class="love-count">' + eng.loves + '</span></button>' +
            '<button class="eng-btn comment-trigger">💬 <span class="comment-count">' + eng.comments.length + '</span></button>' +
            '<button class="eng-btn share-btn">Share</button>' +
        '</div>'
    );
}

const CARD_FOOTER =
    '<div class="card-footer">' +
        '<span class="card-footer-brand">' +
            '<span class="green">Tech</span><span class="red">Geo</span> &mdash; East Africa\'s Tech Blog' +
        '</span>' +
        '<div class="card-footer-socials">' +
            '<a href="https://www.facebook.com/profile.php?id=61551668602567" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>' +
            '<a href="https://instagram.com/techg254" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>' +
            '<a href="https://wa.me/message/GLEMGMF4KOW4C1" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
            '<a href="https://youtube.com/@freelancer_ke1?si=xI40shhYNDqNOCK3" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>' +
            '<a href="https://www.tiktok.com/@geotechn?_t=ZM-90oyN5SDDDw&_r=1" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>' +
        '</div>' +
    '</div>';

/* ═══════════════════════════════════════════════════
   CARD  —  BUILD
═══════════════════════════════════════════════════ */
function buildCard(post) {
    const mediaHTML = post.mediaType === 'video'
        ? '<iframe src="' + post.media + '" frameborder="0" allowfullscreen></iframe>'
        : post.mediaType === 'image'
        ? '<img src="' + post.media + '" alt="' + post.caption + '">'
        : '';

    const preview   = post.content.length > 140 ? post.content.slice(0, 140) + '…' : post.content;
    const dateBadge = post.date ? '<span class="post-date">' + post.date + '</span>' : '';

    const card = document.createElement('article');
    card.className        = 'post-card';
    card.id               = post.id;
    card.dataset.section  = post.section;
    card.dataset.category = post.category;

    card.innerHTML =
        '<div class="post-card-header">' +
            '<div class="post-card-meta">' +
                '<span class="post-category-badge">' + getLabel(post.section) + '</span>' +
                dateBadge +
            '</div>' +
            '<h2 class="post-title">' + post.title + '</h2>' +
        '</div>' +
        '<div class="post-card-body">' +
            '<div class="post-left">' +
                '<p class="post-content">' + preview + '</p>' +
                '<button class="read-more-btn">Read More &rarr;</button>' +
            '</div>' +
            '<div class="post-right">' +
                '<div class="post-media">' + mediaHTML + '</div>' +
                '<p class="post-caption">' + post.caption + '</p>' +
            '</div>' +
        '</div>' +
        buildEngagementBar(post) +
        CARD_FOOTER;

    /* ── Wire events ── */
    card.querySelector('.read-more-btn').addEventListener('click', () => {
        const v = recordView(post.id);
        const vc = card.querySelector('.eng-views-count');
        if (vc) vc.textContent = v;
        openReadMore(post);
    });

    card.querySelector('.like-btn').addEventListener('click', e => {
        const eng = toggleReaction(post.id, 'likes');
        if (!eng) return;
        const btn = e.currentTarget;
        btn.classList.toggle('reacted', eng.likedBy.includes(currentUser.id));
        btn.querySelector('.like-count').textContent = eng.likes;
        syncModalEngagement(post.id);
    });

    card.querySelector('.love-btn').addEventListener('click', e => {
        const eng = toggleReaction(post.id, 'loves');
        if (!eng) return;
        const btn = e.currentTarget;
        btn.classList.toggle('reacted', eng.lovedBy.includes(currentUser.id));
        btn.querySelector('.love-count').textContent = eng.loves;
        syncModalEngagement(post.id);
    });

    card.querySelector('.share-btn').addEventListener('click', e => {
        e.stopPropagation();
        openShareModal(post);
    });

    card.querySelector('.comment-trigger').addEventListener('click', () => {
        const v = recordView(post.id);
        const vc = card.querySelector('.eng-views-count');
        if (vc) vc.textContent = v;
        openReadMore(post, true);
    });

    return card;
}

/* ═══════════════════════════════════════════════════
   MODAL  —  ENGAGEMENT SYNC
═══════════════════════════════════════════════════ */
function syncModalEngagement(postId) {
    const eng = getPostEngagement(postId);
    const get = id => document.getElementById(id);
    const lc = get('rm-like-count');    if (lc) lc.textContent = eng.likes;
    const vc = get('rm-love-count');    if (vc) vc.textContent = eng.loves;
    const cc = get('rm-comment-count'); if (cc) cc.textContent = eng.comments.length;
    const lb = get('rm-like-btn');      if (lb) lb.classList.toggle('reacted', userReacted(postId, 'likes'));
    const vb = get('rm-love-btn');      if (vb) vb.classList.toggle('reacted', userReacted(postId, 'loves'));
    renderModalComments(postId);
    /* also sync the card on the feed */
    const card = document.getElementById(postId);
    if (card) {
        const clc = card.querySelector('.like-count');    if (clc) clc.textContent = eng.likes;
        const cvc = card.querySelector('.love-count');    if (cvc) cvc.textContent = eng.loves;
        const ccc = card.querySelector('.comment-count'); if (ccc) ccc.textContent = eng.comments.length;
        const clb = card.querySelector('.like-btn');      if (clb) clb.classList.toggle('reacted', userReacted(postId, 'likes'));
        const cvb = card.querySelector('.love-btn');      if (cvb) cvb.classList.toggle('reacted', userReacted(postId, 'loves'));
    }
}

function renderModalComments(postId) {
    const eng  = getPostEngagement(postId);
    const list = document.getElementById('rm-comments-list');
    if (!list) return;
    if (eng.comments.length === 0) {
        list.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
        return;
    }
    list.innerHTML = eng.comments.map(c =>
        '<div class="comment-item">' +
            '<div class="comment-meta">' +
                '<span class="comment-author">' + c.name + '</span>' +
                '<span class="comment-time">' + c.time + '</span>' +
            '</div>' +
            '<p class="comment-text">' + c.text + '</p>' +
        '</div>'
    ).join('');
}

/* ═══════════════════════════════════════════════════
   MODAL  —  OPEN READ MORE
═══════════════════════════════════════════════════ */
function openReadMore(post, scrollToComments = false) {
    const mediaHTML = post.mediaType === 'video'
        ? '<div class="rm-media"><iframe src="' + post.media + '" frameborder="0" allowfullscreen></iframe></div>'
        : post.mediaType === 'image'
        ? '<div class="rm-media"><img src="' + post.media + '" alt="' + post.caption + '"></div>'
        : '';

    const eng   = getPostEngagement(post.id);
    const modal = document.getElementById('read-more-modal');

    document.getElementById('rm-badge').textContent    = getLabel(post.section);
    document.getElementById('rm-title').textContent    = post.title;
    const rmDate = document.getElementById('rm-date');
    if (rmDate) rmDate.textContent = post.date ? ' ' + post.date : '';
    document.getElementById('rm-media-wrap').innerHTML = mediaHTML;
    document.getElementById('rm-caption').textContent  = post.caption;
    document.getElementById('rm-content').textContent  = post.content;

    document.getElementById('rm-views-count').textContent   = eng.views;
    document.getElementById('rm-like-count').textContent    = eng.likes;
    document.getElementById('rm-love-count').textContent    = eng.loves;
    document.getElementById('rm-comment-count').textContent = eng.comments.length;
    document.getElementById('rm-like-btn').classList.toggle('reacted', userReacted(post.id, 'likes'));
    document.getElementById('rm-love-btn').classList.toggle('reacted', userReacted(post.id, 'loves'));

    modal.dataset.postId         = post.id;
    modal.dataset.postVisibility = post.visibility || 'public';

    renderModalComments(post.id);

    const ci = document.getElementById('rm-comment-input-wrap');
    if (ci) ci.style.display = isLoggedIn() ? 'flex' : 'none';
    const cl = document.getElementById('rm-comment-login-note');
    if (cl) cl.style.display = isLoggedIn() ? 'none' : 'block';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

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
    readMoreModal.style.display = 'none';
    document.body.style.overflow = '';
});

readMoreModal.addEventListener('click', e => {
    if (e.target === readMoreModal) {
        readMoreModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

document.getElementById('rm-like-btn').addEventListener('click', () => {
    const postId = readMoreModal.dataset.postId; if (!postId) return;
    const eng = toggleReaction(postId, 'likes'); if (eng) syncModalEngagement(postId);
});

document.getElementById('rm-love-btn').addEventListener('click', () => {
    const postId = readMoreModal.dataset.postId; if (!postId) return;
    const eng = toggleReaction(postId, 'loves'); if (eng) syncModalEngagement(postId);
});

document.getElementById('rm-comment-submit').addEventListener('click', () => {
    const postId = readMoreModal.dataset.postId;
    const input  = document.getElementById('rm-comment-box');
    if (!postId || !input) return;
    const comment = addComment(postId, input.value);
    if (comment) {
        input.value = '';
        syncModalEngagement(postId);
        showToast('💬 Comment posted!', 'success');
    }
});

document.getElementById('rm-comment-box').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('rm-comment-submit').click();
    }
});

document.getElementById('rm-share-btn').addEventListener('click', () => {
    const postId = readMoreModal.dataset.postId; if (!postId) return;
    const post = allPosts.find(p => p.id === postId);
    if (post) openShareModal(post);
});

document.getElementById('rm-comment-login-note').addEventListener('click', () => {
    readMoreModal.style.display = 'none';
    document.body.style.overflow = '';
    authForm.style.display = 'block';
    showLogin();
});

/* ═══════════════════════════════════════════════════
   PUBLIC FEED
═══════════════════════════════════════════════════ */
const blogFeed = document.getElementById('blog-feed');
let currentFilter = 'all';

function renderPublicFeed(filter, searchQuery) {
    blogFeed.innerHTML = '';
    let posts = allPosts.filter(p => p.visibility === 'public');

    if (filter && filter !== 'all')
        posts = posts.filter(p => p.section === filter);

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        posts = posts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.section.toLowerCase().includes(q)
        );
    }

    if (posts.length === 0) {
        blogFeed.innerHTML = '<p class="no-results">No posts found. Try a different filter or search.</p>';
        return;
    }

    if (!filter || filter === 'all') {
        const sections = [...new Set(posts.map(p => p.section))];
        sections.forEach(sec => {
            const heading = document.createElement('p');
            heading.className = 'feed-section-title';
            heading.textContent = getLabel(sec);
            blogFeed.appendChild(heading);
            posts.filter(p => p.section === sec).forEach(p => blogFeed.appendChild(buildCard(p)));
        });
    } else {
        posts.forEach(p => blogFeed.appendChild(buildCard(p)));
    }
}

/* ═══════════════════════════════════════════════════
   RIGHT SIDEBAR  —  LATEST TOPICS (newest first)
═══════════════════════════════════════════════════ */
const tocList = document.getElementById('toc-list');

function buildTOC() {
    tocList.innerHTML = '';
    const publicPosts = allPosts
        .filter(p => p.visibility === 'public')
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    publicPosts.forEach(post => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = '#';
        a.innerHTML = '<span class="toc-cat">' + getLabel(post.section) + '</span>' + post.title;
        a.addEventListener('click', e => {
            e.preventDefault();
            setFilter(post.section);
            setTimeout(() => {
                const target = document.getElementById(post.id);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
        });
        li.appendChild(a);
        tocList.appendChild(li);
    });
}

/* ═══════════════════════════════════════════════════
   FILTER  —  LEFT SIDEBAR & NAVBAR
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
    const posts = allPosts.filter(p => p.section === sectionKey);
    hiddenPanelTitle.textContent = getLabel(sectionKey);
    hiddenPanelFeed.innerHTML = '';
    if (posts.length === 0) {
        hiddenPanelFeed.innerHTML = '<p class="no-results">No posts in this section yet.</p>';
    } else {
        posts.forEach(p => hiddenPanelFeed.appendChild(buildCard(p)));
    }
    hiddenOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

closePanel.addEventListener('click', () => {
    hiddenOverlay.style.display = 'none'; document.body.style.overflow = '';
});
hiddenOverlay.addEventListener('click', e => {
    if (e.target === hiddenOverlay) { hiddenOverlay.style.display = 'none'; document.body.style.overflow = ''; }
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
    loginPrompt.style.display = 'none';
    authForm.style.display = 'block';
    showLogin();
});

/* ═══════════════════════════════════════════════════
   SUBSCRIBE
═══════════════════════════════════════════════════ */
const SUBS_KEY = 'techgeo_subscribers';

function loadSubscribers() {
    try { return JSON.parse(sessionStorage.getItem(SUBS_KEY)) || []; } catch { return []; }
}

function saveSubscriber(name, email) {
    const subs = loadSubscribers();
    if (subs.find(s => s.email.toLowerCase() === email.toLowerCase())) {
        showToast('📧 You are already subscribed!', 'info'); return false;
    }
    subs.push({ name, email, date: new Date().toLocaleDateString('en-KE') });
    sessionStorage.setItem(SUBS_KEY, JSON.stringify(subs));
    return true;
}

function updateSubCount() {
    const el = document.getElementById('sub-count');
    if (el) el.textContent = loadSubscribers().length;
}

function openSubscribeModal() {
    document.getElementById('subscribe-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updateSubCount();
}

document.getElementById('subscribe-nav-btn').addEventListener('click', openSubscribeModal);

document.getElementById('close-subscribe').addEventListener('click', () => {
    document.getElementById('subscribe-modal').style.display = 'none';
    document.body.style.overflow = '';
});

document.getElementById('subscribe-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('subscribe-modal')) {
        document.getElementById('subscribe-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
});

document.getElementById('subscribe-form').addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('sub-name').value.trim();
    const email = document.getElementById('sub-email').value.trim();
    const btn   = document.getElementById('sub-btn');
    if (!name || !email) { showToast('⚠️ Please fill in your name and email.', 'error'); return; }
    btn.textContent = 'Subscribing...'; btn.disabled = true;
    setTimeout(() => {
        if (saveSubscriber(name, email)) {
            showToast('🎉 Welcome, ' + name.split(' ')[0] + '! You are now subscribed.', 'success');
            document.getElementById('subscribe-modal').style.display = 'none';
            document.body.style.overflow = '';
            document.getElementById('sub-name').value  = '';
            document.getElementById('sub-email').value = '';
        }
        btn.textContent = 'Subscribe Now'; btn.disabled = false;
        updateSubCount();
    }, 600);
});

/* ═══════════════════════════════════════════════════
   SHARE
   Public posts  → open link, shareable by anyone
   Private posts → link works but shows login gate
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
    document.getElementById('share-private-note').style.display =
        post.visibility === 'members' ? 'block' : 'none';

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
        navigator.clipboard.writeText(input.value).then(() => showToast('🔗 Link copied!', 'success'));
    } else {
        document.execCommand('copy');
        showToast(' Link copied!', 'success');
    }
});

/* ═══════════════════════════════════════════════════
   DEEP-LINK ROUTING
   ?post=post-id  auto-opens the post on page load.
   Private posts require login first.
═══════════════════════════════════════════════════ */
function handleDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (!postId) return;
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    if (post.visibility === 'members' && !isLoggedIn()) {
        setTimeout(() => {
            openLoginPrompt();
            showToast('Login to view this members-only post.', 'info');
        }, 400);
        return;
    }
    setTimeout(() => openReadMore(post), 300);
}

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
loadSession();
renderPublicFeed('all', '');
buildTOC();
handleDeepLink();
