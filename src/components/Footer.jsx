import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Logo from "./Logo.jsx";
import { FOOTER } from "../lib/content.js";
import { IconInstagram, IconLinkedIn } from "./icons.jsx";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = { LinkedIn: IconLinkedIn, Instagram: IconInstagram };

export default function Footer() {
  const root = useRef(null);

  useGSAP(
    () => {
      const targets = [".site-footer .logo", ".site-footer__copy", ".site-footer__social li"];
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, { clearProps: "opacity,transform" });
      });

      // O footer era a única seção da página sem nenhuma entrada — todas as
      // outras (Hero, Sobre mim, Serviços, Projetos, Contato) revelam o
      // conteúdo ao entrar na tela; o footer só "aparecia" de repente,
      // quebrando a consistência do resto da página.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.killTweensOf(targets);
        gsap.from(targets, {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          onComplete: () => gsap.set(targets, { clearProps: "opacity,transform" }),
          scrollTrigger: { trigger: root.current, start: "top 92%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <footer className="site-footer" ref={root}>
      <div className="container site-footer__bar">
        <Logo tone="light" />
        <p className="site-footer__copy">{FOOTER.copy}</p>
        <ul className="site-footer__social">
          {FOOTER.redes.map((rede) => {
            const Icon = SOCIAL_ICONS[rede.nome];
            return (
              <li key={rede.nome}>
                {rede.href ? (
                  <a href={rede.href} target="_blank" rel="noreferrer" aria-label={rede.nome}>
                    <Icon width={18} height={18} />
                  </a>
                ) : (
                  <span className="site-footer__social-pending" aria-hidden="true" title={`${rede.nome} — link pendente`}>
                    <Icon width={18} height={18} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
