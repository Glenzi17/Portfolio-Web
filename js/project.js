/* =========================================================
   PROJETO — template reutilizável (projeto.html?p=slug)
   Lê window.PROJECTS, renderiza cabeçalho, hero, seções
   (contexto → conceito → desenvolvimento → resultado) e
   o "next project". Toda imagem vai numa "prancha" (.plate)
   e aparece inteira, sem cortes.
   ========================================================= */
(function () {
  'use strict';
  const App = window.App;
  const PROJECTS = window.PROJECTS || [];
  const esc = App.escape;

  const slug = new URLSearchParams(location.search).get('p');
  let idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx < 0) idx = 0;
  const p = PROJECTS[idx];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const n = String(idx + 1).padStart(2, '0');
  const nn = String(((idx + 1) % PROJECTS.length) + 1).padStart(2, '0');
  const total = String(PROJECTS.length).padStart(2, '0');

  document.title = `${p.title}${p.subtitle ? ' — ' + p.subtitle : ''} · Guilherme Lenzi`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && p.summary) metaDesc.setAttribute('content', p.summary);

  /* ---------- Figura em prancha ---------- */
  // --r (largura/altura) na figure permite ao CSS limitar a altura de peças
  // verticais sem perder a proporção.
  const caption = (t) => (t ? `<figcaption class="caption small" data-reveal>${esc(t)}</figcaption>` : '');
  const figure = (img = {}, opts = {}) => `
    <figure class="img-reveal" style="--r:${App.ratioOf(img, opts).toFixed(4)}">
      ${App.plate(img, n, opts)}
      ${caption(img.caption)}
    </figure>`;

  /* ---------- Blocos de layout ---------- */
  const block = (b) => {
    switch (b.type) {
      case 'full':
      case 'wide':
        return `<div class="blk blk--${b.type}">${figure(b.image, { ratio: b.ratio })}</div>`;
      case 'split':
      case 'overlap':
        return `<div class="blk blk--${b.type}">${(b.images || []).map((im) => figure(im, { ratio: b.ratio })).join('')}</div>`;
      case 'detail':
        return `<div class="blk blk--detail">
          <figure class="img-reveal blk--detail" style="--zoom:${b.zoom || 1.5}; --focus:${b.focus || '50% 50%'}">
            ${App.plate(b.image, n, { ratio: b.ratio || '16/9' })}
            ${caption(b.image && b.image.caption)}
          </figure>
        </div>`;
      case 'video': {
        const r = App.ratioOf({ src: b.src, ratio: b.ratio }).toFixed(4);
        return `<div class="blk blk--video">
          <figure class="img-reveal" style="--r:${r}">
            <div class="plate plate--fixed plate--dark player is-paused" data-player style="--ratio:${r}">
              <video src="${b.src}" ${b.poster ? `poster="${b.poster}"` : ''} muted loop playsinline preload="metadata" data-cursor="Play" aria-label="${esc(b.caption || 'Vídeo do projeto')}"></video>
              <button class="player__big" type="button" aria-label="Reproduzir">Play</button>
              <div class="player__bar">
                <button class="player__btn" type="button" data-act="play" aria-label="Reproduzir">Play</button>
                <div class="player__track" role="slider" tabindex="0" aria-label="Progresso do vídeo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="player__fill"></i></div>
                <span class="player__time label">00:00 / 00:00</span>
                <button class="player__btn" type="button" data-act="mute" aria-label="Ativar som">Som off</button>
                <button class="player__btn" type="button" data-act="fs" aria-label="Tela cheia">Tela cheia</button>
              </div>
            </div>
            ${caption(b.caption)}
          </figure>
        </div>`;
      }
      case 'note':
        return `<div class="blk blk--note" data-reveal><div><span class="label">${esc(b.label || 'Nota')}</span><p>${esc(b.text || '')}</p></div></div>`;
      default:
        return '';
    }
  };

  /* ---------- Render ---------- */
  const main = document.getElementById('main');
  const meta = [
    ['Categoria', p.category],
    ['Ano', p.year],
    ['Cliente', p.client],
    ['Serviços', (p.tags || []).join(' · ')],
  ].filter(([, v]) => v);

  main.innerHTML = `
    <div class="grid project__head">
      <div class="project__index" data-reveal="down">
        <span class="label label--ink">Project ${n} / ${total}</span>
        <a class="label link-arrow" href="index.html#projetos" data-transition="Projetos"><span class="link-arrow__i">←</span> Todos os projetos</a>
      </div>
      <div class="project__title">
        <h1 class="display h1">
          <span class="l"><span>${esc(p.title)}</span></span>
          ${p.subtitle ? `<span class="l"><span><span class="serif">${esc(p.subtitle)}</span></span></span>` : ''}
        </h1>
      </div>
      <p class="project__summary lead" data-reveal>${esc(p.summary || '')}</p>
      <dl class="project__meta" data-reveal-group data-line="top">
        ${meta.map(([k, v]) => `<div><dt class="label">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
    </div>

    <figure class="project__hero" id="project-hero" style="--r:${App.ratioOf(p.cover).toFixed(4)}">${App.plate(p.cover, n, { cls: 'plate--hero' })}</figure>

    <div class="project__sections">
      ${(p.sections || []).map((s, si) => `
        <section class="psec" aria-labelledby="psec-${si}">
          <div class="grid psec__head">
            <div class="psec__num" data-reveal><span class="label label--ink">0${si + 1}</span></div>
            <div class="psec__title"><h2 id="psec-${si}"><span class="l" data-lines><span>${esc(s.title)}</span></span></h2></div>
            <p class="psec__text body body--mute" data-reveal>${esc(s.text || '')}</p>
          </div>
          <div class="psec__blocks">${(s.blocks || []).map(block).join('')}</div>
        </section>`).join('')}
    </div>`;

  /* ---------- Next project ---------- */
  document.getElementById('project-next').setAttribute('data-line', 'top');
  document.getElementById('project-next').innerHTML = `
    <a class="next" href="projeto.html?p=${next.slug}" data-transition="${esc(next.title)}" data-cursor="Next<br>project">
      <div class="next__label" data-reveal><span class="label label--ink">Next project</span><span class="label">${nn} / ${total}</span></div>
      <div class="next__title">
        <h2 class="display"><span class="l" data-lines><span>${esc(next.title)}</span></span>${next.subtitle ? `<span class="l" data-lines><span><span class="serif">${esc(next.subtitle)}</span></span></span>` : ''}</h2>
        <p class="label next__cat" data-reveal>${esc(next.category)} <span class="next__arrow">→</span></p>
      </div>
      <figure class="next__fig img-reveal">${App.plate(next.cover, nn)}</figure>
    </a>`;

  /* ---------- Intro ---------- */
  const intro = () => {
    const hero = document.getElementById('project-hero');
    const media = hero.querySelector('.plate > img');
    const head = main.querySelectorAll('.project__title .l > span');

    if (App.reduced) { gsap.set(head, { yPercent: 0, y: 0 }); return; }

    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(head, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.1 }, 0.1)
      .fromTo(hero, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.out' }, 0.5);
    if (media) gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.9, ease: 'power3.out', delay: 0.5, clearProps: 'transform' });

    // Parallax sutil da prancha hero
    gsap.fromTo(hero, { y: 32 }, {
      y: -32, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  };

  App.enter(() => {
    App.initReveals();
    App.initPlayers();
    intro();
    ScrollTrigger.refresh();
  });
})();
