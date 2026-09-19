# Guilherme Lenzi — Portfólio

Site estático (HTML + CSS + JavaScript), sem build. Animações com GSAP + ScrollTrigger, smooth scroll com Lenis (via CDN).

## Rodar localmente

```
py tools/serve.py
```

e abra `http://localhost:8765`. (Use esse servidor em vez do `py -m http.server`: ele responde a HTTP Range, sem o qual o navegador não consegue buscar posição no vídeo do player.)

## Estrutura

```
index.html          home (hero → sobre → experiência → projetos → contato)
projeto.html        template de projeto — projeto.html?p=slug
css/style.css       tokens → base → componentes → seções → responsivo
js/projects.js      ⭐ DADOS: projetos, contato, redes, endpoint do formulário
js/media.js         GERADO — dimensões de cada imagem/vídeo (py tools/media.py)
js/main.js          comportamento compartilhado (nav, cursor, reveals, player, transições)
js/home.js          hero, grid de projetos, timeline
js/project.js       renderiza a página de projeto a partir de projects.js
tools/media.py      gera js/media.js a partir de assets/img
tools/serve.py      servidor local com suporte a Range (vídeo)
assets/img/projects/<slug>/   imagens de cada projeto (WebP, até 1800 px)
```

## Editar projetos

Tudo está em `js/projects.js`. Cada projeto:

```js
{
  slug: 'meu-projeto',          // vira a URL: projeto.html?p=meu-projeto
  title: 'Nome', subtitle: 'Subtítulo em serif',
  category: 'Branding', tags: ['Identidade', 'Editorial'],
  year: '2026', client: 'Cliente', role: 'Direção de arte',
  cover: { src: 'assets/img/projects/meu-projeto/cover.webp', alt: '...' },
  summary: 'Resumo curto.',
  sections: [ { title: 'Contexto', text: '...', blocks: [ ... ] }, ... ]
}
```

- A ordem do array define a ordem na home e o encadeamento do "Next project".
- Toda imagem é apresentada numa **prancha** (`.plate`) e aparece inteira, sem cortes. A prancha assume a proporção da própria peça (lida de `js/media.js`), com moldura igual dos quatro lados. Use `bleed: true` para fotos/mockups que devem preencher a prancha, `tone: 'dark'` para prancha escura e `ratio: '16/9'` para forçar uma proporção diferente.
- Para um placeholder elegante, use `{ src: null, ratio: '4/5', label: 'Key visual' }` no lugar de uma imagem.
- Blocos disponíveis: `full` (centralizado e limitado em altura — bom para cartazes), `wide` (largura inteira), `split`, `overlap`, `detail` (único que corta, com `zoom` e `focus`), `video` (player próprio), `note`.
- Na home, a largura de cada card vem da orientação da capa: retrato 5 colunas, paisagem 7, panorâmica a linha inteira. Os cards andam em pares, um deles deslocado para baixo.
- Foto na seção "Sobre": defina `SITE.portrait = 'assets/img/portrait.webp'`.

## Imagens

Exporte em WebP (qualidade ~80, lado maior ≤ 1800 px) e **rode `py tools/media.py`** depois de adicionar ou trocar qualquer imagem — é ele que regenera `js/media.js` com as dimensões que as pranchas usam.

## Vídeo

Bloco `{ type: 'video', src, poster, caption }`. O player é próprio: começa mudo quando entra na tela (e pausa ao sair), com Play/Pause, barra de progresso arrastável, som on/off e tela cheia. Se a pessoa pausar, ele não volta a tocar sozinho. Exporte o MP4 em H.264 + AAC; o poster é um frame do próprio vídeo.

## Formulário

Por padrão o botão "Enviar" abre o cliente de e-mail com a mensagem preenchida. Para enviar sem sair do site, crie um formulário no Formspree (ou similar) e cole o endpoint em `SITE.formEndpoint` no `projects.js`.

## Redes

Links do Instagram / Behance / LinkedIn estão no `index.html` e `projeto.html` (footer) e em `SITE.social` — substitua pelas URLs reais.

## Cores e tipografia

Tokens em `:root` no topo do `style.css`: `--bg`, `--ink`, `--accent` (único acento, use com parcimônia), fontes Inter Tight (display), Inter (texto) e Instrument Serif (itálico editorial).

## Acessibilidade e performance

- `prefers-reduced-motion` desliga todas as animações, preloader, cursor, smooth scroll e o autoplay do vídeo.
- Imagens com `loading="lazy"` e `width`/`height` (sem pulo de layout); vídeo só toca quando visível.
- Sem dependências além de GSAP/Lenis; sem etapa de build.
