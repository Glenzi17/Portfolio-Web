/* =========================================================
   PROJETOS — fonte única de dados do portfólio
   ---------------------------------------------------------
   Para adicionar um projeto: copie um bloco, mude o `slug`
   (ele vira a URL: /projeto/slug) e ajuste os campos.
   A ordem deste array define a ordem na home e o "next".

   Imagens — toda imagem vai numa "prancha" e aparece INTEIRA.
   A prancha assume a proporção da própria peça (dimensões em
   src/data/media.js — rode `npm run media` ao trocar imagens).
   Os arquivos ficam em public/assets/img e são referenciados
   com caminho absoluto:
     { src: '/assets/img/projects/slug/arquivo.webp', alt: '...', caption: '...' }
     { src: null, label: 'Key visual', ratio: '4/5' }   → placeholder elegante
     opções: bleed: true (preenche a prancha, para fotos/mockups)
             tone: 'dark' (prancha escura)
             ratio: '16/9' (força uma proporção diferente da peça)

   Blocos de layout (sections[].blocks):
     { type: 'full',    image }                  prancha centralizada, limitada
                                                 em altura (cartazes não viram
                                                 blocos gigantes)
     { type: 'wide',    image }                  prancha na largura inteira
     { type: 'split',   images: [a, b] }         duas pranchas lado a lado
     { type: 'overlap', images: [a, b] }         imagens sobrepostas, sem prancha
     { type: 'detail',  image, zoom, focus }     detalhe ampliado (único bloco que corta)
     { type: 'video',   src, poster, caption }   player próprio: toca mudo ao
                                                 entrar na tela, com som,
                                                 progresso e tela cheia
     { type: 'note',    text, label }            observação editorial
   ========================================================= */

export const SITE = {
  name: 'Guilherme Lenzi',
  // Foto para a seção "Sobre" (ex.: '/assets/img/portrait.webp'). null = monograma.
  portrait: null,
  role: 'Designer gráfico & Diretor criativo',
  email: 'guilhermelenzi.design@gmail.com',
  phone: '(35) 9153-3663',
  phoneHref: 'tel:+553591533663',
  location: 'Minas Gerais, Brasil',
  social: {
    instagram: 'https://instagram.com/',
    behance: 'https://behance.net/',
    linkedin: 'https://linkedin.com/',
  },
  // Endpoint de formulário (ex.: Formspree "https://formspree.io/f/xxxx").
  // Vazio = o botão abre o cliente de e-mail com a mensagem preenchida.
  formEndpoint: '',
};

