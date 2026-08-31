# Yuri Matha — Site de Portfólio

Implementação em React + Vite + GSAP do portfólio, feita a partir do arquivo Figma
"Yuri Matha" (frame **Home**) e dos assets oficiais da pasta `Site_YuriMatha`.

## Rodar localmente

```bash
npm install
npm run dev       # ambiente de desenvolvimento, http://localhost:5173
npm run build     # gera a pasta dist/ (produção)
npm run preview   # serve a build de produção localmente
```

## O que foi usado como fonte oficial

- **Cores**: `Cores/Paleta.png` (design system v1.0.0-beta) → `src/styles/tokens.css`.
- **Copy**: extraída literalmente do frame Home do Figma e do PDF
  `Copy - Portfólio Yúri Matheus (Versão 2).pdf` → `src/lib/content.js`.
- **Logo**: `Logo/YuriMatha.svg` (símbolo "YM", vetor original, inalterado) →
  `src/components/Logo.jsx`.
- **Hero**: `Assets/Background_v.mp4` (vídeo original) com poster
  `Assets/Background_1.png`.
- **Foto "Sobre mim"**: `Assets/Alterar_fundo_e_adicionar_camiseta_202608231537.jpeg`
  (confirmada visualmente como a foto usada no Figma renderizado).
- **Capas de projeto**: `Projetos/Capas/Capa - Gerenciador Mobile.png`,
  `Capa - Ti_Frete.png`, `Capa - Monitriip.png`, `Capa - Aplicativos.png`.

## Correções recentes (pós-deploy) — rodada 4 (motion design)

Passada de revisão completa das animações da página usando princípios de
motion design (timing, easing, coreografia, camadas de movimento).

1. **Acessibilidade: animações do GSAP ignoravam `prefers-reduced-motion`.**
   A regra global (`global.css`) neutraliza `transition`/`animation` de CSS
   quando o usuário pede menos movimento no sistema, mas isso não tem efeito
   nenhum sobre tweens do GSAP (que interpolam estilo via JS a cada frame) —
   ou seja, todo mundo que ativou essa preferência ainda via a página inteira
   animando normalmente. Corrigido em **todos** os componentes com GSAP
   (`Hero`, `AboutMe`, `Services`, `Contact`, `ProjectsCarousel`, e os dois
   novos abaixo, `Header` e `Footer`) usando `gsap.matchMedia()`: com a
   preferência ativa, o conteúdo aparece direto no estado final; sem ela,
   as animações rodam normalmente.
2. **Hero "chapado" — faltava camada ambiente.** Adicionado um "respiro"
   sutil no glow atrás da silhueta (`.hero__glow`: escala + opacidade, 5s,
   `sine.inOut`, loop infinito) — dá vida de fundo à cena sem competir com o
   texto nem pesar na performance (só `transform`/`opacity`).
3. **Cards de Serviços "chapados" — faltava camada secundária.** Além da
   entrada (opacidade + posição), o pontinho de cada card
   (`.service-card__node`) agora dá um pequeno "pop" (`scale` com
   `back.out`) logo depois do card pousar — um leve overshoot justificado
   pelo peso visual pequeno do elemento (ícone/badge), mesmo com o resto da
   página seguindo uma personalidade "premium" sem overshoot.
4. **Header e Footer sem nenhuma animação de entrada.** Eram as duas únicas
   seções da página que só "apareciam" prontas, quebrando a consistência
   com o resto (Hero, Sobre mim, Serviços, Projetos e Contato já revelam o
   conteúdo). Adicionado ao `Header` um fade+leve queda rápido e discreto,
   disparado junto com o carregamento (chrome persistente não deve competir
   de atenção com o Hero); ao `Footer`, uma entrada por scroll no mesmo
   padrão usado no resto da página.
5. **Sublinhado do link ativo no menu aparecia sem transição.** O
   `::after` do link ativo só existia condicionalmente (`is-active`), então
   "pipocava" na tela em vez de se mover. Reestruturado para existir sempre
   com `transform: scaleX(0)` e animar suavemente para `scaleX(1)`.

## Correções recentes (pós-deploy) — rodada 3

1. **Texto do Hero "fora do grid".** `.hero__content` tinha `max-width: 760px`
   próprio, mas também herdava `margin-inline: auto` da classe `.container`
   — com um max-width menor que o container inteiro, isso passou a
   centralizar o bloco de texto no meio da seção em vez de alinhá-lo à
   mesma margem esquerda do logo no header (diferença de ~340px na tela).
   Removido o `max-width` de `.hero__content`; a largura do título já é
   limitada por si só (`.hero__headline { max-width: 584px }`).
2. **Ícone de scroll fora do centro.** `.hero__scroll-cue` usava
   `left: var(--container-pad)` (alinhado à margem esquerda do container).
   Trocado para `left: 50%; transform: translateX(-50%)` — agora fica
   centralizado horizontalmente, embaixo da seção.
