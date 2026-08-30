/* Ícones de interface em SVG inline — traço 1.5–1.75px, estilo consistente
   com a linguagem "line icon" observada nos cards de contato e serviços do
   Figma. Ícones de redes sociais reproduzem os glifos de marca padrão
   (LinkedIn "in", Instagram câmera), pois nenhum arquivo de ícone oficial
   foi encontrado na pasta /Redes. */

export const IconArrowUpRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const IconArrowRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </svg>
);

export const IconChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const IconChevronRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconMail = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const IconPhone = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3c1 .3 2.1.5 3.2.5a1.2 1.2 0 0 1 1.2 1.2V20a1.2 1.2 0 0 1-1.2 1.2C10.6 21.2 2.8 13.4 2.8 4.2A1.2 1.2 0 0 1 4 3h3.4a1.2 1.2 0 0 1 1.2 1.2c0 1.1.2 2.2.5 3.2a1.2 1.2 0 0 1-.3 1.2Z" />
  </svg>
);

export const IconClose = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6m0-6-6 6" />
  </svg>
);

export const IconLinkedIn = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.94 8.5H3.56V20.4h3.38V8.5ZM5.25 3.6a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.4 20.4h-3.37v-6.24c0-1.66-.03-3.79-2.31-3.79-2.32 0-2.68 1.8-2.68 3.67v6.36H8.68V8.5h3.24v1.62h.05c.45-.86 1.55-1.77 3.2-1.77 3.42 0 4.05 2.25 4.05 5.18v6.87Z" />
  </svg>
);

export const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.1" cy="6.9" r="1" fill="currentColor" stroke="none" />
  </svg>
);
