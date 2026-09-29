const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !expanded);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const fields = new FormData(form);
  const message = [
    'Hello Sufian Technology,',
    '',
    `My name is ${fields.get('name')}.`,
    `Email or phone: ${fields.get('contact')}.`,
    `Topic: ${fields.get('type')}.`,
    '',
    'Here is what I would like to discuss:',
    fields.get('message'),
  ].join('\n');

  window.open(`https://wa.me/255634283550?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

async function loadPublishedContent() {
  try {
    const config = window.SUFIAN_SUPABASE;
    if (!config || config.url.startsWith('YOUR_') || config.publishableKey.startsWith('YOUR_')) return;
    const response = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/site_content?select=id,kind,title,description,category,youtube_id,price,preview,created_at&is_published=eq.true&order=created_at.desc`, {
      headers: { apikey: config.publishableKey },
    });
    if (!response.ok) return;
    const entries = await response.json();
    const videos = entries.filter((entry) => entry.kind === 'video');
    const books = entries.filter((entry) => entry.kind === 'book');
    const updates = entries.filter((entry) => entry.kind === 'update');
    const videoList = document.querySelector('#video-list');
    if (videos.length) {
      videoList.replaceChildren();
      videos.forEach((video) => {
        const card = makeElement('article', 'published-card video-card');
        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtube_id)}`;
        frame.title = video.title; frame.loading = 'lazy'; frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; frame.allowFullscreen = true;
        const text = makeElement('div', 'published-copy'); text.append(makeElement('h3', '', video.title));
        if (video.description) text.append(makeElement('p', '', video.description));
        card.append(frame, text); videoList.append(card);
      });
    }
    const bookList = document.querySelector('#book-list');
    if (books.length) {
      bookList.replaceChildren();
      books.forEach((book) => {
        const card = makeElement('article', 'published-card book-card');
        card.append(makeElement('div', 'book-cover', 'ST'));
        const text = makeElement('div', 'published-copy');
        text.append(makeElement('h3', '', book.title), makeElement('span', 'book-price', book.price));
        if (book.description) text.append(makeElement('p', '', book.description));
        if (book.preview) {
          const details = document.createElement('details');
          const summary = makeElement('summary', '', 'Read a preview');
          details.append(summary, makeElement('p', 'book-preview-text', book.preview)); text.append(details);
        }
        const buy = makeElement('a', 'button button-dark book-order', 'Order on WhatsApp ↗');
        const orderMessage = `Hello Sufian Technology, I would like to ask about ordering “${book.title}” (${book.price}).`;
        buy.href = `https://wa.me/255634283550?text=${encodeURIComponent(orderMessage)}`;
        buy.target = '_blank'; buy.rel = 'noopener noreferrer'; text.append(buy);
        card.append(text); bookList.append(card);
      });
    }
    const updatesList = document.querySelector('#updates-list');
    if (updates.length) {
      updatesList.replaceChildren();
      updates.slice(0, 3).forEach((update) => {
        const card = makeElement('article', 'update-card');
        card.append(makeElement('span', 'insight-tag', update.category || 'UPDATE'), makeElement('h3', '', update.title));
        if (update.description) card.append(makeElement('p', '', update.description));
        updatesList.append(card);
      });
    }
  } catch { /* The static content remains useful if the optional content API is unavailable. */ }
}

loadPublishedContent();
