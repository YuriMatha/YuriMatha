import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Logo from "./Logo.jsx";
import { NAV_LINKS } from "../lib/content.js";
import "./Header.css";

const HEADER_ANIM_TARGETS = [".logo", ".site-nav li", ".site-header__cta", ".site-header__burger"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");
  const headerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(HEADER_ANIM_TARGETS, { clearProps: "opacity,transform" });
      });

      // Header entra junto com o Hero (mesmo instante de carregamento) em vez de
      // simplesmente "aparecer" pronto enquanto o resto da página faz uma entrada
      // coreografada — sem isso o topo da página quebrava a continuidade do
      // primeiro impacto. Rápido e discreto (personalidade "corporate": chrome
      // persistente não deve competir de atenção com o conteúdo do Hero).
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.killTweensOf(HEADER_ANIM_TARGETS);
        gsap.from(HEADER_ANIM_TARGETS, {
          opacity: 0,
          y: -10,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "opacity,transform",
        });
      });

      return () => mm.revert();
    },
    { scope: headerRef }
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? "is-scrolled" : ""}`} id="topo">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <div className="site-header__inner container">
        <Logo tone="light" />

        <nav className="site-nav" aria-label="Navegação principal">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={active === link.href ? "is-active" : ""}
                  onClick={handleNavClick(link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contato" className="btn btn-ghost site-header__cta" onClick={handleNavClick("#contato")}>
          Iniciar um projeto
        </a>

        <button
          type="button"
          className={`site-header__burger ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="menu-mobile" className={`site-header__mobile ${open ? "is-open" : ""}`}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={handleNavClick(link.href)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contato" className="btn btn-secondary" onClick={handleNavClick("#contato")}>
              Iniciar um projeto
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
