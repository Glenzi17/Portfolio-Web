# Guilherme Lenzi — Design System

Sistema visual do portfólio (guilherme-lenzi.vercel.app). A fonte da verdade dos
valores é `src/styles/style.css` (bloco `:root`); este documento explica **como usar**
e `tokens.json` espelha os valores para outras ferramentas (Figma, Canva, peças).

Princípio: **minimalismo com uma assinatura só — o azul.** Neutros frios fazem o
papel de papel e tinta; o azul marca ação, estado e as superfícies líquidas. Nada de
segunda cor de destaque. As cores das marcas dos projetos aparecem só no hover dos
cards e nos chips de categoria.

---

## 1. Cor

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#f2f4f7` | Fundo da página (papel frio). |
| `--ink` | `#0c1422` | Texto principal; fundo das seções escuras (rodapé, preloader). Marinho do shader. |
| `--plate` | `#e5e9ef` | Fundo de pranchas de imagem, painéis claros, faixa de números. |
| `--plate-dark` | `#0f1a2b` | Prancha escura. |
| `--mute` | `#5d6980` | Texto secundário, legendas mono. 5:1 sobre `--bg`. |
| `--line` | `rgba(12,20,34,.12)` | Divisórias finas. |
| `--line-strong` | `rgba(12,20,34,.30)` | Bordas de controles. |
| **`--blue`** | **`#1660ab`** | **Cor principal.** Chips de seção, status, marquee, progresso, linha da timeline, hover dos painéis, palavras em serif dos títulos. 5,6:1 sobre `--bg`. |
| `--blue-hi` | `#2a78d0` | Brilho do azul (hover, ponto do favicon). |
| `--ice` | `#a9d1ff` | O azul sobre fundos escuros: serif do contato/rodapé, ✦ do marquee, L do monograma. |
| `--white` | `#ffffff` | Texto sobre `--blue`; botão do contato. |

Rampa do shader líquido (`Fluid.jsx`), só dentro das superfícies líquidas:
`#0d1520 → #134397 → #1660ab → #1f80b1 → #57beaf → brilho mentolado`.

**Regras**
- Proporção aproximada por tela: 85% neutros, 10% tinta, ≤5% azul sólido (as superfícies líquidas são a exceção — no máximo uma por viewport).
- Azul como texto só em palavras curtas (serif de destaque, número ativo). Parágrafo nunca.
- Sobre escuro, destaque é `--ice`, não `--blue` (o azul cai para 3:1 no marinho).
- Texto sobre superfície líquida precisa de véu marinho (`.contact::after`, 15% → 78%) e legendas a 86% de branco; o shader sozinho não garante leitura.
- Não reintroduzir laranja/lima. `--accent`, `--ocean` e `--lime` antigos agora apontam para o azul.

### Tema noturno
`ThemeToggle.jsx` (na cápsula da direita da nav) alterna `data-theme="dark"` no `<html>`; o site **sempre abre claro**; o noturno vale só enquanto a página está aberta (navegar entre páginas mantém, recarregar volta ao claro). Nada é salvo no navegador. A troca revela o tema novo num círculo que cresce a partir do botão (View Transitions API; instantânea sem a API ou com movimento reduzido).

| Token | Claro | Noturno |
|---|---|---|
| `--bg` | `#f2f4f7` | `#0a0f18` |
| `--ink` | `#0c1422` | `#e8ecf2` |
| `--plate` | `#e5e9ef` | `#131c2b` |
| `--mute` | `#5d6980` | `#8e99ae` |
| `--blue` | `#1660ab` | `#3b86d9` (um passo mais claro para manter contraste) |
| `--surface` | `#ffffff` | `#1b2638` |

Superfícies que **não** mudam com o tema usam `--navy` (`#0c1422`) e `--paper` (`#f2f4f7`): contato, rodapé, abertura, cortina, painel tinta, mockups de celular, controles do player e legenda sobre a foto. Regra: fundo escuro de propósito → `--navy`/`--paper`; o resto → `--bg`/`--ink`.

## 2. Tipografia

