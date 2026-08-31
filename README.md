# Portfólio de Yuri Matha

Implementação em React + Vite + GSAP, feita a partir do arquivo Figma "Yuri Matha"
(frame `Home`) e dos assets oficiais da pasta `Site_YuriMatha`.

## Rodar localmente

```bash
npm install
npm run dev       # ambiente de desenvolvimento, http://localhost:5173
npm run build     # gera a pasta dist/ (produção)
npm run preview   # serve a build de produção localmente
```

## O que foi usado como fonte oficial

- Cores: `Cores/Paleta.png` (design system v1.0.0-beta) → `src/styles/tokens.css`.
- Copy: extraída literalmente do frame Home do Figma e do PDF
  `Copy - Portfólio Yúri Matheus (Versão 2).pdf` → `src/lib/content.js`.
- Logo: `Logo/YuriMatha.svg` (símbolo "YM", vetor original, inalterado) →
  `src/components/Logo.jsx`.
- Hero: `Assets/Background_v.mp4` (vídeo original) com poster
  `Assets/Background_1.png`.
- Foto "Sobre mim": `Assets/Alterar_fundo_e_adicionar_camiseta_202608231537.jpeg`
  (confirmada visualmente como a foto usada no Figma renderizado).
- Capas de projeto: `Projetos/Capas/Capa - Gerenciador Mobile.png`,
  `Capa - Ti_Frete.png`, `Capa - Monitriip.png`, `Capa - Aplicativos.png`.

## Correções recentes (pós-deploy): rodada 6 (hero interativo)

O pedido foi reproduzir na Hero o efeito de uma referência (vídeo controlado pelo
mouse, texto "digitando" tipo máquina de escrever, rótulo desfocado, botões em
pill entrando de forma independente), enviada como o spec completo de outro
projeto: uma landing de agência fictícia, "Mainframe", com um assistente de IA
chamado "A.R.I.A.". Como esse spec é de outro produto, recriei apenas o efeito e
a mecânica de interação em cima do conteúdo já existente da Hero. Nenhuma copy
nova foi inventada, e a identidade visual (fontes Briller/Poppins, cores do
Figma) não mudou:

1. O vídeo do Hero agora tem scrub pelo mouse: ele não toca mais sozinho,
   começa parado no primeiro quadro, e a posição de reprodução segue o
   movimento horizontal do cursor (`Hero.jsx`, novo `useEffect` com
   `mousemove` + `video.currentTime`, sensibilidade de 0.8x a largura da
   tela). Em dispositivos sem mouse (touch, detectado via `(hover: hover) and
   (pointer: fine)`), não haveria como controlar esse scrub, então o vídeo
   mantém o loop automático de antes (o "boomerang" sem travamento das
   rodadas anteriores) em vez de ficar parado numa imagem estática.
2. Novo rótulo desfocado acima do headline: o elemento `.hero__intro-blur`
   (decorativo, `aria-hidden`, `pointer-events: none`) reaproveita
   literalmente o trecho "UX/UI, Ux Writing e Ux Strategist" que já existia
   em `HERO.subheadline`, só quebrado em duas linhas e desfocado (`filter:
   blur(3px)`), dando profundidade antes do headline principal.
3. O headline agora usa efeito de máquina de escrever: o novo hook
   `src/lib/useTypewriter.js` revela a citação grande caractere a caractere
   (38ms por caractere, atraso inicial de 600ms), com cursor piscando
   enquanto digita, no lugar da antiga animação "palavra por palavra" do
   GSAP. Continua respeitando `prefers-reduced-motion`: com a preferência
   ativa, mostra o texto inteiro de uma vez, sem digitação.
