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

/* ---------- Transição para o bloco escuro de contato ---------- */
// A seção sobe um pouco mais rápido que o scroll ao entrar (parallax leve),
// em vez de simplesmente "aparecer" colada ao fim dos projetos.
export const contactEnter = (scope) => {
  const contact = scope.querySelector('.contact');
  if (!contact || reduced) return;
  gsap.fromTo(contact, { y: 72 }, {
    y: 0, ease: 'none',
    scrollTrigger: { trigger: contact, start: 'top bottom', end: 'top 55%', scrub: true },
  });
};
