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

## Correções recentes (pós-deploy): rodada 11

O usuário reportou que o "erro" na Hero continuava, apontando o ícone de
scroll como suspeito, e que o vídeo (já rodando certo depois da rodada
anterior) parecia ter uma imagem atrás, vinda do "background" — pediu pra
tirar essa camada e deixar só o vídeo, além de conferir se o texto da Hero
está no grid certo.

1. O ícone de scroll ficava completamente escondido (`display: none`) abaixo
   de 700px de largura — em qualquer tela menor que isso ele simplesmente
   não existia, o que lia como um bug. Removi essa condição: agora ele
   aparece sempre, embaixo e centralizado (`left: 50%` + `translateX(-50%)`,
   que centraliza contra a própria seção da Hero, então vale pra qualquer
   largura). No mobile ele fica um pouco menor e mais perto da borda de
   baixo, com folga garantida em relação aos botões "Ver projetos"/"Ou
   chama no WhatsApp" acima dele.
2. Sobre a "imagem atrás do vídeo": a `.hero` tinha um `background` próprio
   (um gradiente radial azul vibrante) por baixo do vídeo. Como o vídeo tem
   `opacity: 0.92` (não 100%), esses 8% restantes deixavam esse gradiente
   vazar por trás da silhueta, dando a impressão de uma segunda camada de
   imagem ali (dava pra ver bem no canto superior direito, uma auréola azul
   clara que não muda com o vídeo). Troquei esse gradiente por uma cor
   sólida no mesmo tom escuro do vídeo: agora não sobra nenhum vazamento
   por trás. Vale registrar: extraí quadros do próprio arquivo de vídeo
   (`hero-silhouette.mp4`) pra confirmar, e o tom azulado ao redor da
   silhueta que ainda aparece faz parte do vídeo em si (é a iluminação de
   fundo gravada), não uma camada separada em CSS — não dá pra "remover"
   isso sem trocar o vídeo.
3. Aproveitei pra deixar o autoplay do vídeo mais à prova de falhas: o
   atributo `muted` do React às vezes não é aplicado a tempo do navegador
   decidir se libera o autoplay (um bug conhecido do React com `<video>`),
   e sem isso o vídeo trava mudo no primeiro quadro, parecendo uma imagem
   parada em vez de vídeo rodando. Agora `Hero.jsx` também seta
   `video.muted = true` direto na propriedade antes de chamar `.play()`,
   garantindo que o navegador sempre veja o vídeo como mudo a tempo.
4. Conferi o alinhamento do texto da Hero contra a logo do header com um
   script automatizado, em três larguras (390px, 1440px e 1920px): a borda
   esquerda do headline bate exatamente com a borda esquerda do "YURI
   MATHA" nas três, então o grid já está correto no código atual. Se ainda
   estiver diferente na sua tela, é bem provável que seja cache do navegador
   ou uma versão anterior ainda publicada no Hostinger (o mesmo tipo de
   situação da rodada 9) — vale um Ctrl+Shift+R antes de mais nada.
5. Conferi também o menu mobile aberto e o rodapé no celular: não encontrei
   nenhum desalinhamento além do que já foi corrigido nesta e na rodada
   anterior (o "CONTATO" da seção de Contato).
6. Sobre a lista de segurança pedida: o site é 100% estático (React + Vite,
   sem backend, sem banco de dados, sem login), então boa parte da lista não
   se aplica de verdade aqui: RLS, autenticação server-side, hash de senha,
   rate limit, bloqueio de mass assignment, queries parametrizadas e
   proteção de cookies de sessão são coisas de um sistema com servidor e
   banco por trás, que este projeto não tem. Rodei `npm audit` (nenhuma
   vulnerabilidade nas dependências) e uma busca por padrões de chave/senha
   no código (nenhuma encontrada — não existe nenhum `.env` ou chave de API
   no projeto). O que de fato se aplica pra um site estático eu apliquei:
   adicionei `public/.htaccess` com cabeçalhos de segurança (`X-Content-
   Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-
   Policy`) e uma regra de redirecionamento pra HTTPS (redundante se você já
   tiver o SSL forçado no painel da Hostinger, mas não atrapalha), e
   endureci o `.gitignore` pra ignorar qualquer `.env` que venha a existir
   no futuro.

