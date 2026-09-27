import { useState } from 'react';
import { pad2 } from '../lib/media.js';
import { touch } from '../lib/motion.js';

// No celular a leitura acontece no toque (as marcas são focáveis)
const ACT = touch ? 'Toque' : 'Passe o mouse';

/* =========================================================
   STAT CHARTS — a faixa de números do "O que eu faço".
   Cada número ganha um mini-gráfico com os dados reais do site
   (PROJECTS / EXPERIENCE). Um azul só; quem identifica cada item
   é a posição e o rótulo. Passar o mouse (ou focar/tocar) numa
   marca atualiza a linha de leitura do card. As entradas animadas
   ficam em home-motion.js (statCharts).
   ========================================================= */

// Tipo do projeto a partir da categoria ("Identidade / OOH" → Identidade)
const TYPES = [
  ['Campanha', /campanha/i],
  ['Identidade', /identidade|branding/i],
  ['Varejo', /varejo/i],
  ['Cartaz', /cartaz/i],
];
// Frentes (os mesmos painéis de SERVICES) a partir de categoria + tags; um projeto pode estar em mais de uma
const FRONTS = [
  ['Identidade visual', /identidade|branding/i],
  ['Campanhas', /campanha|pdv|tabloide|cartaz/i],
  ['Digital', /digital|carrossel|motion|web|ui/i],
];

const text = (p) => [p.category, ...(p.tags || [])].join(' ');

function Card({ label, value, idle, read, children, kind }) {
  return (
    <div className={`stat stat--${kind}`} data-chart={kind}>
      <dt className="label">{label}</dt>
      <dd>
        <span className="stat__num" data-count>{value}</span>
        <div className="stat__chart">{children}</div>
        <p className="stat__read label" aria-live="polite">{read || idle}</p>
      </dd>
    </div>
  );
}

/* 1 · Projetos: um quadrado por projeto; no hover assume a cor da marca */
function Units({ projects }) {
  const [on, setOn] = useState(null);
  const p = on === null ? null : projects[on];
  return (
    <Card kind="units" label="Projetos selecionados" value={pad2(projects.length)}
      idle={`${ACT} em cada projeto`} read={p && `${p.title} · ${p.category}`}>
      <div className="units" onMouseLeave={() => setOn(null)}>
        {projects.map((q, i) => (
          <span
            key={q.slug} className={`unit${on === i ? ' is-on' : ''}`} style={{ '--c': q.color }}
            tabIndex={0} role="img" aria-label={`${q.title}, ${q.category}`}
            onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(null)}
          ><i>{pad2(i + 1)}</i></span>
        ))}
      </div>
    </Card>
  );
}

/* 2 · Anos: linha do tempo 2021 → hoje, um marco por ano */
function Years({ steps }) {
  const [on, setOn] = useState(null);
  const n = steps.length;
  const x = (i) => 8 + (i * 224) / (n - 1);
  const s = on === null ? null : steps[on];
  return (
    <Card kind="years" label="Anos criando" value={`${Number(steps[n - 1].year) - Number(steps[0].year)}+`}
      idle={`${steps[0].year} — ${steps[n - 1].year} · ${touch ? 'toque nos anos' : 'passe pelos anos'}`} read={s && `${s.year} · ${s.title}`}>
      <svg className="years" viewBox="0 0 240 64" onMouseLeave={() => setOn(null)} role="list">
        <line className="years__track" x1={x(0)} x2={x(n - 1)} y1="24" y2="24" />
        <line className="years__fill" x1={x(0)} x2={x(n - 1)} y1="24" y2="24" pathLength="1" />
        {steps.map((e, i) => (
          <g key={e.year} className={`years__pt${on === i ? ' is-on' : ''}`} role="listitem" tabIndex={0}
            aria-label={`${e.year}: ${e.title}`}
            onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(null)}>
            <rect className="years__hit" x={x(i) - 18} y="0" width="36" height="64" />
            <circle cx={x(i)} cy="24" r={i === n - 1 ? 6 : 4.5} />
            <text x={x(i)} y="54" textAnchor="middle">{`’${e.year.slice(2)}`}</text>
          </g>
        ))}
      </svg>
    </Card>
  );
}

/* 3 · 360°: anel com a divisão dos projetos por tipo (gaps de 2px entre segmentos) */
function Ring({ projects }) {
  const [on, setOn] = useState(null);
  const groups = TYPES.map(([name, re]) => ({ name, items: projects.filter((p) => re.test(p.category)) }))
    .filter((g) => g.items.length);
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const R = 38, C = 2 * Math.PI * R, GAP = 2.5;
  let acc = 0;
  const segs = groups.map((g) => {
    const len = (g.items.length / total) * C;
    const seg = { ...g, dash: Math.max(len - GAP, 1), off: -acc };
    acc += len;
    return seg;
  });
  const g = on === null ? null : segs[on];
  return (
    <Card kind="ring" label="Campanhas integradas" value="360°"
      idle={`${total} projetos por tipo`} read={g && `${g.name} · ${g.items.map((p) => p.title).join(', ')}`}>
      <div className="ring" onMouseLeave={() => setOn(null)}>
        <svg viewBox="0 0 96 96" className={on !== null ? 'has-on' : ''}>
          <circle className="ring__track" cx="48" cy="48" r={R} />
          <g transform="rotate(-90 48 48)">
            {segs.map((s, i) => (
              <circle key={s.name} className={`ring__seg${on === i ? ' is-on' : ''}`} cx="48" cy="48" r={R}
                strokeDasharray={`${s.dash} ${C}`} strokeDashoffset={s.off}
                onMouseEnter={() => setOn(i)} />
            ))}
          </g>
          <text className="ring__mid" x="48" y="52" textAnchor="middle">{g ? g.items.length : total}</text>
        </svg>
        <ul className="ring__legend">
          {segs.map((s, i) => (
            <li key={s.name} className={on === i ? 'is-on' : ''} tabIndex={0}
              onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(null)}>
              <span>{s.name}</span><b>{pad2(s.items.length)}</b>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* 4 · Frentes: barras com quantos projetos passam por cada frente */
function Bars({ projects, services }) {
  const [on, setOn] = useState(null);
  const rows = FRONTS.map(([name, re]) => ({ name, items: projects.filter((p) => re.test(text(p))) }));
  const max = projects.length;
  const r = on === null ? null : rows[on];
  return (
    <Card kind="bars" label="Frentes de atuação" value={pad2(services)}
      idle="Projetos em cada frente" read={r && `${r.name} · ${r.items.map((p) => p.title).join(', ')}`}>
      <ul className="bars" onMouseLeave={() => setOn(null)}>
        {rows.map((row, i) => (
          <li key={row.name} className={on === i ? 'is-on' : ''} tabIndex={0}
            aria-label={`${row.name}: ${row.items.length} projetos`}
            onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(null)}>
            <span className="bars__name">{row.name}</span>
            <span className="bars__track"><i style={{ '--w': row.items.length / max }} /></span>
            <b>{pad2(row.items.length)}</b>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function StatCharts({ projects, experience, services }) {
  return (
    <dl className="stats stats--charts" data-reveal-group>
      <Units projects={projects} />
      <Years steps={experience} />
      <Ring projects={projects} />
      <Bars projects={projects} services={services} />
    </dl>
  );
}
