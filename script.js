const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
let currentLanguage = 'en';

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
    currentLanguage === 'sw' ? 'Habari Sufian Technology,' : 'Hello Sufian Technology,',
    '',
    currentLanguage === 'sw' ? `Jina langu ni ${fields.get('name')}.` : `My name is ${fields.get('name')}.`,
    currentLanguage === 'sw' ? `Barua pepe au simu: ${fields.get('contact')}.` : `Email or phone: ${fields.get('contact')}.`,
    currentLanguage === 'sw' ? `Mada: ${fields.get('type')}.` : `Topic: ${fields.get('type')}.`,
    '',
    currentLanguage === 'sw' ? 'Ningependa kuzungumzia:' : 'Here is what I would like to discuss:',
    fields.get('message'),
  ].join('\n');

  window.open(`https://wa.me/255634283550?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

const swahiliCopy = {
  navHome: 'Mwanzo', navSolutions: 'Suluhisho', navProjects: 'Miradi', navVideos: 'Video', navBooks: 'Vitabu', navLab: 'Maabara', navInsights: 'Mawazo', navAbout: 'Kuhusu', navContact: 'Mawasiliano', navCta: 'Fanya kazi nasi <span aria-hidden="true">↗</span>',
  heroKicker: '<span class="status-dot"></span> FIKIRI · TATUA · JENGA <span class="eyebrow-rule"></span> TANZANIA', heroTitle: 'Teknolojia inayotatua<br><span class="accent-word">matatizo halisi.</span>', heroLede: 'Tunabadilisha changamoto za kila siku kuwa suluhisho za kidijitali.', heroExplore: 'Angalia suluhisho <span aria-hidden="true">↘</span>', heroWork: 'Fanya kazi nasi <span aria-hidden="true">↗</span>',
  whatTitle: 'Teknolojia yenye manufaa.<br><span class="muted-heading">Kwa maisha halisi.</span>', whatLede: 'Tunatumia teknolojia kurahisisha kazi za kila siku.', capAi: 'Suluhisho za AI', capAiText: 'Tumia AI kuona mifumo na kuokoa muda.', capBusiness: 'Teknolojia za biashara', capBusinessText: 'Rahisisha shughuli za biashara.', capSoftware: 'Programu na mifumo', capSoftwareText: 'Jenga zana za kidijitali zenye manufaa.', capAutomation: 'Uendeshaji otomatiki', capAutomationText: 'Rahisisha kazi zinazojirudia.', capProblem: 'Utatuzi wa matatizo', capProblemText: 'Anza na tatizo, chagua zana sahihi.',
  methodTitle: 'Fikiri kwa makini.<br><span>Jenga lenye maana.</span>', methodLede: 'Anza na hitaji halisi. Jibu kwa njia ya vitendo.', methodThink: 'Fikiri', methodThinkText: 'Chunguza. Uliza maswali bora.', methodSolve: 'Tatua', methodSolveText: 'Chagua njia yenye manufaa.', methodBuild: 'Jenga', methodBuildText: 'Tengeneza. Jaribu. Boresha.', methodFooter: 'Kutoka hitaji hadi suluhisho.',
  videoTitle: 'Tazama. Jifunze.<br><span class="muted-heading">Tengeneza.</span>', videoLede: 'Video na mafunzo kutoka kwa Sufian.', bookTitle: 'Soma. Chunguza.<br><span class="muted-heading">Endeleza wazo.</span>', bookLede: 'Soma sampuli, kisha agiza kwa WhatsApp.', bookEmpty: 'Vitabu vitakuja hivi karibuni.', bookNote: 'Agiza kwa WhatsApp. Malipo mtakubaliana moja kwa moja.',
  projectTitle: 'Miradi<br><span class="muted-heading">inayoendelea.</span>', projectLede: 'Maelezo ya miradi iliyothibitishwa yanakuja.', projectSoon: 'Miradi iliyochaguliwa itakuja hivi karibuni.', labTitle: 'Udadisi, ukiwa<br><span>kazini.</span>', labLede: 'Majaribio na mifano ya awali—yanakuja hivi karibuni.',
  insightsTitle: 'Mawazo ya<br><span class="muted-heading">hatua inayofuata.</span>', insightsLede: 'Vidokezo na mafunzo Instagram.',
  aboutTitle: 'Teknolojia ilete<br><span>mabadiliko.</span>', aboutP1: 'Sufian Technology ni brand ya teknolojia iliyoanzishwa na Sufian. Tunatumia zana za kidijitali na AI kutatua changamoto za vitendo.', aboutP2: 'Tunaanzia Tanzania, tukilenga Afrika Mashariki na bara zima.',
  ctaTitle: 'Una tatizo ambalo teknolojia<br><span>inaweza kutatua?</span>', ctaLede: 'Tufikirie pamoja, tujenge suluhisho.', ctaStart: 'Anza mradi <span aria-hidden="true">↗</span>', ctaTalk: 'Ongea na Sufian <span aria-hidden="true">↗</span>',
  contactTitle: 'Tueleze<br><span class="muted-heading">wazo lako.</span>', contactLede: 'Ujumbe wako utaandaliwa WhatsApp. Utatuma mwenyewe.',
};

const languageTargets = {
  navHome: '#primary-nav a[href="#home"]', navSolutions: '#primary-nav a[href="#solutions"]', navProjects: '#primary-nav a[href="#projects"]', navVideos: '#primary-nav a[href="#videos"]', navBooks: '#primary-nav a[href="#books"]', navLab: '#primary-nav a[href="#lab"]', navInsights: '#primary-nav a[href="#insights"]', navAbout: '#primary-nav a[href="#about"]', navContact: '#primary-nav a[href="#contact"]', navCta: '.nav-cta',
  heroKicker: '.hero .eyebrow', heroTitle: '.hero h1', heroLede: '.hero-lede', heroExplore: '.hero-actions .button-primary', heroWork: '.hero-actions .button-outline',
  whatTitle: '#solutions .section-heading h2', whatLede: '#solutions .section-summary', capAi: '.capability-card:nth-child(1) h3', capAiText: '.capability-card:nth-child(1) p', capBusiness: '.capability-card:nth-child(2) h3', capBusinessText: '.capability-card:nth-child(2) p', capSoftware: '.capability-card:nth-child(3) h3', capSoftwareText: '.capability-card:nth-child(3) p', capAutomation: '.capability-card:nth-child(4) h3', capAutomationText: '.capability-card:nth-child(4) p', capProblem: '.capability-card:nth-child(5) h3', capProblemText: '.capability-card:nth-child(5) p',
  methodTitle: '.process-heading h2', methodLede: '.process-heading p', methodThink: '.method-card:nth-child(1) h3', methodThinkText: '.method-card:nth-child(1) p', methodSolve: '.method-card:nth-child(2) h3', methodSolveText: '.method-card:nth-child(2) p', methodBuild: '.method-card:nth-child(3) h3', methodBuildText: '.method-card:nth-child(3) p', methodFooter: '.process-bottom span:last-child',
  videoTitle: '#videos h2', videoLede: '#videos .section-summary', bookTitle: '#books h2', bookLede: '#books .section-summary', bookNote: '#books .store-note', projectTitle: '#projects h2', projectLede: '#projects .section-summary', projectSoon: '#projects .work-info p', labTitle: '#lab h2', labLede: '#lab .lab-copy', insightsTitle: '#insights h2', insightsLede: '#insights .section-summary', aboutTitle: '#about h2', aboutP1: '#about .about-copy>p:nth-of-type(1)', aboutP2: '#about .about-copy>p:nth-of-type(2)',
  ctaTitle: '.cta-inner h2', ctaLede: '.cta-inner>p', ctaStart: '.cta-actions .button-primary', ctaTalk: '.cta-actions .button-ghost', contactTitle: '#contact h2', contactLede: '#contact .contact-copy>p',
};

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  for (const [key, selector] of Object.entries(languageTargets)) {
    const element = document.querySelector(selector);
    if (!element) continue;
    if (!element.dataset.defaultMarkup) element.dataset.defaultMarkup = element.innerHTML;
    element.innerHTML = language === 'sw' ? swahiliCopy[key] : element.dataset.defaultMarkup;
  }
  const formLabels = { name: 'Jina lako', 'contact-method': 'Barua pepe au simu', 'project-type': 'Mada', message: 'Eleza changamoto yako' };
  for (const [id, swahili] of Object.entries(formLabels)) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (!label) continue;
    const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (textNode) {
      if (!label.dataset.originalLabel) label.dataset.originalLabel = textNode.textContent;
      textNode.textContent = language === 'sw' ? ` ${swahili} ` : label.dataset.originalLabel;
    }
  }
  const formPlaceholders = language === 'sw'
    ? { name: 'mf. Amina', 'contact-method': 'Tukupate wapi?', message: 'Ungependa kurahisisha au kuwezesha nini?' }
    : { name: 'e.g. Amina', 'contact-method': 'How can we reach you?', message: 'What would you like to make easier or possible?' };
  for (const [id, placeholder] of Object.entries(formPlaceholders)) document.querySelector(`#${id}`)?.setAttribute('placeholder', placeholder);
  document.querySelector('#project-type option[value="Not sure yet"]')?.replaceChildren(document.createTextNode(language === 'sw' ? 'Chagua mada' : 'Choose a topic'));
  const formSubmit = document.querySelector('#contact-form .form-submit');
  if (formSubmit?.firstChild) formSubmit.firstChild.textContent = language === 'sw' ? 'Endelea WhatsApp ' : 'Continue to WhatsApp ';
  const formNote = document.querySelector('#form-note');
  if (formNote) formNote.textContent = language === 'sw' ? 'WhatsApp itafunguka na ujumbe wako tayari kukaguliwa. Utatuma mwenyewe.' : 'WhatsApp opens with your message ready to review. You send it yourself.';
  const toggle = document.querySelector('#language-toggle');
  toggle.textContent = language === 'sw' ? 'EN' : 'SW';
  toggle.setAttribute('aria-label', language === 'sw' ? 'Switch to English' : 'Badili lugha iwe Kiswahili');
  try { localStorage.setItem('sufian-language', language); } catch {}
  loadPublishedContent();
}

