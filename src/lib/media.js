/* Proporções das peças — lê as dimensões geradas em src/data/media.js */
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

export const pad2 = (n) => String(n).padStart(2, '0');
