/* =========================================================
   HOME — hero cinematográfico · grid de projetos ·
   timeline de experiência · nav ativa
   ========================================================= */
(function () {
  'use strict';
  const App = window.App;
  const PROJECTS = window.PROJECTS || [];

  /* ---------- Grid de projetos (a partir de PROJECTS) ----------
     Cada capa mantém a própria proporção; a largura do card vem da orientação
     (retrato 5 col · quadrado 6 · paisagem 7 · panorâmica linha inteira).
     Os cards andam em pares; em cada par um deles desce um pouco (offset). */
  const SPAN = { pano: 12, land: 7, square: 6, port: 5 };
  const orient = (r) => (r >= 2.2 ? 'pano' : r >= 1.25 ? 'land' : r > 0.9 ? 'square' : 'port');
  const layout = () => {
    const items = PROJECTS.map((p) => { const r = App.ratioOf(p.cover); return { p, r, o: orient(r) }; });
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
        return;
      }
      const [a, b] = row; let sa = SPAN[a.o], sb = SPAN[b.o];
      while (sa + sb > 11) { if (sa >= sb) sa--; else sb--; } // garante ao menos 1 coluna de respiro
      a.col = `1 / ${1 + sa}`; b.col = `${13 - sb} / 13`;
      (ri % 2 ? a : b).offset = true;
    });
    return items;
  };

  const grid = document.getElementById('work-grid');
  if (grid) {
    grid.innerHTML = layout().map(({ p, col, offset }, i) => {
      const n = String(i + 1).padStart(2, '0');
      return `
      <a class="work__item${offset ? ' work__item--offset' : ''}" style="--col:${col}" href="projeto.html?p=${p.slug}" data-transition="${App.escape(p.title)}" data-cursor="View<br>project" aria-label="${App.escape(p.title)} — ${App.escape(p.category)}">
        <div class="work__fig">${App.plate(p.cover, n)}</div>
        <div class="work__meta">
          <span class="label">${n}</span>
          <div>
            <h3 class="work__title">${App.escape(p.title)} ${p.subtitle ? `<span class="serif">${App.escape(p.subtitle)}</span>` : ''}</h3>
            <p class="label work__cat">${App.escape(p.category)}</p>
          </div>
          <span class="label">${p.year}</span>
        </div>
      </a>`;
    }).join('');
    const count = document.getElementById('work-count');
    if (count) count.textContent = String(PROJECTS.length).padStart(2, '0');
  }

  /* ---------- Foto do "Sobre" (opcional) ---------- */
  const frame = document.getElementById('about-frame');
  if (frame && window.SITE && window.SITE.portrait) {
    frame.innerHTML = `<img src="${window.SITE.portrait}" alt="Retrato de Guilherme Lenzi" loading="lazy" decoding="async">`;
  }

  /* ---------- Reveal dos projetos ---------- */
  const revealWork = () => {
    if (App.reduced) return;
    document.querySelectorAll('.work__item').forEach((item) => {
      const fig = item.querySelector('.work__fig');
      const media = fig.querySelector('.plate > img, .ph');
      const meta = item.querySelector('.work__meta');
      gsap.timeline({
        scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        onComplete: () => item.classList.add('is-revealed'), // libera o hover (CSS)
      })
        .fromTo(fig, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out' })
        .fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power3.out', clearProps: 'transform' }, 0)
        .fromTo(meta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.35);

      // Parallax sutil na prancha inteira
      gsap.fromTo(fig, { y: 24 }, {
        y: -24, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  };

  /* ---------- Timeline de experiência ---------- */
  const initTimeline = () => {
    const items = [...document.querySelectorAll('.exp__item')];
    const yearEl = document.getElementById('exp-year');
    const stepEl = document.getElementById('exp-step');
    const line = document.getElementById('exp-line');
    const progress = document.getElementById('exp-progress');
    const list = document.getElementById('exp-list');
    if (!items.length) return;

    let current = -1;
    const setActive = (i) => {
      if (i === current || i < 0 || i >= items.length) return;
      const dir = i > current ? 1 : -1;
      current = i;
      items.forEach((it, k) => it.classList.toggle('is-active', k === i));
      stepEl.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      const year = items[i].dataset.year;
      if (App.reduced) { yearEl.textContent = year; return; }
      // Troca do ano: o número antigo sai, o novo entra (máscara)
      const next = yearEl.cloneNode(true);
      next.textContent = year;
      next.removeAttribute('id');
      yearEl.parentElement.appendChild(next);
      gsap.fromTo(next, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.8 });
      gsap.to(yearEl, { yPercent: -100 * dir, duration: 0.8, onComplete: () => { yearEl.textContent = year; gsap.set(yearEl, { yPercent: 0 }); next.remove(); } });
    };

    items.forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item, start: 'top 55%', end: 'bottom 55%',
        onEnter: () => setActive(i), onEnterBack: () => setActive(i),
      });
      if (!App.reduced) {
        gsap.fromTo([...item.children], { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.08,
          scrollTrigger: { trigger: item, start: 'top 80%', once: true },
        });
      }
    });
    setActive(0);

    if (!App.reduced) {
      gsap.to([line, progress], {
        scaleY: 1, scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 55%', end: 'bottom 55%', scrub: 0.4 },
      });
    } else { gsap.set([line, progress], { scaleX: 1, scaleY: 1 }); }
  };

  /* ---------- Nav ativa ---------- */
  const initActiveNav = () => {
    const links = [...document.querySelectorAll('.nav__link[data-nav]')];
    links.forEach((link) => {
      const sec = document.getElementById(link.dataset.nav);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 50%', end: 'bottom 50%',
        onToggle: (self) => link.classList.toggle('is-active', self.isActive),
      });
    });
  };

  /* ---------- Hero: entrada cinematográfica ---------- */
  const heroIntro = () => {
    const meta = document.querySelectorAll('[data-hero="meta"]');
    const nameLines = document.querySelectorAll('[data-hero-line] > span');
    const titleLines = document.querySelectorAll('[data-hero-title] > span');
    const desc = document.querySelector('[data-hero="desc"]');
    const tags = document.querySelectorAll('[data-hero="tag"]');
    const scroll = document.querySelector('[data-hero="scroll"]');

    const bottom = document.querySelector('.hero__bottom');

    if (App.reduced) {
      gsap.set([meta, desc, tags, scroll], { opacity: 1 });
      gsap.set([nameLines, titleLines], { yPercent: 0, y: 0 });
      bottom && bottom.classList.add('is-in');
      return;
    }

    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(meta, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.2)
      .fromTo(nameLines, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.1 }, 0.35)
      .fromTo(titleLines, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.09 }, 0.7)
      .fromTo(desc, { opacity: 0, y: 18, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, clearProps: 'filter' }, 0.9)
      .add(() => bottom && bottom.classList.add('is-in'), 0.95) // linha do rodapé do hero se desenha
      .fromTo(tags, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05 }, 1.05)
      .fromTo(scroll, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, 1.3);

    // Parallax sutil do hero ao rolar; a barra de baixo some junto
    gsap.to('.hero__center', {
      yPercent: 8, opacity: 0.6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(bottom, {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true },
    });
  };

  /* ---------- Transição para o bloco escuro de contato ---------- */
  // A seção sobe um pouco mais rápido que o scroll ao entrar (parallax leve),
  // em vez de simplesmente "aparecer" colada ao fim dos projetos.
  const contactEnter = () => {
    const contact = document.querySelector('.contact');
    if (!contact || App.reduced) return;
    gsap.fromTo(contact, { y: 72 }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: contact, start: 'top bottom', end: 'top 55%', scrub: true },
    });
  };

  /* ---------- Boot ---------- */
  App.enter(() => {
    heroIntro();
    App.initReveals();
    revealWork();
    initTimeline();
    initActiveNav();
    contactEnter();
    ScrollTrigger.refresh();
  });
})();
