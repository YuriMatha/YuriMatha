import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HERO, SITE } from "../lib/content.js";
import heroPosterJpg from "../assets/images/hero-poster.jpg";
import heroVideoMp4 from "../assets/video/hero-silhouette.mp4";
import heroVideoWebm from "../assets/video/hero-silhouette.webm";
import "./Hero.css";

const HERO_ANIM_TARGETS = [
  ".hero__eyebrow-line",
  ".hero__headline .word",
  ".hero__subheadline",
  ".hero__actions > *",
  ".hero__portrait",
];

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // prefers-reduced-motion: mostra tudo no estado final, sem posição/escala
      // animando — o CSS global (global.css) já neutraliza transition/animation
      // no resto do site, mas isso não afeta tweens do GSAP (que interpolam
      // estilo via JS a cada frame), então sem isso o Hero ainda animava
      // normalmente para quem pediu menos movimento ao sistema operacional.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(HERO_ANIM_TARGETS, { clearProps: "opacity,transform" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Guard against overlapping/duplicate timelines (e.g. a fast remount) fighting
        // over the same elements, which was leaving text stuck at opacity:0 in production.
        gsap.killTweensOf(HERO_ANIM_TARGETS);

        const revealFinalState = () => {
          // Kill first: if the tween is still mid-flight when this fires, killing it
          // stops it from re-rendering over the values we're about to force.
          gsap.killTweensOf(HERO_ANIM_TARGETS);
          gsap.set(HERO_ANIM_TARGETS, { clearProps: "opacity,transform" });
        };

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: revealFinalState,
        });
        tl.from(".hero__eyebrow-line", { opacity: 0, y: 12, duration: 0.5 })
          .from(".hero__headline .word", { opacity: 0, y: "0.6em", stagger: 0.012, duration: 0.7 }, "-=0.2")
          .from(".hero__subheadline", { opacity: 0, y: 16, duration: 0.6 }, "-=0.35")
          .from(".hero__actions > *", { opacity: 0, y: 14, stagger: 0.08, duration: 0.5 }, "-=0.35")
          .from(".hero__portrait", { opacity: 0, scale: 1.04, duration: 1 }, "-=0.9");

        // Safety net: whatever happens (a stalled tab, a race on load, an interrupted
        // tween), never let the hero text stay invisible for real visitors.
        const safety = setTimeout(revealFinalState, 2500);

        // Camada ambiente: o glow radial atrás da silhueta "respira" bem devagar
        // e sutilmente (opacidade + escala) — sem isso a cena fica "chapada"
        // (só a entrada, sem vida de fundo). Transform+opacity puros, custo de
        // GPU desprezível, não reintroduz o problema de performance do vídeo.
        gsap.to(".hero__glow", {
          scale: 1.08,
          opacity: 0.85,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center center",
        });

        return () => clearTimeout(safety);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const words = HERO.headline.split(" ");

  return (
    <section id="inicio" className="hero" ref={root}>
      <div className="hero__bg" aria-hidden="true">
        <video
          className="hero__portrait"
          autoPlay
          muted
          loop
          playsInline
          poster={heroPosterJpg}
        >
          <source src={heroVideoWebm} type="video/webm" />
          <source src={heroVideoMp4} type="video/mp4" />
        </video>
        <div className="hero__glow" />
        <div className="hero__vignette" />
      </div>

      <div className="container hero__content" id="conteudo">
        <p className="eyebrow hero__eyebrow-line">Yuri Matha — UX/UI</p>
        <h1 className="hero__headline">
          {words.map((w, i) => (
            <span className="word" key={i}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        <p className="hero__subheadline">{HERO.subheadline}</p>
        <div className="hero__actions">
          <a
            href="#projetos"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {HERO.ctaPrimary}
          </a>
          <a href={SITE.whatsappHref} className="btn btn-secondary" target="_blank" rel="noreferrer">
            {HERO.ctaSecondary}
          </a>
        </div>
      </div>

      <a
        href="#sobre-mim"
        className="hero__scroll-cue"
        aria-label="Rolar para a seção Sobre mim"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("#sobre-mim")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span />
      </a>
    </section>
  );
}
