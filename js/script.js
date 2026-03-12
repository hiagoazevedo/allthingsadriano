/* ══════════════════════════════════════════
   script.js — Main application logic
   Depends on utils.js ($, $$, on, lockBody)
   ══════════════════════════════════════════ */

/* ── CURSOR (desktop / fine pointer only) ── */
const cursor = $('#cursor');
const ring   = $('#cursor-ring');
if (window.matchMedia('(pointer: fine)').matches) {
  on(document, 'mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 80);
  });
  $$('a, button').forEach(el => {
    on(el, 'mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; ring.style.opacity = '0.15'; });
    on(el, 'mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.opacity = '0.5'; });
  });
}

/* ── NAVBAR COMPACT ON SCROLL ── */
const navbar = $('#navbar');
on(window, 'scroll', () => {
  navbar.classList.toggle('compact', window.scrollY > 40);
});

/* ── SMOOTH SCROLL ── */
$$('a[href^="#"]').forEach(a => {
  on(a, 'click', function(e) {
    const t = $(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
$$('.reveal').forEach(el => revealObserver.observe(el));

/* ── MOBILE MENU ──
   Must remain globally scoped — HTML uses inline onclick="toggleMobile()" / onclick="closeMobile()"
   ── */
function toggleMobile() {
  const menu = $('#mobileMenu');
  const ham  = $('#hamburger');
  const open = menu.classList.toggle('open');
  ham.classList.toggle('open', open);
  lockBody(open);
}

function closeMobile() {
  $('#mobileMenu').classList.remove('open');
  $('#hamburger').classList.remove('open');
  lockBody(false);
}

// ── REVIEWS CAROUSEL ──
(function () {
  const track = document.querySelector('.reviews-track');
  const dotsWrap = document.getElementById('reviewDots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  let currentPage = 0;

  function perPage()    { return window.innerWidth <= 960 ? 1 : 3; }
  function totalPages() { return Math.ceil(cards.length / perPage()); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to review group ' + (i + 1));
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function goTo(page) {
    currentPage = Math.max(0, Math.min(page, totalPages() - 1));
    const gap       = 2;
    const cardWidth = cards[0].getBoundingClientRect().width;
    track.style.transform = 'translateX(-' + (currentPage * perPage() * (cardWidth + gap)) + 'px)';
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === currentPage));
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages() - 1;
  }

  prevBtn.addEventListener('click', () => goTo(currentPage - 1));
  nextBtn.addEventListener('click', () => goTo(currentPage + 1));

  buildDots();
  goTo(0);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(currentPage, totalPages() - 1));
    }, 150);
  });
})();

// ── REVIEWS: LANGUAGE DETECTION, TRANSLATION & EXPAND ──
(function () {
  const CHAR_LIMIT = 300;

  const PT_PATTERN = /\b(maravilhoso|parabéns|parabens|obrigad[ao]|muito|ótimo|otimo|também|tambem|não|nao|bonito|bonita|lindo|linda|incrível|incrivel|estou|estão|porque|aqui|este|esta|meu|minha|pelo|pela|pelos|pelas|dos|das|foi|ser|tem|ter|isso|aquilo|bom|boa|feliz|perfeito|perfeita)\b/i;
  const ES_PATTERN = /\b(gracias|muchas|excelente|increíble|increible|muy|también|tambien|pero|porque|están|estan|hace|más|mas|para|todo|todos|toda|todas|servicio|atención|atencion|recomiendo|recomendado|definitivamente|hermoso|hermosa|perfecto|perfecta|bueno|buena|fantástico|fantastico|quedé|quede|quedó|quedo|encantad[ao])\b/i;

  function detectLanguage(text) {
    if (PT_PATTERN.test(text)) return 'pt';
    if (ES_PATTERN.test(text)) return 'es';
    return null;
  }

  const LANG_LABELS = {
    pt: 'Portuguese',
    es: 'Spanish',
  };

  async function translateToEnglish(text, sourceLang) {
    try {
      const res = await fetch(
        'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + sourceLang + '|en'
      );
      const data = await res.json();
      if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
    } catch (_) {}
    return text;
  }

  function applyTruncation(el, plainText) {
    if (plainText.length <= CHAR_LIMIT) return;

    let cut = plainText.slice(0, CHAR_LIMIT).trimEnd();
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > CHAR_LIMIT * 0.8) cut = cut.slice(0, lastSpace);

    // Store original markup so <br> and other inline elements survive expand
    el.setAttribute('data-full-html', el.innerHTML);
    el.textContent = cut + '\u2026';

    const showMore = document.createElement('button');
    showMore.className = 'review-show-more';
    showMore.textContent = 'Show more';

    const showLess = document.createElement('button');
    showLess.className = 'review-show-more';
    showLess.textContent = 'Show less';
    showLess.style.display = 'none';

    showMore.addEventListener('click', () => {
      const fromH = el.offsetHeight;
      el.style.maxHeight = fromH + 'px';
      el.style.overflow = 'hidden';
      el.innerHTML = el.getAttribute('data-full-html');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.maxHeight = el.scrollHeight + 'px';
        });
      });
      el.addEventListener('transitionend', () => {
        el.style.maxHeight = '';
        el.style.overflow = '';
      }, { once: true });
      showMore.style.display = 'none';
      showLess.style.display = '';
    });

    showLess.addEventListener('click', () => {
      const fromH = el.offsetHeight;
      el.style.overflow = 'hidden';
      el.style.maxHeight = fromH + 'px';
      el.textContent = cut + '\u2026';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.maxHeight = el.scrollHeight + 'px';
        });
      });
      el.addEventListener('transitionend', () => {
        el.style.maxHeight = '';
        el.style.overflow = '';
      }, { once: true });
      showLess.style.display = 'none';
      showMore.style.display = '';
    });

    el.insertAdjacentElement('afterend', showLess);
    el.insertAdjacentElement('afterend', showMore);
  }

  // Remove any existing show-more/show-less buttons and reset the text element
  function resetTruncation(el, text) {
    const card = el.closest('.review-card');
    card.querySelectorAll('.review-show-more').forEach(b => b.remove());
    el.removeAttribute('data-full-html');
    el.style.maxHeight = '';
    el.style.overflow = '';
    el.textContent = text;
  }

  function addTranslateToggle(card, el, originalText, sourceLang) {
    let translatedText = null;
    let isTranslated = false;
    const langLabel = LANG_LABELS[sourceLang];

    const btn = document.createElement('button');
    btn.className = 'review-translate-btn';
    btn.textContent = 'See translation (English)';

    btn.addEventListener('click', async () => {
      btn.disabled = true;

      if (!isTranslated) {
        if (!translatedText) {
          btn.textContent = 'Translating\u2026';
          translatedText = await translateToEnglish(originalText, sourceLang);
        }
        resetTruncation(el, translatedText);
        applyTruncation(el, translatedText);
        isTranslated = true;
        btn.textContent = 'See original (' + langLabel + ')';
      } else {
        resetTruncation(el, originalText);
        applyTruncation(el, originalText);
        isTranslated = false;
        btn.textContent = 'See translation (English)';
      }

      btn.disabled = false;
    });

    const footer = card.querySelector('.review-footer');
    card.insertBefore(btn, footer);
  }

  function processCard(card) {
    const el = card.querySelector('.review-text');
    if (!el) return;
    const rawText = el.textContent.trim();
    const lang = detectLanguage(rawText);
    if (lang) {
      addTranslateToggle(card, el, rawText, lang);
    }
    applyTruncation(el, rawText);
  }

  document.querySelectorAll('.review-card').forEach(processCard);
})();

