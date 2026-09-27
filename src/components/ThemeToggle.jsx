import { useState } from 'react';
import { flushSync } from 'react-dom';
import { reduced } from '../lib/motion.js';

/* =========================================================
   THEME TOGGLE — claro / noturno, no espírito do skiper26:
   o tema novo se revela num círculo que cresce a partir do
   botão (View Transitions API + clip-path no
   ::view-transition-new). O ícone é um disco meio cheio que
   gira meia volta a cada troca. Sem a API, ou com movimento
   reduzido, a troca é instantânea. A escolha fica salva em
   localStorage ('gl-theme'); sem escolha, segue o sistema
   (o script do index.html aplica antes da primeira pintura).
   ========================================================= */

const current = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

const apply = (t) => {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('gl-theme', t); } catch { /* aba privada: vale só nesta visita */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#0a0f18' : '#f2f4f7');
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(current);

  const toggle = (e) => {
    const next = current() === 'dark' ? 'light' : 'dark';
    const swap = () => { apply(next); flushSync(() => setTheme(next)); };
    if (reduced || !document.startViewTransition) { swap(); return; }

    // Centro do círculo = centro do botão; raio = distância até o canto mais longe
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(swap);
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  };

  const dark = theme === 'dark';
  return (
    <button type="button" className={`theme${dark ? ' is-dark' : ''}`} onClick={toggle}
      aria-label={dark ? 'Mudar para o tema claro' : 'Mudar para o tema noturno'} aria-pressed={dark} title={dark ? 'Tema claro' : 'Tema noturno'}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5z" />
      </svg>
    </button>
  );
}
