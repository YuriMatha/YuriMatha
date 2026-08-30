import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SOBRE } from "../lib/content.js";
import fotoJpg from "../assets/images/sobre-mim.jpg";
import fotoWebp from "../assets/images/sobre-mim.webp";
import "./AboutMe.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMe() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".about__photo", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".about__eyebrow, .about__headline, .about__paragraph", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="sobre-mim" className="about" ref={root}>
      <div className="container about__grid">
        <div className="about__media">
          <picture>
            <source srcSet={fotoWebp} type="image/webp" />
            <img className="about__photo" src={fotoJpg} alt="Retrato de Yuri Matha" loading="lazy" />
          </picture>
        </div>

        <div className="about__copy">
          <p className="eyebrow about__eyebrow">{SOBRE.eyebrow}</p>
          <h2 className="about__headline">{SOBRE.headline}</h2>
          {SOBRE.paragrafos.map((p, i) => (
            <p className="about__paragraph" key={i}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
