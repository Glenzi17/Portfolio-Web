/* =========================================================
   PROJETO — template reutilizável (/projeto/:slug)
   Cabeçalho, hero, seções (contexto → conceito →
   desenvolvimento → resultado) e o "next project". Toda
   imagem vai numa "prancha" (Plate) e aparece inteira.
   ========================================================= */
import { useEffect, useRef } from 'react';
import { Navigate, useParams } from 'react-router';
import { PROJECTS } from '../data/projects.js';
import { ratioOf, pad2 } from '../lib/media.js';
import { gsap, reduced } from '../lib/motion.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { initReveals, initDarkNav } from '../lib/reveals.js';
import { useShell } from '../components/ShellContext.js';
import Plate from '../components/Plate.jsx';
import Player from '../components/Player.jsx';
import Footer from '../components/Footer.jsx';

/* ---------- Figura em prancha ---------- */
// --r (largura/altura) na figure permite ao CSS limitar a altura de peças
// verticais sem perder a proporção.
const Caption = ({ text }) => (text ? <figcaption className="caption small" data-reveal>{text}</figcaption> : null);

const Figure = ({ img, ratio, n, sizes }) => {
  const im = img || {};
  return (
    <figure className="img-reveal" style={{ '--r': ratioOf(im, { ratio }).toFixed(4) }}>
      <Plate img={im} index={n} ratio={ratio} sizes={sizes} />
      <Caption text={im.caption} />
    </figure>
  );
};

// Largura que cada bloco ocupa (para o srcset escolher a variante certa).
// Blocos "full" e o hero são limitados em altura (78vh no celular): um cartaz
// 4:5 nunca passa de ~62vh de largura, então não precisa da variante maior.
const SIZES = {
  full: '(max-width: 860px) min(100vw, 62vh), 70vw',
  wide: '100vw',
  split: '(max-width: 860px) 100vw, 50vw',
  overlap: '(max-width: 860px) 100vw, 66vw',
  hero: '(max-width: 860px) min(100vw, 62vh), 70vw',
  next: '(max-width: 860px) 50vw, 33vw',
};

/* ---------- Blocos de layout ---------- */
function Block({ b, n }) {
  switch (b.type) {
    case 'full':
    case 'wide':
      return <div className={`blk blk--${b.type}`}><Figure img={b.image} ratio={b.ratio} n={n} sizes={SIZES[b.type]} /></div>;
    case 'split':
    case 'overlap':
      return (
        <div className={`blk blk--${b.type}`}>
          {(b.images || []).map((im, i) => <Figure key={i} img={im} ratio={b.ratio} n={n} sizes={SIZES[b.type]} />)}
        </div>
      );
    case 'detail':
      return (
        <div className="blk blk--detail">
          <figure className="img-reveal blk--detail" style={{ '--zoom': String(b.zoom || 1.5), '--focus': b.focus || '50% 50%' }}>
            <Plate img={b.image} index={n} ratio={b.ratio || '16/9'} sizes="100vw" />
            <Caption text={b.image && b.image.caption} />
          </figure>
        </div>
      );
    case 'video': {
      const r = ratioOf({ src: b.src, ratio: b.ratio }).toFixed(4);
      return (
        <div className="blk blk--video">
          <figure className="img-reveal" style={{ '--r': r }}>
            <Player src={b.src} poster={b.poster} caption={b.caption} ratio={r} />
            <Caption text={b.caption} />
          </figure>
        </div>
      );
    }
    case 'note':
      return (
        <div className="blk blk--note" data-reveal>
          <div><span className="label">{b.label || 'Nota'}</span><p>{b.text || ''}</p></div>
        </div>
      );
    default:
      return null;
  }
}

