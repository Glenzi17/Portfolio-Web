/* =========================================================
   SMOOTH CARET — o cursor de digitação que desliza (no espírito
   do skiper106). O cursor nativo fica transparente e um traço
   próprio vai até cada nova posição com uma mola curta (GSAP
   quickTo). A posição sai de um "espelho": um div invisível com
   o mesmo estilo do campo e o texto até o cursor — funciona em
   input e em textarea com várias linhas e quebra automática.
   Com movimento reduzido, fica o cursor nativo.
   ========================================================= */
import { gsap, reduced } from './motion.js';

// Propriedades que definem onde o texto cai dentro do campo
const COPY = [
  'boxSizing', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight',
  'textTransform', 'textIndent', 'wordSpacing', 'tabSize',
];

let mirror = null;
const coords = (el, pos) => {
  if (!mirror) {
    mirror = document.createElement('div');
    mirror.setAttribute('aria-hidden', 'true');
    Object.assign(mirror.style, { position: 'absolute', visibility: 'hidden', top: '0', left: '-9999px', overflow: 'hidden' });
    document.body.appendChild(mirror);
  }
  const cs = getComputedStyle(el);
  COPY.forEach((k) => { mirror.style[k] = cs[k]; });
  const area = el.tagName === 'TEXTAREA';
  mirror.style.whiteSpace = area ? 'pre-wrap' : 'pre';
  mirror.style.overflowWrap = area ? 'break-word' : 'normal';
  mirror.style.height = area ? 'auto' : cs.height;
  mirror.textContent = el.value.slice(0, pos);
  const mark = document.createElement('span');
  mark.textContent = el.value.slice(pos) || '.';
  mirror.appendChild(mark);
  const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.25;
  return {
    x: mark.offsetLeft - el.scrollLeft,
    y: mark.offsetTop - el.scrollTop + (lh - parseFloat(cs.fontSize) * 1.15) / 2,
    h: parseFloat(cs.fontSize) * 1.15,
  };
};

export function smoothCaret(form) {
  if (!form || reduced) return () => {};
  const offs = [];
  form.querySelectorAll('.field').forEach((field) => {
    const el = field.querySelector('input, textarea');
    if (!el) return;
    field.classList.add('has-caret');
    const caret = document.createElement('i');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    field.appendChild(caret);
    const xTo = gsap.quickTo(caret, 'x', { duration: 0.32, ease: 'back.out(1.6)' });
    const yTo = gsap.quickTo(caret, 'y', { duration: 0.32, ease: 'back.out(1.6)' });
    let shown = false;

    const place = () => {
      if (document.activeElement !== el) return;
      // e-mail e telefone não expõem a posição do cursor em alguns navegadores: assume o fim
      let a = null, b = null;
      try { a = el.selectionStart; b = el.selectionEnd; } catch { /* type=email */ }
      if (a == null) { a = b = el.value.length; }
      if (a !== b) { caret.classList.remove('is-on'); return; } // seleção: sem traço
      const c = coords(el, a);
      const x = el.offsetLeft + Math.min(c.x, el.clientWidth - 2);
      const y = el.offsetTop + c.y;
      gsap.set(caret, { height: c.h });
      if (!shown) { gsap.set(caret, { x, y }); xTo(x, x); yTo(y, y); shown = true; } else { xTo(x); yTo(y); }
      // reinicia o piscar a cada movimento (pisca só parado, como o nativo)
      caret.classList.remove('is-on'); void caret.offsetWidth; caret.classList.add('is-on');
    };
    const hide = () => { caret.classList.remove('is-on'); shown = false; };
    const later = () => requestAnimationFrame(place);

    const evs = [['focus', later], ['input', place], ['keyup', place], ['keydown', later], ['click', later], ['select', place], ['scroll', place], ['blur', hide]];
    evs.forEach(([t, f]) => el.addEventListener(t, f));
    offs.push(() => { evs.forEach(([t, f]) => el.removeEventListener(t, f)); caret.remove(); field.classList.remove('has-caret'); });
  });
  const onSel = () => { const el = document.activeElement; if (el && form.contains(el)) el.dispatchEvent(new Event('select')); };
  document.addEventListener('selectionchange', onSel);
  return () => { offs.forEach((f) => f()); document.removeEventListener('selectionchange', onSel); };
}
