import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PROJETOS } from "../lib/content.js";
import { IconArrowUpRight, IconChevronLeft, IconChevronRight } from "./icons.jsx";
import "./ProjectsCarousel.css";

gsap.registerPlugin(ScrollTrigger);

const covers = import.meta.glob("../assets/images/project-*.{jpg,webp}", {
  eager: true,
  import: "default",
});

function coverFor(slug, ext) {
  const match = Object.entries(covers).find(([path]) => path.includes(`project-${slug}.${ext}`));
  return match?.[1];
}

const N = PROJETOS.cards.length;
// Carrossel infinito por clonagem: renderiza [cópia][real][cópia] e, sempre
// que o scroll entra numa das cópias, salta sem animação (scrollTo "auto")
// para a posição equivalente no conjunto real — o usuário nunca percebe o
// salto porque ele acontece com o conteúdo já idêntico visualmente.
const LOOPED = [...PROJETOS.cards, ...PROJETOS.cards, ...PROJETOS.cards];

export default function ProjectsCarousel() {
  const root = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const isJumping = useRef(false);

  useGSAP(
    () => {
      // Só o bloco "real" (não clonado) participa da animação de entrada —
      // as cópias usadas pelo loop infinito ficam fora da viewport inicial
      // e não devem competir no stagger.
      const realCards = ".project-card:not([aria-hidden='true'])";
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".projects__intro > *", realCards], { clearProps: "opacity,transform" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Guard against overlapping/duplicate ScrollTrigger instances fighting over the
        // same elements (which was leaving hero text stuck invisible in production).
        gsap.killTweensOf([".projects__intro > *", realCards]);
        gsap.from(".projects__intro > *", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          onComplete: () => gsap.set(".projects__intro > *", { clearProps: "opacity,transform" }),
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.from(realCards, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: () => gsap.set(realCards, { clearProps: "opacity,transform" }),
          scrollTrigger: { trigger: trackRef.current, start: "top 82%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  // Lê a posição real de cada card no DOM (offsetLeft) em vez de tentar
  // calcular "largura do card + gap" na mão — mais robusto contra o padding
  // de alinhamento (.projects__track-pad) e o scroll-snap do CSS, que já
  // decide a posição final de cada rolagem por conta própria.
  const cardsOf = (el) => el.querySelectorAll(".project-card");
  const scrollTimeout = useRef(null);

  const currentIndexOf = (el) => {
    const cards = cardsOf(el);
    let closest = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - el.scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        closest = i;
      }
    });
    return closest;
  };

  // Posiciona o scroll no início do bloco "real" (o do meio) sem animação,
  // assim que o carrossel monta — antes disso o layout começa exatamente
  // como se fosse o primeiro card, sem flash do bloco clonado.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const cards = cardsOf(el);
    if (cards[N]) el.scrollTo({ left: cards[N].offsetLeft, behavior: "auto" });
    setActive(0);
  }, []);

  // Realinhamento instantâneo pro bloco "real": só roda depois que o scroll
  // (incluindo a animação suave do smooth-scroll) realmente terminou — nunca
  // no meio da animação, senão o realinhamento corta a transição e o salto
  // fica visível. Usa "scrollend" quando disponível; senão cai pra um
  // debounce (o scroll para de disparar eventos ~100ms depois de terminar).
  const realign = () => {
    const el = trackRef.current;
    if (!el || isJumping.current) return;
    const cards = cardsOf(el);
    const idx = currentIndexOf(el);
    if (idx < N || idx >= N * 2) {
      const equivalent = ((idx % N) + N) % N;
      isJumping.current = true;
      el.scrollTo({ left: cards[N + equivalent].offsetLeft, behavior: "auto" });
      setActive(equivalent);
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    } else {
      setActive(idx - N);
    }
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || isJumping.current) return;
    // Feedback visual do dot em tempo real, sem disparar realinhamento aqui.
    const idx = currentIndexOf(el);
    setActive(((idx % N) + N) % N);

    if (!("onscrollend" in window)) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(realign, 120);
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    if ("onscrollend" in window) {
      el.addEventListener("scrollend", realign, { passive: true });
    }
    window.addEventListener("resize", realign);
    return () => {
      el.removeEventListener("scroll", onScroll);
      if ("onscrollend" in window) {
        el.removeEventListener("scrollend", realign);
      }
      window.removeEventListener("resize", realign);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cards = cardsOf(el);
    const idx = currentIndexOf(el);
    const target = Math.min(Math.max(idx + dir, 0), cards.length - 1);
    el.scrollTo({ left: cards[target].offsetLeft, behavior: "smooth" });
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const cards = cardsOf(el);
    if (cards[N + i]) el.scrollTo({ left: cards[N + i].offsetLeft, behavior: "smooth" });
  };

  return (
    <section id="projetos" className="projects" ref={root}>
      <div className="container">
        <div className="projects__intro">
          <p className="eyebrow">{PROJETOS.eyebrow}</p>
          <div className="projects__intro-row">
            <h2 className="projects__headline">{PROJETOS.headline}</h2>
            <div className="projects__nav" role="group" aria-label="Navegar projetos">
              <button
                type="button"
                className="projects__nav-btn"
                onClick={() => scrollByCard(-1)}
                aria-label="Projeto anterior"
              >
                <IconChevronLeft width={18} height={18} />
              </button>
              <button
                type="button"
                className="projects__nav-btn projects__nav-btn--primary"
                onClick={() => scrollByCard(1)}
                aria-label="Próximo projeto"
              >
                <IconChevronRight width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="projects__track" ref={trackRef}>
        <div className="projects__track-pad" aria-hidden="true" />
        {LOOPED.map((card, i) => {
          const isClone = i < N || i >= N * 2;
          return (
            <article className="project-card" key={`${card.slug}-${i}`} aria-hidden={isClone ? "true" : undefined}>
              <a
                className="project-card__media"
                href={`#projeto-${card.slug}`}
                aria-label={`Ver detalhes do projeto ${card.nome}`}
                tabIndex={isClone ? -1 : undefined}
              >
                <picture>
                  <source srcSet={coverFor(card.slug, "webp")} type="image/webp" />
                  <img src={coverFor(card.slug, "jpg")} alt={`Capa do projeto ${card.nome}`} loading="lazy" />
                </picture>
              </a>
              <div className="project-card__info">
                <div className="project-card__title-row">
                  <h3>{card.nome}</h3>
                  <a
                    className="project-card__arrow"
                    href={`#projeto-${card.slug}`}
                    aria-label={`Abrir projeto ${card.nome}`}
                    tabIndex={isClone ? -1 : undefined}
                  >
                    <IconArrowUpRight width={16} height={16} />
                  </a>
                </div>
                <p className="project-card__context">{card.contexto}</p>
                <span className="project-card__role">[{card.papel}]</span>
              </div>
            </article>
          );
        })}
        <div className="projects__track-pad" aria-hidden="true" />
      </div>

      <div className="container">
        <div className="projects__pagination" role="tablist" aria-label="Selecionar projeto">
          {PROJETOS.cards.map((card, i) => (
            <button
              key={card.slug}
              role="tab"
              aria-selected={active === i}
              aria-label={`Ir para o projeto ${card.nome}`}
              className={`projects__dot ${active === i ? "is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
