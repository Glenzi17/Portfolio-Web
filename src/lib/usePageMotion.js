import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './motion.js';

/* Roda `setup(scopeEl)` dentro de um gsap.context assim que a página
   está pronta (depois do preloader / cortina) e reverte tudo — tweens,
   ScrollTriggers, estilos inline — quando a página desmonta. */
export function usePageMotion(ready, scopeRef, setup) {
  useEffect(() => {
    if (!ready || !scopeRef.current) return undefined;
    const scope = scopeRef.current;
    const ctx = gsap.context(() => setup(scope), scope);
    ScrollTrigger.clearScrollMemory(); // não restaurar a posição da página anterior
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      // Estado imperativo que os triggers deixam na navbar
      const nav = document.getElementById('nav');
      if (nav) nav.classList.remove('is-dark');
      document.querySelectorAll('.nav__link.is-active').forEach((a) => a.classList.remove('is-active'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
}