document.querySelector('#language-toggle')?.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'sw' : 'en'));
try { if (localStorage.getItem('sufian-language') === 'sw') setLanguage('sw'); } catch {}

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
    const response = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/site_content?select=id,kind,title,description,category,youtube_id,price,author,isbn,format,language,price_amount,currency,stock,cover_url,preview,created_at&is_published=eq.true&order=created_at.desc`, {
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
    } else videoList.innerHTML = `<div class="empty-content">${currentLanguage === 'sw' ? 'Video zitakuja hivi karibuni.' : 'Videos coming soon.'}</div>`;
    const bookList = document.querySelector('#book-list');
    if (books.length) {
      bookList.replaceChildren();
      books.forEach((book) => {
        const card = makeElement('article', 'published-card book-card');
        if (book.cover_url) {
          const cover = document.createElement('img'); cover.className = 'book-cover-image'; cover.src = book.cover_url; cover.alt = currentLanguage === 'sw' ? `Jalada la kitabu ${book.title}` : `Cover of ${book.title}`; cover.loading = 'lazy'; card.append(cover);
        } else card.append(makeElement('div', 'book-cover', 'ST'));
        const text = makeElement('div', 'published-copy');
        text.append(makeElement('h3', '', book.title));
        if (book.author) text.append(makeElement('p', 'book-author', `${currentLanguage === 'sw' ? 'Mwandishi' : 'By'} ${book.author}`));
        const priceText = book.price_amount !== null && book.price_amount !== undefined
          ? new Intl.NumberFormat(currentLanguage === 'sw' ? 'sw-TZ' : 'en-TZ', { style: 'currency', currency: book.currency || 'TZS', maximumFractionDigits: 2 }).format(Number(book.price_amount))
          : book.price;
        text.append(makeElement('span', 'book-price', priceText));
        const meta = [book.format ? (currentLanguage === 'sw' ? ({ print:'Chapa', digital:'Kidijitali', both:'Chapa + kidijitali' }[book.format]) : ({ print:'Print', digital:'Digital', both:'Print + digital' }[book.format])) : '', book.language, book.isbn ? `ISBN ${book.isbn}` : ''].filter(Boolean).join(' · ');
        if (meta) text.append(makeElement('p', 'book-meta', meta));
        if (book.stock !== null && book.stock !== undefined) text.append(makeElement('p', book.stock > 0 ? 'stock-note' : 'stock-note out-of-stock', book.stock > 0 ? (currentLanguage === 'sw' ? `Zinapatikana: ${book.stock}` : `In stock: ${book.stock}`) : (currentLanguage === 'sw' ? 'Haipo kwa sasa' : 'Out of stock')));
        if (book.description) text.append(makeElement('p', '', book.description));
        if (book.preview) {
          const details = document.createElement('details');
          const summary = makeElement('summary', '', currentLanguage === 'sw' ? 'Soma sampuli' : 'Read a sample');
          details.append(summary, makeElement('p', 'book-preview-text', book.preview)); text.append(details);
        }
        const isOutOfStock = book.stock !== null && book.stock !== undefined && Number(book.stock) < 1;
        const buy = makeElement(isOutOfStock ? 'span' : 'a', `button button-dark book-order${isOutOfStock ? ' disabled' : ''}`, isOutOfStock ? (currentLanguage === 'sw' ? 'Haipo' : 'Out of stock') : (currentLanguage === 'sw' ? 'Agiza WhatsApp ↗' : 'Order on WhatsApp ↗'));
        const orderMessage = currentLanguage === 'sw' ? `Habari Sufian Technology, naomba kuagiza kitabu “${book.title}” (${priceText}).` : `Hello Sufian Technology, I would like to order “${book.title}” (${priceText}).`;
        buy.href = `https://wa.me/255634283550?text=${encodeURIComponent(orderMessage)}`;
        buy.target = '_blank'; buy.rel = 'noopener noreferrer'; text.append(buy);
        card.append(text); bookList.append(card);
      });
    } else bookList.innerHTML = `<div class="empty-content">${currentLanguage === 'sw' ? 'Vitabu vitakuja hivi karibuni.' : 'Books coming soon.'}</div>`;
    const updatesList = document.querySelector('#updates-list');
    if (updates.length) {
      updatesList.replaceChildren();
      updates.slice(0, 3).forEach((update) => {
        const card = makeElement('article', 'update-card');
        if (update.cover_url) {
          const image = document.createElement('img'); image.className = 'update-image'; image.src = update.cover_url; image.alt = update.title; image.loading = 'lazy';
          card.append(image);
        }
        card.append(makeElement('span', 'insight-tag', update.category || 'UPDATE'), makeElement('h3', '', update.title));
        if (update.description) card.append(makeElement('p', '', update.description));
        updatesList.append(card);
      });
    } else updatesList.replaceChildren();
  } catch { /* The static content remains useful if the optional content API is unavailable. */ }
}

loadPublishedContent();
