import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { gsap, reduced } from '../lib/motion.js';
import { magnetize } from '../lib/reveals.js';
import { SITE } from '../data/projects.js';
import { useShell } from './ShellContext.js';

const LINKS = [
  { id: 'sobre', n: '01', label: 'Sobre' },
  { id: 'experiencia', n: '02', label: 'Experiência' },
  { id: 'projetos', n: '03', label: 'Projetos' },
  { id: 'contato', n: '04', label: 'Contato' },
];

/* Navbar fixa + menu mobile. Na home os links rolam até a seção;
   nas outras páginas viajam para a home com a cortina ([data-transition]). */
export default function Nav() {
  const { ready, menuOpen, toggleMenu } = useShell();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const navRef = useRef(null);
  const faded = useRef(false);

  // href por contexto: '#sobre' na home, '/#sobre' + cortina fora dela
  const to = (id, label) => (isHome ? { href: `#${id}` } : { href: `/#${id}`, 'data-transition': label });

  // Entra junto com o conteúdo, uma única vez
  useEffect(() => {
    if (!ready || faded.current) return;
    faded.current = true;
    if (reduced) gsap.set(navRef.current, { opacity: 1 });
    else gsap.fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 1, delay: 0.15, clearProps: 'transform' });
  }, [ready]);

  // Compacta ao rolar
  useEffect(() => {
    const nav = navRef.current;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => magnetize(navRef.current), []);

  return (
    <>
      <header className="nav" id="nav" ref={navRef}>
        <a className="nav__brand" {...(isHome ? { href: '#top' } : { href: '/', 'data-transition': 'Início' })} aria-label="Guilherme Lenzi — início">Guilherme Lenzi</a>
        <nav className="nav__links" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.id} className="nav__link" {...to(l.id, l.label)} data-nav={isHome ? l.id : undefined}><em>{l.n}</em> {l.label}</a>
          ))}
        </nav>
        <a className="btn" {...to('contato', 'Contato')} data-magnetic>Let's talk <span className="btn__arrow">→</span></a>
        <button
          className={`nav__toggle${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={toggleMenu}
        ><span /><span /></button>
      </header>

      <div className={`menu${menuOpen ? ' is-open' : ''}`} id="menu" aria-hidden={!menuOpen}>
        <ul className="menu__list">
          {LINKS.map((l) => (
            <li key={l.id}><a className="menu__link" {...to(l.id, l.label)}><em>{l.n}</em> {l.label}</a></li>
          ))}
        </ul>
        <div className="menu__foot">
          <a className="small" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <span className="label">Minas Gerais, BR</span>
        </div>
      </div>
    </>
  );
}
