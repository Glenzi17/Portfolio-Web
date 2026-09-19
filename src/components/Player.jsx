import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, reduced, touch } from '../lib/motion.js';

const fmt = (s) => {
  s = Math.max(0, Math.floor(s || 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/* Player de vídeo próprio: toca (mudo) quando entra na tela, pausa ao
   sair; respeita pause manual. Som, progresso (clique/arraste/setas) e
   tela cheia. */
export default function Player({ src, poster, caption, ratio }) {
  const boxRef = useRef(null);
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const timeRef = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const box = boxRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    const time = timeRef.current;

    const sync = () => {
      const isPlaying = !video.paused && !video.ended;
      setPlaying(isPlaying);
      setMuted(video.muted);
      video.dataset.cursor = isPlaying ? 'Pause' : 'Play';
      // Atualiza o rótulo do cursor customizado se ele estiver sobre o vídeo
      if (video.matches(':hover')) video.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    };
    const onMeta = () => { time.textContent = `00:00 / ${fmt(video.duration)}`; };
    const onTime = () => {
      if (!video.duration) return;
      const p = video.currentTime / video.duration;
      fill.style.transform = `scaleX(${p})`;
      time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
      track.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    };
    const evs = ['play', 'pause', 'ended', 'volumechange'];
    evs.forEach((ev) => video.addEventListener(ev, sync));
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('timeupdate', onTime);

    // Barra de progresso: clique/arraste
    const seek = (e) => {
      const r = track.getBoundingClientRect();
      const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
      if (video.duration) video.currentTime = x * video.duration;
    };
    const onDown = (e) => {
      e.preventDefault();
      seek(e);
      try { track.setPointerCapture(e.pointerId); } catch { /* ponteiro sintético */ }
      const move = (ev) => seek(ev);
      track.addEventListener('pointermove', move);
      track.addEventListener('pointerup', () => track.removeEventListener('pointermove', move), { once: true });
    };
    track.addEventListener('pointerdown', onDown);

    let st = null;
    if (!reduced) {
      st = ScrollTrigger.create({
        trigger: box, start: 'top 85%', end: 'bottom 15%',
        onToggle: (s) => { if (s.isActive) { if (!userPaused.current) video.play().catch(() => {}); } else video.pause(); },
      });
    }
    sync();
    if (video.readyState >= 1) onMeta();

    return () => {
      evs.forEach((ev) => video.removeEventListener(ev, sync));
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('timeupdate', onTime);
      track.removeEventListener('pointerdown', onDown);
      if (st) st.kill();
      video.pause();
    };
  }, []);

  const play = () => videoRef.current.play().catch(() => {});
  const toggle = () => {
    const video = videoRef.current;
    userPaused.current = !video.paused;
    if (video.paused) play(); else video.pause();
  };
  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    if (!video.muted && video.paused) { userPaused.current = false; play(); }
  };
  const fullscreen = () => {
    const box = boxRef.current; const video = videoRef.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (box.requestFullscreen) box.requestFullscreen().catch(() => {});
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iOS
  };
  const onTrackKey = (e) => {
    const video = videoRef.current;
    if (e.key === 'ArrowRight') { e.preventDefault(); video.currentTime = Math.min(video.currentTime + 1, video.duration || 0); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); video.currentTime = Math.max(video.currentTime - 1, 0); }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
  };

  const cls = ['plate plate--fixed plate--dark player', playing ? '' : 'is-paused', touch ? 'is-touch' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls} ref={boxRef} style={{ '--ratio': ratio }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        data-cursor="Play"
        aria-label={caption || 'Vídeo do projeto'}
        onClick={toggle}
      />
      <button className="player__big" type="button" aria-label="Reproduzir" onClick={toggle}>Play</button>
      <div className="player__bar">
        <button className="player__btn" type="button" aria-label={playing ? 'Pausar' : 'Reproduzir'} onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
        <div
          className="player__track" role="slider" tabIndex={0} aria-label="Progresso do vídeo"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} ref={trackRef} onKeyDown={onTrackKey}
        ><i className="player__fill" ref={fillRef} /></div>
        <span className="player__time label" ref={timeRef}>00:00 / 00:00</span>
        <button className="player__btn" type="button" aria-label={muted ? 'Ativar som' : 'Desativar som'} onClick={toggleMute}>{muted ? 'Som off' : 'Som on'}</button>
        <button className="player__btn" type="button" aria-label="Tela cheia" onClick={fullscreen}>Tela cheia</button>
      </div>
    </div>
  );
}