| Papel | Família | Token |
|---|---|---|
| Display (títulos, nome, números) | Inter Tight 500/600, CAIXA ALTA, tracking negativo | `--font-display` |
| Texto | Inter 400/500 | `--font-body` |
| Destaque | Instrument Serif itálico, caixa normal | `--font-serif` |
| Legenda / UI | Geist Mono 500, CAIXA ALTA, +0.06em | `--font-mono` |

Escala (fluida com `clamp`; valores em 1440 px):

| Estilo | Tamanho | Entrelinha | Tracking |
|---|---|---|---|
| `--fs-h1` nome do hero | 44 → **152 px** | 0.86 | −0.05em |
| `--fs-h2` títulos de seção | 32 → **64 px** | 0.98 | −0.035em |
| Título de contato | 40 → 104 px | 0.90 | −0.05em |
| Ano da timeline | 80 → 176 px | 0.85 | −0.06em |
| H3 (experiência) | 24 → 42 px | 0.98 | −0.035em |
| H3 (serviços) / título de projeto | 20–28 px | 1.0 | −0.03em |
| `--fs-lead` | 17 → 21 px | 1.45 | −0.01em |
| `--fs-body` | 15 → 17 px | 1.55 | 0 |
| `--fs-small` | 13 px | 1.5 | 0 |
| `--fs-label` | 11 px mono | 1.4 | +0.06em |

**Regras**
- Um título = display em caixa alta + no máximo **uma** palavra em serif itálico (em `--blue` no claro, `--ice` no escuro).
- Toda legenda, botão, nav e metadado é mono 11 px. Nunca mono em parágrafo.
- Parágrafos até ~56ch (`.body`) / 52ch (`.lead`); títulos com `text-wrap: balance`.

## 3. Espaço, grade e forma

- Grade de 12 colunas, `--gap` 16–32 px, `--gutter` 20–72 px (respeita o notch).
- Ritmo vertical: `--section-y` 88–152 px entre seções, `--block-y` 40–96 px entre blocos.
- Raios: `--radius` **12 px** (pranchas, painéis, cards), 8 px (legenda sobre foto), 16 px (nav cápsula), `--radius-lg` 24 px (folha do contato), 999 px (botões); selo 26 px.
- Sem sombras. Separação por fundo (`--plate`) ou fio (`--line`).

## 4. Componentes

- **Botão** `.btn`: pílula tinta, texto mono; no hover o azul sobe de baixo (`::before`). No contato: branco com hover tinta. Magnético no desktop (`data-magnetic`).
- **Chip de seção** `.chip`: quadradinho 8 px azul + `NN / Nome` em mono; decodifica ao entrar (`data-scramble`).
- **Nav** (estilo Antimetal): três cápsulas flutuantes em vidro fosco — links à esquerda (ativo = pílula branca com número azul), monograma no centro, "Let's talk" à direita (+ "Início" nas páginas de projeto). Sobre `[data-dark]` as cápsulas escurecem e o centro clareia. No celular: monograma + menu.
- **Monograma de leitura** (`NavMark.jsx`, centro da nav): círculo tinta com "GL" e anel azul que se fecha com a % lida. No fim da página a cápsula se expande e mostra "Guilherme Lenzi ↑"; antes disso, o hover abre "Topo ↑". Clique sempre volta ao topo. Seção atual e % no `aria-label`/`title`. (A versão em barra de progresso foi descartada por poluir.)
- **Prancha** `.plate`: mostra a peça inteira (contain) com moldura igual nos 4 lados; proporção vem de `media.js`.
- **Moldura de prova** (`Frame`, páginas de projeto): marcas de corte nos 4 cantos (desenham ao entrar, ficam azuis no hover), "Fig. NN" por contador CSS e o formato real da peça em mono. Peças em pares/sobreposição têm altura máxima de 72vh (64vh no celular) — nada estoura a tela; detalhes ampliados ficam em 4:3, no máximo 760 px de largura.
- **Versões Desktop/Mobile** (`Devices.jsx`, bloco `{ type: 'devices' }`): seletor em pílula (tinta desliza entre as opções), janela de navegador ou celular com ilha; peça mais alta que a tela rola dentro do aparelho (`data-lenis-prevent`). Hoje: landing da Elma (1440 px × 390 px) e key visual da Coca (16:9 × 9:16).
- **Card de projeto**: prancha + meta (nº, título + subtítulo serif, categoria com chip na cor da marca, ano). Hover: prancha assume a cor da marca, nº e serif ficam azuis.
- **Links (`<Roll>`)**: nav, botões, rodapé, e-mail/telefone e "Scroll to explore" — no hover o texto rola para cima e a cópia entra por baixo (text-shadow, 0.55 s). Sobre escuro o link fica `--ice`. Botões e o "↑" do rodapé são magnéticos. Mouse do sistema (sem cursor customizado).
- **Painéis de serviço**: claro (azul sobe no hover) / tinta / líquido.
- **Números com gráficos** (`StatCharts.jsx`): 4 cards em `--plate`, cada um com legenda, número que conta, mini-gráfico e linha de leitura que responde a hover/foco/toque. Dados calculados de `projects.js` (nada inventado): unidades por projeto (hover = cor da marca), linha do tempo 2021→hoje, anel de projetos por tipo (gaps de 2px), barras de projetos por frente. **Um azul só** — tons de azul como categorias reprovaram no validador (claros demais sobre `--plate`); identidade vem da posição e do rótulo.
- **Painéis de serviço**: entram em leque (giro de ±3°, stagger), luz que segue o mouse (`--mx/--my`), parallax em ritmos diferentes no desktop.
- **Retrato**: moldura 4:5 sticky, foto com parallax interno, legenda clara no rodapé e um **selo** que é o monograma da abertura (quadrado marinho, contorno azul que se desenha, "G" + "L" serif em `--ice`), na borda esquerda da foto.
- **Marquee**: faixa azul, texto branco, ✦ em `--ice`, acelera com o scroll.
- **Campo** `.field`: só fio inferior; legenda mono que sobe no foco.

