import { SITE } from '../data/projects.js';

/* Rodapé escuro. Fica dentro do escopo de cada página para animar
   (data-reveal) a cada visita, como no site original. */
export default function Footer({ top = '#top' }) {
  return (
    <footer className="footer" data-dark>
      <div className="footer__grid" data-reveal-group>
        <div className="footer__brand">
          <strong>{SITE.name}</strong>
          <span className="small">Designer gráfico / Diretor criativo</span>
        </div>
        <nav className="footer__links small" aria-label="Redes">
          <a href={SITE.social.instagram} target="_blank" rel="noopener">Instagram</a>
          <a href={SITE.social.behance} target="_blank" rel="noopener">Behance</a>
          <a href={SITE.social.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a href={`mailto:${SITE.email}`}>Email</a>
        </nav>
        <div className="footer__top"><a className="label" href={top}>Topo ↑</a></div>
      </div>
      <div className="footer__bottom label" data-reveal data-line="top">
        <span>© 2026 {SITE.name}</span>
      </div>
    </footer>
  );
}
