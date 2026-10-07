# AutoLab — Plano de Desenvolvimento v2.1 (Paredes Ilustradas)

> Site-jogo estático sobre Machine Learning, ambientado numa fábrica. Depois de um **preloader** com o mascote (um robô de rosto-tela), a pessoa chega à **fachada da fábrica**, toca em "Iniciar turno", o portão abre e ela entra em **5 salas**. Cada sala é **uma parede vista de frente, na altura dos olhos**, em estilo **low-poly cartoon** (referência: Roblox/Kogama), com sombras e detalhes. Os pontos de interação ficam nos objetos da parede. Tocar num ponto faz a câmera aproximar e abre o card ou o quiz. A cada quiz acertado, uma cópia do mascote ganha uma peça, até ser ligada na Expedição.

- **Disciplina:** Estágio Supervisionado (PACEX VIII), UNIPAR, prof. Elyssandro Piffer
- **Equipe:** Glauber Shoity Nakai (desenvolvimento), Kamilla Barros Silva e Wellington Henrique da Silva Lima, 8º período de Sistemas de Informação
- **Repositório:** github.com/shoityn/AutoLab
- **Publicação:** GitHub Pages (`https://shoityn.github.io/AutoLab/`)
  > Corrigido em 07/10: o endereço anotado aqui era `glaubershoity`, que **não existe** — é a origem do erro que se espalhou para a discussão 06. Ver `PERGUNTAS-ABERTAS.md`, item 1.1.
- **Prazo final:** site no ar e cartazes distribuídos até **07/11/2026**
- **Versão:** 2.1 (03/10/2026). **Substitui o plano v2.** O que não for citado aqui como alterado continua valendo da v2 (máquina de estados, regra "o reducer decide, a animação reage", acessibilidade).

---

## 0. Para o agente de IA (LEIA PRIMEIRO)

1. A navegação **não é por rolagem**. Tela fixa (`100dvh`, `overflow: hidden`), navegação por toque e animação de câmera.
2. Cada sala é **uma imagem de parede vista de frente** (paisagem, 16:9), com câmera 2.5D por cima. **Não há 3D em tempo real** (sem three.js, sem R3F).
3. O mundo agora é **paisagem: 1920 × 1080**. O mundo 1000 × 1600 da v2 foi descartado.
4. O `zoom` dos hotspots é **relativo à visão geral** (multiplicador), não absoluto. Ver seção 6.
5. Cards e quiz ficam ocultos até o toque no hotspot.
6. Todo texto vem de `src/data/estacoes.json`, inclusive as falas do mascote.
7. **Vertical slice primeiro:** preloader + fachada + Sala 1 com arte final, testados num Galaxy A12, antes de tocar nas Salas 2 a 5.
8. Consulte as skills oficiais do GSAP antes de escrever animações (`npx skills add https://github.com/greensock/gsap-skills`).
9. Se algo conflitar com o código existente, **o plano vence**. Pergunte antes de inventar outro fluxo.

---

## 1. O que muda da v2 para a v2.1

| Tema | v2 | v2.1 | Motivo |
|---|---|---|---|
| Visão da sala | Sala inteira em retrato, vista "de cima" | **Uma parede de frente, altura dos olhos** | Referências escolhidas (The Yellow Room, fotos de sala com parede frontal) |
| Mundo | 1000 × 1600 (retrato) | **1920 × 1080 (paisagem)** | Parede é larga |
| Orientação | Celular em pé | **Celular deitado (paisagem)**, com pedido para girar | Melhor leitura da parede |
| Zoom do hotspot | Absoluto (px por unidade) | **Relativo à visão geral** | O absoluto dava resultados diferentes em cada tela |
| Arte | SVG flat em camadas | **Imagem gerada por IA** em estilo low-poly cartoon + 1 camada de frente recortada | Visual mais rico sem modelar 3D; tempo disponível de ~12h |
| Parallax | Câmera + camadas, celular e PC | **Só no PC, pelo mouse** | Decisão do Shoity |
| Recepção | Fachada simples | **Preloader (rosto do robô) → fachada → portão abre** | "Fachada" do site precisa ser forte |
| Robô | Peças genéricas | **Mascote guia + cópia sendo montada** | Personagem único = menos arte |
| Fontes | Orbitron/Chakra + Inter/Space Grotesk | **IBM Plex Sans + IBM Plex Mono** | Coerência com a tela do robô |
| 3D real | Opcional se sobrar tempo | **Fora do projeto** | Câmera travada não aproveita 3D; orçamento de 12h |

