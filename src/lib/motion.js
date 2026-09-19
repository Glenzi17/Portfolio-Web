/* =========================================================
   MOTION — GSAP + ScrollTrigger + Lenis (singletons)
   Equivalente ao topo do antigo main.js: preferências do
   usuário, easings padrão, smooth scroll e scrollTo.
   ========================================================= */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// A posição de scroll é controlada pelo app (topo ou #hash a cada rota).
// Precisa vir ANTES do registerPlugin: o ScrollTrigger memoriza o valor
// inicial e o reaplica a cada refresh().
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.clearScrollMemory('manual');
// A barra de endereço do celular aparece/some ao rolar e dispara "resize";
// sem isto, cada um deles recalcula todos os gatilhos no meio da rolagem.
ScrollTrigger.config({ ignoreMobileResize: true });

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
export const EASE = 'expo.out';
export const EASE_IO = 'power4.inOut';

gsap.defaults({ ease: EASE, duration: 1 });

/* ---------- Smooth scroll (Lenis) ---------- */
export let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export const scrollTo = (target, opts = {}) => {
  if (lenis) {
    lenis.scrollTo(target, { offset: -8, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el && el.nodeType) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  else window.scrollTo({ top: typeof target === 'number' ? target : 0, behavior: 'smooth' });
};

// Salto imediato (troca de rota): topo ou o elemento do #hash
export const jumpTo = (hash = '') => {
  let el = null;
  if (hash && hash.length > 1) { try { el = document.querySelector(hash); } catch { el = null; } }
  if (lenis) lenis.scrollTo(el || 0, { immediate: true, force: true, offset: el ? -8 : 0 });
  else window.scrollTo(0, el ? el.getBoundingClientRect().top + window.scrollY - 8 : 0);
};

// Fontes carregadas depois do primeiro layout deslocam os gatilhos
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

export { gsap, ScrollTrigger };
