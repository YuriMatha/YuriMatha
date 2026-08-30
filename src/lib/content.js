/**
 * Conteúdo oficial do site — extraído literalmente do arquivo Figma
 * "Yuri Matha" (frame Home, node 17:264) e do PDF de copy
 * "Copy - Portfólio Yúri Matheus (Versão 2)". Nenhum texto aqui foi
 * reescrito, resumido ou embelezado — ver /SUPER-COPY-RELATORIO.html
 * para sugestões de otimização de conversão em separado.
 */

export const SITE = {
  nome: "Yuri Matha",
  email: "pot@yurimatha.com.br",
  telefone: "+55 62 99440-2786",
  whatsappHref: "https://wa.me/5562994402786",
};

export const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

export const HERO = {
  headline:
    'Toda empresa quer um UX/UI que "pensa no negócio". Poucas mostram o que isso significa na prática — eu mostro nos projetos abaixo.',
  subheadline:
    "6+ anos de UX/UI, Ux Writing e Ux Strategist. Atualmente à frente da parte visual de uma das maiores empresas de venda de passagens de ônibus do Brasil.",
  ctaPrimary: "Ver projetos",
  ctaSecondary: "Ou chama direto no WhatsApp",
};

export const SOBRE = {
  eyebrow: "Sobre mim",
  headline: "A intersecção exata entre a lógica do código e a experiência do usuário.",
  paragrafos: [
    "Com mais de 6 anos de experiência em UX/UI, UX Writing e Estratégia de Design, trago uma bagagem única no mercado brasileiro: sou formado em Análise e Desenvolvimento de Sistemas (ADS). Essa transição técnica moldou profundamente minha visão de produto.",
    "Eu não desenho apenas telas atraentes; eu planejo sistemas viáveis. Compreendo a arquitetura de dados, limitações de API e frameworks modernos. Essa competência técnica permite falar o mesmo idioma dos desenvolvedores, otimizando drasticamente o handoff e reduzindo atritos de implementação.",
    "Atualmente, lidero a experiência visual em uma das maiores referências em venda de passagens de ônibus do Brasil, projetando soluções de alta complexidade escaladas para milhões de usuários.",
  ],
};

export const SERVICOS = {
  eyebrow: "Serviços",
  headline: "Da estratégia ao pixel, do protótipo ao código de alta fidelidade.",
  tags: ["DESIGN_DRIVEN", "CODE_FLUENT"],
  conector: "HANDOFF_FLOW_ENGINE",
  core: [
    {
      titulo: "UX/UI Designer | Ux Writing | Ux Strategist",
      descricao:
        "Antes de abrir o Figma, mapeio a jornada e escrevo o texto da interface — telas bonitas com texto ruim ainda confundem o usuário.",
    },
    {
      titulo: "Figma Design System componentizado",
      descricao: "Pronto pra handoff sem gerar dúvida de implementação pro time de dev.",
    },
    {
      titulo: "WordPress",
      descricao:
        "Entrego sites que o cliente edita sozinho depois — sem me chamar toda vez que precisa trocar uma foto.",
    },
  ],
  producao: [
    {
      titulo: "Web Designer (pleno) — AngularJS · HTML5 · CSS",
      descricao:
        "Desenho pensando em quem vai codar, não isolado num arquivo que depois vira um problema de 'isso não é viável'.",
    },
    {
      titulo: "Adobe Photoshop — Pós-produção de imagens",
      descricao:
        "Tratamento de imagem pra peça final: banner, campanha, material pronto pra publicar sem mais um ajuste.",
    },
    {
      titulo: "Manipulação de Imagens — Matte painting",
      descricao:
        "Composição de cenas que não existiam em nenhuma foto original — usado quando a campanha precisa de um visual que uma foto sozinha não entrega.",
    },
  ],
};

export const PROJETOS = {
  eyebrow: "Projetos",
  headline: "Trabalhos que provam design estratégico na prática e geram valor real.",
  cards: [
    {
      slug: "gerenciador-mobile",
      nome: "Gerenciador Mobile",
      contexto: "App de gestão com dashboard, menu de navegação e fluxos de formulários para operações mobile",
      papel: "UX/UI Lead & Writing",
    },
    {
      slug: "ti-frete",
      nome: "Ti – Frete",
      contexto: "Plataforma de cotação e gestão de fretes com listagens dinâmicas e formulários de cadastro",
      papel: "UX Strategist",
    },
    {
      slug: "monitriip",
      nome: "Monitriip",
      contexto: "App de monitoramento com dashboard de indicadores circulares e cards de navegação rápida",
      papel: "Product Designer",
    },
    {
      slug: "aplicativo-passagens",
      nome: "Aplicativo de Passagens",
      contexto: "Design system e componentes reutilizáveis para o app de compra de passagens",
      papel: "Design System Ops",
    },
  ],
};

export const CONTATO = {
  eyebrow: "Contato",
  headline: "Alguma dessas telas se parece com o que você precisa?",
  subheadline: "Me chama no WhatsApp e me conta rapidamente o desafio do seu time — respondo no mesmo dia.",
  cards: [
    {
      tipo: "email",
      label: "E-mail profissional",
      valor: SITE.email,
      acao: "Mandar e-mail",
      href: `mailto:${SITE.email}`,
    },
    {
      tipo: "whatsapp",
      label: "WhatsApp Direto",
      valor: SITE.telefone,
      acao: "Chamar",
      href: SITE.whatsappHref,
    },
  ],
  conversao: {
    badge: "QUICK_CONNECT_FLOW",
    headline: "Vamos construir a próxima grande solução juntos",
    promessas: [
      "Retorno rápido (normalmente em menos de 1 hora)",
      "Alinhamento técnico direto de viabilidade",
      "Foco total em negócios e escalabilidade",
    ],
    cta: "Chamar no WhatsApp",
    nota: "Dúvidas rápidas, briefings ou propostas de contratação são bem-vindas.",
  },
};

export const FOOTER = {
  copy: "© 2026 Yuri Matha. Projetado pensando na experiência, construído sabendo o código.",
  /* Nenhuma URL de rede social foi encontrada em /Redes (arquivo vazio) —
     os hrefs ficam vazios até serem fornecidos, para não inventar links. */
  redes: [
    { nome: "LinkedIn", href: "" },
    { nome: "Instagram", href: "" },
  ],
};
