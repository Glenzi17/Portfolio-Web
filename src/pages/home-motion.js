/* =========================================================
   HOME — animações: hero cinematográfico, reveal dos
   projetos, timeline de experiência, nav ativa, contato.
   Rodam dentro do gsap.context da página (usePageMotion).
   ========================================================= */
import { gsap, ScrollTrigger, reduced } from '../lib/motion.js';

/* ---------- Hero: entrada cinematográfica ---------- */
export const heroIntro = (scope) => {
  const meta = scope.querySelectorAll('[data-hero="meta"]');
  const nameChars = scope.querySelectorAll('[data-hero-line] .c');
  const titleLines = scope.querySelectorAll('[data-hero-title] > span');
  const desc = scope.querySelector('[data-hero="desc"]');
  const tags = scope.querySelectorAll('[data-hero="tag"]');
  const scroll = scope.querySelector('[data-hero="scroll"]');
  const bottom = scope.querySelector('.hero__bottom');
  const hero = scope.querySelector('.hero');

  if (reduced) {
    gsap.set([meta, desc, tags, scroll], { opacity: 1 });
    gsap.set([nameChars, titleLines], { yPercent: 0, y: 0 });
    if (bottom) bottom.classList.add('is-in');
    return;
  }

  // Na primeira visita o preloader ainda está saindo: espera ele liberar o hero
  const delay = document.querySelector('.preloader') ? 0.4 : 0;
  gsap.timeline({ delay, defaults: { ease: 'expo.out' } })
    .fromTo(meta, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.2)
    // letra a letra, com um leve giro que assenta
    .fromTo(nameChars, { yPercent: 115, rotate: 8, y: 0 }, { yPercent: 0, rotate: 0, y: 0, duration: 1.2, stagger: 0.035 }, 0.3)
    .fromTo(titleLines, { yPercent: 125, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.09 }, 0.75)
    .fromTo(desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, 0.9)
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
// Só transform (escala a partir do topo): o clip-path animado repintava a
// seção inteira — e o shader atrás dela — a cada quadro de rolagem.
export const contactEnter = (scope) => {
  const contact = scope.querySelector('.contact');
  if (!contact || reduced) return;
  // Entra como um cartão de cantos bem arredondados nos quatro lados; ao
  // chegar à largura total os cantos de baixo fecham para emendar no rodapé.
  const end = getComputedStyle(contact).borderRadius || '24px 24px 0px 0px';
  gsap.fromTo(contact, { scale: 0.9, borderRadius: '56px' }, {
    scale: 1, borderRadius: end, ease: 'none', clearProps: 'transform,borderRadius',
    scrollTrigger: { trigger: contact, start: 'top bottom', end: 'top 20%', scrub: true },
  });
};

/* ---------- "O que eu faço": painéis entram em leque e flutuam no scroll ---------- */
export const servicesMotion = (scope) => {
  const cards = [...scope.querySelectorAll('.service')];
  if (!cards.length) return;
  if (reduced) { gsap.set(cards, { opacity: 1 }); return; }
  const list = cards[0].parentElement;
  gsap.timeline({ scrollTrigger: { trigger: list, start: 'top 85%', once: true } })
    .fromTo(cards, { y: 90, opacity: 0, rotate: (i) => (i - 1) * 3, scale: 0.94 },
      { y: 0, opacity: 1, rotate: 0, scale: 1, duration: 1.2, stagger: 0.12, clearProps: 'transform' })
    .fromTo(cards.map((c) => c.querySelector('.service__title')), { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.35)
    .fromTo(cards.map((c) => c.querySelector('p')), { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.5);
  // Profundidade: cada painel rola num ritmo levemente diferente (só desktop)
  if (!window.matchMedia('(min-width: 861px)').matches) return;
  cards.forEach((c, i) => {
    gsap.fromTo(c, { y: 0 }, {
      y: [-10, -34, -18][i % 3], ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom top', scrub: true },
    });
  });
};

/* ---------- Gráficos dos números (StatCharts.jsx) ---------- */
export const statCharts = (scope) => {
  if (reduced) return;
  const once = (el) => ({ trigger: el, start: 'top 88%', once: true });
  const units = scope.querySelector('[data-chart="units"]');
  if (units) {
    gsap.fromTo(units.querySelectorAll('.unit'), { scale: 0, rotate: -45 },
      { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.07, clearProps: 'transform', scrollTrigger: once(units) });
  }
  const years = scope.querySelector('[data-chart="years"]');
  if (years) {
    gsap.timeline({ scrollTrigger: once(years) })
      .fromTo(years.querySelector('.years__fill'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
      .fromTo(years.querySelectorAll('.years__pt'), { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.22, clearProps: 'transform' }, 0.05);
  }
  const ring = scope.querySelector('[data-chart="ring"]');
  if (ring) {
    const segs = [...ring.querySelectorAll('.ring__seg')];
    const tl = gsap.timeline({ scrollTrigger: once(ring) })
      .fromTo(ring.querySelector('svg'), { rotate: -120 }, { rotate: 0, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0)
      .fromTo(ring.querySelectorAll('.ring__legend li'), { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, clearProps: 'transform' }, 0.4);
    segs.forEach((seg, i) => {
      const [len, rest] = seg.getAttribute('stroke-dasharray').split(' ');
      tl.fromTo(seg, { attr: { 'stroke-dasharray': `0 ${rest}` } }, { attr: { 'stroke-dasharray': `${len} ${rest}` }, duration: 0.8, ease: 'power3.out' }, 0.15 + i * 0.18);
    });
  }
  const bars = scope.querySelector('[data-chart="bars"]');
  if (bars) {
    const fills = [...bars.querySelectorAll('.bars__track i')];
    gsap.fromTo(fills, { scaleX: 0 }, {
      scaleX: (i, el) => parseFloat(el.style.getPropertyValue('--w')) || 0,
      duration: 1.3, ease: 'expo.out', stagger: 0.14, clearProps: 'transform', scrollTrigger: once(bars),
    });
  }
};

/* ---------- Legendas que "decodificam" ao entrar ([data-scramble]) ---------- */
const GLYPHS = '#/_<>+*0123456789ABCDEF';
export const scramble = (scope) => {
  if (reduced) return;
  scope.querySelectorAll('[data-scramble]').forEach((el) => {
    // só o último nó de texto (o quadradinho <i> do chip fica intacto)
    const node = [...el.childNodes].reverse().find((c) => c.nodeType === 3 && c.textContent.trim());
    if (!node) return;
    const final = node.textContent;
    const st = { p: 0 };
    gsap.to(st, {
      p: 1, duration: 0.9, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        const k = Math.floor(st.p * final.length);
        node.textContent = final.slice(0, k) + [...final.slice(k)].map((ch) => (ch === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
      },
      onComplete: () => { node.textContent = final; },
    });
  });
};

/* ---------- Retrato: parallax dentro da moldura ---------- */
export const portrait = (scope) => {
  const photo = scope.querySelector('.about__photo');
  if (!photo || reduced) return;
  gsap.fromTo(photo, { yPercent: -5 }, {
    yPercent: 5, ease: 'none',
    scrollTrigger: { trigger: photo.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
  });
  // Selo: repete a abertura do site — o quadrado entra, o contorno azul se
  // desenha e as letras sobem pela máscara.
  const badge = scope.querySelector('.badge');
  if (badge) {
    gsap.timeline({ scrollTrigger: { trigger: badge, start: 'top 88%', once: true } })
      .fromTo(badge, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' })
      .to(badge.querySelector('.badge__ring rect'), { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.1)
      .fromTo(badge.querySelectorAll('.badge__glyph > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, 0.3);
  }
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

/* ---------- Citação: reveal em caixa palavra a palavra (estilo skiper70) ---------- */
// Cada palavra ganha uma caixa azul: ela cresce da esquerda cobrindo a palavra,
// a palavra acende por baixo e a caixa se recolhe para a direita. No desktop a
// seção fica fixa (pin) enquanto a rolagem conduz a frase; no celular, sem pin.
const splitBoxes = (p) => {
  const out = [];
  const wrap = (word, italic) => {
    const w = document.createElement('span'); w.className = 'bw';
    const t = document.createElement(italic ? 'em' : 'span'); t.className = 'bw__t'; t.textContent = word;
    const b = document.createElement('i'); b.className = 'bw__box'; b.setAttribute('aria-hidden', 'true');
    w.append(t, b); out.push(w); return w;
  };
  const frag = document.createDocumentFragment();
  [...p.childNodes].forEach((node) => {
    const italic = node.nodeType === 1 && node.tagName === 'EM';
    const words = node.textContent.split(/\s+/).filter(Boolean);
    words.forEach((word, i) => { frag.append(wrap(word, italic)); frag.append(' '); });
  });
  p.setAttribute('aria-label', p.textContent.trim());
  p.textContent = '';
  p.append(frag);
  return out;
};

export const quoteMotion = (scope) => {
  const sec = scope.querySelector('.quote');
  const p = sec && sec.querySelector('[data-boxreveal]');
  if (!p || reduced) return;
  const words = splitBoxes(p);
  const mark = sec.querySelector('.quote__mark');
  const by = sec.querySelectorAll('.quote__by .label, .quote__eyebrow');
  const desktop = window.matchMedia('(min-width: 861px)').matches;
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    scrollTrigger: desktop
      ? { trigger: sec, start: 'top top', end: '+=110%', pin: true, scrub: 0.6, anticipatePin: 1 }
      : { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
  });
  tl.fromTo(mark, { yPercent: 30, rotate: -14, scale: 0.8 }, { yPercent: 0, rotate: 0, scale: 1, duration: words.length * 0.35 + 0.6, ease: 'none' }, 0);
  tl.fromTo(by[0], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0);
  words.forEach((w, i) => {
    const t = w.querySelector('.bw__t'); const b = w.querySelector('.bw__box');
    const at = 0.15 + i * 0.35;
    tl.set(b, { transformOrigin: 'left center' }, at)
      .to(b, { scaleX: 1, duration: 0.3 }, at)
      .set(t, { opacity: 1 }, at + 0.3)
      .set(b, { transformOrigin: 'right center' }, at + 0.3)
      .to(b, { scaleX: 0, duration: 0.3 }, at + 0.3);
  });
  tl.fromTo([...by].slice(1), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, '-=0.1');
};
