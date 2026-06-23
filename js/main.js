const DEFAULT_AIRLINES = [
  { name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Emirates_logo.svg' },
  { name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Qatar_Airways_Logo.svg' },
  { name: 'Etihad Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Etihad_Airways_Logo_Vector.svg' },
  { name: 'Saudi Arabian Airlines', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Saudia_logo.svg' },
  { name: 'Flydubai', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Flydubai_Logo.svg' },
  { name: 'Air Arabia', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Air_Arabia_Logo.svg' },
  { name: 'Turkish Airlines', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Turkish_Airlines_logo_2019_compact.svg' },
  { name: 'PIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Pakistan_International_Airlines_logo.svg' },
  { name: 'Oman Air', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Oman_Air_logo.svg' },
  { name: 'Gulf Air', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Gulf_Air_Logo.svg' }
];

// Helpers
function g(id) { return document.getElementById(id); }
function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e) { return d; } }

function showToast(msg, t) {
  var el = g('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'toast ' + (t || 'success') + ' show';
  setTimeout(function() { el.classList.remove('show'); }, 3500);
}

// Mobile nav
function toggleMobileNav() {
  var el = g('mobile-nav');
  if (el) el.classList.toggle('open');
}

// Chatbot
function toggleChatbot() {
  var p = g('chatbotPanel');
  var t = g('chatbotToggle');
  if (p && t) {
    var isOpen = p.classList.contains('open');
    p.classList.toggle('open');
    t.style.display = isOpen ? 'flex' : 'none';
    if (!isOpen) {
      var msgs = g('chatbotMsgs');
      if (msgs && !msgs.children.length) {
        msgs.innerHTML = '<div class="cb-msg cb-bot">Hello! Welcome to Sanayah Travels & Tourism! How can I assist you today?</div>';
      }
    }
  }
}

function sendChatbotMsg() {
  var input = g('chatbotInput');
  var msgs = g('chatbotMsgs');
  if (!input || !msgs || !input.value.trim()) return;
  var text = input.value.trim();
  input.value = '';
  msgs.innerHTML += '<div class="cb-msg cb-user">' + esc(text) + '</div>';
  msgs.scrollTop = msgs.scrollHeight;
  // Try API, fallback to local Q&A
  var cfg = lsGet('sanayah_chatconfig');
  var answer = getLocalAnswer(text);
  if (cfg && cfg.apiKey) {
    apiChatbotMessage(text, cfg.provider || 'deepseek', cfg.apiKey, cfg.systemPrompt).then(function(reply) {
      if (reply) {
        msgs.innerHTML += '<div class="cb-msg cb-bot">' + esc(reply) + '</div>';
        msgs.scrollTop = msgs.scrollHeight;
      } else {
        sendLocalAnswer(msgs, answer);
      }
    });
  } else {
    sendLocalAnswer(msgs, answer);
  }
}

function getLocalAnswer(text) {
  var qa = lsGet('sanayah_qa', []);
  text = text.toLowerCase();
  for (var i = 0; i < qa.length; i++) {
    if (text.indexOf(qa[i].key) !== -1) return qa[i].reply;
  }
  if (text.indexOf('hello') !== -1 || text.indexOf('hi') !== -1) return "Hello! Welcome to Sanayah Travels! How can I help you?";
  if (text.indexOf('contact') !== -1) return "Contact us at +92 300 2816459 or email sanayahtravels@gmail.com";
  return "Thank you for your message! Our team will get back to you soon. Call us at +92 300 2816459.";
}

function sendLocalAnswer(msgs, answer) {
  msgs.innerHTML += '<div class="cb-msg cb-bot">' + esc(answer) + '</div>';
  msgs.scrollTop = msgs.scrollHeight;
}

// Home popup
function closeHomePopup() {
  var el = g('homePopup');
  if (el) el.style.display = 'none';
  try { localStorage.setItem('sanayah_popup_closed', '1'); } catch(e) {}
}

// Load airlines
function loadAirlines() {
  var strip = document.querySelector('.brand-strip-inner');
  if (!strip) return;
  var airlines = lsGet('sanayah_airlines');
  if (!airlines || !airlines.length) airlines = DEFAULT_AIRLINES;
  strip.innerHTML = airlines.map(function(a) {
    var logo = a.logo || a.data || '';
    return '<div class="brand-item"><img src="' + esc(logo) + '" alt="' + esc(a.name) + '" onerror="this.style.display=\'none\'" /><span>' + esc(a.name) + '</span></div>';
  }).join('');
}

// Load reviews
function loadReviews() {
  var container = g('reviews-display');
  if (!container) return;
  var reviews = lsGet('sanayah_reviews', []);
  var approved = reviews.filter(function(r) { return r.approved === true; });
  if (!approved.length) {
    container.style.display = 'none';
    return;
  }
  container.style.display = '';
  container.innerHTML = approved.slice(0, 6).map(function(r) {
    var stars = '';
    var rating = r.rating || r.stars || 5;
    for (var i = 0; i < rating; i++) stars += '\u2605';
    return '<div class="testi-card"><div class="testi-stars">' + stars + '</div><p class="testi-text">' + esc(r.text || '') + '</p><div class="testi-author"><strong>' + esc(r.name) + '</strong>' + (r.city ? '<span>' + esc(r.city) + '</span>' : '') + '</div></div>';
  }).join('');
}

// Load settings content
function loadContent() {
  var els = document.querySelectorAll('[data-page]');
  var pages = lsGet('sanayah_pages');
  var seo = lsGet('sanayah_seo');
  var heroTitle = lsGet('sanayah_hero_title');
  var heroSub = lsGet('sanayah_hero_sub');
  var siteName = lsGet('sanayah_site_name');

  if (seo && seo.title) document.title = seo.title;

  els.forEach(function(el) {
    var page = el.getAttribute('data-page');
    var content = el.getAttribute('data-content');
    if (page === 'home' && content && pages && pages.home) {
      if (content === 'hero_title' && heroTitle) el.textContent = heroTitle;
      else if (content === 'hero_sub' && heroSub) el.textContent = heroSub;
      else if (content === 'site_name' && siteName) el.textContent = siteName;
      else if (pages.home[content]) el.textContent = pages.home[content];
    }
  });
}

// Card click handler
function initCards() {
  document.querySelectorAll('[href]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href && href !== '#') window.location.href = href;
    });
  });
}

// Search tabs
function initSearchTabs() {
  var tabs = document.querySelectorAll('.stab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });
}

// Back to top
function initBackTop() {
  var btn = g('backTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });
}

// Announcement bar load
function loadAnnouncement() {
  var bar = document.querySelector('.announce-bar');
  if (!bar) return;
  var ann = lsGet('sanayah_announcement');
  if (ann) bar.innerHTML = ann;
}

// Popup on load
function initPopup() {
  var el = g('homePopup');
  if (!el) return;
  var closed = localStorage.getItem('sanayah_popup_closed');
  var popData = lsGet('sanayah_popup');
  if (closed || !popData) return;
  var imgWrap = g('popupImgWrap');
  var img = g('popupImg');
  var text = g('popupText');
  if (popData.image && img && imgWrap) {
    img.src = popData.image;
    imgWrap.style.display = '';
  }
  if (popData.text && text) text.textContent = popData.text;
  el.style.display = 'flex';
}

// Escape helper
function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Init
(function init() {
  loadAirlines();
  loadReviews();
  loadContent();
  initCards();
  initSearchTabs();
  initBackTop();
  loadAnnouncement();
  initPopup();
})();
