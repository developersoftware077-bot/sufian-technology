const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginMessage = document.querySelector('#login-message');
const SUPABASE = window.SUFIAN_SUPABASE;
const SESSION_KEY = 'sufian-admin-session';
const OWNER_EMAIL = 'developersoftware077@gmail.com';

function configured() {
  return SUPABASE?.url && SUPABASE?.publishableKey && !SUPABASE.url.startsWith('YOUR_') && !SUPABASE.publishableKey.startsWith('YOUR_');
}
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
function saveSession(session) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
function message(form, value, error = false) {
  const output = form.querySelector('[role="status"]');
  output.textContent = value;
  output.classList.toggle('error', error);
}
function errorMessage(payload) {
  return payload?.msg || payload?.message || payload?.error_description || payload?.error || 'Something went wrong.';
}

async function rawRequest(path, options = {}, accessToken = '') {
  const headers = {
    apikey: SUPABASE.publishableKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`${SUPABASE.url.replace(/\/$/, '')}${path}`, { ...options, headers });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload;
}

async function freshAccessToken() {
  const session = getSession();
  if (!session?.access_token) throw new Error('Sign in again to continue.');
  if (session.expires_at > Math.floor(Date.now() / 1000) + 60) return session.access_token;
  const refreshed = await rawRequest('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST', body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  saveSession({ ...refreshed, expires_at: Math.floor(Date.now() / 1000) + refreshed.expires_in });
  return refreshed.access_token;
}

async function dataRequest(path, options = {}) {
  const token = await freshAccessToken();
  return rawRequest(`/rest/v1/${path}`, options, token);
}

async function uploadImage(file, bucket) {
  if (!file) return '';
  const types = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  if (!types[file.type]) throw new Error('Choose a JPG, PNG or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Cover image must be 5 MB or smaller.');
  const objectPath = `${crypto.randomUUID()}.${types[file.type]}`;
  const token = await freshAccessToken();
  const response = await fetch(`${SUPABASE.url.replace(/\/$/, '')}/storage/v1/object/${bucket}/${objectPath}`, {
    method: 'POST',
    headers: { apikey: SUPABASE.publishableKey, Authorization: `Bearer ${token}`, 'Content-Type': file.type, 'x-upsert': 'false', 'cache-control': '3600' },
    body: file,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(errorMessage(result));
  return `${SUPABASE.url.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${objectPath}`;
}

async function removeImage(url, bucket) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const pathname = new URL(url).pathname;
  const index = pathname.indexOf(marker);
  if (index < 0) return;
  const objectPath = decodeURIComponent(pathname.slice(index + marker.length));
  const token = await freshAccessToken();
  await rawRequest(`/storage/v1/object/${bucket}`, {
    method: 'DELETE', body: JSON.stringify({ prefixes: [objectPath] }),
  }, token);
}

async function loadItems() {
  const items = await dataRequest('site_content?select=id,kind,title,cover_url,created_at&order=created_at.desc');
  const listNames = { video: 'videos', book: 'books', update: 'updates' };
  for (const [kind, listName] of Object.entries(listNames)) {
    const list = document.querySelector(`[data-list="${listName}"]`);
    list.replaceChildren();
    const matches = items.filter((item) => item.kind === kind);
    if (!matches.length) {
      const empty = document.createElement('p'); empty.className = 'list-empty'; empty.textContent = 'Nothing added yet.'; list.append(empty); continue;
    }
    for (const item of matches) {
      const row = document.createElement('div'); row.className = 'managed-item';
      const title = document.createElement('span'); title.textContent = item.title;
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${item.title}`);
      remove.addEventListener('click', async () => {
        if (!window.confirm(`Remove “${item.title}” from the website?`)) return;
        try {
          if ((kind === 'book' || kind === 'update') && item.cover_url) await removeImage(item.cover_url, kind === 'book' ? 'book-covers' : 'update-images');
          await dataRequest(`site_content?id=eq.${encodeURIComponent(item.id)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
          await loadItems();
        }
        catch (error) { window.alert(error.message); }
      });
      row.append(title, remove); list.append(row);
    }
  }
}

function showDashboard() {
  loginPanel.hidden = true; dashboard.hidden = false;
  loadItems().catch((error) => window.alert(error.message));
}

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!configured()) { loginMessage.textContent = 'Add your Supabase URL and publishable key to supabase-config.js first.'; loginMessage.classList.add('error'); return; }
  const fields = new FormData(form);
  loginMessage.textContent = 'Signing in…'; loginMessage.classList.remove('error');
  try {
    const session = await rawRequest('/auth/v1/token?grant_type=password', {
      method: 'POST', body: JSON.stringify({ email: fields.get('email'), password: fields.get('password') }),
    });
    if (session.user?.email?.toLowerCase() !== OWNER_EMAIL) {
      await rawRequest('/auth/v1/logout', { method: 'POST' }, session.access_token).catch(() => {});
      throw new Error('This admin panel is restricted to the site owner account.');
    }
    saveSession({ ...session, expires_at: Math.floor(Date.now() / 1000) + session.expires_in });
    showDashboard();
  } catch (error) { loginMessage.textContent = error.message; loginMessage.classList.add('error'); }
});

document.querySelectorAll('.content-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(form));
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    const kinds = { videos: 'video', books: 'book', updates: 'update' };
    const item = { kind: kinds[form.dataset.type], title: fields.title, description: fields.description || '', category: fields.category || '', youtube_id: null, price: '', author: fields.author || '', isbn: fields.isbn || '', format: fields.format || 'print', language: fields.language || 'English', price_amount: fields.price_amount ? Number(fields.price_amount) : null, currency: fields.currency || 'TZS', stock: fields.stock === '' ? null : Number(fields.stock), cover_url: '', preview: fields.preview || '', is_published: true };
    if (item.kind === 'book') item.price = `${item.currency} ${Number(item.price_amount).toLocaleString('en-US')}`;
    if (item.kind === 'video') {
      try {
        const url = new URL(fields.url);
        item.youtube_id = url.hostname === 'youtu.be' ? url.pathname.slice(1).split('/')[0] : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
        if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(url.hostname) || !/^[\w-]{11}$/.test(item.youtube_id || '')) throw new Error('Use a valid YouTube video link.');
      } catch (error) { message(form, error.message, true); button.disabled = false; return; }
    }
    let uploadedCover = '';
    try {
      if (item.kind === 'book' || item.kind === 'update') {
        const bucket = item.kind === 'book' ? 'book-covers' : 'update-images';
        item.cover_url = uploadedCover = await uploadImage(form.querySelector('[name="cover"]').files[0], bucket);
      }
      await dataRequest('site_content', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(item) });
      form.reset(); message(form, 'Added to your website.'); await loadItems();
    } catch (error) {
      if (uploadedCover) await removeImage(uploadedCover, item.kind === 'book' ? 'book-covers' : 'update-images').catch(() => {});
      message(form, error.message, true);
    }
    finally { button.disabled = false; }
  });
});

document.querySelector('#logout').addEventListener('click', async () => {
  const session = getSession();
  if (session?.access_token && configured()) await rawRequest('/auth/v1/logout', { method: 'POST' }, session.access_token).catch(() => {});
  sessionStorage.removeItem(SESSION_KEY);
  dashboard.hidden = true; loginPanel.hidden = false;
});

if (!configured()) {
  loginMessage.textContent = 'Setup needed: connect this site to Supabase to enable admin sign-in.';
  loginMessage.classList.add('error');
} else if (getSession()?.user?.email?.toLowerCase() === OWNER_EMAIL) {
  showDashboard();
}
