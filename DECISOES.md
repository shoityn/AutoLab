# Decisões tomadas sem o Shoity — integração da arte (06/10/2026)

Sessão de trabalho autônoma a partir da pasta `tt/`, que trouxe a marca, o mascote, a fachada e a Sala 1 prontas. Branch: **`feat/salas-arte`** (nada foi enviado para a `main` nem publicado).

Este documento lista **o que foi decidido sem aprovação** e **o que foi construído**. As decisões marcadas com ⚠️ divergem do `PLANO.md` e merecem uma conferência antes de seguir.

---

## 1. O que a pasta `tt/` entregou

| Arquivo | O que é |
|---|---|
| `marca/*.svg` (11) | Logotipo AutoLab: horizontal, vertical, mono preto/branco e símbolo isolado |
| `mascote/corpo-*.webp` (3) | Zinos de corpo inteiro: acenando, neutro, desligado |
| `mascote/zinos-cabeca.svg` | Folha com **8 expressões** da cabeça (neutro, feliz, triste, explicando, indicando, pensando, carregando, desligado) |
| `mascote/pecas/*.svg` (6) | As 5 peças do robô, numeradas, + variante da cabeça ligada |
| `fachada/cena.webp` + `portao.webp` | Fachada em 1920 × 1080, com o vão do portão e a placa deixados em branco |
| `salas/1/cena.webp` | Sala 1 (Recebimento & Ingestão) em 1920 × 1080 |
| `coordenadas.json` | Posição exata de cada hotspot da Sala 1 e de cada encaixe da fachada |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` | Ícones com o símbolo da marca |

Tudo foi copiado para `public/`. A pasta `tt/` ficou intacta no disco e entrou no `.gitignore` (é duplicata) — **pode apagar quando quiser**.

---

## 2. Decisões que divergem do PLANO.md

### ⚠️ 2.1 O mundo virou 1920 × 1080 (paisagem). Era 1000 × 1600 (retrato)

**Motivo:** toda a arte entregue é 16:9 deitada, e o `coordenadas.json` usa esse espaço (hotspots de x = 240 a x = 1760).

**Consequência:** o `PLANO.md` seção 2 dizia "celular em pé, que é como se escaneia QR code". Com a arte deitada isso não fecha: num celular em pé a sala inteira caberia numa faixa de ~220 px de altura, e os anéis de 44 px dos hotspots ficariam sobrepostos (dois deles têm só 45 px de distância entre si nessa escala).

### ⚠️ 2.2 O jogo pede o celular deitado

Em retrato (proporção menor que 1,2) aparece uma tela **"Gire o celular"**, com o Zinos girando e um botão **"Jogar assim mesmo"** — ninguém fica bloqueado.

**Como reverter, se preferirem retrato:** ou re-gerar as cenas em 1080 × 1920, ou implementar panorâmica horizontal na visão geral (o jogador arrasta a sala). As duas são mudanças grandes; por isso a tela de aviso, que é a opção reversível.

### 2.3 Visão geral com faixas laterais (contain), não corte

A sala inteira sempre cabe na tela; a sobra vira faixa na cor `--bg`. Num celular deitado de 19,5:9 ficam ~75 px de faixa de cada lado. A alternativa (preencher a tela cortando) escondia a saída em telas 4:3.

### 2.4 Câmera limitada às bordas do mundo

Ao aproximar de um objeto perto da borda (as caixas em x = 240, por exemplo), a câmera **para na borda** em vez de mostrar o vazio. O objeto fica descentralizado, o que é o comportamento certo e o que todo jogo do gênero faz.

### ⚠️ 2.5 As peças do robô mudaram de nome

O plano previa `base, tronco, nucleo, olhos, antena`. Os arquivos entregues são `1-base, 2-tronco, 3-nucleo, 4-bracos, 5-cabeca`. **Adotei os nomes dos arquivos**, e a ordem numérica virou a ordem das salas:

| Sala | Peça |
|---|---|
| 1 — Recebimento & Ingestão | base (flutuação) |
| 2 — Linha de Processamento | tronco |
| 3 — Processamento Neural | núcleo |
| 4 — Inspeção de Qualidade | braços |
| 5 — Expedição & Análise | cabeça |

Na Expedição a cabeça é trocada pela variante **ligada** (`5-cabeca-ligada.svg`, rosto feliz): o robô literalmente acorda no fim. Esse uso do arquivo extra foi dedução minha, mas é claramente para o que ele existe.

### 2.6 O ciano da marca virou a cor da interação

Criei um token `--hotspot`, fixo em `#67E8F9` (a cor dos olhos do Zinos), usado em **todos os ambientes**. O `--acento` de cada ambiente ficou para os estados já concluídos.