---

## 2. Orçamento de tempo (ler antes de tudo)

O desenvolvimento tem **~4h por semana**, quase todo em vibe code. De 04/10 a 26/10 são **3 semanas ≈ 12h** para identidade, arte e site. Isso é apertado. Portanto:

- O que não está no vertical slice só entra se o slice estiver pronto.
- As Salas 1 e 2 são detalhadas. As Salas 3, 4 e 5 já nascem simplificadas (3 hotspots, cena mais limpa).
- Existe uma **escada de cortes** (seção 14) definida de antemão, para não decidir no desespero.
- Conteúdo (textos, quiz, dicas), cartaz e fotos ficam com o grupo, em paralelo.

---

## 3. Decisões fechadas (v2.1)

| Tema | Decisão |
|---|---|
| Fluxo | Preloader → Fachada → 5 salas → Expedição |
| Sala | 1 parede frontal por sala, câmera travada (sem girar), só zoom e pan |
| Interação | 3 a 4 hotspots de card + 1 de quiz por sala, nos objetos da parede |
| Quiz | 1 pergunta, tentativas livres, dica fixa dita pelo mascote. Trancado até ler os cards |
| Orientação | Paisagem é o modo principal. Em retrato, aviso para girar com opção "continuar assim" |
| Parallax | Só PC (mouse), leve. Desligado com `prefers-reduced-motion` |
| Estilo | Low-poly cartoon com sombras suaves (Roblox/Kogama), de frente, perspectiva de um ponto |
| Progressão de tema | Rústico/metálico → industrial → robótico/sci-fi. Se faltar tempo, mantém um tema só |
| Mascote | Robô com **rosto de tela**. Emoções são desenhos na tela (SVG). Guia a pessoa e é o modelo das cópias montadas |
| Peças da cópia | 1 base/rodas · 2 tronco · 3 núcleo · 4 braços/sensores · 5 cabeça-tela + antena (liga na Expedição) |
| Logo | Símbolo minimalista derivado da cabeça do mascote + "AutoLab" em IBM Plex |
| Música | Não |
| Desktop | Precisa ficar bonito, mas o foco é celular |
| Métricas | GoatCounter |

---

## 4. Experiência do usuário

```
QR code
  → Preloader (rosto-tela do robô "codificando" → olhos acendem → sorri)
  → [aviso "Gire o celular" se estiver em pé]
  → Fachada da fábrica + logo + "Iniciar turno" / "Continuar" / "Recomeçar"
  → [portão abre, câmera entra]
  → Sala 1 → Sala 2 → Sala 3 → Sala 4 → Sala 5
      em cada sala: visão geral da parede → toca hotspot → câmera aproxima → card abre
                    → "Entendi" → volta → ... → quiz destrava → acerta → peça encaixa na cópia → saída acende
  → Expedição (cópia completa liga a tela e sorri, créditos, compartilhar)
```

### 4.1 Preloader
- Fundo `--bg` do ambiente 1. No centro, a **cabeça do mascote** (SVG).
- Na tela do rosto: caracteres em IBM Plex Mono rolando (`01`, `{ }`, `</>`, `▮`), barra de progresso real (assets carregados / total).
- Ao chegar a 100%: os caracteres somem, os olhos acendem, piscam uma vez, expressão "feliz". Transição para a fachada.
- Carrega **só** o necessário para a fachada e a Sala 1. As outras salas carregam em segundo plano depois.
- Mínimo de 1,2 s na tela (para a animação não piscar em conexão rápida). Máximo esperado: ~4 s no 4G.

