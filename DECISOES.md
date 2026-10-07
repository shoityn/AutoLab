# Decisões tomadas sem o Shoity

Branch **`feat/visual`** (nada enviado para a `main` nem publicado).

Duas sessões autônomas:

1. **06/10, manhã** — integração da marca, do mascote, da fachada e da Sala 1 (pasta `tt/`).
2. **06/10, noite** — entrega da `ENTREGA-CODIGO`: preloader, fachada em camadas, salas 2 a 5 com arte, transições e Expedição, seguindo o `PROMPT-AGENTE.md`, o `PLANO_v2.1.md` e as discussões 03, 04 e 07.

As decisões marcadas com ⚠️ divergem de algum documento e merecem conferência.

---

## Parte 2 — o que foi feito na segunda sessão (a mais recente)

### O que veio na entrega

| Novo | Detalhe |
|---|---|
| `salas/2,3,4/cena.webp` | Arte final (1920 × 1080, 66 a 134 KB) |
| `salas/5/cena-provisoria.png` | Blockout cinza — a arte da Sala 5 saiu repetindo a Sala 4 e será corrigida por edição (roteiro em `pendente-sala5/`) |
| `fachada/cena.webp` | Agora **com furo transparente no portão** (a versão anterior era opaca) |
| `fachada/portao.webp` | Portão recortado, para subir por `clip-path` |
| `og-image.png` | 1200 × 630, pronta |
| `src-data/estacoes.json` | **Formato v3**: um objeto com `versao`, `mundo`, `abertura`, `salas[]` e `expedicao` |

### Implementado

- **Preloader** com progresso real dos assets (tabelas A e B do roteiro 04): caracteres rolando na tela do Zinos, porcentagem, barra, olhos que acendem, "Sistema pronto!" escrito letra a letra, sorriso e saída. Mínimo de 1,2 s na tela. As Salas 2 a 5 carregam em segundo plano depois que a fachada aparece.
- **Fachada em camadas** exatamente como a discussão 03 descreve: o vão do portão mostra a própria Sala 1, a fachada entra por cima com o furo, o portão sobe por `clip-path` e a câmera mergulha pelo vão (`aproximacao` 3,8). Logo sobre a placa, Zinos flutuando, fumaça na chaminé.
- **Chamada "Como uma máquina aprende?"**, botões, e a **cópia ZN-xx** aparecendo ao lado quando há progresso salvo. "Recomeçar" confirma **dentro da página**.
- **Aviso de orientação** como camada por cima (não é estado da máquina), com a cabeça do Zinos e o ícone de celular girando juntos e o "Continuar assim mesmo" gravado em `sessionStorage`.
- **Salas 2 a 5** a partir do JSON, com os hotspots nas coordenadas corrigidas do doc 07.
- **Rótulo "Por quê?"** da Sala 5 em HTML por cima da tela da parede (ciano, IBM Plex Mono) — texto nunca vem da imagem gerada.
- **`<Passagem>`** com os 5 efeitos do roteiro (`tunel`, `elevador`, `portaDupla`, `vidro`, `luz`), só CSS/SVG, com `onMeio` trocando a sala e `onFim` liberando os toques.
- **Painel lateral** no celular deitado: ocupa ~55% da largura, do lado oposto ao objeto, e a câmera desloca o enquadramento para a metade livre. No PC e em retrato abre centralizado.
- **Expedição**: fundo da Sala 5 desfocado sob véu escuro, a cópia com a cabeça desligada que **liga** com flash ciano, número de série, Zinos acenando com o balão, Compartilhar (Web Share API com fallback de copiar o link) e Recomeçar com confirmação inline.
- **Mascote** com as 8 expressões, piscada aleatória a cada 3–5 s e troca de expressão por crossfade; aparece no preloader, no HUD, nos cards, no quiz e na Expedição.
- **Parallax do PC** (`hover: hover` + `pointer: fine`), desligado com movimento reduzido e durante foco/card/quiz/transição.
- **`aproximacao` relativa** à visão geral, com clamp do pan — foi a mudança da v2 para a v2.1 na câmera.
- **Progresso v3** com `serie` (ZN-01 a ZN-99, sorteado por jogador). Progresso de outra versão é descartado.
- **index.html**: favicon SVG + ICO 48, apple-touch-icon, `theme-color #1E222A`, og/twitter completos com URL absoluta, IBM Plex Sans 400/600 e IBM Plex Mono 400.

