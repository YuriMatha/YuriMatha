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

  // Vídeo controlado pelo movimento horizontal do mouse ("scrub"): a posição
  // do vídeo acompanha o gesto do cursor em vez de tocar sozinho. Em telas
  // sem mouse (touch), não existe "mousemove" pra controlar nada, então o
  // vídeo cairia parado no primeiro quadro pra sempre — nesse caso mantemos
  // o loop automático de antes (boomerang, sem travamento) em vez de deixar
  // a hero com uma imagem estática.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover) {
      video.loop = true;
      video.play().catch(() => {});
      return undefined;
    }

    const SENSITIVITY = 0.8;
    let duration = 0;
    let targetTime = 0;
    let seeking = false;
    let prevX = null;

    const onLoadedMetadata = () => {
      duration = video.duration || 0;
      targetTime = video.currentTime;
    };

    const seekTo = (time) => {
      if (seeking) return;
      seeking = true;
      video.currentTime = time;
    };

    const onSeeked = () => {
      seeking = false;
      // Se o alvo já mudou de novo enquanto o seek anterior ainda estava em
      // andamento, dispara o próximo agora — evita "afogar" o vídeo com
      // seeks simultâneos quando o mouse se move rápido.
      if (Math.abs(targetTime - video.currentTime) > 0.01) {
        seekTo(targetTime);
      }
    };

    const onMouseMove = (e) => {
      if (!duration) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      const offset = (delta / window.innerWidth) * SENSITIVITY * duration;
      targetTime = Math.min(Math.max(targetTime + offset, 0), duration);
      seekTo(targetTime);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove);
    if (video.readyState >= 1) onLoadedMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMouseMove);
    };
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

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: revealFinalState,
        });
        tl.from(".hero__subheadline", { opacity: 0, y: 16, duration: 0.6 })
          .from(".hero__portrait", { opacity: 0, scale: 1.04, duration: 1 }, "-=0.4");

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