### 4.2 Fachada
- Imagem da fachada da fábrica (mesmo estilo das salas), logo AutoLab, mascote ao lado acenando (expressão "indicando").
- Botões: "Iniciar turno" (ou "Continuar turno" + "Recomeçar" se houver progresso).
- Ao tocar: o portão abre (camada do portão recortada sobe ou se separa, ~0,8 s) e a câmera faz zoom **através** do vão até a Sala 1.
- No Android, o toque em "Iniciar turno" também tenta `requestFullscreen()` + `screen.orientation.lock('landscape')`. Se falhar (iPhone, navegador do WhatsApp), segue normal, sem erro.

### 4.3 Sala em visão geral
- A parede inteira cabe na tela (modo *contain*). Faixas que sobrarem ficam na cor `--bg`.
- Hotspots: anel pulsante + ícone (informação / ✓ / cadeado / "?"), botão com **mínimo de 44 px na tela**, renderizado em overlay fora do mundo.
- HUD: nome da sala, "Registros 2/4", **avatar do mascote** (só a cabeça, com expressão), miniatura da cópia sendo montada, menu.

### 4.4 Card e quiz (paisagem)
- No celular deitado a altura é pequena (~350 px úteis). O painel abre como **painel lateral** ocupando ~55% da largura, do lado oposto ao objeto focado, com texto rolável dentro do painel.
- No PC e em retrato, o painel abre centralizado.
- Quiz: ao errar, o **mascote** aparece com expressão "triste" e depois "explicando", e a dica aparece num balão de fala. Ao acertar: "feliz", explicação curta, fecha, a peça encaixa na cópia (`bounce.out`), a saída acende.

### 4.5 Retrato (celular em pé)
- Tela de aviso: mascote "indicando" com um ícone de celular girando, texto "Gire o celular para ver a fábrica".
- Botão "Continuar assim mesmo": usa o modo *contain* (a parede fica pequena, mas os hotspots continuam com 44 px e o zoom funciona).
- Se o usuário girar a qualquer momento, reenquadra.
- Lembrete: no iPhone não é possível forçar a orientação, e quem tem a rotação travada precisa destravá-la. Por isso o modo retrato precisa continuar jogável.

### 4.6 Transição entre salas
Igual à v2 (pan até a saída → zoom através dela → próxima sala chega). Com movimento reduzido: crossfade.

---

## 5. Máquina de estados (atualizada)

| Estado | Tela | Eventos | Próximo |
|---|---|---|---|
| `carregando` | Preloader | (assets prontos) | `fachada` |
| `fachada` | Fachada + botões | INICIAR, CONTINUAR, RECOMECAR | `transicao` |
| `visao-geral` | Parede inteira | TOCAR_HOTSPOT, TOCAR_SAIDA (se concluída) | `foco` / `transicao` |
| `foco` | Câmera chegando | (fim da animação) | `card` / `quiz` |
| `card` | Painel do card | ENTENDI, FECHAR | `visao-geral` |
| `quiz` | Painel do quiz | RESPONDER, FECHAR | `quiz` / `visao-geral` |
| `transicao` | Animação | nenhum | `visao-geral` da próxima / `expedicao` |
| `expedicao` | Tela final | COMPARTILHAR, RECOMECAR | `fachada` |

O aviso de orientação é uma **camada por cima**, não um estado: ele não interrompe a máquina.

---

## 6. Câmera 2.5D (alterações sobre a v2)

### 6.1 Mundo e enquadramento

```js
export const MUNDO = { largura: 1920, altura: 1080 };

// Zoom base: a parede inteira cabe na tela
const zoomBase = (vw, vh) => Math.min(vw / MUNDO.largura, vh / MUNDO.altura);

// Visão geral
const visaoGeral = (vw, vh) => ({ x: 960, y: 540, zoom: zoomBase(vw, vh) });

// Hotspot: "aproximacao" vem do JSON e é multiplicador da visão geral
const alvoHotspot = (h, vw, vh) => ({ x: h.x, y: h.y, zoom: zoomBase(vw, vh) * h.aproximacao });

// Enquadrar (igual à v2)
const enquadrar = ({ x, y, zoom }, vw, vh) => ({ x: vw / 2 - x * zoom, y: vh / 2 - y * zoom, scale: zoom });
```