### ⚠️ Decisões e divergências desta sessão

**1. Os SVGs da entrega não foram copiados — os do repositório já eram iguais.**
Todos os 19 SVGs (`marca/`, `mascote/`, `favicon`) são idênticos aos que já estavam no repo, exceto por um bloco `<metadata>` de proveniência C2PA que cada arquivo carrega (~16 KB cada, ~300 KB no total). Mantive as versões limpas e copiei só os arquivos realmente novos (as cenas, a fachada, o portão, a og-image e o apple-touch-icon). Se quiserem a proveniência no repositório, é só copiar a pasta por cima.

**2. O `Mascote` é uma transcrição em JSX, não o SVG injetado em runtime.**
O prompt pedia para injetar `zinos-cabeca.svg` inline. O preloader precisa desenhar o Zinos **antes** de qualquer asset carregar, e um fetch ali atrasaria justamente a primeira tela. Os grupos continuam acessíveis (expressão e `[data-olhos]` para a piscada), que é o que as animações pedem. Se o arquivo mudar, a transcrição precisa ser atualizada junto.

**3. A URL do site continua `shoityn.github.io`.**
O `PLANO_v2.1.md` e o `PROMPT-AGENTE.md` dizem `glaubershoity.github.io`, mas o repositório e o `index.html` sempre usaram `shoityn`. **Confira qual é a certa** — está em dois lugares: `index.html` (meta tags) e `SITE_URL` em `src/components/Expedicao.jsx`.

**4. O GoatCounter ficou atrás de uma constante vazia.**
`window.GOATCOUNTER_CODE` no `index.html`. Enquanto estiver `''`, o script nem é carregado (nada de requisição para um domínio que não existe). Basta preencher com o código da conta.

**5. O id da Sala 5 é `expedicao` e o estado final também se chama `expedicao`.**
Vieram assim no JSON da entrega. Não colidem (um é `sala.id`, o outro é `estado.estado`), mas é uma pegadinha se alguém mexer no reducer.

**6. O torso da cópia tem "ZN-07" impresso no próprio SVG.**
O número de série sorteado (ex.: ZN-42) aparece abaixo da cópia, mas o `2-tronco.svg` tem "ZN-07" desenhado. Fica estranho lado a lado. Não mexi no asset: ou se apaga o texto do SVG, ou se aceita que ZN-07 é o "modelo" e ZN-42 é a unidade.

**7. O rótulo "Por quê?" sobe um pouco em relação à coordenada do JSON.**
O anel do hotspot e o rótulo compartilham o mesmo x/y (960, 320) e ficavam um em cima do outro. O rótulo de estilo `tela` é desenhado deslocado para cima, para os dois se lerem. Quando a arte final da Sala 5 chegar e os x/y forem reconferidos, vale revisar.

### Dois bugs encontrados e corrigidos

**O preloader travava na própria saída.** A sequência final agendava "sorrir" (1,2 s) e "sair" (1,6 s) no mesmo efeito, com a fase como dependência. Ao sorrir, a fase mudava, o React limpava o efeito — e com ele o temporizador da saída, que ainda não tinha disparado. O jogo ficava preso na primeira tela, com o Zinos sorrindo para sempre. Agora o que dispara a saída é um estado que muda **uma única vez**, e o sorriso é um estado separado.

**Transições presas quando o navegador congela o rAF.** Vários pontos do jogo dependiam do `onComplete` de uma timeline do GSAP para avançar de estado (abrir o painel, trocar de sala, entrar pelo portão). Se a aba vai para segundo plano — alguém escaneia o QR e troca de app — o rAF congela, a timeline para no meio e o `onComplete` nunca chega. Criei `comSalvaguarda()` em `src/lib/transicoes.js`: o callback roda no fim da animação **ou** depois de um limite de relógio, o que vier primeiro, e só uma vez.

### Como foi testado

Fluxo completo no navegador: preloader → fachada → mergulho pelo portão → Sala 1 → ler os 4 registros → quiz errando e acertando (Zinos triste → feliz, dica no balão) → peça montada no HUD → saída → passagem túnel → Sala 2. Depois, por progresso salvo: Sala 3, Sala 4 e Sala 5 (com o "Por quê?"), e a Expedição com a cópia ligando e o número de série.

