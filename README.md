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

## Limitações e pontos em aberto (favor revisar)

1. **Fonte de título "Briller" não encontrada na pasta.** O manual de marca e uma
   conversa anterior citam "Briller" (títulos) + "Poppins" (corpo), mas nenhum
   arquivo de fonte (.otf/.ttf/.woff) está na pasta do projeto, e o texto do
   Figma foi exportado como vetor (sem metadados de fonte). Usei **Baloo 2**
   como substituto temporário — é a família redonda/bold mais próxima do que
   aparece no render oficial. Envie o arquivo da fonte Briller (ou confirme
   que não deve ser usada) e eu troco em `src/main.jsx` + `tokens.css`
   (`--font-display`) em poucos minutos.
2. **Divergência de tipografia em `Manual da Marca/`**: as duas imagens dessa
   pasta (`Generated Image ...png`) mostram um guia de marca citando
   "Montserrat" (primária) e "Lora" (secundária). Esse guia não bate com a
   tipografia realmente usada no Figma/Home.png renderizado (que não usa
   nenhuma fonte serifada, e o título é bem mais arredondado que Montserrat).
   Tratei essas duas imagens como uma exploração antiga/descartada e priorizei
   o render final do Figma, conforme a regra de "versão mais claramente
   relacionada ao projeto final" — mas vale confirmar com você.
3. **Redes sociais sem link**: `Redes/Linkedin e Instagram.txt` está vazio.
   Os ícones de LinkedIn e Instagram estão no rodapé, mas sem `href` (ficam
   com aparência apagada/"pendente"). Assim que tiver as URLs, atualize
   `src/lib/content.js` → `FOOTER.redes` (e o `sameAs` no JSON-LD de
   `index.html`).
4. **E-mail "pot@yurimatha.com.br"**: mantive exatamente como está escrito no
   Figma renderizado. Se for erro de digitação (ex.: "oi@" ou "contato@"),
   me avise para corrigir — não alterei por conta própria.
5. **4º card de projetos ("Aplicativo de Passagens")**: o card se estende
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
