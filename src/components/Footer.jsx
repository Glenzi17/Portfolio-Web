import { useLocation } from 'react-router';
import { SITE } from '../data/projects.js';

const SECTIONS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'contato', label: 'Contato' },
];

/* Rodapé escuro: frase + status à esquerda, colunas de links à direita.
   Fica dentro do escopo de cada página para animar (data-reveal) a cada
   visita, como no site original. */
export default function Footer({ top = '#top' }) {
  const isHome = useLocation().pathname === '/';
  // Na home os links rolam até a seção; fora dela viajam com a cortina
  const to = (id, label) => (isHome ? { href: `#${id}` } : { href: `/#${id}`, 'data-transition': label });

  return (
    <footer className="footer" data-dark>
      <div className="footer__grid" data-reveal-group>
        <div className="footer__brand">
          <p className="footer__statement">Design com conceito, estética <span className="serif">e propósito.</span></p>
          <span className="label footer__status"><i />Disponível para projetos</span>
        </div>
        <nav className="footer__col small" aria-label="Seções">
          <span className="label">Navegar</span>
          {SECTIONS.map((s) => <a key={s.id} {...to(s.id, s.label)}>{s.label}</a>)}
        </nav>
        <nav className="footer__col small" aria-label="Redes">
          <span className="label">Redes</span>
          <a href={SITE.social.instagram} target="_blank" rel="noopener">Instagram</a>
          <a href={SITE.social.behance} target="_blank" rel="noopener">Behance</a>
          <a href={SITE.social.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        </nav>
        <div className="footer__col small">
          <span className="label">Contato</span>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </div>
      </div>
      <div className="footer__bottom label" data-reveal data-line="top">
        <span>© 2026 {SITE.name} · {SITE.location}</span>
        <a className="footer__up" href={top} aria-label="Voltar ao topo">↑</a>
      </div>
    </footer>
  );
}