- `aproximacao` típica: **2.0 a 3.0**. Ajustar no `?debug=1`.
- **Limitar o pan** para a câmera não mostrar além da borda da imagem quando aproximada (clamp de `x` e `y`).
- No modo paisagem com painel lateral aberto, o centro do enquadramento desloca para a metade livre da tela (o objeto fica visível ao lado do painel).

### 6.2 Camadas

| Camada | Arquivo | Uso |
|---|---|---|
| `cena` | `salas/N/cena.webp` (2560 × 1440) | A parede inteira |
| `frente` | `salas/N/frente.webp` (PNG/WebP com transparência) | 1 ou 2 objetos recortados em primeiro plano, só para o parallax |
| `rotulos` | HTML/SVG por cima | Placas e etiquetas (CSV, JSON, "Por quê?"). **Texto nunca vem da imagem gerada** |

### 6.3 Parallax (só PC)
- Ativo apenas com `matchMedia('(hover: hover) and (pointer: fine)')` e sem `prefers-reduced-motion`.
- Mouse move a camada `frente` até ±12 px e a `cena` até ±4 px, com `gsap.quickTo` (suave e barato).
- Desligado durante `foco`, `card`, `quiz` e `transicao`.

### 6.4 O que continua da v2
`useCamera` com `ir()`, card nascendo do objeto (fora do mundo), hotspots em overlay com 44 px, bloqueio de toques em `transicao`, `reenquadrar` em `resize`/`orientationchange`, movimento reduzido.

---

## 7. Pipeline de arte (resumo)

Detalhado em `claude/discussoes/03-estilo-e-cenas.md`.

1. **Figma:** frame de 1920 × 1080 com o *blockout* da parede (blocos cinza) e retângulos nomeados `hotspot:<id>`. O centro de cada retângulo vira o `x, y` do JSON, sem chute.
2. **Gerador de imagem** (Gemini ou ChatGPT): blockout + imagem de referência de estilo + prompt-base fixo → cena.
3. **Upscale** para 2560 × 1440 (Upscayl, gratuito) e exportação em WebP (meta: ≤ 500 KB por cena).
4. **Recorte** de 1 ou 2 objetos de frente no Figma (Remove background) → `frente.webp`.
5. **Rótulos e textos** por cima, em HTML/SVG.
6. A **primeira cena aprovada** (Sala 1) vira a referência de estilo de todas as seguintes.

---

## 8. As salas (paredes)

| # | Sala | Ambiente | A parede mostra | Hotspots (cards) | Quiz | Saída | Peça | Detalhe |
|---|---|---|---|---|---|---|---|---|
| — | Fachada | 1 | Frente da fábrica, portão de enrolar, placa AutoLab, luzes | — | — | Portão | — | **Alto** |
| 1 | Recebimento & Ingestão | 1 – Galpão rústico | Doca com portão metálico, pilhas de caixas rotuladas, balança industrial, quadro de entrada, lâmpadas penduradas | Caixas (fontes), balança (qualidade), etiqueta rasgada (faltantes), contador (volume) | Prancheta na parede | Esteira saindo pela lateral | Base/rodas | **Alto** |
| 2 | Linha de Processamento | 1 – Galpão rústico | Trecho de esteira na frente da parede, lavadora, peneira, lixeira de rejeitos, painel de alavancas | Lavadora (limpeza), peneira (outliers), painel (normalização), lixeira (descarte) | Painel de controle | Elevador de carga | Tronco | **Alto** |
| 3 | Processamento Neural | 2 – Industrial | Parede de painéis com cabos ligando nós luminosos, mostradores, válvula, quadro técnico | Quadro (perceptron), mostradores (pesos), válvula (bias + ativação) | Terminal central | Porta pressurizada | Núcleo | Médio |
| 4 | Inspeção de Qualidade | 3 – Lab | Bancada branca, monitor grande, lupa, gavetas de amostras | Monitor (matriz de confusão), lupa (precision), gavetas (recall + seleção/gerações) | Prancheta de laudo | Porta de vidro | Braços/sensores | Simples |
| 5 | Expedição & Análise | 3 – Lab | Doca de saída limpa, caixa lacrada, painel "Por quê?", quadro de avisos | Quadro (problemas/limitações), painel "Por quê?" (XAI), caixa lacrada (conclusão) | Terminal de liberação | Doca → Expedição | Cabeça-tela + antena | Simples |