// ── PORTFOLIO LIGHTBOX ──
(function () {
  const lightbox  = $('#lightbox');
  const lbCounter = $('#lbCounter');
  const lbClose   = $('#lbClose');
  const lbPrev    = $('#lbPrev');
  const lbNext    = $('#lbNext');
  const items     = $$('.portfolio-item');
  const total     = items.length;
  let current     = 0;

  function openLightbox(index) {
    current = index;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lockBody(true);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    if (lightbox.contains(document.activeElement)) document.activeElement.blur();
    lightbox.setAttribute('aria-hidden', 'true');
    lockBody(false);
  }

  function updateLightbox() {
    lbCounter.textContent = `${current + 1} / ${total}`;
    const source = items[current].querySelector('img');
    const lbImg  = $('#lbImg');
    lbImg.src    = source.src;
    lbImg.srcset = source.srcset;
    lbImg.alt    = source.alt;
  }

  function navigate(dir) {
    const wrap = lightbox.querySelector('.lightbox-img-wrap');
    wrap.classList.add('transitioning');
    setTimeout(() => {
      current = (current + dir + total) % total;
      updateLightbox();
      wrap.classList.remove('transitioning');
    }, 200);
  }

  // Open on item click
  items.forEach((item, i) => {
    on(item.querySelector('.portfolio-img'), 'click', () => openLightbox(i));
  });

  // Controls
  on(lbClose, 'click', closeLightbox);
  on(lbPrev,  'click', () => navigate(-1));
  on(lbNext,  'click', () => navigate(1));

  // Close on overlay click (outside image)
  on(lightbox, 'click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard navigation
  on(document, 'keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft')  navigate(-1);
  });
})();
