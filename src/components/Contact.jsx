import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { CONTATO } from "../lib/content.js";
import { IconArrowRight, IconCheck, IconMail, IconPhone } from "./icons.jsx";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

const ICONS = { email: IconMail, whatsapp: IconPhone };

export default function Contact() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".contact__left > *", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".contact__conversion-card", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="contato" className="contact" ref={root}>
      <span className="contact__watermark" aria-hidden="true">
        CONTATO
      </span>
      <div className="container contact__grid">
        <div className="contact__left">
          <p className="eyebrow">{CONTATO.eyebrow}</p>
          <h2 className="contact__headline">{CONTATO.headline}</h2>
          <p className="contact__subheadline">{CONTATO.subheadline}</p>

          <ul className="contact__cards">
            {CONTATO.cards.map((card) => {
              const Icon = ICONS[card.tipo];
              return (
                <li className="contact-card" key={card.tipo}>
                  <div className="contact-card__info">
                    <span className="contact-card__icon">
                      <Icon width={18} height={18} />
                    </span>
                    <span>
                      <span className="contact-card__label">{card.label}</span>
                      <span className="contact-card__value">{card.valor}</span>
                    </span>
                  </div>
                  <a
                    className="contact-card__action"
                    href={card.href}
                    target={card.tipo === "whatsapp" ? "_blank" : undefined}
                    rel={card.tipo === "whatsapp" ? "noreferrer" : undefined}
                  >
                    {card.acao}
                    <IconArrowRight width={15} height={15} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="contact__conversion-card">
          <div className="contact__conversion-badge-row">
            <span className="contact__conversion-badge">{CONTATO.conversao.badge}</span>
            <span className="contact__pulse" aria-hidden="true" />
          </div>
          <h3 className="contact__conversion-headline">{CONTATO.conversao.headline}</h3>
          <hr className="contact__divider" />
          <ul className="contact__promises">
            {CONTATO.conversao.promessas.map((p) => (
              <li key={p}>
                <IconCheck width={16} height={16} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <a
            className="btn btn-accent"
            href={CONTATO.cards.find((c) => c.tipo === "whatsapp").href}
            target="_blank"
            rel="noreferrer"
          >
            {CONTATO.conversao.cta}
          </a>
          <p className="contact__conversion-note">{CONTATO.conversao.nota}</p>
        </div>
      </div>
    </section>
  );
}