4. Os botões de ação agora entram de forma independente: os pills ("Ver
   projetos", "Ou chama no WhatsApp") aparecem sozinhos 400ms após o
   carregamento da página, sem esperar o headline terminar de digitar. Isso
   é controlado por um `setTimeout` e uma classe CSS
   (`hero__actions.is-visible`), em vez de fazer parte da timeline do GSAP.
5. Novo botão "Copiar e-mail": um terceiro pill (contornado, transparente)
   com o e-mail já cadastrado (`SITE.email`) e um ícone de copiar. O clique
   copia o e-mail pra área de transferência via
   `navigator.clipboard.writeText()` e mostra "E-mail copiado!" por 1.8s
   como confirmação. Nova classe `.btn-outline` em `global.css` e ícone
   `IconCopy` em `icons.jsx`.

## Correções recentes (pós-deploy): rodada 5 (glassmorphism)

O frame Home do Figma usa vidro fosco (glassmorphism) nos botões que ficam
sobre o vídeo do Hero e nos cards de conteúdo. A primeira implementação,
porém, mediu isso a partir do `Home.svg` e do `Home.png` exportados, que só
guardam a cor final visível de cada camada, sem preservar blur nem
transparência real, então o resultado saiu como cor sólida lisa em vez de
vidro. Foi adicionado em `tokens.css` um conjunto de tokens de glassmorphism
(`--glass-*`: blur, gradiente de fundo translúcido, borda "cintilante" de 3
tons, brilho no topo), aplicado em:

1. Botões sobre mídia (`.btn-primary` "Ver projetos", `.btn-ghost` "Iniciar
   um projeto" no header): fundo em gradiente translúcido com
   `backdrop-filter: blur()`, revelando o vídeo ou conteúdo atrás, com borda
   em gradiente (mais clara no canto superior) em vez de borda lisa.
2. Cards (`.service-card`, `.contact-card`, `.contact__conversion-card`,
   `.project-card`, `.projects__nav-btn`): mesmo tratamento de vidro fosco,
   com uma mancha de luz ambiente (`::before` com `radial-gradient` azul)
   atrás da grade de cada seção (Serviços, Contato, Projetos). Sem algo
   colorido atrás pra revelar, o blur do vidro não tem efeito visível sobre
   um fundo liso.
3. Card de conversão em Contato: reforçado com um brilho radial branco suave
   no canto superior (`::after`), no mesmo espírito do card "premium" de
   destaque do design system de referência.

`--cor-superficie-card`/`--cor-superficie-card-hover` (cor sólida antiga)
ficaram sem uso nos componentes acima, mas os tokens continuam definidos em
`tokens.css` caso algum componente futuro precise de uma superfície opaca.

## Correções recentes (pós-deploy): rodada 4 (motion design)

Passada de revisão completa das animações da página usando princípios de
motion design (timing, easing, coreografia, camadas de movimento).

1. As animações do GSAP ignoravam `prefers-reduced-motion`: a regra global
   (`global.css`) neutraliza `transition` e `animation` de CSS quando o
   usuário pede menos movimento no sistema, mas isso não tem efeito nenhum
   sobre tweens do GSAP (que interpolam estilo via JS a cada frame). Ou
   seja, todo mundo que ativou essa preferência ainda via a página inteira
   animando normalmente. Isso foi corrigido em todos os componentes com
   GSAP (`Hero`, `AboutMe`, `Services`, `Contact`, `ProjectsCarousel`, e os
   dois novos abaixo, `Header` e `Footer`) usando `gsap.matchMedia()`: com a
   preferência ativa, o conteúdo aparece direto no estado final; sem ela, as
   animações rodam normalmente.
2. O Hero estava "chapado" por falta de uma camada ambiente. Foi adicionado
   um "respiro" sutil no glow atrás da silhueta (`.hero__glow`: escala e
   opacidade, 5s, `sine.inOut`, loop infinito), que dá vida de fundo à cena
   sem competir com o texto nem pesar na performance (só anima `transform`
   e `opacity`).
3. Os cards de Serviços também estavam "chapados" por falta de uma camada
   secundária. Além da entrada (opacidade e posição), o pontinho de cada
   card (`.service-card__node`) agora dá um pequeno "pop" (`scale` com
   `back.out`) logo depois do card pousar. É um leve overshoot, justificado
   pelo peso visual pequeno do elemento (ícone/badge), mesmo com o resto da
   página seguindo uma personalidade "premium" sem overshoot.
4. Header e Footer não tinham nenhuma animação de entrada: eram as duas
   únicas seções da página que só "apareciam" prontas, quebrando a
   consistência com o resto (Hero, Sobre mim, Serviços, Projetos e Contato
   já revelam o conteúdo). Foi adicionado ao `Header` um fade com leve
   queda, rápido e discreto, disparado junto com o carregamento (chrome
   persistente não deve competir de atenção com o Hero); ao `Footer`, uma
   entrada por scroll no mesmo padrão usado no resto da página.
5. O sublinhado do link ativo no menu aparecia sem transição: o `::after` do
   link ativo só existia condicionalmente (`is-active`), então "pipocava" na
   tela em vez de se mover. Foi reestruturado pra existir sempre, com
   `transform: scaleX(0)`, e animar suavemente até `scaleX(1)`.

## Correções recentes (pós-deploy): rodada 3

1. O texto do Hero ficava fora do grid: `.hero__content` tinha seu próprio
   `max-width: 760px`, mas também herdava `margin-inline: auto` da classe
   `.container`. Com um max-width menor que o container inteiro, isso
   passou a centralizar o bloco de texto no meio da seção, em vez de
   alinhá-lo à mesma margem esquerda do logo no header (diferença de cerca
   de 340px na tela). O `max-width` foi removido de `.hero__content`; a
   largura do título já é limitada por si só (`.hero__headline { max-width:
   584px }`).
2. O ícone de scroll ficava fora do centro: `.hero__scroll-cue` usava `left:
   var(--container-pad)` (alinhado à margem esquerda do container). Foi
   trocado para `left: 50%; transform: translateX(-50%)`, e agora fica
   centralizado horizontalmente, embaixo da seção.
3. Havia uma "segunda imagem" atrás do vídeo do Hero: um `<img>` de fallback
   (`hero-poster.jpg/webp`) posicionado atrás do vídeo (pensado pra
   navegadores sem suporte a autoplay de vídeo), com o mesmo enquadramento
   do vídeo, mas sendo uma imagem estática separada. Em alguns momentos,
   especialmente durante o carregamento, isso dava a impressão de uma
   segunda silhueta fantasma. O `<img>` de fallback foi removido de
   `Hero.jsx`; o `<video>` já usa esse mesmo arquivo como `poster` (mostrado
   nativamente enquanto o vídeo carrega), então nada foi perdido.

## Correções recentes (pós-deploy): rodada 2

1. O vídeo do Hero continuava "igual" depois da primeira tentativa de
   correção. Mexer só no `object-position` mudava muito pouco porque, com a
   proporção do vídeo (1280x720, aproximadamente 16:9) próxima da proporção
   comum de tela, `object-fit: cover` sobra pouca folga pra cortar. Em
   janelas mais largas que altas (por exemplo 1857x873, comum num monitor
   grande com o navegador não maximizado na vertical), o corte acontece só
   na vertical, e mudar a posição horizontal não tinha efeito nenhum.
   Comparando o enquadramento do Figma (a cabeça ocupa quase toda a altura
   do frame, bem próxima da câmera) com o que estava saindo, a silhueta
   aparecia pequena e cortada perto do queixo. Isso foi corrigido em
   `Hero.css` com dois ajustes: um piso de altura na seção (`min-height:
   max(100svh, 760px)`) pra ela não "achatar" demais em janelas baixas, e um
   zoom (`transform: scale`) aplicado especificamente quando a janela é bem
   mais larga que alta (`@media (min-aspect-ratio: 3/2)`), recuperando o
   enquadramento generoso do Figma nesses casos sem alterar o comportamento
   em telas mais comuns.
2. Foram adicionadas as URLs de LinkedIn e Instagram (`src/lib/content.js` →
   `FOOTER.redes`, e o `sameAs` do JSON-LD em `index.html`); os ícones no
   rodapé agora abrem os perfis reais.
3. O carrossel de projetos agora tem loop infinito: `ProjectsCarousel.jsx`
   renderiza o conjunto de cards três vezes (cópia, real, cópia) e, assim
   que o scroll (incluindo a animação suave) chega numa das cópias,
   realinha instantaneamente pro conjunto real na posição equivalente, sem
   o usuário perceber o salto. Os botões de seta agora navegam
   infinitamente nas duas direções, sem desabilitar no primeiro ou último
   projeto.

## Correções recentes (pós-deploy)

1. O texto do Hero sumia em produção: no domínio temporário da Hostinger, a
   animação de entrada (GSAP) do Hero às vezes travava no meio do caminho,
   deixando o headline, o subheadline e os botões com `opacity: 0` de forma
   permanente (o CSS não tem nenhum estado visível por padrão; a única
   coisa que mostra o texto é a animação). A causa mais provável era
   instâncias sobrepostas da mesma timeline brigando pelos mesmos
   elementos. Foi corrigido em `Hero.jsx` (e, por precaução, nos outros 4
   componentes com GSAP) com `gsap.killTweensOf(...)` antes de criar a
   timeline, `clearProps` ao final pra soltar os estilos inline, e uma rede
   de segurança (`setTimeout` de 2.5s) que força o estado final visível não
   importa o que aconteça. Testado localmente com throttling de CPU
   agressivo (20x) simulando o cenário que travava; o texto agora sempre
   aparece.
2. A fonte "Briller" foi integrada: os arquivos oficiais (`Fonte/Briller/*`)
   foram adicionados em `src/assets/fonts/briller/`, com `@font-face`
   self-hosted em `src/styles/fonts-briller.css`, substituindo o
   placeholder Baloo 2. Como a Briller tem uma proporção de cap-height bem
   diferente da Baloo 2, recalibrei `--fs-display-sm/md/lg/xl`
   (`tokens.css`) e a largura e o line-height do headline do Hero
   (`Hero.css`) medindo diretamente o render `Figma/Home.png` (altura do
   "T" e largura do bloco de texto). Ficou muito próximo da quebra de linha
   original (6 linhas no Figma contra 7 na implementação atual), mas como o
   texto do Figma foi exportado como vetor, sem tamanho e tracking exatos,
   não dá pra garantir 100% de coincidência de pixel a pixel; vale um
   confere visual seu.
3. Foi removida do `package.json` a dependência `@fontsource/baloo-2`, que
   não é mais usada.
4. Havia lag no Hero: o vídeo de fundo (`hero-silhouette.mp4/webm`) tinha
   `mask-image`/`-webkit-mask-image` aplicada continuamente sobre um vídeo
   em reprodução (custo alto de composição e GPU), redundante com o
   `.hero__vignette` (uma camada estática que já produz o mesmo
   esmaecimento visual). A máscara foi removida em `Hero.css`. Além disso, o
   vídeo original estava em 1920x1080 com cerca de 16s; foi recodificado
   para 1280x720, mantendo a mesma taxa de quadros, reduzindo o arquivo de
   mais de 3MB para 537KB (mp4) e 420KB (webm), com menos dados pra
   decodificar por quadro.
5. O vídeo de fundo do Hero estava desenquadrado e travava no loop. O
   `object-position` do vídeo (`.hero__portrait`) estava em `78% 30%`,
   deslocando a silhueta bem mais pra direita do que no Figma; medindo o
   enquadramento real do Figma (crop do Hero em `Figma/Home.png`) contra o
   vídeo, corrigi para `63% 20%` (e o equivalente no breakpoint mobile).
   Separadamente, o vídeo original (`Background_v.mp4`) não voltava ao
   quadro inicial ao terminar, e o `loop` do HTML criava um corte visível
   ("travamento") a cada repetição. Foi recodificado como "boomerang" (o
   próprio vídeo tocando pra frente e depois de trás pra frente,
   concatenados), o que garante que o último quadro é idêntico ao primeiro:
   o loop agora é perfeitamente contínuo.
6. As cores estavam divergentes do Figma, principalmente nos botões.
   Comparando os tokens de cor (`tokens.css`) com o SVG exportado da página
   real do Figma (`Home.svg`), nenhum dos hex documentados em
   `Cores/Paleta.png` aparece no arquivo: a paleta usada como referência
   original não batia com o que está de fato no design. Medi as cores reais
   usadas (botão "Ver projetos", botão "Ou chama no WhatsApp", CTA "Iniciar
   um projeto" no header, fundo geral, e o indicador verde de "online" na
   seção de Contato) diretamente do SVG/PNG, e corrigi `tokens.css`,
   `global.css` e `Contact.css` de acordo (os detalhes de cada medição
   estão comentados no topo de `tokens.css`). Vale copiar ou atualizar
   `Cores/Paleta.png` a partir dessas correções, se quiser manter os dois em
   sincronia no futuro.

## Pontos em aberto (ainda sem alteração sua no repositório)

Revisei `src/lib/content.js` e `index.html` no seu repositório local, e eles
estão idênticos ao que entreguei: os itens abaixo (que você mencionou já ter
alterado) continuam exatamente como antes. Se você alterou em outro lugar
(por exemplo, direto no Hostinger), me avise pra eu não sobrescrever; caso
contrário, seguem pendentes:

1. Há uma divergência de tipografia em `Manual da Marca/`: as duas imagens
   dessa pasta (`Generated Image ...png`) mostram um guia de marca citando
   "Montserrat" (primária) e "Lora" (secundária). Esse guia não bate com a
   tipografia realmente usada no `Figma/Home.png` renderizado (que não usa
   nenhuma fonte serifada, e o título é bem mais arredondado que
   Montserrat). Tratei essas duas imagens como uma exploração antiga, já
   descartada, e priorizei o render final do Figma, conforme a regra de
   "versão mais claramente relacionada ao projeto final", mas vale
   confirmar com você.
2. Sobre o e-mail "pot@yurimatha.com.br": mantive exatamente como está
   escrito no Figma renderizado. Se for erro de digitação (por exemplo
   "oi@" ou "contato@"), me avise pra eu corrigir; não alterei por conta
   própria.
3. Sobre o 4º card de projetos ("Aplicativo de Passagens"): o card se
   estende além da borda direita do artboard do Figma (1440px), e o PNG
   exportado corta exatamente nesse limite, sem nenhum pixel a mais pra
   ler. O texto "Design system e componentes reutilizáveis para o app de
   compra de passagens" é minha melhor reconstrução a partir do que ficou
   visível (ver `src/lib/content.js` → `PROJETOS.cards[3]`); vale conferir a
   frase exata direto no arquivo Figma.

(O item sobre os links de redes sociais que apareceu aqui numa versão
anterior deste README já foi resolvido na rodada 2, acima, e foi removido
desta lista.)

## Relatório de copy (opcional, não aplicado)

`super-copy-relatorio.html` traz 3 sugestões de teste A/B pelos princípios
clássicos de copywriting. Nenhuma foi aplicada ao site; a copy ativa continua
sendo a oficial do Figma/PDF, como pedido no briefing.
