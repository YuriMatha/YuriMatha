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
        <span className="service-card__number">SERVICE_{String(index).padStart(2, "0")}</span>
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
      gsap.from(".services__intro > *", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.utils.toArray(".service-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: "power3.out",
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
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
            <p className="services__tags">
              {SERVICOS.tags.join(" ")}
            </p>
          </div>
        </div>

        <ul className="services__grid services__grid--core">
          {SERVICOS.core.map((s, i) => (
            <ServiceCard key={s.titulo} index={i + 1} {...s} />
          ))}
        </ul>

        <div className="services__connector">
          <span>{SERVICOS.conector}</span>
        </div>

        <ul className="services__grid services__grid--producao">
          {SERVICOS.producao.map((s, i) => (
            <ServiceCard key={s.titulo} index={i + 4} {...s} />
          ))}
        </ul>
      </div>
    </section>
  );
}
