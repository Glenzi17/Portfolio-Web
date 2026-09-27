import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { lenis, scrollTo } from '../lib/motion.js';

/* =========================================================
   NAV MARK — a cápsula central da nav (estilo Antimetal).
   O monograma GL fica num círculo com um anel azul que se fecha
   conforme a leitura avança. No fim da página a cápsula se
   expande e mostra o nome completo; antes disso, o hover abre
   "↑ Topo". O clique sempre volta ao topo. A seção atual
   ([data-pill]) e a % ficam no aria-label/title.
   ========================================================= */

const readSections = () => [...document.querySelectorAll('[data-pill]')]
  .map((el) => ({ el, name: el.dataset.pill }));

export default function NavMark({ name }) {
  const { key, pathname } = useLocation();
  const ringRef = useRef(null);
  const [label, setLabel] = useState('');
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let sections = [];
    const refresh = () => { sections = readSections(); };
    const t = setTimeout(refresh, 400); // a página nova monta depois da cortina
    const ring = ringRef.current;
    let lastPct = -1, lastLabel = null, lastDone = null;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      ring.style.strokeDashoffset = (1 - p).toFixed(4);
      const n = Math.round(p * 100);
      if (n !== lastPct) { lastPct = n; setPct(n); }
      const line = window.innerHeight * 0.4;
      let cur = '';
      for (const s of sections) if (s.el.getBoundingClientRect().top < line) cur = s.name;
      if (cur !== lastLabel) { lastLabel = cur; setLabel(cur); }
      const d = max > 0 && p > 0.985; // chegou ao fim
      if (d !== lastDone) { lastDone = d; setDone(d); }
    };

    refresh(); update();
    if (lenis) lenis.on('scroll', update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', refresh);
    return () => {
      clearTimeout(t);
      if (lenis) lenis.off('scroll', update);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', refresh);
    };
  }, [key]);

  const text = label || (pathname === '/' ? 'Início' : 'Projeto');
  return (
    <button
      type="button"
      className={`nav__mark${done ? ' is-done' : ''}`}
      onClick={() => scrollTo(0)}
      aria-label={done ? `${name} — voltar ao topo` : `${text}, ${pct}% lido — voltar ao topo`}
      title={done ? 'Voltar ao topo' : `${text} · ${pct}% — voltar ao topo`}
    >
      <span className="nav__mark-dot">
        <svg className="nav__mark-ring" viewBox="0 0 48 48" aria-hidden="true">
          <circle className="nav__mark-track" cx="24" cy="24" r="22" />
          <circle className="nav__mark-fill" ref={ringRef} cx="24" cy="24" r="22" pathLength="1" />
        </svg>
        <span className="nav__mark-gl" aria-hidden="true">G<em>L</em></span>
      </span>
      {/* a cápsula abre de 0 à largura do texto (grid 0fr → 1fr) */}
      <span className="nav__mark-open" aria-hidden="true">
        <span className="nav__mark-txt">
          <span className="nav__mark-name">{name}</span>
          <span className="nav__mark-top">Topo</span>
          <i>↑</i>
        </span>
      </span>
    </button>
  );
}
