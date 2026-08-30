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