**Motivo:** no Ambiente 1 o `--acento` é laranja queimado `#B45309`, quase a mesma cor da luz do galpão — um anel pulsante nessa cor sumiria. O ciano é complementar, salta, e lê como "o robô está apontando".

### 2.7 O id da Sala 5 virou `entrega`

Era `expedicao`, que colidia com o nome do estado final da máquina de estados. Nada visível muda.

### 2.8 A fonte continua a do sistema

O `PLANO.md` deixa a escolha (Orbitron / Chakra Petch / Inter / Space Grotesk) para a Fase C, como pendência do Shoity. **Não escolhi** — a pilha é `Inter, ui-sans-serif, system-ui, …`, então basta carregar a Inter (ou trocar o nome) quando decidirem. Nenhuma fonte externa é baixada hoje.

---

## 3. O que foi construído

### 3.1 Fundação

- **Mundo e câmera** (`useCamera.js`) reescritos para 1920 × 1080, com limite de borda, `contain` na visão geral e detecção de retrato.
- **Medida real do viewport**: a câmera e o overlay de hotspots usam a mesma medida (`getBoundingClientRect` do viewport), porque em celular `100dvh` nem sempre bate com `innerHeight` — se divergirem, os anéis param deslocados dos objetos.
- **Dois slots de mundo** (`Mundo.jsx`): durante a transição entre salas as duas cenas ficam montadas. O transform inicial já sai pronto no primeiro paint, para a cena nunca piscar em escala 1:1.

### 3.2 Recepção — fachada jogável

A fachada deixou de ser uma tela de texto e virou cena de verdade, montada nas coordenadas entregues:

- portão de rolo encaixado no vão, com interior escuro atrás dele;
- logotipo na placa luminosa;
- Zinos acenando na calçada, flutuando de leve;
- fumaça saindo da chaminé.

**"Iniciar turno"** executa a transição do plano (seção 4.4): o portão enrola para cima, a câmera mergulha pelo vão até zoom 3,8 (o valor `aproximacao` que veio no `coordenadas.json`), a fachada some e a Sala 1 entra vinda de uma escala menor.

### 3.3 Salas

- **Sala 1** com a arte final e os 5 hotspots exatamente em cima dos objetos (caixas, etiqueta rasgada, balança, contador, prancheta).
- **Salas 2 a 5** com cenário provisório desenhado em SVG no mesmo enquadramento de 1920 × 1080, com os objetos nas coordenadas já definidas. **O jogo é jogável do início ao fim.** Quando a arte final de cada sala chegar, basta acrescentar `"cena": "salas/<n>/cena.webp"` no JSON e conferir as coordenadas no `?debug=1`.
- **Transição entre salas** implementada conforme a seção 6.6: pan até a saída → zoom através dela → a próxima sala chega.

### 3.4 Conteúdo

`src/data/estacoes.json` reescrito: **5 salas, 20 cards e 5 quizzes**, distribuídos pelos objetos da tabela da seção 7 do plano. Textos de ~60 palavras, terminologia técnica.

⚠️ **Os textos das salas 2 a 5 foram escritos por mim**, a partir dos temas definidos no plano (limpeza, outliers, normalização, seleção de atributos; perceptron, pesos, bias, ativação; matriz de confusão, precisão, revocação, gerações; aplicações, limitações, XAI, monitoramento). **Precisam da revisão técnica da Kamilla e do Wellington**, e devem ser conferidos contra o relatório PACEX quando ele chegar — o plano prevê isso até 17/10.

### 3.5 Robô e mascote

- `Robo.jsx` monta as 5 peças reais empilhadas (base → braços → tronco → núcleo → cabeça). Cada peça nova entra com `bounce.out`.
- `Zinos.jsx` transcreve a folha de expressões para React: a cabeça aparece na Recepção (feliz), no cabeçalho de cada card (explicando), no quiz (pensando → triste ao errar → feliz ao acertar) e na Expedição.

