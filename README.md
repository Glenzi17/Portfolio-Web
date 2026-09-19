# Guilherme Lenzi — Portfólio

Site em **React 19 + Vite 7**, com React Router (rotas `/` e `/projeto/:slug`), GSAP + ScrollTrigger para as animações e Lenis para o smooth scroll. Hospedado na Vercel.

## Rodar localmente

```
npm install
npm run dev        # http://localhost:5173
```

```
npm run build      # gera dist/
npm run preview    # serve o build em http://localhost:8765
```

## Estrutura

```
index.html                  casca HTML (fontes, meta, #root)
public/assets/              favicon e imagens/vídeos dos projetos (servidos na raiz: /assets/...)
src/main.jsx                bootstrap do React
src/App.jsx                 rotas
src/styles/style.css        tokens → base → componentes → seções → responsivo
src/data/projects.js        ⭐ DADOS: projetos, contato, redes, endpoint do formulário
src/data/media.js           GERADO — dimensões de cada imagem/vídeo (npm run media)
src/lib/motion.js           GSAP + ScrollTrigger + Lenis (singletons), scrollTo/jumpTo
src/lib/reveals.js          reveals compartilhados, nav escura, botões magnéticos
src/lib/usePageMotion.js    hook: roda as animações da página num gsap.context e limpa ao sair
src/components/Shell.jsx    preloader, cortina de transição entre rotas, menu, links âncora
src/components/Nav.jsx      navbar + menu mobile
src/components/Cursor.jsx   cursor customizado (desktop)
src/components/Plate.jsx    prancha de imagem (proporção da própria peça)
src/components/Player.jsx   player de vídeo próprio
src/components/ContactForm.jsx
src/components/Footer.jsx
src/pages/Home.jsx          hero → sobre → experiência → projetos → contato
src/pages/home-motion.js    animações da home
src/pages/Project.jsx       página de projeto + redirect da URL antiga (projeto.html?p=slug)
tools/media.py              gera src/data/media.js a partir de public/assets/img
vercel.json                 rewrite de SPA (toda rota → index.html)
```

## Editar projetos

Tudo está em `src/data/projects.js`. Cada projeto:

```js
{
  slug: 'meu-projeto',          // vira a URL: /projeto/meu-projeto
  title: 'Nome', subtitle: 'Subtítulo em serif',
  category: 'Branding', tags: ['Identidade', 'Editorial'],
  year: '2026', client: 'Cliente', role: 'Direção de arte',
  cover: { src: '/assets/img/projects/meu-projeto/cover.webp', alt: '...' },
  summary: 'Resumo curto.',
  sections: [
    { title: 'Contexto', text: '...', blocks: [ { type: 'full', image: { src: '...', alt: '...', caption: '...' } } ] },
    // Conceito → Desenvolvimento → Resultado
  ],
}
```

Blocos disponíveis: `full`, `wide`, `split` (2 imagens), `overlap` (2 imagens), `detail` (zoom/focus), `video` (src, poster, caption), `note` (label, text). A ordem do array define a ordem na home e o "next project".

### Trocar / adicionar imagens

1. Coloque o arquivo (WebP, até 1800 px) em `public/assets/img/projects/<slug>/`.
2. Rode `npm run media` (precisa de Python com Pillow: `py -m pip install pillow`). Isso:
   - regenera `src/data/media.js` com as dimensões — é o que faz a prancha assumir a proporção exata da peça, sem cortes;
   - cria as variantes responsivas `nome@640.webp`, `nome@1000.webp`, `nome@1400.webp` ao lado do original (o celular baixa a menor que serve, via `srcset`). Não edite nem referencie as variantes à mão.
3. Referencie em `projects.js` com caminho absoluto `/assets/img/...` (sempre o original, sem `@`).

### Vídeo

O player usa o arquivo original no desktop e, no celular, a variante `nome@720.mp4` se ela existir. Para gerar (precisa de ffmpeg):

```
ffmpeg -i reel.mp4 -vf scale=720:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k reel@720.mp4
```

Depois rode `npm run media` para registrar a variante.

### Contato

`SITE.email`, `SITE.phone` e `SITE.social` ficam em `projects.js`. `SITE.formEndpoint` vazio = o botão "Enviar" abre o cliente de e-mail com a mensagem preenchida; com um endpoint (ex.: Formspree) o envio é por fetch.

## Deploy

Na Vercel: importar o repositório do GitHub, framework **Vite** (detectado automaticamente), build `npm run build`, output `dist`. Cada push na `main` gera um deploy.
