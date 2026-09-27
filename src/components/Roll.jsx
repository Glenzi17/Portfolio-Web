/* Texto que "rola" no hover do link/botão pai: a cópia (text-shadow)
   sobe de baixo enquanto o original sai por cima. Só visual — o texto
   real continua um nó só, então leitores de tela leem uma vez. */
export default function Roll({ children }) {
  return <span className="roll"><span>{children}</span></span>;
}
