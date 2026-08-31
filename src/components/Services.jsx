import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SERVICOS } from "../lib/content.js";
import "./Services.css";

gsap.registerPlugin(ScrollTrigger);

function ServiceCard({ index, titulo, descricao }) {
  return (
    <li className="service-card">
      <div className="service-card__header">
        <span className="service-card__number">{String(index).padStart(2, "0")}</span>
        <span className="service-card__node" aria-hidden="true" />
      </div>
      <h3 className="service-card__title">{titulo}</h3>
      <p className="service-card__description">{descricao}</p>
    </li>
  );
}

export default function Services() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".services__intro > *", ".service-card", ".service-card__node"], {
          clearProps: "opacity,transform",
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Guard against overlapping/duplicate ScrollTrigger instances fighting over the
        // same elements (which was leaving hero text stuck invisible in production).
        gsap.killTweensOf(".services__intro > *");
        gsap.from(".services__intro > *", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          onComplete: () => gsap.set(".services__intro > *", { clearProps: "opacity,transform" }),
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.utils.toArray(".service-card").forEach((card, i) => {
          gsap.killTweensOf(card);
          const node = card.querySelector(".service-card__node");
          // Camada secundária: o card entra, e o "node" (pontinho) dá um pequeno
          // pop logo depois de pousar — pequeno follow-through que evita a
          // entrada "chapada" de só opacidade+posição.
          const tl = gsap.timeline({
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
            onComplete: () => gsap.set([card, node], { clearProps: "opacity,transform" }),
          });
          tl.from(card, { opacity: 0, y: 28, duration: 0.6, ease: "power3.out" });
          if (node) {
            tl.from(node, { scale: 0, duration: 0.35, ease: "back.out(1.7)" }, "-=0.25");
          }
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="servicos" className="services" ref={root}>
      <div className="container">
        <div className="services__intro">
          <p className="eyebrow">{SERVICOS.eyebrow}</p>
          <div className="services__intro-row">
            <h2 className="services__headline">{SERVICOS.headline}</h2>
          </div>
        </div>

        <ul className="services__grid services__grid--core">
          {SERVICOS.core.map((s, i) => (
            <ServiceCard key={s.titulo} index={i + 1} {...s} />
          ))}
        </ul>

        <div className="services__connector" aria-hidden="true" />

        <ul className="services__grid services__grid--producao">
          {SERVICOS.producao.map((s, i) => (
            <ServiceCard key={s.titulo} index={i + 4} {...s} />
          ))}
        </ul>
      </div>
    </section>
  );
}
