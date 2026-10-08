const COLORS = [
  { name:'ORANGE',      c:'#F76B1C', ink:'#2b1304' },
  { name:'TURQUOISE',   c:'#00D4D8', ink:'#022b2c' },
  { name:'BROWN',       c:'#6E4220', ink:'#ffffff' },
  { name:'MAGENTA',     c:'#9A0A9A', ink:'#ffffff' },
  { name:'LIGHT GREEN', c:'#6BE86B', ink:'#0f3a0f' },
  { name:'RED',         c:'#C70A0A', ink:'#ffffff' }
];
const KEY = 'sixcolors-scores-v1';
let scores = COLORS.map(() => 0);
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (Array.isArray(saved) && saved.length === 6) scores = saved.map(n => +n || 0);
} catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(scores)); } catch (e) {} };

const game = document.getElementById('game');
const els = COLORS.map((col, i) => {
  const d = document.createElement('div');
  d.className = 'col';
  d.tabIndex = 0;
  d.setAttribute('role', 'button');
  d.setAttribute('aria-label', col.name + ': sumar un punto');
  d.style.setProperty('--c', col.c);
  d.style.setProperty('--ink', col.ink);
  d.innerHTML =
    '<h2 class="name">' + col.name + '</h2>' +
    '<div class="card"><small>SCORE</small><span class="score" aria-live="polite">' + scores[i] + '</span></div>';
  game.appendChild(d);
  return d;
});

function point(i, x, y) {
  scores[i]++;
  const el = els[i], s = el.querySelector('.score');
  s.textContent = scores[i];
  s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');

  const r = el.getBoundingClientRect();
  const px = (x ?? r.left + r.width / 2) - r.left;
  const py = (y ?? r.top + r.height * 0.45) - r.top;
  const plus = document.createElement('span');
  plus.className = 'plus';
  plus.textContent = '+1';
  plus.style.left = px + 'px';
  plus.style.top = py + 'px';
  plus.style.setProperty('--dx', (Math.random() * 36 - 18).toFixed(1) + 'px');
  plus.style.setProperty('--r', (Math.random() * 16 - 8).toFixed(1) + 'deg');
  el.appendChild(plus);
  setTimeout(() => plus.remove(), 1000);
  save();
}

els.forEach((el, i) => {
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    el.classList.add('pressed');
    point(i, e.clientX, e.clientY);
  });
  ['pointerup','pointerleave','pointercancel'].forEach(t =>
    el.addEventListener(t, () => el.classList.remove('pressed')));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); point(i); }
  });
});

// Teclas 1–6 para jugar con teclado
addEventListener('keydown', e => {
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 6) point(n - 1);
});

document.getElementById('reset').addEventListener('click', () => {
  scores = scores.map(() => 0);
  els.forEach(el => el.querySelector('.score').textContent = '0');
  save();
});