/* ---------- Página ---------- */
function Project({ p, idx }) {
  const { ready } = useShell();
  const scope = useRef(null);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const n = pad2(idx + 1);
  const nn = pad2(((idx + 1) % PROJECTS.length) + 1);
  const total = pad2(PROJECTS.length);
  const meta = [
    ['Categoria', p.category],
    ['Ano', p.year],
    ['Cliente', p.client],
    ['Serviços', (p.tags || []).join(' · ')],
  ].filter(([, v]) => v);

  useEffect(() => {
    document.title = `${p.title}${p.subtitle ? ' — ' + p.subtitle : ''} · Guilherme Lenzi`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && p.summary) metaDesc.setAttribute('content', p.summary);
  }, [p]);

  usePageMotion(ready, scope, (el) => {
    initReveals(el);
    initDarkNav(el);

    // Intro: título em máscara + hero em clip, com parallax sutil
    const hero = el.querySelector('#project-hero');
    const media = hero.querySelector('.plate > img');
    const head = el.querySelectorAll('.project__title .l > span');
    if (reduced) { gsap.set(head, { yPercent: 0, y: 0 }); return; }

    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(head, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.1 }, 0.1)
      .fromTo(hero, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.out' }, 0.5);
    if (media) gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.9, ease: 'power3.out', delay: 0.5, clearProps: 'transform' });

    gsap.fromTo(hero, { y: 32 }, {
      y: -32, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  return (
    <div ref={scope}>
      <main className="project container" id="main">
        <div className="grid project__head">
          <div className="project__index" data-reveal="down">
            <span className="label label--ink">Project {n} / {total}</span>
            <a className="label link-arrow" href="/#projetos" data-transition="Projetos"><span className="link-arrow__i">←</span> Todos os projetos</a>
          </div>
          <div className="project__title">
            <h1 className="display h1">
              <span className="l"><span>{p.title}</span></span>
              {p.subtitle ? <span className="l"><span><span className="serif">{p.subtitle}</span></span></span> : null}
            </h1>
          </div>
          <p className="project__summary lead" data-reveal>{p.summary || ''}</p>
          <dl className="project__meta" data-reveal-group data-line="top">
            {meta.map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>

        <figure className="project__hero" id="project-hero" style={{ '--r': ratioOf(p.cover).toFixed(4) }}>
          <Plate img={p.cover} index={n} className="plate--hero" sizes={SIZES.hero} priority />
        </figure>

        <div className="project__sections">
          {(p.sections || []).map((s, si) => (
            <section className="psec" aria-labelledby={`psec-${si}`} key={si}>
              <div className="grid psec__head">
                <div className="psec__num" data-reveal><span className="label label--ink">0{si + 1}</span></div>
                <div className="psec__title"><h2 id={`psec-${si}`}><span className="l" data-lines><span>{s.title}</span></span></h2></div>
                <p className="psec__text body body--mute" data-reveal>{s.text || ''}</p>
              </div>
              <div className="psec__blocks">
                {(s.blocks || []).map((b, bi) => <Block key={bi} b={b} n={n} />)}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* ---------- Next project ---------- */}
      <section className="project__next container" id="project-next" data-line="top">
        <a className="next" href={`/projeto/${next.slug}`} data-transition={next.title} data-cursor="Next<br>project">
          <div className="next__label" data-reveal><span className="label label--ink">Next project</span><span className="label">{nn} / {total}</span></div>
          <div className="next__title">
            <h2 className="display">
              <span className="l" data-lines><span>{next.title}</span></span>
              {next.subtitle ? <span className="l" data-lines><span><span className="serif">{next.subtitle}</span></span></span> : null}
            </h2>
            <p className="label next__cat" data-reveal>{next.category} <span className="next__arrow">→</span></p>
          </div>
          <figure className="next__fig img-reveal"><Plate img={next.cover} index={nn} sizes={SIZES.next} /></figure>
        </a>
      </section>

      <Footer top="#main" />
    </div>
  );
}

/* Rota: resolve o slug e remonta a página a cada projeto (key) */
export default function ProjectRoute() {
  const { slug } = useParams();
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx < 0) return <Navigate to="/" replace />;
  return <Project key={slug} p={PROJECTS[idx]} idx={idx} />;
}

/* Compatibilidade com a URL antiga: projeto.html?p=slug */
export function LegacyProjectRedirect() {
  const slug = new URLSearchParams(window.location.search).get('p');
  return <Navigate to={slug ? `/projeto/${slug}` : '/'} replace />;
}