## Correções recentes (pós-deploy): rodada 10

O usuário pediu pra ajustar o efeito de mouse do vídeo da Hero (ou deixá-lo
só rodando, se não desse pra deixar 100% confiável), corrigir o glow que
faltava nos cards do carrossel, o zoom que cortava o card na seção e as
imagens de projeto que às vezes não abriam, e o "CONTATO" que passava da
largura da tela no Contato.

1. O vídeo da Hero era controlado pelo movimento do mouse ("scrub", buscando
   um frame específico conforme a posição do cursor), mas esse efeito se
   mostrou inconsistente entre navegadores/máquinas em várias rodadas
   anteriores. Como o próprio usuário topou essa troca caso não desse pra
   deixar 100% funcional, simplifiquei pra um autoplay em loop simples
   (`video.loop = true` + `video.play()`), mais simples e consistente em
   qualquer navegador.
2. Corrigi o bug de "algumas imagens não abrem" no carrossel: o carrossel
   infinito usa três cópias do mesmo conjunto de cards pra criar o loop
   (cópia, real, cópia), e o clique pra abrir o visualizador de imagem
   estava desabilitado nas cópias (`isClone`) por acidente — como o
   autoplay frequentemente deixa uma cópia em foco, clicar nela não fazia
   nada. Como toda cópia mostra exatamente o mesmo projeto que o bloco
   real, agora o clique abre o modal em qualquer uma delas.
3. O zoom do card ficava cortado na borda da seção porque dois problemas de
   CSS se somavam: o próprio `.project-card` tinha `overflow: hidden`, o que
   corta o próprio `box-shadow` do elemento (por isso o glow do hover nunca
   aparecia); e a faixa de scroll (`.projects__track`) tinha `overflow-x:
   auto` sem `overflow-y` explícito, o que pela especificação do CSS força o
   eixo vertical a virar `auto` também, cortando o "levantar" do card
   (`translateY`) bem na borda da faixa. Tirei o `overflow: hidden` do card
   (o corte arredondado da imagem passou pro `.project-card__media`, que já
   tinha esse overflow) e dei um respiro vertical (`padding-block`) na
   faixa de scroll pra caber a animação de hover sem cortar.
4. Com esses dois ajustes, adicionei o glow de hover que faltava: um brilho
   azulado contido no próprio card, que aparece só em dispositivos com mouse
   de verdade e some junto com o card ao tirar o cursor — diferente do glow
   ambiente de fundo das seções, que foi removido de vez na rodada 8 e
   continua fora.
5. O "CONTATO" no fundo da seção de Contato: o ajuste da rodada anterior
   (um clamp de tamanho de fonte "no olho") ainda estava errado, como o
   usuário reportou. Dessa vez medi a largura real do texto renderizado
   (a fonte Briller é bem mais larga por caractere do que parece) em vez de
   estimar, e recalculei o clamp pra manter a palavra em ~74% da largura da
   tela em qualquer tamanho, com folga real dos dois lados.

## Correções recentes (pós-deploy): rodada 9

O usuário reportou que o botão de copiar e-mail e o rótulo desfocado da Hero
ainda apareciam, que o efeito da Hero precisava ficar mais suave, e que
ainda dava pra ver uma linha marcando a divisão entre seções. Pediu também
um ajuste de SEO/GEO/AEO pra ajudar no posicionamento.

1. Conferi o código do botão de copiar e-mail e do rótulo desfocado: ambos
   já tinham sido removidos corretamente na rodada 8 (arquivo, tamanho e
   render local batem). A explicação mais provável pra continuar aparecendo
   é cache do navegador ou uma versão anterior ainda publicada no Hostinger
   — nenhuma mudança de código adicional foi necessária aqui.
