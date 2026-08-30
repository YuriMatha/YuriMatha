import { useEffect, useRef, useState } from "react";
import Logo from "./Logo.jsx";
import { NAV_LINKS } from "../lib/content.js";
import "./Header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");
  const headerRef = useRef(null);

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