## 5. Motion

Easing: `--ease` `cubic-bezier(.16,1,.3,1)` (expo.out) para entradas; `--ease-io` `cubic-bezier(.76,0,.24,1)` para cortinas. Durações: 0.35 s (hover), 0.7 s (estado), 0.9–1.3 s (entrada).

- **Preloader**: espera as fontes (máx. 1,2 s) → contorno azul do monograma se desenha + contador 000–100 + barra → a página monta *com a tela coberta* → sai para cima só com `transform`, puxando uma faixa azul.
- **Hero**: letras do nome sobem uma a uma com giro de 8° que assenta; "Lenzi" alinhado à direita.
- **Scroll**: linhas de título em máscara, fade-up nos blocos, palavras que acendem no "Sobre", números que contam, legendas que decodificam, parallax leve nas pranchas e no retrato.
- **Rotas**: cortina líquida com faixa azul na borda.
- **Contato**: a folha cresce de 90% a 100% com cantos de 56 px nos quatro lados, que fecham para 24 px em cima / 0 embaixo ao emendar no rodapé.
- **Selo do retrato**: repete a abertura — entra com escala, contorno se desenha, letras sobem.

**Regras de desempenho (não quebrar)**
- Animar só `transform` e `opacity`. Nada de `filter: blur`, `clip-path` com scrub em áreas grandes, ou transição de `width/top/padding` em loop.
- Shader líquido: contexto WebGL criado só perto da tela, 30 fps, 0.75× de resolução (0.5× no toque), pausa fora da tela.
- Sem `will-change` permanente em imagens.
- Trabalho pesado (montar a página, compilar shader) acontece com o preloader cobrindo a tela.
- Fontes servidas do próprio site (`@fontsource`, subconjunto latin, importadas em `main.jsx`) — nada de Google Fonts.
- Página de projeto é um pacote à parte (`lazy` em `App.jsx`), pré-carregado quando o navegador fica ocioso.
- `index.html` já desenha o fundo da abertura (`.boot #boot`) na primeira visita da sessão; o React o remove ao montar.
- Cache (`vercel.json`): `/static/*` imutável por 1 ano (nomes com hash); `/assets/*` 1 semana + revalidação.
- `prefers-reduced-motion`: tudo aparece parado, preloader/cortina/progresso somem.

## 6. Voz

Português direto, frases curtas, primeira pessoa. Legendas técnicas podem ficar em inglês ("Selected work", "Scroll to explore") — são parte da estética mono. Sem emoji.