3. **"Segunda imagem" atrás do vídeo do Hero.** Existia um `<img>` de
   fallback (`hero-poster.jpg/webp`) posicionado atrás do vídeo (pensado
   pra navegadores sem suporte a autoplay de vídeo), com o mesmo
   enquadramento do vídeo mas sendo uma imagem estática separada — em
   alguns momentos (esp. durante o carregamento) dava a impressão de uma
   segunda silhueta fantasma. Removido o `<img>` de fallback em `Hero.jsx`;
   o `<video>` já usa esse mesmo arquivo como `poster` (mostrado
   nativamente enquanto o vídeo carrega), então nada foi perdido.

## Correções recentes (pós-deploy) — rodada 2

7. **Vídeo do Hero ainda "igual" depois da primeira tentativa de correção.**
   A primeira correção (mexer só no `object-position`) mudava muito pouco
   porque, com a proporção do vídeo (1280x720 ≈ 16:9) próxima da proporção
   comum de tela, `object-fit: cover` sobra pouca folga pra cortar — em
   janelas mais largas que altas (ex.: 1857x873, comum em monitor grande
   sem o navegador maximizado na vertical) o corte acontece só na vertical,
   e mudar a posição horizontal não tinha efeito nenhum. Comparando o
   enquadramento do Figma (cabeça ocupa quase toda a altura do frame, bem
   próxima da câmera) com o que estava saindo, a silhueta aparecia pequena
   e cortada perto do queixo. Corrigido em `Hero.css` com: (a) um piso de
   altura na seção (`min-height: max(100svh, 760px)`) pra ela não "achatar"
   demais em janelas baixas; e (b) um zoom (`transform: scale`) aplicado
   especificamente quando a janela é bem mais larga que alta
   (`@media (min-aspect-ratio: 3/2)`), recuperando o enquadramento generoso
   do Figma nesses casos sem alterar o comportamento em telas mais comuns.
2. **Links de redes sociais.** Adicionadas as URLs de LinkedIn e Instagram
   (`src/lib/content.js` → `FOOTER.redes`, e o `sameAs` do JSON-LD em
   `index.html`) — os ícones no rodapé agora abrem os perfis reais.
3. **Carrossel de projetos: loop infinito.** `ProjectsCarousel.jsx`
   renderiza o conjunto de cards três vezes (cópia–real–cópia) e, assim que
   o scroll (incluindo a animação suave) chega numa das cópias, realinha
   instantaneamente pro conjunto real na posição equivalente — o usuário
   nunca vê o salto. Os botões de seta agora navegam infinitamente em
   ambas as direções (sem desabilitar no primeiro/último projeto).

## Correções recentes (pós-deploy)

1. **Bug corrigido: texto do Hero sumindo em produção.** No domínio temporário
   da Hostinger, a animação de entrada (GSAP) do Hero às vezes travava a meio
   caminho, deixando o headline/subheadline/botões com `opacity: 0` de forma
   permanente (o CSS não tem nenhum estado visível por padrão — a única coisa
   que mostra o texto é a animação). Causa mais provável: instâncias
   sobrepostas da mesma timeline brigando pelos mesmos elementos. Corrigido em
   `Hero.jsx` (e por precaução nos outros 4 componentes com GSAP) com:
   `gsap.killTweensOf(...)` antes de criar a timeline, `clearProps` ao final
   para soltar os estilos inline, e uma rede de segurança (`setTimeout` de
   2.5s) que força o estado final visível não importa o que aconteça. Testado
   localmente com throttling de CPU agressivo (20x) simulando o cenário que
   travava — o texto agora sempre aparece.
2. **Fonte "Briller" integrada.** Os arquivos oficiais (`Fonte/Briller/*`)
   foram adicionados em `src/assets/fonts/briller/` com `@font-face`
   self-hosted em `src/styles/fonts-briller.css`, substituindo o placeholder
   Baloo 2. Como a Briller tem uma proporção de cap-height bem diferente da
   Baloo 2, recalibrei `--fs-display-sm/md/lg/xl` (`tokens.css`) e a
   largura/line-height do headline do Hero (`Hero.css`) medindo diretamente o
   render `Figma/Home.png` (altura do "T" e largura do bloco de texto) —
   ficou muito próximo da quebra de linha original (6 linhas no Figma vs. 7
   linhas na implementação atual), mas como o texto do Figma foi exportado
   como vetor (sem tamanho/tracking exatos), não dá pra garantir 100% de
   coincidência de pixel a pixel; vale um confere visual seu.
3. **`package.json`**: removida a dependência `@fontsource/baloo-2` (não é
   mais usada).