As Salas 3 a 5 já começam com 3 cards em vez de 4, conforme o orçamento de tempo.

---

## 9. Mascote e cópias

Detalhado em `claude/discussoes/01-mascote.md`.

- **Duas representações do mesmo robô:**
  1. **Versão vetorial simples** (SVG): cabeça-tela com os olhos. Usada no logo, no preloader, no avatar do HUD e nas peças da cópia no HUD.
  2. **Versão ilustrada low-poly** (imagem): corpo inteiro, no estilo das cenas. Usada na fachada e na Expedição.
- **Expressões** (desenhos na tela, em SVG, animáveis pelo GSAP): `neutro`, `feliz`, `triste`, `explicando`, `indicando`, `pensando`, `carregando`.
- **Falas** ficam no JSON (`fala` na sala, `dica` no quiz), exibidas num balão ao lado do avatar.

---

## 10. Estrutura de dados (alterações)

```json
{
  "id": "ingestao",
  "ordem": 1,
  "titulo": "Recebimento & Ingestão",
  "ambiente": 1,
  "peca": "base",
  "fala": "Bem-vindo à doca! Todo modelo começa aqui: nos dados.",
  "camadas": { "cena": "salas/1/cena.webp", "frente": "salas/1/frente.webp" },
  "rotulos": [ { "texto": "CSV", "x": 410, "y": 620 } ],
  "saida": { "x": 1780, "y": 760, "aproximacao": 2.0, "rotulo": "Seguir pela esteira" },
  "hotspots": [
    { "id": "ingestao-caixas", "tipo": "card", "x": 420, "y": 640, "aproximacao": 2.5,
      "rotulo": "Caixas de dados", "titulo": "...", "texto": "..." },
    { "id": "ingestao-quiz", "tipo": "quiz", "x": 1180, "y": 430, "aproximacao": 2.6,
      "rotulo": "Prancheta do supervisor", "pergunta": "...", "alternativas": ["...", "...", "...", "..."],
      "correta": 2, "dica": "...", "explicacao": "..." }
  ]
}
```

- `zoom` foi substituído por `aproximacao`.
- Progresso salvo: `{ "versao": 3, ... }`. Dados com versão diferente são descartados.

## 11. Pastas (alterações sobre a v2)

```
public/
├─ salas/1..5/cena.webp, frente.webp
├─ fachada/cena.webp, portao.webp
├─ mascote/corpo.webp
└─ og-image.png
src/components/
├─ Preloader.jsx
├─ Fachada.jsx            # substitui Recepcao.jsx
├─ AvisoOrientacao.jsx
├─ Mascote.jsx            # cabeça SVG + prop "expressao"
├─ BalaoFala.jsx
├─ CopiaRobo.jsx          # substitui Robo.jsx (peças da cópia)
└─ (demais da v2)
src/hooks/useOrientacao.js
src/lib/precarregar.js     # carrega assets e informa o progresso ao Preloader
```

## 12. Identidade visual

- **Tokens de cor:** mantidos da v2 (3 ambientes). As cenas geradas devem usar paletas próximas dos tokens.
- **Fontes:** IBM Plex Sans (interface e cards) e IBM Plex Mono (HUD, rosto do robô, preloader, contadores). Carregar apenas os pesos 400/600 da Sans e 400 da Mono.
- **Logo:** ver `claude/discussoes/02-logo.md`.

## 13. Fases e cronograma