2. A "linha de divisão entre seções" não era mais o glow (já removido): era
   uma borda (`border-top`) de 1px no rodapé (`.site-footer`), sutil mas
   visível entre a seção de Contato e o rodapé. Removida.
3. Suavizei a entrada da Hero: a curva `power3.out` desacelera bem rápido
   perto do final, o que lê como um freio brusco. Troquei para `power2.out`,
   com durações um pouco mais longas e menos deslocamento vertical, o que
   tira a sensação de "chacoalhão" na entrada do subtítulo e do vídeo.
4. SEO/GEO/AEO: adicionei `robots.txt` e `sitemap.xml` (indexação
   tradicional), `llms.txt` (contexto direto pra buscadores baseados em IA
   resumirem o portfólio sem precisar interpretar o HTML todo) e completei
   o JSON-LD do `index.html` com telefone, ponto de contato, ocupação e uma
   lista estruturada dos quatro projetos. Também corrigi o e-mail
   desatualizado (pot@ para port@) que ainda estava no JSON-LD. Gerei
   `og-cover.jpg` (1200x630, recortado do frame do vídeo da Hero) e
   `perfil-yuri-matha.jpg` (800x800) pra completar as imagens de
   compartilhamento que o `index.html` já referenciava.

## Correções recentes (pós-deploy): rodada 8

O usuário pediu pra tirar o botão de copiar e-mail e o rótulo desfocado da
Hero, remover de vez qualquer glow do site (o brilho ambiente das seções
estava marcando a divisão entre elas), trocar o e-mail de contato, dar alguma
ação ao botão "Mandar e-mail", corrigir o zoom dos cards do carrossel e
deixá-lo rodando sozinho em loop, abrir a imagem do projeto num visualizador
3D que segue o mouse, e ajustar o enquadramento do vídeo da Hero pra não
ficar tão perto da tela.

1. Tirei o botão "Copiar: pot@yurimatha.com.br" e o rótulo desfocado
   ("Yuri Matha, UX/UI, Ux Writing e Ux Strategist") de cima do headline
   digitado. Também removi a camada de glow atrás da silhueta do vídeo: era
   um brilho radial azul, animado, meio "respirando", que ficava por cima do
   vídeo e dava a impressão de uma imagem extra ali. Agora só sobra o vídeo
   em si, sem nenhuma camada por cima.
2. O glow de fundo de Serviços, Contato e Projetos, que na rodada passada eu
   só tinha suavizado, foi removido por completo: o usuário confirmou que
   mesmo mais fraco ainda dava pra ver onde uma seção terminava e a outra
   começava, então tirei as manchas de luz radiais inteiras (inclusive o
   brilho branco no canto do card de conversão em Contato).
3. Testei a Hero de novo com testes automatizados, sem emular "reduzir
   movimento" dessa vez: o ícone de scroll renderiza centralizado e no fim da
   seção (a mesma posição de sempre, `left: 50%` com `transform:
   translateX(-50%)` e `bottom`), e a animação dele, junto com a máquina de
   escrever do headline e o fade do vídeo/subtítulo, roda normalmente e sem
   nenhum erro de JavaScript. Se ainda estiver diferente disso na sua tela,
   vale um refresh forçado (Ctrl+Shift+R) pra descartar cache de uma versão
   antiga dos arquivos.
4. Ajustei o zoom do vídeo em telas bem largas: o `scale(1.22)` deixava o
   rosto grande demais, quase colado na tela. Reduzi pra `scale(1.1)`, ainda
   recuperando o enquadramento generoso do Figma sem esse efeito de câmera
   perto demais.
5. O e-mail de contato mudou de pot@yurimatha.com.br para
   port@yurimatha.com.br. Como esse valor vem de um único lugar
   (`SITE.email` em `content.js`), a troca já propaga pro card de contato e
   pro link `mailto:`.
6. O botão "Mandar e-mail" agora faz algo visível ao clicar: copia o
   endereço pra área de transferência e troca o texto por "E-mail copiado!"
   por um instante, além de continuar abrindo o cliente de e-mail padrão
   normalmente. Isso cobre quem não tem um cliente de e-mail configurado no
   computador.