4. **Lag no Hero.** O vídeo de fundo (`hero-silhouette.mp4/webm`) tinha
   `mask-image`/`-webkit-mask-image` aplicada continuamente sobre um vídeo em
   reprodução (custo alto de composição/GPU), redundante com o
   `.hero__vignette` (uma camada estática que já produz o mesmo esmaecimento
   visual). Removi a máscara em `Hero.css`. Além disso, o vídeo original
   estava em 1920x1080 com ~16s; recodifiquei para 1280x720 mantendo a
   mesma taxa de quadros, reduzindo o arquivo de ~3MB+ para 537KB (mp4) /
   420KB (webm) — menos dados pra decodificar por quadro.
5. **Vídeo de fundo do Hero desenquadrado + travamento no loop.** O
   `object-position` do vídeo (`.hero__portrait`) estava em `78% 30%`,
   deslocando a silhueta bem mais para a direita do que no Figma; medindo o
   enquadramento real do Figma (crop do Hero em `Figma/Home.png`) contra o
   vídeo, corrigi para `63% 20%` (e o equivalente no breakpoint mobile).
   Separadamente, o vídeo original (`Background_v.mp4`) não voltava ao
   quadro inicial ao terminar — o `loop` do HTML criava um corte visível
   ("travamento") a cada repetição. Recodifiquei como "boomerang" (o próprio
   vídeo tocando pra frente e depois de trás pra frente, concatenados), o
   que garante que o último quadro é idêntico ao primeiro — o loop agora é
   perfeitamente contínuo.
6. **Cores divergentes do Figma, principalmente nos botões.** Comparando os
   tokens de cor (`tokens.css`) com o SVG exportado da página real do Figma
   (`Home.svg`), nenhum dos hex documentados em `Cores/Paleta.png` aparece
   no arquivo — ou seja, a paleta usada como referência original não bate
   com o que está de fato no design. Medi as cores reais usadas (botão "Ver
   projetos", botão "Ou chama no WhatsApp", CTA "Iniciar um projeto" no
   header, fundo geral, e o indicador verde de "online" na seção de
   Contato) diretamente do SVG/PNG e corrigi `tokens.css`, `global.css` e
   `Contact.css` de acordo (detalhes de cada medição comentados no topo de
   `tokens.css`). Vale copiar/atualizar `Cores/Paleta.png` a partir dessas
   correções se quiser manter os dois em sincronia no futuro.

## Pontos em aberto (ainda sem alteração sua no repositório)

Revisei `src/lib/content.js` e `index.html` no seu repositório local e eles
estão idênticos ao que entreguei — ou seja, os itens abaixo (que você mencionou
já ter alterado) continuam exatamente como antes. Se você alterou em outro
lugar (por exemplo, direto no Hostinger), me avise para eu não sobrescrever;
caso contrário, seguem pendentes:

1. **Divergência de tipografia em `Manual da Marca/`**: as duas imagens dessa
   pasta (`Generated Image ...png`) mostram um guia de marca citando
   "Montserrat" (primária) e "Lora" (secundária). Esse guia não bate com a
   tipografia realmente usada no Figma/Home.png renderizado (que não usa
   nenhuma fonte serifada, e o título é bem mais arredondado que Montserrat).
   Tratei essas duas imagens como uma exploração antiga/descartada e priorizei
   o render final do Figma, conforme a regra de "versão mais claramente
   relacionada ao projeto final" — mas vale confirmar com você.
2. **Redes sociais sem link**: `Redes/Linkedin e Instagram.txt` está vazio.
   Os ícones de LinkedIn e Instagram estão no rodapé, mas sem `href` (ficam
   com aparência apagada/"pendente"). Assim que tiver as URLs, atualize
   `src/lib/content.js` → `FOOTER.redes` (e o `sameAs` no JSON-LD de
   `index.html`).
3. **E-mail "pot@yurimatha.com.br"**: mantive exatamente como está escrito no
   Figma renderizado. Se for erro de digitação (ex.: "oi@" ou "contato@"),
   me avise para corrigir — não alterei por conta própria.
4. **4º card de projetos ("Aplicativo de Passagens")**: o card se estende
   além da borda direita do artboard do Figma (1440px), e o PNG exportado
   corta exatamente nesse limite — não existe pixel a mais pra ler. O texto
   "Design system e componentes reutilizáveis para o app de compra de
   passagens" é minha melhor reconstrução a partir do que ficou visível
   (ver `src/lib/content.js` → `PROJETOS.cards[3]`); vale conferir a frase
   exata direto no arquivo Figma.

## Relatório de copy (opcional, não aplicado)

`super-copy-relatorio.html` traz 3 sugestões de teste A/B pelos princípios
clássicos de copywriting. Nenhuma foi aplicada ao site — a copy ativa
continua sendo a oficial do Figma/PDF, como pedido no briefing.
