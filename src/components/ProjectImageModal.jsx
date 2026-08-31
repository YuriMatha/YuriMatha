import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IconClose } from "./icons.jsx";
import "./ProjectImageModal.css";

/**
 * Lightbox "3D" do carrossel de projetos: abre a capa do projeto em destaque
 * e a imagem inclina (rotateX/rotateY) seguindo a posição do cursor dentro do
 * palco (perspective + transform-style: preserve-3d no CSS). Pedido explícito
 * do usuário com /motion-design — entrada com escala+opacidade (Premium:
 * power3.out, sem overshoot) e a inclinação suavizada via gsap.quickTo (a
 * "camada secundária" de motion craft, evitando que o tilt salte junto com o
 * mouse sem transição).
 */
export default function ProjectImageModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const stageRef = useRef(null);
  const imgWrapRef = useRef(null);
  const quickRotateY = useRef(null);
  const quickRotateX = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(imgWrapRef.current, { opacity: 1, scale: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.fromTo(
          imgWrapRef.current,
          { opacity: 0, scale: 0.92, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" }
        );
      });

      // Suaviza a inclinação (em vez de aplicar o ângulo cru a cada mousemove)
      // — sem isso o tilt "trava" seguindo o pixel do mouse 1:1, sem nenhuma
      // sensação de peso/inércia na imagem. Nomes de propriedade do GSAP são
      // "rotationX"/"rotationY" (não "rotateX"/"rotateY" — esses não existem
      // no CSSPlugin e o tween não tinha efeito nenhum na tela).
      quickRotateY.current = gsap.quickTo(imgWrapRef.current, "rotationY", {
        duration: 0.5,
        ease: "power3.out",
      });
      quickRotateX.current = gsap.quickTo(imgWrapRef.current, "rotationX", {
        duration: 0.5,
        ease: "power3.out",
      });

      return () => mm.revert();
    },
    { scope: overlayRef }
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const MAX_TILT_DEG = 9;

  const handleMouseMove = (e) => {
    const stage = stageRef.current;
    if (!stage || !quickRotateY.current) return;
    const rect = stage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    quickRotateY.current(relX * MAX_TILT_DEG * 2);
    quickRotateX.current(relY * -MAX_TILT_DEG * 2);
  };

  const handleMouseLeave = () => {
    quickRotateY.current?.(0);
    quickRotateX.current?.(0);
  };

  return (
    <div
      className="project-modal"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagem ampliada do projeto ${project.nome}`}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <button type="button" className="project-modal__close" onClick={onClose} aria-label="Fechar imagem">
        <IconClose width={18} height={18} />
      </button>

      <div
        className="project-modal__stage"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="project-modal__image-wrap" ref={imgWrapRef}>
          <img src={project.cover} alt={`Capa do projeto ${project.nome}`} />
        </div>
      </div>

      <p className="project-modal__caption">{project.nome}</p>
    </div>
  );
}
