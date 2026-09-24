/* =========================================================
   HOME — animações: hero cinematográfico, reveal dos
   projetos, timeline de experiência, nav ativa, contato.
   Rodam dentro do gsap.context da página (usePageMotion).
   ========================================================= */
import { gsap, ScrollTrigger, reduced, touch } from '../lib/motion.js';

/* ---------- Hero: entrada cinematográfica ---------- */
export const heroIntro = (scope) => {
  const meta = scope.querySelectorAll('[data-hero="meta"]');
  const nameLines = scope.querySelectorAll('[data-hero-line] > span');
  const titleLines = scope.querySelectorAll('[data-hero-title] > span');
  const desc = scope.querySelector('[data-hero="desc"]');
  const tags = scope.querySelectorAll('[data-hero="tag"]');
  const scroll = scope.querySelector('[data-hero="scroll"]');
  const bottom = scope.querySelector('.hero__bottom');
  const hero = scope.querySelector('.hero');

  if (reduced) {
    gsap.set([meta, desc, tags, scroll], { opacity: 1 });
    gsap.set([nameLines, titleLines], { yPercent: 0, y: 0 });
    if (bottom) bottom.classList.add('is-in');
    return;
  }

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .fromTo(meta, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.2)
    .fromTo(nameLines, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, stagger: 0.1 }, 0.35)
    .fromTo(titleLines, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.09 }, 0.7)
    .fromTo(desc,
      touch ? { opacity: 0, y: 18 } : { opacity: 0, y: 18, filter: 'blur(6px)' },
      touch ? { opacity: 1, y: 0, duration: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, clearProps: 'filter' }, 0.9)
    .add(() => bottom && bottom.classList.add('is-in'), 0.95) // linha do rodapé do hero se desenha
    .fromTo(tags, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05 }, 1.05)
    .fromTo(scroll, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, 1.3);

  // Parallax sutil do hero ao rolar; a barra de baixo some junto
  gsap.to(scope.querySelector('.hero__center'), {
    yPercent: 8, opacity: 0.6, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(bottom, {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: true },
  });
};

/* ---------- Reveal dos projetos ---------- */
export const revealWork = (scope) => {
  if (reduced) return;
  scope.querySelectorAll('.work__item').forEach((item) => {
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
export const initTimeline = (scope) => {
  const items = [...scope.querySelectorAll('.exp__item')];
  const yearEl = scope.querySelector('#exp-year');
  const stepEl = scope.querySelector('#exp-step');
  const line = scope.querySelector('#exp-line');
  const progress = scope.querySelector('#exp-progress');
  const list = scope.querySelector('#exp-list');
  if (!items.length) return;

  let current = -1;
  const setActive = (i) => {
    if (i === current || i < 0 || i >= items.length) return;
    const dir = i > current ? 1 : -1;
    current = i;
    items.forEach((it, k) => it.classList.toggle('is-active', k === i));
    stepEl.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    const year = items[i].dataset.year;
    if (reduced) { yearEl.textContent = year; return; }
    // Troca do ano: o número antigo sai, o novo entra (máscara)
    yearEl.parentElement.querySelectorAll('span:not(#exp-year)').forEach((stale) => stale.remove());
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
    if (!reduced) {
      gsap.fromTo([...item.children], { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.08,
        scrollTrigger: { trigger: item, start: 'top 80%', once: true },
      });
    }
  });
  setActive(0);

  if (!reduced) {
    gsap.to([line, progress], {
      scaleY: 1, scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 55%', end: 'bottom 55%', scrub: 0.4 },
    });
  } else { gsap.set([line, progress], { scaleX: 1, scaleY: 1 }); }
};

/* ---------- Nav ativa ---------- */
export const initActiveNav = (scope) => {
  const links = [...document.querySelectorAll('.nav__link[data-nav]')];
  links.forEach((link) => {
    const sec = scope.querySelector(`#${link.dataset.nav}`);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
  });
};

/* ---------- Contato: a folha abre até a largura total ---------- */
// Entra como um cartão recuado das bordas e se expande enquanto sobe
// (os cantos de baixo ficam retos porque o rodapé continua a folha).
export const contactEnter = (scope) => {
  const contact = scope.querySelector('.contact');
  if (!contact || reduced) return;
  gsap.fromTo(contact,
    { clipPath: 'inset(0% 4% 0% 4% round 40px 40px 0px 0px)' },
    {
      clipPath: 'inset(0% 0% 0% 0% round 24px 24px 0px 0px)', ease: 'none',
      scrollTrigger: { trigger: contact, start: 'top bottom', end: 'top 25%', scrub: true },
    });
};

/* ---------- Texto que se preenche palavra a palavra ([data-words]) ---------- */
// O parágrafo começa apagado e cada palavra acende conforme a leitura avança.
export const wordFill = (scope) => {
  scope.querySelectorAll('[data-words]').forEach((p) => {
    if (reduced) return;
    const words = p.textContent.trim().split(/\s+/);
    p.setAttribute('aria-label', p.textContent.trim());
    p.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    gsap.fromTo(p.querySelectorAll('.w'), { opacity: 0.16 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 50%', scrub: true },
    });
  });
};

/* ---------- Números que contam ao entrar ([data-count]) ---------- */
// Mantém prefixo/sufixo e zeros à esquerda: "07", "5+", "360°".
export const countUp = (scope) => {
  if (reduced) return;
  scope.querySelectorAll('[data-count]').forEach((el) => {
    const m = el.textContent.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const n = { v: 0 };
    const render = () => { el.textContent = `${pre}${String(Math.round(n.v)).padStart(num.length, '0')}${post}`; };
    render();
    gsap.to(n, {
      v: Number(num), duration: 1.6, ease: 'power3.out', onUpdate: render,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
};

/* ---------- Faixa em loop que reage ao scroll (.marquee) ---------- */
// Anda sozinha; rolar a página acelera e inverte o sentido junto com o scroll.
export const marquee = (scope) => {
  const band = scope.querySelector('.marquee');
  if (!band || reduced) return;
  const loop = gsap.to(band.querySelector('.marquee__track'), { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
  loop.totalTime(loop.duration() * 200); // folga para tocar ao contrário sem parar no início
  let dir = 1;
  ScrollTrigger.create({
    trigger: band, start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      dir = self.direction;
      const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 250);
      gsap.timeline({ overwrite: true })
        .to(loop, { timeScale: dir * boost, duration: 0.2, ease: 'power1.out' })
        .to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' });
    },
  });
};
