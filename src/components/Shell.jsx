/* =========================================================
   SHELL — casca persistente do app: preloader, cortina de
   transição entre rotas, menu mobile, links âncora, cursor.
   Expõe via contexto: ready (página pode animar), leaveTo,
   menuOpen / toggleMenu / closeMenu.
   ========================================================= */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { gsap, lenis, reduced, scrollTo, jumpTo, EASE_IO } from '../lib/motion.js';
import { ShellCtx } from './ShellContext.js';
import Nav from './Nav.jsx';
import Cursor from './Cursor.jsx';

// Preloader só na primeira visita da sessão (lido uma única vez, no load)
const SEEN = (() => {
  try {
    const s = sessionStorage.getItem('gl-seen') === '1';
    sessionStorage.setItem('gl-seen', '1');
    return s;
  } catch { return true; }
})();

export default function Shell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [preloading, setPreloading] = useState(!reduced && !SEEN);
  const [menuOpen, setMenuOpen] = useState(false);

  const curtainRef = useRef(null);
  const labelRef = useRef(null);
  const preRef = useRef(null);
  const pending = useRef(false);      // próxima troca de rota veio da cortina
  const lastKey = useRef(null);
  const menuOpenRef = useRef(false);
  const prevMenu = useRef(false);

  /* ---------- Menu mobile ---------- */
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  useEffect(() => {
    menuOpenRef.current = menuOpen;
    if (prevMenu.current === menuOpen) return;
    prevMenu.current = menuOpen;
    if (menuOpen) { if (lenis) lenis.stop(); document.body.style.overflow = 'hidden'; }
    else { if (lenis && !pending.current) lenis.start(); document.body.style.overflow = ''; }
  }, [menuOpen]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- Entrada inicial: preloader ---------- */
  useEffect(() => {
    if (reduced || SEEN) { setReady(true); return undefined; }
    const pre = preRef.current;
    const count = pre.querySelector('.preloader__count');
    const ring = pre.querySelector('.preloader__ring rect');
    const glyphs = pre.querySelectorAll('.preloader__glyph > span');
    const mark = pre.querySelector('.preloader__mark');
    const n = { v: 0 };
    if (lenis) lenis.stop();
    // Monograma: o contorno se desenha junto com a contagem, as letras sobem
    // pela máscara; no fim a tela recolhe para cima com a base arredondada.
    const tl = gsap.timeline({ onComplete: () => { setPreloading(false); if (lenis) lenis.start(); } })
      .to(n, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(2, '0'); } })
      .to(ring, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0)
      .fromTo(glyphs, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, 0.2)
      .to(glyphs, { yPercent: -110, duration: 0.5, stagger: 0.05, ease: 'power3.in' }, '+=0.15')
      .to([mark, count], { opacity: 0, scale: 0.94, duration: 0.4, ease: 'power2.in' }, '<0.1')
      .to(pre, { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 48px 48px)', duration: 0.9, ease: EASE_IO }, '-=0.15')
      .add(() => setReady(true), '-=0.85'); // o hero começa a subir enquanto a tela recolhe
    return () => tl.kill();
  }, []);

  /* ---------- Troca de rota: scroll + cortina ---------- */
  useLayoutEffect(() => {
    if (lastKey.current === location.key) return;
    const isFirst = lastKey.current === null;
    lastKey.current = location.key;
    jumpTo(location.hash);
    if (isFirst) return; // a entrada inicial é do preloader
    const curtain = curtainRef.current;
    if (pending.current && curtain) {
      pending.current = false;
      gsap.timeline({ delay: 0.15 })
        .add(() => setReady(true), 0.1)
        .to(curtain, { y: '-100%', duration: 0.9, ease: EASE_IO }, 0)
        .set(curtain, { y: '120%', pointerEvents: 'none' })
        .set(labelRef.current, { opacity: 0 })
        .add(() => { if (lenis) lenis.start(); });
    } else {
      setReady(true); // voltar/avançar do navegador
    }
  }, [location.key, location.hash]);

  /* ---------- Sair para outra rota com a cortina ---------- */
  const leaveTo = useCallback((href, labelText = '', origin = null) => {
    setMenuOpen(false);
    if (reduced || !curtainRef.current) { setReady(false); navigate(href); return; }
    pending.current = true;
    if (labelRef.current) labelRef.current.textContent = labelText;
    if (lenis) lenis.stop();
    const curtain = curtainRef.current;
    const tl = gsap.timeline()
      .set(curtain, { pointerEvents: 'auto' })
      .to(curtain, { y: '0%', duration: 0.8, ease: EASE_IO })
      .to(labelRef.current, { opacity: 1, duration: 0.3 }, '-=0.3')
      .add(() => { setReady(false); navigate(href); }, '+=0.05');
    // Se veio de um card de projeto, a imagem "avança" enquanto a cortina sobe
    const media = origin && origin.querySelector('.plate > img');
    if (media) tl.to(media, { scale: 1.06, duration: 0.9, ease: 'power3.out' }, 0);
  }, [navigate]);

  /* ---------- Links: [data-transition] (rota) e #âncora (scroll) ---------- */
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented) return;
      const t = e.target.closest('a[data-transition]');
      if (t) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || t.target === '_blank') return;
        e.preventDefault();
        leaveTo(t.getAttribute('href'), t.dataset.transition, t);
        return;
      }
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      let target = null;
      try { target = document.querySelector(id); } catch { target = null; }
      if (!target) return;
      e.preventDefault();
      const wasOpen = menuOpenRef.current;
      setMenuOpen(false);
      // No menu mobile, espera fechar antes de rolar
      setTimeout(() => scrollTo(target), wasOpen ? 350 : 0);
      history.replaceState(null, '', id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [leaveTo]);

  return (
    <ShellCtx.Provider value={{ ready, leaveTo, menuOpen, toggleMenu, closeMenu }}>
      <a className="skip-link" href="#main">Pular para o conteúdo</a>

      {preloading && (
        <div className="preloader" aria-hidden="true" ref={preRef}>
          <div className="preloader__mark">
            <svg className="preloader__ring" viewBox="0 0 120 120"><rect x="1" y="1" width="118" height="118" rx="30" pathLength="1" /></svg>
            <span className="preloader__glyph"><span>G</span><span className="serif">L</span></span>
          </div>
          <div className="preloader__count label">00</div>
        </div>
      )}
      {!reduced && (
        <div className="curtain" aria-hidden="true" ref={curtainRef}>
          <span className="curtain__label label" ref={labelRef} />
        </div>
      )}
      <Cursor />

      <Nav />

      {children}
    </ShellCtx.Provider>
  );
}
