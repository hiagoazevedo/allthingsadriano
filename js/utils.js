/* ══════════════════════════════════════════
   utils.js — Reusable DOM helpers
   Resolves duplicated querySelector / addEventListener patterns
   ══════════════════════════════════════════ */

const $  = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const on = (el, ev, fn) => el.addEventListener(ev, fn);
const lockBody = bool => { document.body.style.overflow = bool ? 'hidden' : ''; };
