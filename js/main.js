/* =========================================================
   MAIN — comportamento compartilhado (home + projeto)
   smooth scroll · navbar · menu · cursor · magnetic ·
   reveals · parallax · transições de página · helpers
   ========================================================= */
(function () {
  'use strict';

  const App = (window.App = {});
  const doc = document.documentElement;
  const body = document.body;

  App.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  App.touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  App.ease = 'expo.out';
  App.easeIO = 'power4.inOut';

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: App.ease, duration: 1 });

  /* ---------- Smooth scroll (Lenis) ---------- */
  App.lenis = null;
  if (!App.reduced && window.Lenis) {
    App.lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true });
    App.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => App.lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  App.scrollTo = (target, opts = {}) => {
    if (App.lenis) App.lenis.scrollTo(target, { offset: -8, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts });
    else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) el.scrollIntoView({ behavior: App.reduced ? 'auto' : 'smooth' });
      else window.scrollTo({ top: typeof target === 'number' ? target : 0, behavior: 'smooth' });
    }
  };

  /* ---------- Navbar ---------- */
  const nav = document.getElementById('nav');
  const menu = document.getElementById('menu');
  const toggle = document.querySelector('.nav__toggle');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  App.closeMenu = () => {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    if (App.lenis) App.lenis.start();
    body.style.overflow = '';
  };
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      if (!open) return App.closeMenu();
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      if (App.lenis) App.lenis.stop();
      body.style.overflow = 'hidden';
    });
    document.addEventListener('keydown', (e) => e.key === 'Escape' && App.closeMenu());
  }

  // Navbar inverte sobre seções escuras ([data-dark])
  const darkActive = new Set();
  document.querySelectorAll('[data-dark]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 40px', end: 'bottom 40px',
      onToggle: (self) => {
        self.isActive ? darkActive.add(sec) : darkActive.delete(sec);
        nav.classList.toggle('is-dark', darkActive.size > 0);
      },
    });
  });

  /* ---------- Links âncora ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    App.closeMenu();
    // No menu mobile, espera fechar antes de rolar
    setTimeout(() => App.scrollTo(target), menu && menu.classList.contains('is-open') ? 350 : 0);
    history.replaceState(null, '', id);
  });

  /* ---------- Cursor customizado ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && !App.touch && !App.reduced) {
    body.classList.add('has-cursor');
    const label = cursor.querySelector('.cursor__label');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let shown = false;
    window.addEventListener('mousemove', (e) => {
      target.x = e.clientX; target.y = e.clientY;
      if (!shown) { shown = true; pos.x = target.x; pos.y = target.y; cursor.classList.add('is-visible'); }
    }, { passive: true });
    gsap.ticker.add(() => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    });
    document.addEventListener('mouseover', (e) => {
      const view = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, [role="button"], input, textarea, label');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-link', !view && !!link);
      cursor.classList.toggle('is-hidden', !!e.target.closest('input, textarea'));
      if (view) label.innerHTML = view.dataset.cursor || 'View<br>project';
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
  }

  /* ---------- Botões magnéticos ---------- */
  if (!App.touch && !App.reduced) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Reveals genéricos ---------- */
  App.initReveals = (scope = document) => {
    if (App.reduced) return;
    // Elementos colados ao fim da página (footer) nunca chegam a 90% do
    // viewport — para eles o gatilho é simplesmente "entrou na tela".
    const startFor = (el, pct) => (el.closest('.footer') ? 'top bottom' : `top ${pct}%`);

    // Linhas em máscara (títulos)
    const lineGroups = new Map();
    scope.querySelectorAll('[data-lines]').forEach((line) => {
      const parent = line.parentElement;
      if (!lineGroups.has(parent)) lineGroups.set(parent, []);
      lineGroups.get(parent).push(line.querySelector('span'));
    });
    lineGroups.forEach((spans, parent) => {
      // y: 0 zera o translateY(110%) do CSS, que o GSAP lê como px
      gsap.fromTo(spans, { yPercent: 125, y: 0 }, {
        yPercent: 0, y: 0, duration: 1.2, stagger: 0.09,
        scrollTrigger: { trigger: parent, start: 'top 88%', once: true },
      });
    });

    // Fade up + blur → sharp
    scope.querySelectorAll('[data-reveal]').forEach((el) => {
      const dir = el.dataset.reveal || 'up';
      const from = { opacity: 0, y: dir === 'up' ? 28 : dir === 'down' ? -20 : 0, filter: 'blur(6px)' };
      gsap.fromTo(el, from, {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, clearProps: 'filter',
        scrollTrigger: { trigger: el, start: startFor(el, 90), once: true },
      });
    });

    // Grupo com stagger
    scope.querySelectorAll('[data-reveal-group]').forEach((group) => {
      const items = [...group.children];
      gsap.fromTo(items, { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.07,
        scrollTrigger: { trigger: group, start: startFor(group, 88), once: true },
      });
    });

    // Parallax sutil
    scope.querySelectorAll('[data-parallax]').forEach((el) => {
      const amt = parseFloat(el.dataset.parallax) || 0.1;
      gsap.fromTo(el, { yPercent: -amt * 100 }, {
        yPercent: amt * 100, ease: 'none',
        scrollTrigger: { trigger: el.closest('section, figure, .work__item') || el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Reveal de imagens (clip + escala). No fim, limpa o transform inline para
    // o hover (CSS) voltar a valer.
    scope.querySelectorAll('.img-reveal').forEach((fig) => {
      const media = fig.querySelector('.plate > img, .plate > video');
      const isDetail = fig.classList.contains('blk--detail');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: fig, start: 'top 85%', once: true },
        onComplete: () => { fig.classList.add('is-revealed'); gsap.set([fig, media].filter(Boolean), { clearProps: 'clipPath,transform' }); },
      });
      tl.to(fig, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out' });
      if (media && !isDetail) tl.to(media, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
      if (media && isDetail) tl.to(media, { scale: parseFloat(fig.style.getPropertyValue('--zoom')) || 1.5, duration: 1.6, ease: 'power3.out' }, 0);
    });

    // Linhas que se desenham ([data-line]) — as do hero são disparadas pela intro
    scope.querySelectorAll('[data-line]').forEach((el) => {
      if (el.closest('.hero')) return;
      ScrollTrigger.create({ trigger: el, start: startFor(el, 92), once: true, onEnter: () => el.classList.add('is-in') });
    });
  };

  /* ---------- Player de vídeo próprio ---------- */
  // Markup: .player[data-player] > video + .player__big + .player__bar
  // Toca (mudo) quando entra na tela, pausa ao sair; respeita pause manual.
  App.initPlayers = (scope = document) => {
    const fmt = (s) => {
      s = Math.max(0, Math.floor(s || 0));
      return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    };
    scope.querySelectorAll('[data-player]').forEach((box) => {
      const video = box.querySelector('video');
      const playBtn = box.querySelector('[data-act="play"]');
      const muteBtn = box.querySelector('[data-act="mute"]');
      const fsBtn = box.querySelector('[data-act="fs"]');
      const track = box.querySelector('.player__track');
      const fill = box.querySelector('.player__fill');
      const time = box.querySelector('.player__time');
      let userPaused = false;

      const sync = () => {
        const playing = !video.paused && !video.ended;
        box.classList.toggle('is-paused', !playing);
        playBtn.textContent = playing ? 'Pause' : 'Play';
        playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproduzir');
        muteBtn.textContent = video.muted ? 'Som off' : 'Som on';
        muteBtn.setAttribute('aria-label', video.muted ? 'Ativar som' : 'Desativar som');
        video.dataset.cursor = playing ? 'Pause' : 'Play';
        // Atualiza o rótulo do cursor customizado se ele estiver sobre o vídeo
        if (video.matches(':hover')) video.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      };
      const play = () => video.play().catch(() => {});
      const toggle = () => { userPaused = !video.paused; if (video.paused) play(); else video.pause(); };

      ['play', 'pause', 'ended', 'volumechange'].forEach((ev) => video.addEventListener(ev, sync));
      video.addEventListener('loadedmetadata', () => { time.textContent = `00:00 / ${fmt(video.duration)}`; });
      video.addEventListener('timeupdate', () => {
        if (!video.duration) return;
        const p = video.currentTime / video.duration;
        fill.style.transform = `scaleX(${p})`;
        time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
        track.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      });

      video.addEventListener('click', toggle);
      box.querySelector('.player__big').addEventListener('click', toggle);
      playBtn.addEventListener('click', toggle);
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (!video.muted && video.paused) { userPaused = false; play(); }
      });
      fsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (box.requestFullscreen) box.requestFullscreen().catch(() => {});
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iOS
      });

      // Barra de progresso: clique/arraste e setas
      const seek = (e) => {
        const r = track.getBoundingClientRect();
        const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
        if (video.duration) video.currentTime = x * video.duration;
      };
      track.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        seek(e);
        try { track.setPointerCapture(e.pointerId); } catch (_) { /* ponteiro sintético */ }
        const move = (ev) => seek(ev);
        track.addEventListener('pointermove', move);
        track.addEventListener('pointerup', () => track.removeEventListener('pointermove', move), { once: true });
      });
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); video.currentTime = Math.min(video.currentTime + 1, video.duration || 0); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); video.currentTime = Math.max(video.currentTime - 1, 0); }
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
      });

      if (App.touch) box.classList.add('is-touch');
      if (!App.reduced) {
        ScrollTrigger.create({
          trigger: box, start: 'top 85%', end: 'bottom 15%',
          onToggle: (s) => { if (s.isActive) { if (!userPaused) play(); } else video.pause(); },
        });
      }
      sync();
    });
  };

  /* ---------- Transições de página ---------- */
  const curtain = document.querySelector('.curtain');
  const curtainLabel = curtain && curtain.querySelector('.curtain__label');
  const preloader = document.querySelector('.preloader');

  App.leaveTo = (href, labelText = '', origin = null) => {
    if (App.reduced || !curtain) { location.href = href; return; }
    if (curtainLabel) curtainLabel.textContent = labelText;
    sessionStorage.setItem('gl-transition', '1');
    if (App.lenis) App.lenis.stop();
    const tl = gsap.timeline()
      .set(curtain, { pointerEvents: 'auto' })
      .to(curtain, { y: '0%', duration: 0.8, ease: App.easeIO })
      .to(curtainLabel, { opacity: 1, duration: 0.3 }, '-=0.3')
      .add(() => { location.href = href; }, '+=0.05');
    // Se veio de um card de projeto, a imagem "avança" enquanto a cortina sobe
    const media = origin && origin.querySelector('.plate > img');
    if (media) tl.to(media, { scale: 1.06, duration: 0.9, ease: 'power3.out' }, 0);
  };

  // Links internos para outras páginas (.html) usam a cortina
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-transition]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    e.preventDefault();
    App.leaveTo(a.getAttribute('href'), a.dataset.transition, a);
  });

  // Entrada: preloader (primeira visita) ou cortina (vindo de outra página)
  App.enter = (ready) => {
    const cameFromTransition = sessionStorage.getItem('gl-transition') === '1';
    sessionStorage.removeItem('gl-transition');
    const seen = sessionStorage.getItem('gl-seen') === '1';
    sessionStorage.setItem('gl-seen', '1');

    // A navbar entra junto com o conteúdo, em qualquer página
    const onReady = () => {
      if (!App.reduced) gsap.fromTo(nav, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 1, delay: 0.15, clearProps: 'transform' });
      ready();
    };

    if (App.reduced) { preloader && preloader.remove(); curtain && (curtain.style.display = 'none'); gsap.set(nav, { opacity: 1 }); ready(); return; }

    if (cameFromTransition && curtain) {
      // A cortina já "está" cobrindo: mostra-a e revela a página
      preloader && preloader.remove();
      gsap.set(curtain, { y: '0%' });
      gsap.timeline({ delay: 0.15 })
        .add(onReady, 0.1)
        .to(curtain, { y: '-100%', duration: 0.9, ease: App.easeIO }, 0)
        .set(curtain, { y: '100%', pointerEvents: 'none' });
      return;
    }

    if (!preloader || seen) { preloader && preloader.remove(); onReady(); return; }

    const count = preloader.querySelector('.preloader__count');
    const bar = preloader.querySelector('.preloader__bar i');
    const n = { v: 0 };
    if (App.lenis) App.lenis.stop();
    gsap.timeline({ onComplete: () => { preloader.remove(); if (App.lenis) App.lenis.start(); } })
      .to(n, { v: 100, duration: 0.9, ease: 'power2.inOut', onUpdate: () => (count.textContent = String(Math.round(n.v)).padStart(2, '0')) })
      .to(bar, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to([count, bar], { opacity: 0, duration: 0.25 }, '+=0.05')
      .to(preloader, { yPercent: -100, duration: 0.8, ease: App.easeIO }, '-=0.1')
      .add(onReady, '-=0.5');
  };

  /* ---------- Helpers de mídia ---------- */
  App.escape = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  App.placeholder = (img = {}, index = '') => `
    <div class="ph" role="img" aria-label="${App.escape(img.label || 'Imagem')} (placeholder)">
      <span class="label ph__label">${App.escape(img.label || 'Image')}</span>
      <span class="ph__num" aria-hidden="true">${index}</span>
    </div>`;

  // Proporção (largura/altura) de uma peça: ratio explícito ('16/9' ou número)
  // → dimensões reais em js/media.js (gerado por tools/media.py) → 4:5.
  App.mediaRatio = (src) => {
    const d = src && window.MEDIA && window.MEDIA[src];
    return d ? d[0] / d[1] : 0;
  };
  App.ratioOf = (img = {}, opts = {}) => {
    const r = opts.ratio || (img && img.ratio);
    if (typeof r === 'number') return r;
    if (r) { const [a, b] = String(r).split('/').map(Number); if (a && b) return a / b; }
    return App.mediaRatio(img && img.src) || 0.8;
  };

  // Prancha: a peça aparece inteira (object-fit: contain) sobre um fundo neutro,
  // e a prancha assume a proporção da própria peça (ver App.ratioOf).
  // img.bleed = true → a imagem preenche a prancha (cover), para fotos/mockups.
  // img.tone = 'dark' → prancha escura.
  App.plate = (img = {}, index = '', opts = {}) => {
    img = img || {};
    // Proporção fixa (a mídia preenche em absoluto) quando não há imagem,
    // quando ela deve sangrar ou quando um ratio foi forçado.
    const fixed = !img.src || img.bleed || opts.ratio || img.ratio;
    const cls = ['plate', fixed ? 'plate--fixed' : '', img.bleed ? 'plate--bleed' : '', img.tone === 'dark' ? 'plate--dark' : '', opts.cls || ''].join(' ').trim();
    const style = ` style="--ratio:${App.ratioOf(img, opts).toFixed(4)}"`;
    const dims = img.src && window.MEDIA && window.MEDIA[img.src];
    const inner = img.src
      ? `<img src="${img.src}" alt="${App.escape(img.alt || '')}"${dims ? ` width="${dims[0]}" height="${dims[1]}"` : ''} loading="lazy" decoding="async">`
      : App.placeholder(img, index);
    return `<div class="${cls}"${style}>${inner}</div>`;
  };

  /* ---------- Formulário ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.nome || !data.email || !data.mensagem) { status.textContent = 'Preencha nome, e-mail e mensagem.'; return; }
      const endpoint = (window.SITE && window.SITE.formEndpoint) || '';
      if (!endpoint) {
        const subject = encodeURIComponent(`Contato pelo portfólio — ${data.nome}`);
        const bodyTxt = encodeURIComponent(`${data.mensagem}\n\n— ${data.nome}\n${data.email}${data.telefone ? '\n' + data.telefone : ''}`);
        location.href = `mailto:${window.SITE.email}?subject=${subject}&body=${bodyTxt}`;
        status.textContent = 'Abrindo seu e-mail…';
        return;
      }
      status.textContent = 'Enviando…';
      try {
        const r = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        status.textContent = r.ok ? 'Mensagem enviada. Obrigado!' : 'Não foi possível enviar. Tente por e-mail.';
        if (r.ok) form.reset();
      } catch { status.textContent = 'Não foi possível enviar. Tente por e-mail.'; }
    });
  }

  /* ---------- Resize: recalcula triggers ---------- */
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
})();
