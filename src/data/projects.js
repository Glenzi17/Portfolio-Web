/* =========================================================
   PROJETOS â€” fonte Ãºnica de dados do portfÃ³lio
   ---------------------------------------------------------
   Para adicionar um projeto: copie um bloco, mude o `slug`
   (ele vira a URL: /projeto/slug) e ajuste os campos.
   A ordem deste array define a ordem na home e o "next".
   `color` Ã© a cor da marca: tinge o card no hover, o cursor e
   os detalhes da pÃ¡gina do projeto.

   Imagens â€” toda imagem vai numa "prancha" e aparece INTEIRA.
   A prancha assume a proporÃ§Ã£o da prÃ³pria peÃ§a (dimensÃµes em
   src/data/media.js â€” rode `npm run media` ao trocar imagens).
   Os arquivos ficam em public/assets/img e sÃ£o referenciados
   com caminho absoluto:
     { src: '/assets/img/projects/slug/arquivo.webp', alt: '...', caption: '...' }
     { src: null, label: 'Key visual', ratio: '4/5' }   â†’ placeholder elegante
     opÃ§Ãµes: bleed: true (preenche a prancha, para fotos/mockups)
             tone: 'dark' (prancha escura)
             ratio: '16/9' (forÃ§a uma proporÃ§Ã£o diferente da peÃ§a)

   Blocos de layout (sections[].blocks):
     { type: 'full',    image }                  prancha centralizada, limitada
                                                 em altura (cartazes nÃ£o viram
                                                 blocos gigantes)
     { type: 'wide',    image }                  prancha na largura inteira
     { type: 'split',   images: [a, b] }         duas pranchas lado a lado
     { type: 'overlap', images: [a, b] }         imagens sobrepostas, sem prancha
     { type: 'detail',  image, zoom, focus }     detalhe ampliado (Ãºnico bloco que corta)
     { type: 'devices', label, url, caption,     a mesma peÃ§a em Desktop e Mobile, com
       desktop: img, mobile: img }               botÃ£o para o visitante escolher; img
                                                 pode ter spec ('1440 px'); peÃ§a mais
                                                 alta que a tela rola dentro do aparelho
     { type: 'video',   src, poster, caption }   player prÃ³prio: toca mudo ao
                                                 entrar na tela, com som,
                                                 progresso e tela cheia
     { type: 'note',    text, label }            observaÃ§Ã£o editorial
   ========================================================= */

export const SITE = {
  name: 'Guilherme Lenzi',
  // Foto para a seÃ§Ã£o "Sobre" (ex.: '/assets/img/portrait.webp'). null = monograma.
  portrait: '/assets/img/portrait.webp',
  role: 'Designer grÃ¡fico & Diretor criativo',
  email: 'guilherme.clenzi@gmail.com',
  phone: '(35) 99153-3663',
  phoneHref: 'tel:+5535991533663',
  location: 'Minas Gerais, Brasil',
  social: {
    instagram: 'https://www.instagram.com/lenzi_gc/',
    behance: 'https://www.behance.net/guilhercostal',
    linkedin: 'https://www.linkedin.com/in/guilherme-costa-lenzi-ab9b3643a/',
  },
  // Endpoint de formulÃ¡rio (ex.: Formspree "https://formspree.io/f/xxxx").
  // Vazio = o botÃ£o abre o cliente de e-mail com a mensagem preenchida.
  formEndpoint: '',
};