export const PROJECTS = [
  {
    slug: 'elma-chips',
    title: 'Elma Chips',
    subtitle: 'Estoura a Sorte',
    category: 'Campanha publicitária',
    tags: ['Campanha 360°', 'Key visual', 'PDV', 'Digital'],
    year: '2026',
    client: 'Elma Chips — projeto acadêmico',
    role: 'Direção de arte · Design gráfico · Digital',
    cover: { src: '/assets/img/projects/elma-chips/kv.webp', alt: 'Key visual da campanha Estoura a Sorte' },
    summary:
      'Campanha promocional 360° para o Mês das Crianças: um key visual que "estoura" da embalagem e se desdobra em cartaz, outdoor, PDV, social e landing page.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Uma promoção nacional precisa ser lida a cinco metros no supermercado e a um palmo no celular. O briefing pedia uma mecânica simples — comprou, cadastrou, concorreu — e uma linguagem que falasse com a criança sem perder o adulto, que é quem decide a compra.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/elma-chips/kv.webp', alt: 'Key visual Estoura a Sorte', caption: 'Key visual — formato-mestre 4:5, base de todas as adaptações.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'O estouro. Os produtos saem literalmente da embalagem e do frame, com uma tipografia display pesada que carrega o nome da promoção. Duas zonas de leitura: a laranja, para a criança (nome, produtos, prêmios); a azul, para o adulto (mecânica, QR, regulamento).',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/elma-chips/cartaz.webp', alt: 'Cartaz A3', caption: 'Cartaz A3 — PDV e fachada.' },
              { src: '/assets/img/projects/elma-chips/flyer.webp', alt: 'Flyer A5', caption: 'Flyer A5 — distribuição em loja.' },
            ],
          },
          { type: 'note', label: 'Hierarquia', text: 'Nome → mecânica → prêmios → como participar. Nessa ordem, em qualquer formato.' },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Do formato-mestre nasceram treze peças: impressos com sangria e CMYK, mídia exterior, material de gôndola, feed e story, banner display e uma landing page de cadastro. Cada adaptação reorganiza os mesmos elementos, nunca os redesenha.',
        blocks: [
          { type: 'wide', image: { src: '/assets/img/projects/elma-chips/outdoor.webp', alt: 'Outdoor 9x3m', caption: 'Outdoor 9 × 3 m — leitura a 40 metros.' } },
          {
            type: 'overlap',
            images: [
              { src: '/assets/img/projects/elma-chips/feed.webp', alt: 'Post para feed do Instagram' },
              { src: '/assets/img/projects/elma-chips/story.webp', alt: 'Story do Instagram' },
            ],
          },
          { type: 'wide', image: { src: '/assets/img/projects/elma-chips/anuncio.webp', alt: 'Anúncio de mídia paga', caption: 'Anúncio 1200 × 628 — mídia paga.' } },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Um sistema que se reconhece de longe e funciona de perto. A landing page fecha o ciclo: a criança vê o estouro no ponto de venda, o adulto escaneia o QR e cadastra a compra em menos de um minuto.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/elma-chips/landing.webp', alt: 'Landing page da promoção', caption: 'Landing page — cadastro de compra e regulamento.' } },
          { type: 'wide', image: { src: '/assets/img/projects/elma-chips/faixa.webp', alt: 'Faixa de gôndola', caption: 'Faixa de gôndola 1000 × 120 mm.' } },
        ],
      },
    ],
  },

  {
    slug: 'coca-cola',
    title: 'Coca-Cola',
    subtitle: 'Promoção Clássicos',
    category: 'Campanha promocional',
    tags: ['Campanha', 'Cartaz', 'Motion', 'PDV'],
    year: '2026',
    client: 'Coca-Cola — projeto acadêmico',
    role: 'Direção de arte · Design gráfico · Motion',
    cover: { src: '/assets/img/projects/coca-cola/cartaz.webp', alt: 'Cartaz da Promoção Clássicos Coca-Cola' },
    summary:
      'Redesign de uma promoção de ponto de venda: compre 2, ganhe 1. Cartaz A3 e reel vertical com uma única regra — o número precisa vencer o ambiente.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Bares e lanchonetes são ambientes visualmente ruidosos, com luz quente e dezenas de estímulos concorrentes. A promoção precisava ser entendida em dois segundos, a quatro metros de distância, sem depender de leitura de texto pequeno.',
        blocks: [
          { type: 'wide', image: { src: '/assets/img/projects/coca-cola/kv.webp', alt: 'Key visual horizontal Promoção Clássicos', caption: 'Key visual horizontal — base para telas e mídia digital.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Reduzir a mensagem ao essencial: COMPRE 2, GANHE 1. Tipografia condensada em caixa alta, os números destacados em contorno, o produto real em primeiro plano. O vermelho da marca faz o resto.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/coca-cola/cartaz.webp', alt: 'Cartaz A3', caption: 'Cartaz A3 — 300 dpi, sangria e marcas de corte.' },
              { src: '/assets/img/projects/coca-cola/reel-still.webp', alt: 'Frame final do reel', caption: 'Frame final do reel vertical.' },
            ],
          },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'O reel de 15 segundos foi construído com o mesmo sistema do cartaz: o círculo branco abre, a garrafa sobe, a mensagem entra em dois tempos. Trilha original e ritmo de corte pensados para funcionar com e sem som — ative o áudio no player.',
        blocks: [
          { type: 'video', src: '/assets/img/projects/coca-cola/reel.mp4', poster: '/assets/img/projects/coca-cola/reel-poster.webp', caption: 'Reel 1080 × 1920 — 15 s, trilha original.' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Uma peça que se lê antes de ser vista. Teste de PDV simulado: com luz quente e ruído visual, a única coisa que precisa vencer é o número. Vence.',
        blocks: [
          { type: 'detail', image: { src: '/assets/img/projects/coca-cola/cartaz.webp', alt: 'Detalhe do cartaz', caption: 'Detalhe ampliado — tipografia condensada e números em contorno.' }, zoom: 1.08, focus: '50% 10%' },
        ],
      },
    ],
  },

  {
    slug: 'boulevard',
    title: 'Boulevard',
    subtitle: 'SB Dunk',
    category: 'Branding / Sneakers',
    tags: ['Concept sneaker', 'Identidade', 'Carrossel', 'Storytelling'],
    year: '2026',
    client: 'Nike SB × Golf — projeto conceitual',
    role: 'Direção de arte · Design gráfico',
    cover: { src: '/assets/img/projects/boulevard/final.webp', alt: 'Boulevard SB Dunk — tênis verde e rosa' },
    summary:
      'Um SB Dunk conceitual inspirado em Call Me If You Get Lost, de Tyler, The Creator. Verde floresta e rosa antigo traduzem a jornada do artista em um único tênis — e em um carrossel que conta a história.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Criar um sneaker é criar uma narrativa. O ponto de partida foi o universo de Call Me If You Get Lost: passaportes, carimbos, malas e a ideia de viagem como transformação. O carrossel precisava apresentar o tênis como se fosse um diário de bordo.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/boulevard/capa.webp', alt: 'Capa do carrossel Boulevard', caption: 'Capa — passaporte carimbado, estrelas e o lockup Golf + Nike.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'O verde e o rosa remetem às eras IGOR e CHROMAKOPIA, unindo estéticas diferentes em um só objeto. Mais do que um sneaker, o Boulevard representa evolução, múltiplas facetas e liberdade criativa de um artista em constante movimento.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/boulevard/conceito.webp', alt: 'Página de conceito com o tênis e a capa do álbum', caption: 'Conceito — o tênis, o álbum e o carimbo de chegada.' },
              { src: '/assets/img/projects/boulevard/cores.webp', alt: 'Paleta de cores do projeto', caption: 'Cores que representam — verde floresta, rosa antigo, cinza quente.' },
            ],
          },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Textura de papel, carimbos de imigração, selos e fita adesiva compõem a linguagem visual. Cada página do carrossel avança a história: do embarque aos detalhes do produto, com fotos aproximadas do couro, do camurça e dos cadarços.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/boulevard/detalhes.webp', alt: 'Detalhes do tênis', caption: 'Detalhes que contam histórias — close nos materiais e no bordado.' } },
          { type: 'note', label: 'Paleta', text: '#265341 · #CFA4AD · #CFC3C2 — verde floresta escuro, rosa antigo e cinza quente claro.' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Feito para jornadas. Especialmente nas ruas. O fechamento do carrossel apresenta o produto inteiro, com a assinatura da coleção e o convite para a próxima viagem.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/boulevard/final.webp', alt: 'Página final do carrossel', caption: 'Página final — produto e assinatura.' } },
        ],
      },
    ],
  },

  {
    slug: 'vertice',
    title: 'Vértice',
    subtitle: 'Arquitetura & Interiores',
    category: 'Identidade / Papelaria',
    tags: ['Identidade visual', 'Cartão de visita', 'Papelaria', 'Branding'],
    year: '2026',
    client: 'Vértice Arquitetura — escritório de arquitetura e interiores',
    role: 'Identidade visual · Design gráfico',
    cover: { src: '/assets/img/projects/vertice/frente.webp', alt: 'Frente do cartão de visita Vértice — monograma V sobre azul-marinho' },
    summary:
      'Identidade e cartão de visita para um escritório de arquitetura e interiores: monograma em V, azul-marinho profundo, dourado discreto e uma malha técnica ao fundo — precisão sem frieza.',
    sections: [
      {
        title: 'Contexto',
        text:
          'O cartão de visita é, muitas vezes, o primeiro contato físico de um escritório de arquitetura com o cliente. Ele precisava transmitir rigor técnico e bom gosto no mesmo gesto — e caber, com todas as informações de contato, em um cartão de bolso.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/vertice/mockup-01.webp', alt: 'Cartão Vértice em mãos, frente', caption: 'Frente — o cartão em mãos, na escala real de uso.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Vértice: o ponto onde duas linhas se encontram. O monograma nasce dessa geometria — um V que é também um traço de projeto — e os arcos dourados lembram o compasso na prancheta. Azul-marinho para a solidez, dourado para o acabamento, off-white para o respiro.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/vertice/verso.webp', alt: 'Verso do cartão com contatos e QR code', caption: 'Verso — contatos, registro CAU e QR code para salvar o contato.' } },
          { type: 'note', label: 'Tipografia', text: 'Serifa humanista espaçada para a marca; monoespaçada para os dados técnicos, como na prancha de um projeto.' },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'A frente carrega a marca; o verso carrega a pessoa. A faixa lateral em azul e a linha dourada costuram os dois lados, e o QR code substitui o "guarde meu número" por um toque. Tudo alinhado à mesma malha que aparece no fundo da frente.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/vertice/mockup-02.webp', alt: 'Cartão Vértice em mãos, verso', caption: 'Verso — em mãos.' } },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Um cartão que parece um objeto de arquitetura: sóbrio, preciso e agradável de segurar. A identidade se estende com facilidade para papel timbrado, assinatura de e-mail e placa de obra.',
        blocks: [
          { type: 'note', label: 'Cores', text: '#0E2232 azul-marinho · #D8A040 dourado · #ECEDEA off-white.' },
        ],
      },
    ],
  },

  {
    slug: 'americans',
    title: 'Drogaria Americans',
    subtitle: 'Mega Feirão da Saúde',
    category: 'Varejo / Tabloide',
    tags: ['Tabloide', 'Varejo', 'Diagramação', 'Impresso'],
    year: '2026',
    client: 'Drogaria Americans — campanha de aniversário',
    role: 'Diagramação · Design gráfico',
    cover: { src: '/assets/img/projects/americans/tabloide-01.webp', alt: 'Capa do tabloide Mega Feirão da Saúde' },
    summary:
      'Tabloide de ofertas para a campanha de aniversário de uma rede de drogarias: mais de duzentos itens organizados em uma grade que se lê rápido, com o preço sempre vencendo o resto.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Tabloide de farmácia é design de varejo no seu estado mais puro: muita informação, pouco espaço e um leitor com pressa. O desafio era manter a hierarquia — preço, produto, condição — sem transformar a página em ruído.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/americans/tabloide-02.webp', alt: 'Página 2 do tabloide', caption: 'Página 2 — cuidado diário, serviços gratuitos e cupom exclusivo.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Uma grade de cards iguais, com respiro entre eles, e um único ponto de cor forte por card: o preço em vermelho. O azul da marca fica no topo e no rodapé, emoldurando a página em vez de competir com os produtos.',
        blocks: [
          { type: 'note', label: 'Hierarquia', text: 'Preço → produto → condição (unidade, desconto, "leve 3 pague 2") → selo de categoria.' },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Cards com selo de categoria (genérico, oferta, promoção), preço "de/por", parcelamento e rodapé com formas de pagamento e serviços da loja. A segunda página muda o tema para "cuidado diário" e fecha com o cupom e o convite para a loja.',
        blocks: [
          { type: 'detail', image: { src: '/assets/img/projects/americans/tabloide-01.webp', alt: 'Detalhe da grade de ofertas', caption: 'Detalhe — os cards de oferta: selo, produto, preço e condição.' }, zoom: 1.55, focus: '50% 60%' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Duas páginas densas que ainda assim respiram. O olho encontra o preço em qualquer ponto da página, e a marca fica reconhecível mesmo com o tabloide dobrado na sacola.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/americans/tabloide-01.webp', alt: 'Página 1 do tabloide', caption: 'Página 1 — Mega Feirão da Saúde.' },
              { src: '/assets/img/projects/americans/tabloide-02.webp', alt: 'Página 2 do tabloide', caption: 'Página 2 — cuidado diário, serviços e cupom.' },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'lvcas',
    title: 'LVCAS',
    subtitle: 'Coca-Cola × Rock in Rio',
    category: 'Cartaz / Direção de arte',
    tags: ['Cartaz', 'Fotografia', 'Tipografia', 'Evento'],
    year: '2026',
    client: 'Coca-Cola × Rock in Rio — projeto conceitual',
    role: 'Direção de arte · Composição',
    cover: { src: '/assets/img/projects/lvcas/cartaz-01.webp', alt: 'Cartaz LVCAS — Coca-Cola × Rock in Rio' },
    summary:
      'Cartaz de show para o artista LVCAS no palco Coca-Cola do Rock in Rio. Latas gigantes, luz de palco e tipografia que sai do quadro.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Divulgar uma apresentação em um festival exige três informações — quem, onde, quando — e uma atitude. O cartaz precisava carregar a marca patrocinadora sem virar anúncio de refrigerante.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/lvcas/cartaz-01.webp', alt: 'Cartaz versão nome', caption: 'Versão 01 — o nome do artista sangra o quadro.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Escala. As latas viram cenário, o artista senta na frente delas como em um trono improvisado e o nome, em display pesada, é cortado pela borda — como se não coubesse no cartaz.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/lvcas/cartaz-01.webp', alt: 'Cartaz 01', caption: 'Versão 01 — nome.' },
              { src: '/assets/img/projects/lvcas/cartaz-02.webp', alt: 'Cartaz 02', caption: 'Versão 02 — data.' },
            ],
          },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Recorte fotográfico, sombra projetada e um flare de palco para unir os planos. As duas versões trocam apenas o elemento tipográfico principal: nome em uma, data na outra.',
        blocks: [
          { type: 'note', label: 'Sistema', text: 'Mesma composição, dois momentos: anúncio (nome) e lembrete (data).' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Um par de cartazes com presença de rua e leitura imediata. A marca aparece grande e ainda assim o artista é o protagonista.',
        blocks: [
          { type: 'full', image: { src: '/assets/img/projects/lvcas/cartaz-02.webp', alt: 'Cartaz versão data', caption: 'Versão 02 — 05·09.' } },
        ],
      },
    ],
  },

  {
    slug: 'aerion',
    title: 'Aerion Airlines',
    subtitle: 'Santorini',
    category: 'Identidade / OOH',
    tags: ['Mídia exterior', 'Outdoor', 'Identidade', 'Campanha'],
    year: '2026',
    client: 'Aerion Airlines — projeto conceitual',
    role: 'Direção de arte · Design gráfico',
    cover: { src: '/assets/img/projects/aerion/outdoor-02.webp', alt: 'Outdoor Aerion Airlines — Santorini' },
    summary:
      'Dois outdoors para uma companhia aérea fictícia: do Brasil para a Grécia em um único olhar. Uma janela azul, um mapa pontilhado e a promessa de Santorini.',
    sections: [
      {
        title: 'Contexto',
        text:
          'Mídia exterior se lê em segundos, em movimento. O briefing pedia comunicar uma rota nova — BR → GR — com a menor quantidade de informação possível e o máximo de desejo pelo destino.',
        blocks: [
          { type: 'wide', image: { src: '/assets/img/projects/aerion/outdoor-01.webp', alt: 'Outdoor 01 — Do BR para GR', caption: 'Outdoor 01 — origem, destino e horários em simetria.' } },
        ],
      },
      {
        title: 'Conceito',
        text:
          'Simetria como argumento: DO BR à esquerda, PARA GR à direita, e no centro a janela aberta de Santorini como portal. O azul das portas e do mar é a cor da marca; o branco das casas, o respiro.',
        blocks: [
          { type: 'wide', image: { src: '/assets/img/projects/aerion/outdoor-02.webp', alt: 'Outdoor 02 — Santorini com rota pontilhada', caption: 'Outdoor 02 — a rota pontilhada leva o olhar até a ilha.' } },
        ],
      },
      {
        title: 'Desenvolvimento',
        text:
          'Tipografia serifada para o nome do destino, sans condensada para os dados de voo. O bilhete de embarque, o avião e a linha pontilhada funcionam como sistema de ícones da campanha, reutilizável em outros destinos.',
        blocks: [
          { type: 'note', label: 'Sistema', text: 'Mesma estrutura, outro destino: basta trocar a foto, a sigla e o horário.' },
        ],
      },
      {
        title: 'Resultado',
        text:
          'Duas peças que se completam na rua: uma vende a rota, a outra vende o lugar. Juntas, formam a assinatura visual da Aerion.',
        blocks: [
          {
            type: 'split',
            images: [
              { src: '/assets/img/projects/aerion/outdoor-01.webp', alt: 'Outdoor 01', caption: 'Peça 01 — rota.' },
              { src: '/assets/img/projects/aerion/outdoor-02.webp', alt: 'Outdoor 02', caption: 'Peça 02 — destino.' },
            ],
          },
        ],
      },
    ],
  },
];
