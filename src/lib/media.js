/* Proporções e variantes das peças — lê o que tools/media.py gerou em src/data/media.js */
import { MEDIA } from '../data/media.js';

export const dimsOf = (src) => (src && MEDIA[src]) || null;

export const mediaRatio = (src) => {
  const d = dimsOf(src);
  return d ? d[0] / d[1] : 0;
};

// Proporção (largura/altura): ratio explícito ('16/9' ou número)
// → dimensões reais em media.js → 4:5.
export const ratioOf = (img = {}, opts = {}) => {
  const r = opts.ratio || (img && img.ratio);
  if (typeof r === 'number') return r;
  if (r) { const [a, b] = String(r).split('/').map(Number); if (a && b) return a / b; }
  return mediaRatio(img && img.src) || 0.8;
};

// URL da variante nome@W.ext
export const variantUrl = (src, w) => src.replace(/(\.[a-z0-9]+)$/i, `@${w}$1`);

// srcset com as variantes geradas + o original ("kv@640.webp 640w, ..., kv.webp 1400w")
export const srcsetOf = (src) => {
  const d = dimsOf(src);
  if (!d || !d[2] || !d[2].length) return undefined;
  return [...d[2].map((w) => `${variantUrl(src, w)} ${w}w`), `${src} ${d[0]}w`].join(', ');
};

// Vídeo: no celular usa a variante mais leve (nome@720.mp4) quando existe
export const videoSrcFor = (src, small) => {
  const d = dimsOf(src);
  if (!small || !d || !d[2] || !d[2].length) return src;
  return variantUrl(src, d[2][0]);
};

export const pad2 = (n) => String(n).padStart(2, '0');