Também conferidos: "Continuar turno" com a cópia na fachada, confirmação inline do "Recomeçar", painel lateral num viewport de 820 × 390, aviso de girar num viewport de 400 × 720, e persistência em `localStorage`.

`npm run lint` e `npm run build` limpos.

---

## Parte 1 — decisões da primeira sessão (ainda valem)

### Mundo em paisagem 1920 × 1080

Confirmado pelo `PLANO_v2.1.md`, que adotou a mesma mudança: o mundo 1000 × 1600 em retrato da v2 foi descartado porque toda a arte é 16:9.

### O jogo pede o celular deitado

Em retrato aparece o aviso para girar, com "Continuar assim mesmo". Igual ao que a v2.1 descreve na seção 4.5.

### Visão geral com faixas laterais (contain)

A parede inteira sempre cabe na tela; a sobra vira faixa na cor `--bg`.

### Câmera limitada às bordas do mundo

Ao aproximar de um objeto perto da borda a câmera para na borda em vez de mostrar o vazio.

### Peças da cópia

`base, tronco, nucleo, bracos, cabeca`, seguindo os nomes dos arquivos de `public/mascote/pecas/`, uma por sala na ordem 1–5. Na Expedição a cabeça apagada vira a acesa (`5-cabeca-ligada.svg`).

### O ciano da marca é a cor da interação

Token `--hotspot`, fixo em `#67E8F9` em todos os ambientes. No Ambiente 1 o `--acento` é laranja queimado, quase a mesma cor da luz do galpão: um anel pulsante nessa cor sumiria.

### Um bug corrigido na primeira sessão

Os painéis abriam com `autoAlpha` do GSAP, que aplica `visibility: hidden`. Elemento invisível não recebe foco, então o foco inicial no título do card nunca funcionava — a acessibilidade exigida na seção 11 estava quebrada sem aparecer. Trocado por `opacity`.

---

## O que ficou pendente

| Item | Situação |
|---|---|
| **Arte da Sala 5** | Blockout provisório. O roteiro de edição está em `ENTREGA-CODIGO/pendente-sala5/PROMPT-sala5-edicao.txt`. Quando sair: salvar como `public/salas/5/cena.webp` e trocar `camadas.cena` da sala `expedicao` no JSON. |
| **Camada `frente` e parallax forte** | O código já lê `camadas.frente` e move a camada no PC, mas nenhuma sala tem esse arquivo ainda. Hoje o parallax move só a cena, de leve. |
| **GoatCounter** | `GOATCOUNTER_CODE` vazio no `index.html`. |
| **URL do Pages** | `shoityn` × `glaubershoity` — conferir (item ⚠️ 3). |
| **Revisão do conteúdo** | Os textos vieram prontos na entrega; a revisão do grupo continua valendo. |
| **Teste no Galaxy A12** | Não dá para fazer daqui. É o critério de aceite do plano. |
| **Lighthouse mobile** | Não medido. |
| **Merge na `main`** | A branch `feat/visual` está pronta; a `main` continua como estava. |

---

## Para retomar

```bash
git checkout feat/visual
npm run dev          # http://localhost:5173/AutoLab/
```

Modo debug: `?debug=1` liga a grade do mundo e mostra a coordenada de cada toque.

Depois de conferir:

```bash
git checkout main && git merge feat/visual
```

Commits das duas sessões, do mais antigo para o mais novo:

```
31d618f chore: adiciona os assets finais (marca, mascote Zinos, fachada, sala 1) ao public
c15fc4b feat: mundo passa para 1920x1080 (paisagem) e estacoes.json ganha as 5 salas
f7b2d97 feat: robo montado com as 5 pecas entregues e mascote Zinos com expressoes
baf9055 feat: fachada jogavel, transicoes de camera entre salas e as 5 salas no jogo
65e780c content: nova og-image com o Zinos, icones da marca e meta tags revisadas
46c770d fix: painel usa opacity em vez de autoAlpha (visibility hidden impedia o foco)
d681d09 docs: README atualizado e DECISOES.md
03b3b75 chore: assets das salas 2 a 5, fachada com vao transparente e conteudo v3
3bb81e5 feat: preloader, fachada em camadas, passagens entre salas e expedicao com a copia ZN-xx
ece82b2 fix: salvaguarda de tempo nas transicoes que dependem do fim da animacao
332d04c fix: preloader nao travava mais na saida
```