### Fase A — Navegação (concluída)
Sala 1 com placeholders, hotspots, quiz e saída funcionando.

### Fase A2 — Identidade e arte da Sala 1 (04–10/10, ~4h)
- [ ] Mascote: cabeça vetorial + expressões (discussão 01)
- [ ] Logo (discussão 02)
- [ ] Prompt-base de estilo testado; cena da **Sala 1** e da **fachada** aprovadas (discussão 03)
- [ ] Blockouts no Figma das Salas 1 e 2
- **Aceite:** uma cena da Sala 1 que vocês considerem "a cara do projeto"

### Fase B — Vertical slice (11–17/10, ~4h)
- [ ] Mundo 1920 × 1080, `aproximacao` relativa, clamp do pan
- [ ] Preloader com progresso real (discussão 04)
- [ ] Fachada com portão abrindo e entrada na Sala 1
- [ ] Sala 1 com arte final, rótulos, camada de frente
- [ ] Mascote no HUD com expressões e balão de dica no quiz
- [ ] Aviso de orientação e painel lateral em paisagem
- [ ] Parallax no PC
- **Aceite:** no Galaxy A12, deitado, o fluxo preloader → fachada → Sala 1 completa roda sem travar, e o preloader leva menos de ~4 s no 4G

### Fase C — Salas 2 a 5 e final (18–24/10, ~4h)
- [ ] Cenas e blockouts das Salas 2 a 5 (2 detalhada; 3–5 simples)
- [ ] Transições entre salas
- [ ] Expedição com a cópia ligando, créditos, compartilhar
- [ ] GoatCounter, `og-image`, meta tags

### Folga (25–26/10)
Ajustes. Se algo atrasou, aplicar a escada de cortes.

### Conteúdo, em paralelo (grupo, até 17/10)
Ver `claude/discussoes/05-conteudo-das-salas.md`.

### Fase D — QA, QR e cartaz (27/10–01/11)
Testes no A12 e em outro aparelho, Lighthouse mobile (Performance ≥ 85, Acessibilidade ≥ 95), teclado, revisão de texto, QR code, cartaz (discussão 06).

### Fase E — Distribuição e comprovação (02–07/11)
Cartazes na cidade, fotos individuais, números do GoatCounter.

## 14. Escada de cortes (aplicar de cima para baixo)

1. Portão animado da fachada → vira um crossfade
2. Salas 4 e 5 compartilham a mesma cena base, com variações feitas por edição de imagem
3. Camada de frente e parallax no PC
4. Progressão de ambientes → um tema só nas Salas 3 a 5
5. Expressões do mascote → reduzir para `neutro`, `feliz`, `triste`

**Nunca cortar:** preloader, fachada e Sala 1 com qualidade alta; quiz com dica; progresso salvo; funcionamento no A12 deitado.

## 15. Fora do escopo
3D em tempo real (three.js/R3F), mapa de profundidade/efeito "foto 3D", música, câmera girando entre paredes, navegação livre.

## 16. Referências
- **The Yellow Room / Cube Escape:** parede de frente, objetos tocáveis, aproximação e volta
- **Dark Dimensions:** cena fixa cheia de objetos, apenas como referência de interação (o estilo será cartoon)
- **Roblox / Kogama:** referência de estilo low-poly com sombras suaves
- **Gorogoa:** transição por zoom através de uma imagem

## 17. Regras do repositório
Iguais à v2 (commits pequenos em português `tipo: descrição`, `main` sempre publicável, sem coautoria automática, sem segredos). O trabalho da v2.1 vai na branch `feat/visual`.

## 18. Pendências

| Item | Responsável | Até |
|---|---|---|
| Discussões 01 (mascote) e 02 (logo) | Shoity | 07/10 |
| Discussão 03 + cena da Sala 1 e fachada | Shoity | 10/10 |
| Conteúdo das 5 salas no formato do JSON | Grupo | 17/10 |
| Criar conta no GoatCounter | Shoity | 18/10 |
| Locais dos cartazes | Grupo | 26/10 |
| Cartaz | Kamilla / Wellington | 30/10 |
