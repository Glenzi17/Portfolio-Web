/* =========================================================
   REVEALS — animações de entrada compartilhadas (home + projeto)
   Todas as funções devem rodar dentro de um gsap.context()
   (ver usePageMotion), que limpa tweens e ScrollTriggers
   quando a página desmonta.
   ========================================================= */
import { gsap, ScrollTrigger, reduced, touch } from './motion.js';

export const initReveals = (scope) => {
  if (reduced) return;
  // Elementos colados ao fim da página (footer) nunca chegam a 90% do
  // viewport — para eles o gatilho é simplesmente "entrou na tela".
  const startFor = (el, pct) => (el.closest('.footer') ? 'top bottom' : `top ${pct}%`);

  // Linhas em máscara (títulos)
  const lineGroups = new Map();
  scope.querySelectorAll('[data-lines]').forEach((line) => {
    const parent = line.parentElement;
    if (!lineGroups.has(parent)) lineGroups.set(parent, []);
    lineGroups.get(parent).push(line.querySelector('span'));
  });
  lineGroups.forEach((spans, parent) => {
    // y: 0 zera o translateY(125%) do CSS, que o GSAP lê como px
    gsap.fromTo(spans, { yPercent: 125, y: 0 }, {
      yPercent: 0, y: 0, duration: 1.2, stagger: 0.09,
      scrollTrigger: { trigger: parent, start: 'top 88%', once: true },
    });
  });

  // Fade up + blur → sharp (sem blur no toque: filtro animado pesa na GPU do celular)
  scope.querySelectorAll('[data-reveal]').forEach((el) => {
    const dir = el.dataset.reveal || 'up';
    const from = { opacity: 0, y: dir === 'up' ? 28 : dir === 'down' ? -20 : 0 };
    const to = { opacity: 1, y: 0, duration: 1.1, scrollTrigger: { trigger: el, start: startFor(el, 90), once: true } };
    if (!touch) { from.filter = 'blur(6px)'; to.filter = 'blur(0px)'; to.clearProps = 'filter'; }
    gsap.fromTo(el, from, to);
  });

  // Grupo com stagger
  scope.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const items = [...group.children];
    gsap.fromTo(items, { opacity: 0, y: 22 }, {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.07,
      scrollTrigger: { trigger: group, start: startFor(group, 88), once: true },
    });
  });

  // Parallax sutil
  scope.querySelectorAll('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 0.1;
    gsap.fromTo(el, { yPercent: -amt * 100 }, {
      yPercent: amt * 100, ease: 'none',
      scrollTrigger: { trigger: el.closest('section, figure, .work__item') || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Reveal de imagens (clip + escala). No fim, limpa o transform inline para
  // o hover (CSS) voltar a valer.
  scope.querySelectorAll('.img-reveal').forEach((fig) => {
    const media = fig.querySelector('.plate > img, .plate > video');
    const isDetail = fig.classList.contains('blk--detail');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: fig, start: 'top 85%', once: true },
      onComplete: () => { fig.classList.add('is-revealed'); gsap.set([fig, media].filter(Boolean), { clearProps: 'clipPath,transform' }); },
    });
    tl.to(fig, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out' });
    if (media && !isDetail) tl.to(media, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
    if (media && isDetail) tl.to(media, { scale: parseFloat(fig.style.getPropertyValue('--zoom')) || 1.5, duration: 1.6, ease: 'power3.out' }, 0);
  });

  // Linhas que se desenham ([data-line]) — as do hero são disparadas pela intro
  scope.querySelectorAll('[data-line]').forEach((el) => {
    if (el.closest('.hero')) return;
    ScrollTrigger.create({ trigger: el, start: startFor(el, 92), once: true, onEnter: () => el.classList.add('is-in') });
  });
};

// Navbar inverte sobre seções escuras ([data-dark])
export const initDarkNav = (scope) => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const darkActive = new Set();
  scope.querySelectorAll('[data-dark]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 40px', end: 'bottom 40px',
      onToggle: (self) => {
        if (self.isActive) darkActive.add(sec); else darkActive.delete(sec);
        nav.classList.toggle('is-dark', darkActive.size > 0);
      },
    });
  });
};

// Botões magnéticos ([data-magnetic]) — retorna função de limpeza
export const magnetize = (scope) => {
  if (touch || reduced) return () => {};
  const offs = [];
  const ctx = gsap.context(() => {
    scope.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      offs.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); });
    });
  }, scope);
  return () => { offs.forEach((off) => off()); ctx.revert(); };
};