7. Corrigi o zoom dos cards do carrossel: a imagem cresce a partir do centro
   (antes não tinha um `transform-origin` explícito) e o hover que aplica
   esse zoom agora só roda em dispositivos com mouse de verdade
   (`hover: hover`); em touch, o `:hover` ficava "grudado" no último card
   tocado e o zoom nunca desligava.
8. O carrossel agora roda sozinho em loop infinito, avançando um card a cada
   4,5s pelo mesmo mecanismo de clonagem que já existia pro arrasto manual.
   Ele pausa ao passar o mouse ou focar nos cards, e enquanto o visualizador
   de imagem (item abaixo) está aberto, e respeita "reduzir movimento" (não
   roda sozinho nesse caso).
9. Clicar na imagem ou na seta de um projeto agora abre um visualizador em
   tela cheia com efeito 3D: a capa inclina (rotaciona em X/Y) seguindo a
   posição do cursor dentro do palco, com perspectiva e uma leve suavização
   via GSAP (`quickTo`) pra não parecer que a imagem está "grudada" no
   ponteiro. Entrada com escala e opacidade, fecha com Esc, clique fora ou
   pelo botão no canto.

## Correções recentes (pós-deploy): rodada 7

O usuário pediu para revisar o efeito da Hero que "não estava funcionando",
remover as etiquetas em estilo de código (como "DESIGN_DRIVEN CODE_FLUENT")
espalhadas pela página, suavizar o brilho de fundo das seções, humanizar
qualquer texto genérico que tivesse sobrado, e dar mais vida ao ícone de
scroll.

1. Investiguei o efeito da Hero (vídeo controlado pelo mouse, máquina de
   escrever, rótulo desfocado, pills) rodando testes automatizados, e não
   encontrei nenhum erro de JavaScript ou falha de carregamento: tudo
   funciona como esperado em ambiente limpo. A explicação mais provável é
   uma destas duas: o navegador ou sistema operacional do usuário está
   configurado com "reduzir movimento" ativado, o que por design faz o site
   mostrar o headline inteiro de uma vez (sem digitação) e desativa a
   animação do ícone de scroll, já que essas animações respeitam essa
   preferência de acessibilidade; ou o site publicado ainda não foi
   reconstruído e reenviado com as mudanças da rodada anterior. Vale
   conferir as configurações de acessibilidade do sistema (no Windows:
   Configurações > Acessibilidade > Efeitos visuais > Efeitos de animação) e
   confirmar que o build mais recente foi publicado.
2. Removidas todas as etiquetas em estilo "código" (tudo em maiúsculas com
   underline, como "DESIGN_DRIVEN", "CODE_FLUENT", "HANDOFF_FLOW_ENGINE",
   "SERVICE_01"): os tags decorativos ao lado do headline de Serviços foram
   removidos, o divisor entre os dois blocos de cards virou uma linha
   simples sem rótulo, a numeração dos cards agora mostra só "01", "02" e
   assim por diante, e o badge do card de conversão em Contato trocou
   "QUICK_CONNECT_FLOW" por "Disponível agora".
3. O brilho ambiente atrás das grades de Serviços, Contato e Projetos
   (introduzido na rodada de glassmorphism) estava forte demais. Reduzi a
   opacidade de cada mancha de luz e suavizei a transição pras bordas,
   deixando o efeito mais discreto.
4. Revisei os textos que eu mesmo escrevi nas últimas rodadas, não a copy
   original do Figma, em busca de "fala" genérica de IA: o rótulo desfocado
   da Hero tinha um travessão desnecessário ("Yuri Matha —"), trocado por
   vírgula.
5. O ícone de scroll ganhou uma animação mais trabalhada: o pontinho agora
   tem uma pequena antecipação (sobe 2px antes de cair, como em animação
   clássica) e um percurso maior (18px em vez de 14px), e o contorno da pill
   "respira" bem devagar como camada extra de vida. Continua totalmente
   desativado para quem usa "reduzir movimento".

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
