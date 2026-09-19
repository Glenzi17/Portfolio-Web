import { dimsOf, ratioOf, srcsetOf } from '../lib/media.js';

/* Placeholder elegante para peças ainda sem imagem */
export function Placeholder({ img = {}, index = '' }) {
  return (
    <div className="ph" role="img" aria-label={`${img.label || 'Imagem'} (placeholder)`}>
      <span className="label ph__label">{img.label || 'Image'}</span>
      <span className="ph__num" aria-hidden="true">{index}</span>
    </div>
  );
}

// Largura que a peça ocupa na tela, para o navegador escolher a variante
// certa do srcset. Padrão: tela inteira no celular, metade no desktop.
const SIZES_DEFAULT = '(max-width: 860px) 100vw, 50vw';

/* Prancha: a peça aparece inteira (object-fit: contain) sobre um fundo
   neutro, e a prancha assume a proporção da própria peça (ratioOf).
   img.bleed = true → a imagem preenche a prancha (cover), para fotos/mockups.
   img.tone = 'dark' → prancha escura.
   ratio (prop) força uma proporção → prancha fixa.
   priority = true → imagem principal da página (LCP): carrega já, sem lazy. */
export default function Plate({ img, index = '', ratio, className = '', sizes = SIZES_DEFAULT, priority = false }) {
  const im = img || {};
  // Proporção fixa (a mídia preenche em absoluto) quando não há imagem,
  // quando ela deve sangrar ou quando um ratio foi forçado.
  const fixed = !im.src || im.bleed || ratio || im.ratio;
  const cls = ['plate', fixed ? 'plate--fixed' : '', im.bleed ? 'plate--bleed' : '', im.tone === 'dark' ? 'plate--dark' : '', className]
    .filter(Boolean).join(' ');
  const dims = dimsOf(im.src);
  return (
    <div className={cls} style={{ '--ratio': ratioOf(im, { ratio }).toFixed(4) }}>
      {im.src
        ? (
          <img
            src={im.src}
            srcSet={srcsetOf(im.src)}
            sizes={srcsetOf(im.src) ? sizes : undefined}
            alt={im.alt || ''}
            width={dims ? dims[0] : undefined}
            height={dims ? dims[1] : undefined}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
          />
        )
        : <Placeholder img={im} index={index} />}
    </div>
  );
}