export const PROJECTS = [
  {
    slug: 'elma-chips',
    color: '#F56F13',
    title: 'Elma Chips',
    subtitle: 'Estoura a Sorte',
    category: 'Campanha publicitÃ¡ria',
    tags: ['Campanha 360Â°', 'Key visual', 'PDV', 'Digital'],
    year: '2026',
    client: 'Elma Chips â€” projeto acadÃªmico',
    role: 'DireÃ§Ã£o de arte Â· Design grÃ¡fico Â· Digital',
    cover: { src: '/assets/img/projects/elma-chips/kv.webp', alt: 'Key visual da campanha Estoura a Sorte' },
    summary:
      'Campanha promocional 360Â° para o MÃªs das CrianÃ§as: um key visual que "estoura" da embalagem e se desdobra em cartaz, outdoor, PDV, social e landing page.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Uma promoÃ§Ã£o nacional precisa ser lida a cinco metros no supermercado e a um palmo no celular. O briefing pedia uma mecÃ¢nica simples â€” comprou, cadastrou, concorreu â€” e uma linguagem que falasse com a crianÃ§a sem perder o adulto, que Ã© quem decide a compra.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/elma-chips/kv.webp', alt: 'Key visual Estoura a Sorte', caption: 'Key visual â€” formato-mestre 4:5, base de todas as adaptaÃ§Ãµes.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'O estouro. Os produtos saem literalmente da embalagem e do frame, com uma tipografia display pesada que carrega o nome da promoÃ§Ã£o. Duas zonas de leitura: a laranja, para a crianÃ§a (nome, produtos, prÃªmios); a azul, para o adulto (mecÃ¢nica, QR, regulamento).',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/elma-chips/cartaz.webp', alt: 'Cartaz A3', caption: 'Cartaz A3 â€” PDV e fachada.' },
              { src: '/assets/img/projects/elma-chips/flyer.webp', alt: 'Flyer A5', caption: 'Flyer A5 â€” distribuiÃ§Ã£o em loja.' },
            ],
          },
          { type: 'note', label: 'Hierarquia', text: 'Nome â†’ mecÃ¢nica â†’ prÃªmios â†’ como participar. Nessa ordem, em qualquer formato.' },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Do formato-mestre nasceram treze peÃ§as: impressos com sangria e CMYK, mÃ­dia exterior, material de gÃ´ndola, feed e story, banner display e uma landing page de cadastro. Cada adaptaÃ§Ã£o reorganiza os mesmos elementos, nunca os redesenha.',
        blocks: [
          { type: 'wide', image: { src: '/assets/img/projects/elma-chips/outdoor.webp', alt: 'Outdoor 9x3m', caption: 'Outdoor 9 Ã— 3 m â€” leitura a 40 metros.' } },
          {
            type: 'overlap',
            images: [
              { src: '/assets/img/projects/elma-chips/feed.webp', alt: 'Post para feed do Instagram' },
              { src: '/assets/img/projects/elma-chips/story.webp', alt: 'Story do Instagram' },
            ],
          },
          { type: 'wide', image: { src: '/assets/img/projects/elma-chips/anuncio.webp', alt: 'AnÃºncio de mÃ­dia paga', caption: 'AnÃºncio 1200 Ã— 628 â€” mÃ­dia paga.' } },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Um sistema que se reconhece de longe e funciona de perto. A landing page fecha o ciclo: a crianÃ§a vÃª o estouro no ponto de venda, o adulto escaneia o QR e cadastra a compra em menos de um minuto.',
        blocks: [
          {
            type: 'devices',
            label: 'Landing page',
            url: 'estouraasorte.elmachips.com.br',
            desktop: { src: '/assets/img/projects/elma-chips/landing-full.webp', alt: 'Landing page da promoÃ§Ã£o â€” versÃ£o desktop', spec: 'Desktop 1440 px Â· pÃ¡gina inteira' },
            mobile: { src: '/assets/img/projects/elma-chips/landing-mobile.webp', alt: 'Landing page da promoÃ§Ã£o â€” versÃ£o mobile', spec: 'Mobile 390 px Â· pÃ¡gina inteira' },
            caption: 'Landing page â€” cadastro de compra, prÃªmios, sorteios e regulamento. No celular: passos em lista, FAQ em acordeÃ£o e o cadastro sempre a um toque.',
          },
          { type: 'wide', image: { src: '/assets/img/projects/elma-chips/faixa.webp', alt: 'Faixa de gÃ´ndola', caption: 'Faixa de gÃ´ndola 1000 Ã— 120 mm.' } },
        ],
      },
    ],
  },

  {
    slug: 'coca-cola',
    color: '#E40009',
    title: 'Coca-Cola',
    subtitle: 'PromoÃ§Ã£o ClÃ¡ssicos',
    category: 'Campanha promocional',
    tags: ['Campanha', 'Cartaz', 'Motion', 'PDV'],
    year: '2026',
    client: 'Coca-Cola â€” projeto acadÃªmico',
    role: 'DireÃ§Ã£o de arte Â· Design grÃ¡fico Â· Motion',
    cover: { src: '/assets/img/projects/coca-cola/cartaz.webp', alt: 'Cartaz da PromoÃ§Ã£o ClÃ¡ssicos Coca-Cola' },
    summary:
      'Redesign de uma promoÃ§Ã£o de ponto de venda: compre 2, ganhe 1. Cartaz A3 e reel vertical com uma Ãºnica regra â€” o nÃºmero precisa vencer o ambiente.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Bares e lanchonetes sÃ£o ambientes visualmente ruidosos, com luz quente e dezenas de estÃ­mulos concorrentes. A promoÃ§Ã£o precisava ser entendida em dois segundos, a quatro metros de distÃ¢ncia, sem depender de leitura de texto pequeno.',
        blocks: [
          {
            type: 'devices',
            label: 'Key visual',
            url: 'coca-cola.com.br/classicos',
            desktop: { src: '/assets/img/projects/coca-cola/kv.webp', alt: 'Key visual horizontal PromoÃ§Ã£o ClÃ¡ssicos', spec: 'Horizontal 16:9' },
            mobile: { src: '/assets/img/projects/coca-cola/mobile-como-participar.webp', alt: 'Tela vertical para celular com a mecÃ¢nica da promoÃ§Ã£o', spec: 'Vertical 9:16 Â· stories e reels' },
            caption: 'Key visual horizontal para telas e mÃ­dia digital; no celular, a mecÃ¢nica vira uma tela vertical â€” como participar em trÃªs passos.',
          },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Reduzir a mensagem ao essencial: COMPRE 2, GANHE 1. Tipografia condensada em caixa alta, os nÃºmeros destacados em contorno, o produto real em primeiro plano. O vermelho da marca faz o resto.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/coca-cola/cartaz.webp', alt: 'Cartaz A3', caption: 'Cartaz A3 â€” 300 dpi, sangria e marcas de corte.' },
              { src: '/assets/img/projects/coca-cola/reel-still.webp', alt: 'Frame final do reel', caption: 'Frame final do reel vertical.' },
            ],
          },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'O reel de 15 segundos foi construÃ­do com o mesmo sistema do cartaz: o cÃ­rculo branco abre, a garrafa sobe, a mensagem entra em dois tempos. Trilha original e ritmo de corte pensados para funcionar com e sem som â€” ative o Ã¡udio no player.',
        blocks: [
          { type: 'video', src: '/assets/img/projects/coca-cola/reel.mp4', poster: '/assets/img/projects/coca-cola/reel-poster.webp', caption: 'Reel 1080 Ã— 1920 â€” 15 s, trilha original.' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Uma peÃ§a que se lÃª antes de ser vista. Teste de PDV simulado: com luz quente e ruÃ­do visual, a Ãºnica coisa que precisa vencer Ã© o nÃºmero. Vence.',
        blocks: [
          { type: 'detail', image: { src: '/assets/img/projects/coca-cola/cartaz.webp', alt: 'Detalhe do cartaz', caption: 'Detalhe ampliado â€” tipografia condensada e nÃºmeros em contorno.' }, zoom: 1, focus: '50% 18%', ratio: '4/3' },
        ],
      },
    ],
  },

  {
    slug: 'boulevard',
    color: '#2F6B45',
    title: 'Boulevard',
    subtitle: 'SB Dunk',
    category: 'Branding / Sneakers',
    tags: ['Concept sneaker', 'Identidade', 'Carrossel', 'Storytelling'],
    year: '2026',
    client: 'Nike SB Ã— Golf â€” projeto conceitual',
    role: 'DireÃ§Ã£o de arte Â· Design grÃ¡fico',
    cover: { src: '/assets/img/projects/boulevard/final.webp', alt: 'Boulevard SB Dunk â€” tÃªnis verde e rosa' },
    summary:
      'Um SB Dunk conceitual inspirado em Call Me If You Get Lost, de Tyler, The Creator. Verde floresta e rosa antigo traduzem a jornada do artista em um Ãºnico tÃªnis â€” e em um carrossel que conta a histÃ³ria.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Criar um sneaker Ã© criar uma narrativa. O ponto de partida foi o universo de Call Me If You Get Lost: passaportes, carimbos, malas e a ideia de viagem como transformaÃ§Ã£o. O carrossel precisava apresentar o tÃªnis como se fosse um diÃ¡rio de bordo.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/boulevard/capa.webp', alt: 'Capa do carrossel Boulevard', caption: 'Capa â€” passaporte carimbado, estrelas e o lockup Golf + Nike.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'O verde e o rosa remetem Ã s eras IGOR e CHROMAKOPIA, unindo estÃ©ticas diferentes em um sÃ³ objeto. Mais do que um sneaker, o Boulevard representa evoluÃ§Ã£o, mÃºltiplas facetas e liberdade criativa de um artista em constante movimento.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/boulevard/conceito.webp', alt: 'PÃ¡gina de conceito com o tÃªnis e a capa do Ã¡lbum', caption: 'Conceito â€” o tÃªnis, o Ã¡lbum e o carimbo de chegada.' },
              { src: '/assets/img/projects/boulevard/cores.webp', alt: 'Paleta de cores do projeto', caption: 'Cores que representam â€” verde floresta, rosa antigo, cinza quente.' },
            ],
          },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Textura de papel, carimbos de imigraÃ§Ã£o, selos e fita adesiva compÃµem a linguagem visual. Cada pÃ¡gina do carrossel avanÃ§a a histÃ³ria: do embarque aos detalhes do produto, com fotos aproximadas do couro, do camurÃ§a e dos cadarÃ§os.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/boulevard/detalhes.webp', alt: 'Detalhes do tÃªnis', caption: 'Detalhes que contam histÃ³rias â€” close nos materiais e no bordado.' } },
          { type: 'note', label: 'Paleta', text: '#265341 Â· #CFA4AD Â· #CFC3C2 â€” verde floresta escuro, rosa antigo e cinza quente claro.' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Feito para jornadas. Especialmente nas ruas. O fechamento do carrossel apresenta o produto inteiro, com a assinatura da coleÃ§Ã£o e o convite para a prÃ³xima viagem.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/boulevard/final.webp', alt: 'PÃ¡gina final do carrossel', caption: 'PÃ¡gina final â€” produto e assinatura.' } },
        ],
      },
    ],
  },

  {
    slug: 'vertice',
    color: '#1B3A55',
    title: 'VÃ©rtice',
    subtitle: 'Arquitetura & Interiores',
    category: 'Identidade / Papelaria',
    tags: ['Identidade visual', 'CartÃ£o de visita', 'Papelaria', 'Branding'],
    year: '2026',
    client: 'VÃ©rtice Arquitetura â€” escritÃ³rio de arquitetura e interiores',
    role: 'Identidade visual Â· Design grÃ¡fico',
    cover: { src: '/assets/img/projects/vertice/frente.webp', alt: 'Frente do cartÃ£o de visita VÃ©rtice â€” monograma V sobre azul-marinho' },
    summary:
      'Identidade e cartÃ£o de visita para um escritÃ³rio de arquitetura e interiores: monograma em V, azul-marinho profundo, dourado discreto e uma malha tÃ©cnica ao fundo â€” precisÃ£o sem frieza.',
    sections: [
      {
        title: 'Contexto',
        text:
          'O cartÃ£o de visita Ã©, muitas vezes, o primeiro contato fÃ­sico de um escritÃ³rio de arquitetura com o cliente. Ele precisava transmitir rigor tÃ©cnico e bom gosto no mesmo gesto â€” e caber, com todas as informaÃ§Ãµes de contato, em um cartÃ£o de bolso.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/vertice/mockup-01.webp', alt: 'CartÃ£o VÃ©rtice em mÃ£os, frente', caption: 'Frente â€” o cartÃ£o em mÃ£os, na escala real de uso.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'VÃ©rtice: o ponto onde duas linhas se encontram. O monograma nasce dessa geometria â€” um V que Ã© tambÃ©m um traÃ§o de projeto â€” e os arcos dourados lembram o compasso na prancheta. Azul-marinho para a solidez, dourado para o acabamento, off-white para o respiro.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/vertice/verso.webp', alt: 'Verso do cartÃ£o com contatos e QR code', caption: 'Verso â€” contatos, registro CAU e QR code para salvar o contato.' } },
          { type: 'note', label: 'Tipografia', text: 'Serifa humanista espaÃ§ada para a marca; monoespaÃ§ada para os dados tÃ©cnicos, como na prancha de um projeto.' },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'A frente carrega a marca; o verso carrega a pessoa. A faixa lateral em azul e a linha dourada costuram os dois lados, e o QR code substitui o "guarde meu nÃºmero" por um toque. Tudo alinhado Ã  mesma malha que aparece no fundo da frente.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/vertice/mockup-02.webp', alt: 'CartÃ£o VÃ©rtice em mÃ£os, verso', caption: 'Verso â€” em mÃ£os.' } },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Um cartÃ£o que parece um objeto de arquitetura: sÃ³brio, preciso e agradÃ¡vel de segurar. A identidade se estende com facilidade para papel timbrado, assinatura de e-mail e placa de obra.',
        blocks: [
          { type: 'note', label: 'Cores', text: '#0E2232 azul-marinho Â· #D8A040 dourado Â· #ECEDEA off-white.' },
        ],
      },
    ],
  },

  {
    slug: 'americans',
    color: '#0A4DB0',
    title: 'Drogaria Americans',
    subtitle: 'Mega FeirÃ£o da SaÃºde',
    category: 'Varejo / Tabloide',
    tags: ['Tabloide', 'Varejo', 'DiagramaÃ§Ã£o', 'Impresso'],
    year: '2026',
    client: 'Drogaria Americans â€” campanha de aniversÃ¡rio',
    role: 'DiagramaÃ§Ã£o Â· Design grÃ¡fico',
    cover: { src: '/assets/img/projects/americans/tabloide-01.webp', alt: 'Capa do tabloide Mega FeirÃ£o da SaÃºde' },
    summary:
      'Tabloide de ofertas para a campanha de aniversÃ¡rio de uma rede de drogarias: mais de duzentos itens organizados em uma grade que se lÃª rÃ¡pido, com o preÃ§o sempre vencendo o resto.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Tabloide de farmÃ¡cia Ã© design de varejo no seu estado mais puro: muita informaÃ§Ã£o, pouco espaÃ§o e um leitor com pressa. O desafio era manter a hierarquia â€” preÃ§o, produto, condiÃ§Ã£o â€” sem transformar a pÃ¡gina em ruÃ­do.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/americans/tabloide-02.webp', alt: 'PÃ¡gina 2 do tabloide', caption: 'PÃ¡gina 2 â€” cuidado diÃ¡rio, serviÃ§os gratuitos e cupom exclusivo.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Uma grade de cards iguais, com respiro entre eles, e um Ãºnico ponto de cor forte por card: o preÃ§o em vermelho. O azul da marca fica no topo e no rodapÃ©, emoldurando a pÃ¡gina em vez de competir com os produtos.',
        blocks: [
          { type: 'note', label: 'Hierarquia', text: 'PreÃ§o â†’ produto â†’ condiÃ§Ã£o (unidade, desconto, "leve 3 pague 2") â†’ selo de categoria.' },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Cards com selo de categoria (genÃ©rico, oferta, promoÃ§Ã£o), preÃ§o "de/por", parcelamento e rodapÃ© com formas de pagamento e serviÃ§os da loja. A segunda pÃ¡gina muda o tema para "cuidado diÃ¡rio" e fecha com o cupom e o convite para a loja.',
        blocks: [
          { type: 'detail', image: { src: '/assets/img/projects/americans/tabloide-01.webp', alt: 'Detalhe da grade de ofertas', caption: 'Detalhe â€” os cards de oferta: selo, produto, preÃ§o e condiÃ§Ã£o.' }, zoom: 1.15, focus: '50% 58%', ratio: '4/3' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Duas pÃ¡ginas densas que ainda assim respiram. O olho encontra o preÃ§o em qualquer ponto da pÃ¡gina, e a marca fica reconhecÃ­vel mesmo com o tabloide dobrado na sacola.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/americans/tabloide-01.webp', alt: 'PÃ¡gina 1 do tabloide', caption: 'PÃ¡gina 1 â€” Mega FeirÃ£o da SaÃºde.' },
              { src: '/assets/img/projects/americans/tabloide-02.webp', alt: 'PÃ¡gina 2 do tabloide', caption: 'PÃ¡gina 2 â€” cuidado diÃ¡rio, serviÃ§os e cupom.' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'lvcas',
    color: '#8E1B2A',
    title: 'LVCAS',
    subtitle: 'Coca-Cola Ã— Rock in Rio',
    category: 'Cartaz / DireÃ§Ã£o de arte',
    tags: ['Cartaz', 'Fotografia', 'Tipografia', 'Evento'],
    year: '2026',
    client: 'Coca-Cola Ã— Rock in Rio â€” projeto conceitual',
    role: 'DireÃ§Ã£o de arte Â· ComposiÃ§Ã£o',
    cover: { src: '/assets/img/projects/lvcas/cartaz-01.webp', alt: 'Cartaz LVCAS â€” Coca-Cola Ã— Rock in Rio' },
    summary:
      'Cartaz de show para o artista LVCAS no palco Coca-Cola do Rock in Rio. Latas gigantes, luz de palco e tipografia que sai do quadro.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Divulgar uma apresentaÃ§Ã£o em um festival exige trÃªs informaÃ§Ãµes â€” quem, onde, quando â€” e uma atitude. O cartaz precisava carregar a marca patrocinadora sem virar anÃºncio de refrigerante.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/lvcas/cartaz-01.webp', alt: 'Cartaz versÃ£o nome', caption: 'VersÃ£o 01 â€” o nome do artista sangra o quadro.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Escala. As latas viram cenÃ¡rio, o artista senta na frente delas como em um trono improvisado e o nome, em display pesada, Ã© cortado pela borda â€” como se nÃ£o coubesse no cartaz.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/lvcas/cartaz-01.webp', alt: 'Cartaz 01', caption: 'VersÃ£o 01 â€” nome.' },
              { src: '/assets/img/projects/lvcas/cartaz-02.webp', alt: 'Cartaz 02', caption: 'VersÃ£o 02 â€” data.' },
            ],
          },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Recorte fotogrÃ¡fico, sombra projetada e um flare de palco para unir os planos. As duas versÃµes trocam apenas o elemento tipogrÃ¡fico principal: nome em uma, data na outra.',
        blocks: [
          { type: 'note', label: 'Sistema', text: 'Mesma composiÃ§Ã£o, dois momentos: anÃºncio (nome) e lembrete (data).' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Um par de cartazes com presenÃ§a de rua e leitura imediata. A marca aparece grande e ainda assim o artista Ã© o protagonista.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/lvcas/cartaz-02.webp', alt: 'Cartaz versÃ£o data', caption: 'VersÃ£o 02 â€” 05Â·09.' } },
        ],
      },
    ],
  },

  {
    slug: 'aerion',
    color: '#2F5FD0',
    title: 'Aerion Airlines',
    subtitle: 'Santorini',
    category: 'Identidade / OOH',
    tags: ['MÃ­dia exterior', 'Outdoor', 'Identidade', 'Campanha'],
    year: '2026',
    client: 'Aerion Airlines â€” projeto conceitual',
    role: 'DireÃ§Ã£o de arte Â· Design grÃ¡fico',
    cover: { src: '/assets/img/projects/aerion/outdoor-02.webp', alt: 'Outdoor Aerion Airlines â€” Santorini' },
    summary:
      'Dois outdoors para uma companhia aÃ©rea fictÃ­cia: do Brasil para a GrÃ©cia em um Ãºnico olhar. Uma janela azul, um mapa pontilhado e a promessa de Santorini.',
    sections: [
      {
        title: 'Contexto',
        text:
          'MÃ­dia exterior se lÃª em segundos, em movimento. O briefing pedia comunicar uma rota nova â€” BR â†’ GR â€” com a menor quantidade de informaÃ§Ã£o possÃ­vel e o mÃ¡ximo de desejo pelo destino.',
        blocks: [
          { type: 'wide', image: { src: '/assets/img/projects/aerion/outdoor-01.webp', alt: 'Outdoor 01 â€” Do BR para GR', caption: 'Outdoor 01 â€” origem, destino e horÃ¡rios em simetria.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Simetria como argumento: DO BR Ã  esquerda, PARA GR Ã  direita, e no centro a janela aberta de Santorini como portal. O azul das portas e do mar Ã© a cor da marca; o branco das casas, o respiro.',
        blocks: [
          { type: 'wide', image: { src: '/assets/img/projects/aerion/outdoor-02.webp', alt: 'Outdoor 02 â€” Santorini com rota pontilhada', caption: 'Outdoor 02 â€” a rota pontilhada leva o olhar atÃ© a ilha.' } },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Tipografia serifada para o nome do destino, sans condensada para os dados de voo. O bilhete de embarque, o aviÃ£o e a linha pontilhada funcionam como sistema de Ã­cones da campanha, reutilizÃ¡vel em outros destinos.',
        blocks: [
          { type: 'note', label: 'Sistema', text: 'Mesma estrutura, outro destino: basta trocar a foto, a sigla e o horÃ¡rio.' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Duas peÃ§as que se completam na rua: uma vende a rota, a outra vende o lugar. Juntas, formam a assinatura visual da Aerion.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/aerion/outdoor-01.webp', alt: 'Outdoor 01', caption: 'PeÃ§a 01 â€” rota.' },
              { src: '/assets/img/projects/aerion/outdoor-02.webp', alt: 'Outdoor 02', caption: 'PeÃ§a 02 â€” destino.' },
            ],
          },
        ],
      },
    ],
  },
];
