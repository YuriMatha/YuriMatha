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

export default function ProjectsCarousel() {
  const root = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useGSAP(
    () => {
      // Guard against overlapping/duplicate ScrollTrigger instances fighting over the
      // same elements (which was leaving hero text stuck invisible in production).
      gsap.killTweensOf([".projects__intro > *", ".project-card"]);
      gsap.from(".projects__intro > *", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        onComplete: () => gsap.set(".projects__intro > *", { clearProps: "opacity,transform" }),
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".project-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        onComplete: () => gsap.set(".project-card", { clearProps: "opacity,transform" }),
        scrollTrigger: { trigger: trackRef.current, start: "top 82%" },
      });
    },
    { scope: root }
  );

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
    const cardWidth = el.firstChild ? el.firstChild.getBoundingClientRect().width + 24 : 1;
    setActive(Math.round(el.scrollLeft / cardWidth));
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, []);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstChild.getBoundingClientRect().width + 24;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstChild.getBoundingClientRect().width + 24;
    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
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
                disabled={atStart}
                aria-label="Projeto anterior"
              >
                <IconChevronLeft width={18} height={18} />
              </button>
              <button
                type="button"
                className="projects__nav-btn projects__nav-btn--primary"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
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
        {PROJETOS.cards.map((card) => (
          <article className="project-card" key={card.slug}>
            <a
              className="project-card__media"
              href={`#projeto-${card.slug}`}
              aria-label={`Ver detalhes do projeto ${card.nome}`}
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
                >
                  <IconArrowUpRight width={16} height={16} />
                </a>
              </div>
              <p className="project-card__context">{card.contexto}</p>
              <span className="project-card__role">[{card.papel}]</span>
            </div>
          </article>
        ))}
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