### 3.6 Interface

- **Hotspots** redesenhados: anel pulsante em CSS, 44 × 44 px de toque, e um ícone diferente por estado (ℹ novo, ✓ lido, 🔒 trancado, ? liberado, → saída) — a sinalização nunca depende só de cor.
- **HUD** com símbolo da marca, nome da sala, contador numérico + pontinhos, robô em miniatura e botão de recomeçar.
- **Card e quiz** no estilo da marca, com cabeçalho do Zinos. No quiz as alternativas são rotuladas A–D e viram ✓/✕ ao responder.
- **Expedição** com o robô completo e aceso, fala do Zinos, compartilhar (Web Share API com `wa.me` de reserva) e créditos.

### 3.7 Acessibilidade

- Foco preso dentro do painel aberto (Tab e Shift+Tab circulam), `Esc` fecha, foco volta ao hotspot ao fechar.
- Ordem de tabulação conferida: hotspots da esquerda para a direita → saída → menu do HUD.
- `prefers-reduced-motion` desliga câmera, parallax, fumaça e pulso — e o jogo continua inteiro.
- `aria-live` no aviso de "sala trancada" e no contador de peças.

### 3.8 Marca e metadados

- Favicon, `favicon.ico` e `apple-touch-icon` ligados; `theme-color` com a cor do galpão.
- **`og-image` refeita**: a antiga ainda era do visual v1 (robô laranja genérico). A nova usa a fachada, o logotipo e o Zinos acenando. A página que a gera ficou versionada em `ferramentas/og.html`, com as instruções para regerar.

### 3.9 Um bug corrigido no caminho

Os painéis abriam com `autoAlpha` do GSAP, que aplica `visibility: hidden`. Elemento invisível **não recebe foco**, então o foco inicial no título do card nunca funcionava — a acessibilidade exigida na seção 11 estava quebrada sem aparecer. Trocado por `opacity`.

---

## 4. Como foi testado

Testado no navegador, de ponta a ponta: fachada → mergulho pelo portão → Sala 1 → ler os 4 registros → quiz (errando e acertando) → peça montada no HUD → saída → Sala 2 → ... → Expedição com o robô completo. Verificados também: persistência em `localStorage`, "Continuar o turno", bloqueio de toques durante a transição, tela de retrato (em viewport de 430 × 800) e `Esc` fechando o painel.

`npm run lint` e `npm run build` limpos. Console do navegador sem erros.

---

## 5. O que ficou pendente (e por quê)

| Item | Situação |
|---|---|
| **Arte das salas 2 a 5** | Cenário provisório no lugar. É a entrega da Fase C (Kamilla/Wellington, até 22/10). |
| **Revisão técnica dos textos novos** | Salas 2 a 5 escritas por mim; precisam do relatório PACEX e da revisão da dupla. |
| **Fonte** | Não escolhi, é decisão de vocês (pendência do plano, até 18/10). |
| **GoatCounter** | `index.html` ainda tem `seucodigo` no lugar do código real (a conta ainda não existe). |
| **Parallax entre camadas** | A infraestrutura (`data-profundidade`) está pronta, mas a Sala 1 veio como uma imagem única, sem camadas. Só entra se a arte final vier separada em fundo/meio/objetos/frente. |
| **Merge na `main`** | Deixei na branch `feat/salas-arte`. A `main` continua como estava, e o Pages não publicou nada. |

---

## 6. Para retomar

```bash
git checkout feat/salas-arte
npm run dev          # http://localhost:5173/AutoLab/
```

Depois de conferir, para levar para a `main`:

```bash
git checkout main && git merge feat/salas-arte
```

Commits da sessão:

```
31d618f chore: adiciona os assets finais (marca, mascote Zinos, fachada, sala 1) ao public
c15fc4b feat: mundo passa para 1920x1080 (paisagem) e estacoes.json ganha as 5 salas
f7b2d97 feat: robo montado com as 5 pecas entregues e mascote Zinos com expressoes
baf9055 feat: fachada jogavel, transicoes de camera entre salas e as 5 salas no jogo
65e780c content: nova og-image com o Zinos, icones da marca e meta tags revisadas
46c770d fix: painel usa opacity em vez de autoAlpha (visibility hidden impedia o foco)
```
