/* =========================================================
   HOME — hero → sobre → experiência → projetos → contato
   ========================================================= */
import { useEffect, useMemo, useRef } from 'react';
import { SITE, PROJECTS } from '../data/projects.js';
import { ratioOf, pad2 } from '../lib/media.js';
import { usePageMotion } from '../lib/usePageMotion.js';
import { initReveals, initDarkNav } from '../lib/reveals.js';
import { heroIntro, revealWork, initTimeline, initActiveNav, contactEnter, wordFill, countUp, marquee } from './home-motion.js';
import { useShell } from '../components/ShellContext.js';
import Plate from '../components/Plate.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Footer from '../components/Footer.jsx';
import Fluid from '../components/Fluid.jsx';

const TITLE = 'Guilherme Lenzi — Designer Gráfico & Diretor Criativo';
const DESC = 'Portfólio de Guilherme Lenzi: identidades visuais, campanhas publicitárias, direção de arte e experiências digitais com conceito, estética e propósito.';

const EXPERIENCE = [
  { year: '2021', title: 'Primeiros contatos', text: 'Descoberta e experimentação.' },
  { year: '2022', title: 'Desenvolvimento', text: 'Aprimoramento técnico.' },
  { year: '2023', title: 'Projetos e identidade', text: 'Do conceito ao resultado.' },
  { year: '2024', title: 'Design como profissão', text: 'Construção de portfólio.' },
  { year: '2025', title: 'Aprimoramento', text: 'Evolução técnica e criativa.' },
  { year: '2026', title: 'Hoje', text: 'Sempre evoluindo.' },
];

const MARQUEE = ['Branding', 'Campanhas', 'Direção de arte', 'Key visual', 'Digital', 'Identidade visual'];

const SERVICES = [
  { title: 'Identidade visual', tags: 'Branding / Papelaria', tone: 'lime', text: 'Marcas, logotipos e sistemas visuais consistentes, do cartão de visita ao digital.' },
  { title: 'Campanhas', tags: 'Key visual / PDV / Social', tone: 'ink', text: 'Conceito, direção de arte e desdobramento de peças para campanhas publicitárias e promocionais.' },
  { title: 'Digital', tags: 'UI / Web', tone: 'ocean', text: 'Interfaces, sites e peças digitais pensadas para comunicar bem e funcionar em qualquer tela.' },
];

// Anos de estrada saem da própria linha do tempo
const STATS = [
  { value: pad2(PROJECTS.length), label: 'Projetos selecionados' },
  { value: `${Number(EXPERIENCE.at(-1).year) - Number(EXPERIENCE[0].year)}+`, label: 'Anos criando' },
  { value: '360°', label: 'Campanhas integradas' },
  { value: pad2(SERVICES.length), label: 'Frentes de atuação' },
];

/* ---------- Grid de projetos ----------
   Cada capa mantém a própria proporção; a largura do card vem da orientação
   (retrato 5 col · quadrado 6 · paisagem 7 · panorâmica linha inteira).
   Os cards andam em pares; em cada par um deles desce um pouco (offset). */
const SPAN = { pano: 12, land: 7, square: 6, port: 5 };
const orient = (r) => (r >= 2.2 ? 'pano' : r >= 1.25 ? 'land' : r > 0.9 ? 'square' : 'port');
const layout = (projects) => {
  const items = projects.map((p) => { const r = ratioOf(p.cover); return { p, r, o: orient(r), col: '', offset: false }; });
  const rows = []; let cur = [];
  items.forEach((it) => {
    if (it.o === 'pano') { if (cur.length) rows.push(cur); rows.push([it]); cur = []; return; }
    cur.push(it);
    if (cur.length === 2) { rows.push(cur); cur = []; }
  });
  if (cur.length) rows.push(cur);
  rows.forEach((row, ri) => {
    if (row.length === 1) {
      const it = row[0]; const s = SPAN[it.o];
      it.col = it.o === 'pano' ? '1 / 13' : ri % 2 ? `${13 - s} / 13` : `1 / ${1 + s}`;
      it.span = it.o === 'pano' ? 12 : s;
      return;
    }
    const [a, b] = row; let sa = SPAN[a.o], sb = SPAN[b.o];
    while (sa + sb > 11) { if (sa >= sb) sa--; else sb--; } // garante ao menos 1 coluna de respiro
    a.col = `1 / ${1 + sa}`; b.col = `${13 - sb} / 13`;
    a.span = sa; b.span = sb;
    (ri % 2 ? a : b).offset = true;
  });
  // Largura do card na tela (para o srcset): tela inteira no celular, fração da grade no desktop
  items.forEach((it) => { it.sizes = `(max-width: 860px) 100vw, ${Math.round((it.span / 12) * 100)}vw`; });
  return items;
};

