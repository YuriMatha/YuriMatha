import { useEffect, useRef, useState } from "react";

/**
 * Efeito "máquina de escrever": revela `text` um caractere por vez, depois de
 * um atraso inicial. Usado no headline do Hero (ver Hero.jsx) — imitando o
 * efeito pedido pelo usuário (typewriter de uma mensagem, como uma resposta
 * sendo digitada em tempo real).
 *
 * Acessibilidade: usuários com `prefers-reduced-motion: reduce` recebem o
 * texto inteiro de uma vez, sem a animação caractere a caractere (mesmo
 * princípio já aplicado nas outras animações do site via gsap.matchMedia).
 */
export function useTypewriter(text, { speed = 38, startDelay = 600 } = {}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [displayed, setDisplayed] = useState(prefersReducedMotion ? text : "");
  const [done, setDone] = useState(prefersReducedMotion);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);
    let i = 0;

    const startId = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(intervalRef.current);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startId);
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay]);

  return { displayed, done };
}
