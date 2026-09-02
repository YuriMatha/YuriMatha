import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HERO, SITE } from "../lib/content.js";
import { useTypewriter } from "../lib/useTypewriter.js";
import heroVideoMp4 from "../assets/video/hero-silhouette.mp4";
import heroVideoWebm from "../assets/video/hero-silhouette.webm";
import "./Hero.css";

const HERO_ANIM_TARGETS = [".hero__subheadline", ".hero__portrait"];

export default function Hero() {
  const root = useRef(null);
  const videoRef = useRef(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const { displayed: typedHeadline, done: typingDone } = useTypewriter(HERO.headline, {
    speed: 38,
    startDelay: 600,
  });

  // Botões de ação: entram sozinhos 400ms após o carregamento, sem esperar o
  // headline terminar de "digitar" — pedido explícito do usuário pra essa
  // entrada ser independente do typewriter.
  useEffect(() => {
    const id = setTimeout(() => setActionsVisible(true), 400);
    return () => clearTimeout(id);
  }, []);

  // O vídeo antes era controlado pelo movimento do mouse ("scrub"), mas esse
  // efeito se mostrou inconsistente entre máquinas/navegadores em várias
  // rodadas de ajuste (dependia de currentTime/seek se comportar igual em
  // todo lugar, o que não é garantido). Pedido explícito do usuário: se não
  // der pra deixar 100%, é preferível o vídeo simplesmente rodando sozinho
  // (autoplay em loop) a manter um efeito quebrado. Mais simples, e
  // consistente em qualquer navegador/dispositivo.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    // "muted" via atributo JSX às vezes não é aplicado na propriedade real do
    // elemento a tempo do navegador decidir se libera o autoplay (bug
    // conhecido do React com <video>) — sem isso, o autoplay é bloqueado
    // silenciosamente e o vídeo trava no primeiro frame, parecendo uma
    // imagem estática parada em vez de um vídeo rodando. Setar aqui, direto
    // na propriedade, antes do play(), garante que o navegador sempre veja o
    // vídeo como mudo a tempo.
    video.muted = true;
    video.loop = true;
    video.play().catch(() => {});
    return undefined;
  }, []);

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

        // Suavizado (pedido explícito): power3.out desacelera muito rápido
        // perto do final, o que lê como um "freio brusco". power2.out chega
        // no mesmo lugar com uma desaceleração mais gradual, e as durações
        // um pouco mais longas (com menos deslocamento em Y) tiram a
        // sensação de "chacoalhão" da entrada.
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: revealFinalState,
        });
        tl.from(".hero__subheadline", { opacity: 0, y: 10, duration: 0.85 })
          .from(".hero__portrait", { opacity: 0, scale: 1.03, duration: 1.4 }, "-=0.55");

        // Safety net: whatever happens (a stalled tab, a race on load, an interrupted
        // tween), never let the hero text stay invisible for real visitors.
        const safety = setTimeout(revealFinalState, 2500);

        return () => clearTimeout(safety);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="inicio" className="hero" ref={root}>
      <div className="hero__bg" aria-hidden="true">
        <video ref={videoRef} className="hero__portrait" muted playsInline preload="auto">
          <source src={heroVideoWebm} type="video/webm" />
          <source src={heroVideoMp4} type="video/mp4" />
        </video>
        <div className="hero__vignette" />
      </div>

      <div className="container hero__content" id="conteudo">
        <h1 className="hero__headline">
          {typedHeadline}
          {!typingDone && <span className="hero__typewriter-cursor" aria-hidden="true" />}
        </h1>
        <p className="hero__subheadline">{HERO.subheadline}</p>
        <div className={`hero__actions ${actionsVisible ? "is-visible" : ""}`}>
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