export default function Home() {
  const { ready } = useShell();
  const scope = useRef(null);
  const grid = useMemo(() => layout(PROJECTS), []);

  useEffect(() => {
    document.title = TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', DESC);
  }, []);

  usePageMotion(ready, scope, (el) => {
    heroIntro(el);
    initReveals(el);
    revealWork(el);
    initTimeline(el);
    initActiveNav(el);
    contactEnter(el);
    wordFill(el);
    countUp(el);
    marquee(el);
    initDarkNav(el);
  });

  return (
    <div ref={scope}>
      <main id="main">
        {/* ======================= HERO ======================= */}
        <section className="hero" id="top">
          <div className="hero__top">
            <span className="label" data-hero="meta">Portfólio — 2026</span>
            <span className="label hero__status" data-hero="meta"><i />Disponível para projetos</span>
          </div>

          <div className="hero__center">
            <h1 className="display hero__name" aria-label="Guilherme Lenzi">
              <span className="l" data-hero-line><span>Guilherme</span></span>
              <span className="l" data-hero-line><span>Lenzi</span></span>
            </h1>

            <div className="hero__row">
              <p className="hero__title">
                <span className="l" data-hero-title><span>Designer gráfico</span></span>
                <span className="l" data-hero-title><span><span className="serif hero__amp">&amp;</span> diretor criativo</span></span>
              </p>
              <p className="hero__desc" data-hero="desc">Transformo ideias em identidades, experiências e soluções visuais com conceito, estética e propósito.</p>
            </div>
          </div>

          <div className="hero__bottom" data-line="top">
            <ul className="hero__tags label" aria-label="Áreas de atuação">
              <li data-hero="tag">Graphic design</li>
              <li data-hero="tag">Branding</li>
              <li data-hero="tag">Art direction</li>
              <li data-hero="tag">Digital experiences</li>
            </ul>
            <a className="hero__scroll label" href="#sobre" data-hero="scroll">Scroll to explore <i>↓</i></a>
          </div>
        </section>

        {/* ======================= 01 SOBRE ======================= */}
        <section className="section container" id="sobre">
          <div className="section-head" data-reveal data-line>
            <span className="label label--ink chip" style={{ '--chip': 'var(--lime)' }}><i />01 / Sobre</span>
          </div>

          <div className="grid about">
            <div className="about__text">
              <h2 className="h2 about__title">
                <span className="l" data-lines><span>Designer com</span></span>
                <span className="l" data-lines><span>visão <span className="serif">criativa.</span></span></span>
              </h2>
              <p className="lead about__body" data-words>Sou designer gráfico focado na criação de identidades visuais, peças publicitárias e projetos digitais. Tenho interesse em explorar diferentes linguagens visuais, combinando tipografia, composição, cores e direção de arte para transformar ideias em soluções visuais marcantes.</p>
            </div>

            <div className="about__visual">
              <figure className={`about__frame img-reveal${SITE.portrait ? '' : ' about__frame--mono fluid-host'}`} id="about-frame">
                {!SITE.portrait && <Fluid seed={9.1} />}
                {/* Foto: defina SITE.portrait em src/data/projects.js. Sem foto, mostra o monograma. */}
                {SITE.portrait
                  ? <img src={SITE.portrait} alt="Retrato de Guilherme Lenzi" loading="lazy" decoding="async" />
                  : <div className="about__mono" data-parallax="-0.06" aria-hidden="true">G<span className="serif">L</span></div>}
              </figure>
            </div>
          </div>

          <div className="services">
            <div className="services__head" data-reveal data-line>
              <span className="label label--ink">O que eu faço</span>
              <span className="label">{pad2(SERVICES.length)} frentes</span>
            </div>
            <div className="services__list" data-reveal-group>
              {SERVICES.map((s, i) => (
                <article className={`service${s.tone ? ` service--${s.tone}` : ''}${s.tone === 'ocean' ? ' fluid-host' : ''}`} key={s.title}>
                  {s.tone === 'ocean' && <Fluid seed={4.2} />}
                  <div className="service__top">
                    <span className="label">{s.tags}</span>
                    <span className="label">{pad2(i + 1)}.</span>
                  </div>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <dl className="stats" data-reveal-group>
              {STATS.map((s) => (
                <div key={s.label}><dt className="label">{s.label}</dt><dd data-count>{s.value}</dd></div>
              ))}
            </dl>
          </div>

          <div className="tools">
            <div className="tools__head" data-reveal data-line>
              <span className="label label--ink">Ferramentas &amp; conhecimentos</span>
            </div>
            <dl className="tools__list" data-reveal-group>
              <div><dt className="label">Design</dt><dd>Photoshop, Illustrator, Figma</dd></div>
              <div><dt className="label">Código</dt><dd>HTML, CSS, JavaScript</dd></div>
              <div><dt className="label">Plataformas</dt><dd>WordPress, Wix</dd></div>
            </dl>
          </div>
        </section>

        {/* ======================= 02 EXPERIÊNCIA ======================= */}
        <section className="section container" id="experiencia">
          <div className="section-head" data-reveal data-line>
            <span className="label label--ink chip" style={{ '--chip': 'var(--accent)' }}><i />02 / Experiência</span>
            <span className="label">2021 — hoje</span>
          </div>

          <div className="grid exp">
            <div className="exp__sticky">
              <div className="exp__year display" aria-live="polite"><span id="exp-year">{EXPERIENCE[0].year}</span></div>
              <div className="exp__year-sub">
                <span className="exp__progress"><i id="exp-progress" /></span>
                <span className="label" id="exp-step">01 / {pad2(EXPERIENCE.length)}</span>
              </div>
            </div>

            <ol className="exp__list" id="exp-list">
              <span className="exp__line" aria-hidden="true"><i id="exp-line" /></span>
              {EXPERIENCE.map((e) => (
                <li className="exp__item" data-year={e.year} key={e.year}>
                  <span className="label">{e.year}</span>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Faixa com as frentes de trabalho: anda sozinha e acelera com o scroll */}
        <div className="marquee" aria-hidden="true" data-dark>
          <div className="marquee__track">
            {[0, 1].map((k) => (
              <span className="marquee__group" key={k}>
                {MARQUEE.map((w) => <span key={w}>{w}<i>✦</i></span>)}
              </span>
            ))}
          </div>
        </div>

        {/* ======================= 03 PROJETOS ======================= */}
        <section className="section container" id="projetos">
          <div className="section-head" data-reveal data-line>
            <span className="label label--ink chip" style={{ '--chip': 'var(--ocean)' }}><i />03 / Selected work</span>
            <span className="label"><span id="work-count">{pad2(PROJECTS.length)}</span> projetos</span>
          </div>
          <h2 className="h2 work__heading">
            <span className="l" data-lines><span>Projetos</span></span>
            <span className="l" data-lines><span><span className="serif">selecionados.</span></span></span>
          </h2>

          <div className="grid work" id="work-grid">
            {grid.map(({ p, col, offset, sizes }, i) => {
              const n = pad2(i + 1);
              return (
                <a
                  key={p.slug}
                  className={`work__item${offset ? ' work__item--offset' : ''}`}
                  style={{ '--col': col, '--c': p.color }}
                  href={`/projeto/${p.slug}`}
                  data-transition={p.title}
                  data-cursor="View<br>project"
                  data-cursor-color={p.color}
                  aria-label={`${p.title} — ${p.category}`}
                >
                  <div className="work__fig"><Plate img={p.cover} index={n} sizes={sizes} /></div>
                  <div className="work__meta">
                    <span className="label">{n}</span>
                    <div>
                      <h3 className="work__title">{p.title} {p.subtitle ? <span className="serif">{p.subtitle}</span> : null}</h3>
                      <p className="label work__cat chip" style={{ '--chip': p.color }}><i />{p.category}</p>
                    </div>
                    <span className="label">{p.year}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ======================= 04 CONTATO ======================= */}
        <section className="section contact fluid-host" id="contato" data-dark>
          <Fluid seed={1.3} />
          <div className="container">
            <div className="section-head" data-reveal data-line>
              <span className="label label--ink chip" style={{ '--chip': 'var(--lime)' }}><i />04 / Contato</span>
            </div>

            <h2 className="display contact__title">
              <span className="l" data-lines><span>Vamos criar</span></span>
              <span className="l" data-lines><span>algo <span className="serif">incrível.</span></span></span>
            </h2>

            <div className="grid contact__grid">
              <div className="contact__info">
                <p className="lead" data-reveal>Estou aberto a novas oportunidades, projetos e colaborações criativas. Se você tem uma ideia, projeto ou oportunidade em mente, entre em contato.</p>
                <div className="contact__links" data-reveal-group>
                  <div><span className="label">E-mail</span><br /><a className="contact__big" href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
                  <div><span className="label">Telefone</span><br /><a className="contact__big" href={SITE.phoneHref}>{SITE.phone}</a></div>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer top="#top" />
    </div>
  );
}
