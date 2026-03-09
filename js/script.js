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
    lightbox.setAttribute('aria-hidden', 'true');
    lockBody(false);
  }

  function updateLightbox() {
    lbCounter.textContent = `${current + 1} / ${total}`;
    // When real images are added: update lbImg background-image or src here
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
    on(item.querySelector('.portfolio-img-placeholder'), 'click', () => openLightbox(i));
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
