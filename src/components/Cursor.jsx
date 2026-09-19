import { useEffect, useRef } from 'react';
import { gsap, reduced, touch } from '../lib/motion.js';

/* Cursor customizado (desktop): ponto que cresce sobre links e vira
   "View project" sobre elementos com [data-cursor]. */
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || touch || reduced) return undefined;
    document.body.classList.add('has-cursor');
    const label = cursor.querySelector('.cursor__label');
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let shown = false;

    const onMove = (e) => {
      target.x = e.clientX; target.y = e.clientY;
      if (!shown) { shown = true; pos.x = target.x; pos.y = target.y; cursor.classList.add('is-visible'); }
    };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    const onOver = (e) => {
      const view = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, [role="button"], input, textarea, label');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-link', !view && !!link);
      cursor.classList.toggle('is-hidden', !!e.target.closest('input, textarea'));
      if (view) label.innerHTML = view.dataset.cursor || 'View<br>project';
    };
    const onLeave = () => cursor.classList.remove('is-visible');
    const onEnter = () => cursor.classList.add('is-visible');

    window.addEventListener('mousemove', onMove, { passive: true });
    gsap.ticker.add(tick);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(tick);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  if (touch || reduced) return null;
  return (
    <div className="cursor" aria-hidden="true" ref={ref}>
      <span className="cursor__label">View<br />project</span>
    </div>
  );
}
