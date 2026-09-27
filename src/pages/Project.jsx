/* =========================================================
   PROJETO — template reutilizável (/projeto/:slug)
   Cabeçalho, hero, seções (contexto → conceito →
   desenvolvimento → resultado) e o "next project". Toda
   imagem vai numa "prancha" (Plate) e aparece inteira.
   ========================================================= */
import { useEffect, useRef } from 'react';
import { Navigate, useParams } from 'react-router';
import { PROJECTS } from '../data/projects.js';
import { ratioOf, pad2, dimsOf } from '../lib/media.js';
import { gsap, ScrollTrigger, reduced } from '../lib/motion.js';
import { scramble } from './home-motion.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { initReveals, initDarkNav } from '../lib/reveals.js';
import { useShell } from '../components/ShellContext.js';
import Roll from '../components/Roll.jsx';
import Plate from '../components/Plate.jsx';
import Player from '../components/Player.jsx';
import Devices from '../components/Devices.jsx';
import Footer from '../components/Footer.jsx';

/* ---------- Figura em prancha ---------- */
// --r (largura/altura) na figure permite ao CSS limitar a altura de peças
// verticais sem perder a proporção.
const Caption = ({ text }) => (text ? <figcaption className="caption small" data-reveal>{text}</figcaption> : null);

/* Moldura de prova: marcas de corte nos quatro cantos, número da figura
   (contador CSS) e o formato real da peça — o vocabulário da gráfica. */
function Frame({ img, children }) {
  const d = dimsOf(img && img.src);
  return (
    <div className="frame">
      <span className="frame__tag label" aria-hidden="true">
        <b className="frame__n" />
        {d ? <span>{d[0]} × {d[1]}</span> : null}
      </span>
      <i className="frame__c frame__c--tl" /><i className="frame__c frame__c--tr" />
      <i className="frame__c frame__c--bl" /><i className="frame__c frame__c--br" />
      {children}
    </div>
  );
}

const Figure = ({ img, ratio, n, sizes }) => {
  const im = img || {};
  return (
    <figure className="img-reveal" style={{ '--r': ratioOf(im, { ratio }).toFixed(4) }}>
      <Frame img={im}><Plate img={im} index={n} ratio={ratio} sizes={sizes} /></Frame>
      <Caption text={im.caption} />
    </figure>
  );
};

// Título letra a letra (mesma entrada do nome na home)
const NBSP = String.fromCharCode(160);
const Chars = ({ text }) => [...text].map((ch, i) => <span className="c" key={i} aria-hidden="true">{ch === ' ' ? NBSP : ch}</span>);

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
            <Frame img={b.image}><Plate img={b.image} index={n} ratio={b.ratio || '3/2'} sizes="(max-width: 860px) 100vw, 60vw" /></Frame>
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
    case 'devices':
      return <Devices b={b} />;
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

    scramble(el);

    // Molduras: as marcas de corte se desenham quando a peça entra
    el.querySelectorAll('.frame').forEach((f) => {
      ScrollTrigger.create({ trigger: f, start: 'top 88%', once: true, onEnter: () => f.classList.add('is-in') });
    });

    // Intro: título letra a letra + subtítulo em máscara + hero em clip
    const hero = el.querySelector('#project-hero');
    const media = hero.querySelector('.plate > img');
    const chars = el.querySelectorAll('.project__title .c');
    const sub = el.querySelectorAll('.project__title .l:not(:first-child) > span');
    if (reduced) { gsap.set([chars, sub], { yPercent: 0, y: 0 }); return; }

    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(chars, { yPercent: 115, rotate: 8, y: 0 }, { yPercent: 0, rotate: 0, y: 0, duration: 1.2, stagger: 0.03 }, 0.1)
      .fromTo(sub, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.2 }, 0.4)
      .fromTo(hero, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.out' }, 0.5);
    if (media) gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.9, ease: 'power3.out', delay: 0.5, clearProps: 'transform' });

    // Hero: sobe devagar e encolhe um pouco enquanto a página rola
    gsap.fromTo(hero, { y: 32, scale: 1 }, {
      y: -32, scale: 0.94, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: hero, start: 'top 60%', end: 'bottom top', scrub: true },
    });

    // Pares: a segunda peça rola em outro ritmo (profundidade)
    el.querySelectorAll('.blk--split figure:last-child, .blk--overlap figure:last-child').forEach((f) => {
      gsap.fromTo(f, { y: 28 }, {
        y: -28, ease: 'none',
        scrollTrigger: { trigger: f.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Versões: o aparelho sobe quando chega na tela
    el.querySelectorAll('.devices__stage').forEach((st) => {
      gsap.fromTo(st, { y: 80, scale: 0.94, opacity: 0 }, {
        y: 0, scale: 1, opacity: 1, duration: 1.3, clearProps: 'transform',
        scrollTrigger: { trigger: st, start: 'top 88%', once: true },
      });
    });

    // Próximo projeto: a capa cresce enquanto chega
    const nf = el.querySelector('.next__fig');
    if (nf) {
      gsap.fromTo(nf, { scale: 0.86, rotate: 3 }, {
        scale: 1, rotate: 0, ease: 'none',
        scrollTrigger: { trigger: nf, start: 'top bottom', end: 'top 45%', scrub: true },
      });
    }
  });

  return (
    <div ref={scope}>
      <main className="project container" id="main" data-pill={p.title}>
        <div className="grid project__head">
          <div className="project__index" data-reveal="down">
            <span className="label label--ink chip" style={{ '--chip': p.color }}><i />Project {n} / {total}</span>
            <a className="label link-arrow" href="/#projetos" data-transition="Projetos"><span className="link-arrow__i">←</span> <Roll>Todos os projetos</Roll></a>
          </div>
          <div className="project__title">
            <h1 className="display h1">
              <span className="l" aria-label={p.title}><span><Chars text={p.title} /></span></span>
              {p.subtitle ? <span className="l"><span><span className="serif">{p.subtitle}</span></span></span> : null}
            </h1>
          </div>
          <p className="project__summary lead" data-reveal>{p.summary || ''}</p>
          <dl className="project__meta" data-reveal-group data-line="top">
            {meta.map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>

        <figure className="project__hero" id="project-hero" style={{ '--r': ratioOf(p.cover).toFixed(4) }}>
          <Frame img={p.cover}><Plate img={p.cover} index={n} className="plate--hero" sizes={SIZES.hero} priority /></Frame>
        </figure>

        <div className="project__sections">
          {(p.sections || []).map((s, si) => (
            <section className="psec" aria-labelledby={`psec-${si}`} key={si} data-pill={s.title}>
              <div className="grid psec__head">
                <div className="psec__num" data-reveal><span className="label label--ink chip" style={{ '--chip': p.color }} data-scramble><i />0{si + 1}</span></div>
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
      <section className="project__next container" id="project-next" data-line="top" data-pill="Próximo">
        <a className="next" href={`/projeto/${next.slug}`} data-transition={next.title} style={{ '--c': next.color }}>
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
