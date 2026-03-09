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
