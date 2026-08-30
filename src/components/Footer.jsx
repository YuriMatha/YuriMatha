import Logo from "./Logo.jsx";
import { FOOTER } from "../lib/content.js";
import { IconInstagram, IconLinkedIn } from "./icons.jsx";
import "./Footer.css";

const SOCIAL_ICONS = { LinkedIn: IconLinkedIn, Instagram: IconInstagram };

export default function Footer() {
  return (
    <footer className="site-footer">
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
