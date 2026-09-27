import { useLayoutEffect, useRef, useState } from 'react';
import { dimsOf, srcsetOf } from '../lib/media.js';
import { gsap, reduced } from '../lib/motion.js';

/* =========================================================
   DEVICES — a mesma peça em duas versões, e o visitante escolhe
   qual ver: Desktop (janela de navegador) ou Mobile (celular).
   Bloco { type: 'devices', label, desktop: img, mobile: img, caption }.
   Peça mais alta que a tela (landing page inteira) rola DENTRO do
   aparelho — data-lenis-prevent deixa a rolagem para o próprio
   elemento em vez do smooth scroll da página.
   ========================================================= */

const MODES = [
  { id: 'desktop', label: 'Desktop', icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="M8 20h8M12 17v3" /></svg> },
  { id: 'mobile', label: 'Mobile', icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg> },
];

// Proporção da tela do aparelho: a da peça, até o limite da "janela";
// mais alta que isso, a peça rola lá dentro.
const screenFor = (img, min) => {
  const d = dimsOf(img && img.src);
  const r = d ? d[0] / d[1] : min;
  return { ratio: Math.max(r, min), scroll: r < min - 0.01, dims: d };
};

// Tela do aparelho. Rolável: sem barra nativa (ela vazava da borda
// arredondada do celular) — um trilho fino dentro do aparelho mostra a posição.
function Screen({ img, sizes, scroll }) {
  const onScroll = (e) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    el.parentElement.style.setProperty('--p', max > 0 ? (el.scrollTop / max).toFixed(4) : '0');
  };
  return (
    <>
      <div className={`device__screen${scroll ? ' is-scroll' : ''}`} data-lenis-prevent={scroll ? '' : undefined}
        tabIndex={scroll ? 0 : undefined} onScroll={scroll ? onScroll : undefined}
        aria-label={scroll ? `${img.alt} — role para ver a página inteira` : undefined}>
        <img src={img.src} srcSet={srcsetOf(img.src)} sizes={sizes} alt={img.alt || ''} loading="lazy" decoding="async" />
      </div>
      {scroll ? <span className="device__rail" aria-hidden="true"><i /></span> : null}
    </>
  );
}

export default function Devices({ b }) {
  const [mode, setMode] = useState('desktop');
  const stage = useRef(null);
  const first = useRef(true);
  const desk = screenFor(b.desktop, 1.6);
  const mob = screenFor(b.mobile, 9 / 19.5);

  // Troca: o aparelho que entra sobe e cresce; a tela volta ao topo
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = stage.current && stage.current.querySelector(`.device--${mode}`);
    if (!el) return;
    const sc = el.querySelector('.device__screen'); if (sc) sc.scrollTop = 0;
    el.style.setProperty('--p', '0');
    if (reduced) return;
    gsap.fromTo(el, { opacity: 0, y: 40, scale: 0.94, rotate: mode === 'mobile' ? -4 : 0 },
      { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity' });
  }, [mode]);

  const active = mode === 'desktop' ? desk : mob;
  return (
    <div className="blk blk--devices" data-mode={mode}>
      <div className="devices__bar" data-reveal>
        <span className="label label--ink">{b.label || 'Versões'}</span>
        <div className="seg" role="tablist" aria-label="Escolher versão">
          <i className="seg__pill" aria-hidden="true" />
          {MODES.map((m) => (
            <button key={m.id} type="button" role="tab" aria-selected={mode === m.id}
              className={`seg__btn${mode === m.id ? ' is-on' : ''}`} onClick={() => setMode(m.id)}>
              {m.icon}<span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="devices__stage" ref={stage}>
        <div className="device device--desktop" hidden={mode !== 'desktop'} style={{ '--A': desk.ratio.toFixed(4) }}>
          <div className="device__chrome" aria-hidden="true"><i /><i /><i /><span>{b.url || 'site.com.br'}</span></div>
          <Screen img={b.desktop} scroll={desk.scroll} sizes="(max-width: 860px) 100vw, 80vw" />
        </div>
        <div className="device device--mobile" hidden={mode !== 'mobile'} style={{ '--A': mob.ratio.toFixed(4) }}>
          <i className="device__island" aria-hidden="true" />
          <Screen img={b.mobile} scroll={mob.scroll} sizes="360px" />
        </div>
      </div>

      <div className="devices__foot">
        <p className="caption small">{b.caption}</p>
        <span className="label">
          {(mode === 'desktop' ? b.desktop : b.mobile).spec || (active.dims ? `${active.dims[0]} × ${active.dims[1]} px` : '')}
          {active.scroll ? ' · role dentro da tela ↓' : ''}
        </span>
      </div>
    </div>
  );
}
