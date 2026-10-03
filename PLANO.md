# AutoLab — Plano de Desenvolvimento v2 (Salas Navegáveis)

> Site-jogo estático sobre Machine Learning, ambientado numa fábrica. Quem escaneia o QR code do cartaz explora **5 salas ilustradas**. Cada sala é vista inteira (zoom out), cheia de decorações, com **pontos de interação escondidos** nos objetos. Tocar num ponto faz a **câmera aproximar** e abrir o card de conteúdo ou o quiz. Ao concluir a sala, uma **animação de câmera** leva até a próxima. A cada quiz acertado, uma peça do robô é montada, até a expedição.

- **Disciplina:** Estágio Supervisionado (PACEX VIII), UNIPAR, prof. Elyssandro Piffer
- **Equipe:** Glauber Shoity Nakai (desenvolvimento), Kamilla Barros Silva e Wellington Henrique da Silva Lima, 8º período de Sistemas de Informação
- **Repositório:** github.com/glaubershoity/AutoLab
- **Publicação:** GitHub Pages (`https://glaubershoity.github.io/AutoLab/`)
- **Prazo final:** site no ar e cartazes distribuídos até **07/11/2026**
- **Versão:** 2.0 (03/10/2026). **Substitui integralmente** a seção de fluxo por rolagem do plano v1.

---

## 0. Para o agente de IA que vai ler este documento (LEIA PRIMEIRO)

1. **A navegação NÃO é por rolagem.** Não use ScrollTrigger, scroll-snap nem seções empilhadas para navegar entre conteúdos. A página não rola: ela ocupa a tela inteira (`100dvh`, `overflow: hidden`) e a navegação acontece por toques nos pontos de interação e por animações de câmera.
2. Cada estação é uma **SALA** (uma cena ilustrada inteira), não uma seção com cards empilhados.
3. Os cards e o quiz ficam **ocultos** até o usuário tocar no ponto de interação correspondente.
4. Implemente **uma fase por vez**, na ordem da seção 12, e só avance quando os critérios de aceite da fase forem cumpridos.
5. **Construa uma sala completa antes de replicar para as cinco.**
6. Todo o texto vem de `src/data/estacoes.json`. Nenhum texto de conteúdo fixo dentro dos componentes.
7. Instale e consulte as skills oficiais do GSAP (seção 15) antes de escrever animações.
8. Se algo neste plano parecer conflitar com o código existente, **o plano vence**. Pergunte antes de inventar um fluxo diferente.

---

## 1. O que deu errado na v1 (diagnóstico)

O resultado entregue (rolagem suave sobre cards com as cores de fundo) **não foi um erro da IA. Ela seguiu o plano v1 ao pé da letra**, e o plano descrevia outra coisa:

| O que o plano v1 dizia | O que isso gerou | O que realmente queríamos |
|---|---|---|
| "Rolagem vertical (pensada para celular)" | Página longa com scroll | Tela fixa, exploração por toque |
| "`Estacao.jsx` — seção da esteira (cards + quiz)" | Cada estação virou uma seção com cards visíveis | Cada estação é uma sala com cards escondidos |
| "ScrollTrigger (transições)" | Transições amarradas ao scroll, sem sensação de câmera | Transições disparadas por eventos (toque, conclusão) |
| "O GSAP interpola as variáveis do `:root` conforme o scroll" | Só a cor de fundo mudava | Câmera se move pela sala e entre salas |
| Nenhuma menção a hotspot, zoom ou decoração | Nada disso foi feito | É o centro da experiência |

**Lição:** a experiência precisa estar escrita de forma explícita e verificável. Este documento corrige isso com uma máquina de estados (seção 5), uma técnica de câmera definida (seção 6) e critérios de aceite por fase (seção 12).

### O que se aproveita da v1

- Projeto Vite + React, Tailwind, GSAP, deploy pelo GitHub Actions
- Tokens de cor dos 3 ambientes (`tokens.css`)
- Lógica do quiz (validar, dica fixa, tentar de novo)
- `useProgresso` (localStorage com try/catch), estendido para guardar hotspots lidos
- `lib/metricas.js` (GoatCounter)
- O conteúdo do `estacoes.json`, que ganha os campos de sala e hotspots

### O que sai

- Navegação por scroll e o uso do ScrollTrigger para navegação
- `Estacao.jsx` como seção empilhada
- `BarraProgresso.jsx` como barra de rolagem (vira um HUD)

---

## 2. Decisões fechadas (v2)

| Tema | Decisão |
|---|---|
| Estrutura | Recepção + **5 salas** + Expedição (tela final) |
| Navegação | **Salas navegáveis em 2.5D**: tela fixa, sem rolagem, câmera = transform de um "mundo" ilustrado |
| Formato da sala | **Vertical**, mundo fixo de **1000 × 1600** unidades (celular em pé, que é como se escaneia QR code). Todas as salas têm o mesmo tamanho |
| Pontos de interação | 3 a 5 hotspots de card + 1 hotspot de quiz por sala, escondidos em objetos da cena, com indicador pulsante |
| Ao tocar num hotspot | Câmera aproxima do objeto, o card "nasce" do objeto e abre no centro |
| Quiz | 1 pergunta por sala, tentativas livres, dica fixa ao errar. O hotspot do quiz **fica trancado** até todos os cards da sala serem lidos |
| Conclusão da sala | Peça do robô encaixa no HUD, a saída da sala acende, e o toque na saída dispara a transição de câmera para a próxima sala |
| Progressão | Robô em SVG no HUD, ganhando uma peça por sala |
| Final | Expedição: conclusão, créditos (equipe/UNIPAR/disciplina) e botão de compartilhar |
| Progresso | localStorage: sala atual, hotspots lidos, quizzes concluídos. Botão "Recomeçar turno" |
| Métricas | GoatCounter (gratuito, sem cookies) |
| 3D | **Fora do escopo da entrega.** Só entra se a Fase C terminar até 22/10 (ver seção 13) |
| Arte | Ilustração vetorial **flat** em SVG, com camadas, montada com formas simples + assets CC0 |

## 3. Stack

| Camada | Tecnologia | Uso |
|---|---|---|
| Base | React + Vite | `base: '/AutoLab/'` |
| Estilo | Tailwind CSS + variáveis CSS | Tokens dos 3 ambientes |
| Animação | GSAP + `@gsap/react` (`useGSAP`, `contextSafe`) | Câmera, parallax, abertura de cards, transição entre salas, encaixe das peças (`bounce.out`) |
| Plugin opcional | GSAP **Flip** | Card "nascendo" do objeto (alternativa ao cálculo manual da seção 6.4) |
| Estado | `useReducer` (máquina de estados) | Controla o que pode acontecer em cada momento |
| Deploy | GitHub Actions → GitHub Pages | A cada push na `main` |
| Métricas | GoatCounter | Visita, sala concluída, fim |

**Não usar:** ScrollTrigger para navegação, Next.js, Framer Motion, backend, IA corrigindo quiz, Spline, glassmorphism nos cards, mundo 3D com movimentação livre do usuário (WASD, joystick).

---

## 4. Experiência do usuário

```
QR code
  → Recepção (fachada da fábrica + "Iniciar turno")
  → [zoom pela porta da fábrica]
  → Sala 1 ─┐
  → Sala 2  │  em cada sala:
  → Sala 3  │   visão geral → toca hotspot → câmera aproxima → card abre → "Entendi" → volta à visão geral
  → Sala 4  │   ... todos os cards lidos → quiz destrava → acerta → peça encaixa → saída acende
  → Sala 5 ─┘   toca na saída → transição de câmera para a próxima sala
  → Expedição (tela final, créditos, compartilhar)
```

### 4.1 A sala em visão geral

- A sala inteira cabe na tela (zoom out), com decorações: máquinas, caixas, cabos, luzes, placas, plantas, ferramentas. **Decoração não é interativa.**
- Os hotspots são objetos da cena (uma caixa, um monitor, uma prancheta) com um **anel pulsante** na cor `--acento` e um ícone pequeno:
  - card não lido: anel pulsante + ícone de informação
  - card lido: anel parado + ✓
  - quiz trancado: cadeado (tocar mostra "Leia todos os registros desta sala primeiro")
  - quiz liberado: anel pulsante mais forte + "?"
- HUD fixo e discreto: nome da sala, contador "Registros 2/4", robô em miniatura e botão de menu (Recomeçar turno).
- Área de toque mínima de **44 × 44 px na tela**, mesmo na visão geral (o botão do hotspot tem tamanho de tela, não de mundo; ver 6.5).

### 4.2 Foco num hotspot

1. A câmera faz zoom e pan até o objeto (~1,2 s, `power3.inOut`), com parallax entre as camadas.
2. O card abre "saindo" do objeto até o centro da tela (~0,5 s).
3. Card: título, texto (~60 palavras), botão "Entendi" (marca como lido) e botão de fechar.
4. Ao fechar: o card volta/encolhe, a câmera retorna à visão geral.

### 4.3 Quiz

Mesmo fluxo do card, mas o painel contém a pergunta com 4 alternativas. Ao errar: dica fixa, tenta de novo. Ao acertar: explicação curta → fecha → câmera volta à visão geral → peça do robô encaixa no HUD (`bounce.out`) → a saída da sala acende e pulsa.

### 4.4 Transição entre salas

Toque na saída (porta, esteira, elevador):
1. Pan até a saída.
2. Zoom forte **através** dela (acelerando, `power2.in`), enquanto a sala atual some.
3. A próxima sala entra vinda de uma escala menor até a visão geral (`power3.out`). As cores do ambiente (tokens) interpolam durante a transição.

Inspiração direta: a transição "por dentro da imagem" de *Gorogoa*.

---

## 5. Máquina de estados

Toda a navegação é controlada por um `useReducer` em `useJogo.js`. **Enquanto o estado for `transicao`, nenhum toque é aceito** (evita animações sobrepostas).

| Estado | O que está na tela | Eventos aceitos | Próximo estado |
|---|---|---|---|
| `recepcao` | Fachada, "Iniciar turno" / "Continuar" / "Recomeçar" | INICIAR | `transicao` → `visao-geral` |
| `visao-geral` | Sala inteira com hotspots | TOCAR_HOTSPOT, TOCAR_SAIDA (se sala concluída) | `foco` ou `transicao` |
| `foco` | Câmera chegando no objeto | (fim da animação) | `card` ou `quiz` |
| `card` | Card aberto | ENTENDI, FECHAR | `visao-geral` |
| `quiz` | Pergunta aberta | RESPONDER, FECHAR | `quiz` (errou) ou `visao-geral` (acertou/fechou) |
| `transicao` | Animação de câmera entre salas | nenhum | `visao-geral` da próxima sala ou `expedicao` |
| `expedicao` | Tela final | COMPARTILHAR, RECOMEÇAR | `recepcao` |

Regra: **o reducer decide o estado; o componente reage ao estado disparando a animação; a animação, ao terminar (`onComplete`), despacha o próximo evento.**

---

## 6. Técnica de câmera 2.5D (o coração do projeto)

### 6.1 Conceito

- Existe um **viewport** (a tela, `position: fixed`, `inset: 0`, `overflow: hidden`).
- Dentro dele, um **mundo** com tamanho fixo de 1000 × 1600, `transform-origin: 0 0`.
- A "câmera" é só o `x`, `y` e `scale` do mundo. Para olhar o ponto `(px, py)` com zoom `z`, o mundo vai para:

```
x = larguraTela / 2 − px · z
y = alturaTela  / 2 − py · z
scale = z
```

- Visão geral: `z = min(larguraTela / 1000, alturaTela / 1600)`, centro `(500, 800)`.
- Só se anima `transform` e `opacity` (rápido em celular de entrada). Nada de animar `width`, `top`, `left` ou filtros pesados.

### 6.2 Camadas e parallax

Cada sala tem 3 ou 4 camadas dentro do mundo, com um atributo `data-profundidade`:

| Camada | Profundidade | Conteúdo |
|---|---|---|
| fundo | 0.85 | Parede, janelas, céu |
| meio | 0.95 | Estantes, máquinas grandes |
| objetos | **1.00** | Objetos com hotspots (coordenadas exatas) |
| frente | 1.15 | Cabos, grades, poeira em primeiro plano |

**Os hotspots ficam sempre na camada com profundidade 1**, para que as coordenadas do JSON batam exatamente com o lugar do objeto.

### 6.3 Hook `useCamera`

```js
// src/hooks/useCamera.js
import { useCallback, useRef } from "react";
import { gsap } from "gsap";

export const MUNDO = { largura: 1000, altura: 1600 };

export function useCamera(viewportRef, mundoRef) {
  const alvoAtual = useRef(null);

  const tela = () => viewportRef.current.getBoundingClientRect();

  // Converte "olhar para (x, y) com zoom" em transform do mundo
  const enquadrar = useCallback(({ x, y, zoom }) => {
    const { width: vw, height: vh } = tela();
    return { x: vw / 2 - x * zoom, y: vh / 2 - y * zoom, scale: zoom };
  }, []);

  const visaoGeral = useCallback(() => {
    const { width: vw, height: vh } = tela();
    const zoom = Math.min(vw / MUNDO.largura, vh / MUNDO.altura);
    return { x: MUNDO.largura / 2, y: MUNDO.altura / 2, zoom };
  }, []);

  // Move a câmera e aplica parallax nas camadas
  const ir = useCallback((alvo, { duracao = 1.2, ease = "power3.inOut", mundo } = {}) => {
    const el = mundo ?? mundoRef.current;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = reduzido ? 0 : duracao;
    alvoAtual.current = alvo;

    const tl = gsap.timeline();
    tl.to(el, { ...enquadrar(alvo), duration: d, ease, overwrite: "auto" }, 0);

    el.querySelectorAll("[data-profundidade]").forEach((camada) => {
      const p = parseFloat(camada.dataset.profundidade);
      tl.to(camada, {
        x: (alvo.x - MUNDO.largura / 2) * (1 - p),
        y: (alvo.y - MUNDO.altura / 2) * (1 - p),
        duration: d, ease, overwrite: "auto",
      }, 0);
    });
    return tl;
  }, [enquadrar, mundoRef]);

  // Chamar no resize/orientationchange
  const reenquadrar = useCallback(() => {
    if (alvoAtual.current) gsap.set(mundoRef.current, enquadrar(alvoAtual.current));
  }, [enquadrar, mundoRef]);

  return { ir, enquadrar, visaoGeral, reenquadrar };
}
```

CSS do mundo:

```css
.viewport { position: fixed; inset: 0; overflow: hidden; height: 100dvh; touch-action: manipulation; }
.mundo    { position: absolute; top: 0; left: 0; width: 1000px; height: 1600px;
            transform-origin: 0 0; will-change: transform; }
.camada   { position: absolute; inset: 0; }
```

Chamadas a partir de cliques devem passar por `contextSafe` do `useGSAP`, para as animações serem limpas quando o componente desmontar.

### 6.4 Card "nascendo" do objeto

Depois que a câmera chega ao hotspot, o card é animado a partir da posição do objeto na tela:

```js
function abrirCard(hotspotEl, cardEl) {
  const r = hotspotEl.getBoundingClientRect();
  const c = cardEl.getBoundingClientRect();
  return gsap.fromTo(cardEl,
    {
      x: r.left + r.width / 2 - (c.left + c.width / 2),
      y: r.top + r.height / 2 - (c.top + c.height / 2),
      scale: r.width / c.width,
      autoAlpha: 0,
    },
    { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "power3.out" }
  );
}
// Fechar: a mesma animação em reverso (guardar o tween e chamar .reverse()).
```

Alternativa: plugin **Flip** do GSAP (`Flip.getState` no hotspot, `Flip.from` no card, ligando os dois pelo mesmo `data-flip-id`).

O card fica **fora do mundo** (num overlay acima do viewport), para não ser escalado pela câmera e manter o texto nítido.

### 6.5 Hotspots com tamanho de tela

O objeto desenhado escala com a câmera, mas o **botão** do hotspot precisa ter no mínimo 44 px na tela. Opções:
- aplicar ao botão `scale: 1 / zoomAtual` (contra-escala) junto com a câmera; ou
- renderizar os botões num overlay fora do mundo, convertendo as coordenadas do mundo para a tela com a mesma fórmula da 6.1.

A segunda é a mais simples de manter. Escolher uma e usar em todas as salas.

### 6.6 Transição entre salas

Durante a transição, as duas salas ficam montadas (a atual e a próxima, uma sobre a outra).

```js
function transicaoEntreSalas({ camera, mundoAtual, mundoProximo, saida, aoTerminar }) {
  const geral = camera.visaoGeral();
  const tl = gsap.timeline({ onComplete: aoTerminar });

  tl.add(camera.ir(saida, { duracao: 0.8, mundo: mundoAtual }))           // 1. pan até a saída
    .to(mundoAtual, {                                                       // 2. zoom através da porta
      ...camera.enquadrar({ ...saida, zoom: saida.zoom * 4 }),
      duration: 0.7, ease: "power2.in",
    })
    .to(mundoAtual, { autoAlpha: 0, duration: 0.2 }, "-=0.2")
    .fromTo(mundoProximo,                                                   // 3. próxima sala chega
      { ...camera.enquadrar({ ...geral, zoom: geral.zoom * 0.6 }), autoAlpha: 0 },
      { ...camera.enquadrar(geral), autoAlpha: 1, duration: 0.9, ease: "power3.out" },
      "-=0.1");

  return tl;
}
```

A troca de cores do ambiente (tokens) acontece em paralelo, interpolando as variáveis CSS no `:root` durante a etapa 3.

### 6.7 Movimento reduzido

Com `prefers-reduced-motion: reduce`: sem zoom nem parallax. A câmera vai direto (duração 0), os cards aparecem com fade curto e a troca de sala é um crossfade. Tudo continua jogável.

### 6.8 Erros comuns a evitar

- Disparar uma animação de câmera antes da anterior terminar (por isso o estado `transicao` bloqueia toques).
- Animar `left/top/width` em vez de `x/y/scale`.
- Colocar o card dentro do mundo (fica borrado e escala junto).
- Usar ScrollTrigger para isso. Não há rolagem.
- Esquecer o `resize`/`orientationchange` (o enquadramento depende do tamanho da tela).
- Salas com tamanhos diferentes (quebra a fórmula da transição).

---

## 7. As 5 salas

| # | Sala | Ambiente | Cenário e decoração | Hotspots (cards) | Quiz em | Saída | Peça |
|---|---|---|---|---|---|---|---|
| 0 | Recepção | 1 | Fachada da fábrica AutoLab, placa luminosa, portão | Nenhum, só "Iniciar turno" | — | Portão (zoom para a Sala 1) | Robô vazio |
| 1 | Recebimento & Ingestão | 1 – Galpão Rústico | Doca de carga, paletes de caixas rotuladas (CSV, JSON, IMG), empilhadeira, balança, lâmpadas penduradas | Caixas (fontes de dados), balança (qualidade), etiqueta rasgada (dados faltantes), contador de volume | Prancheta do supervisor | Esteira para a próxima sala | Base/chassi |
| 2 | Linha de Processamento | 1 – Galpão Rústico | Esteira, máquina de lavagem, peneira, lixeira de rejeitos, painel de ajustes | Lavadora (limpeza), peneira (outliers), painel (normalização), lixeira (descarte) | Painel de controle da linha | Elevador de carga | Tronco/estrutura |
| 3 | Processamento Neural | 2 – Transição Industrial | Painel com cabos ligando nós luminosos, mostradores, válvulas, quadro técnico | Quadro (perceptron), mostradores (pesos), válvula (bias), chave de limiar (ativação) | Terminal central | Porta pressurizada | Núcleo/cérebro |
| 4 | Inspeção de Qualidade | 3 – Lab Clean | Bancada branca, lupa, monitor, gavetas de amostras, estufa com gerações | Monitor (matriz de confusão), lupa (precision), gavetas (recall), estufa (seleção artificial e gerações) | Prancheta de laudo | Porta de vidro deslizante | Olhos/sensores |
| 5 | Expedição & Análise | 3 – Lab Clean | Doca de saída, caixa lacrada, painel "Por quê?", quadro de avisos | Quadro de avisos (problemas), caixa lacrada (limitações), painel "Por quê?" (XAI), certificado (conclusão) | Terminal de liberação | Doca → tela de Expedição | Antena + selo |

Os textos dos cards seguem o plano v1: cerca de 60 palavras, terminologia técnica, conteúdo do relatório PACEX (Sala 4: métricas são conteúdo novo).

## 8. Estrutura de dados (`src/data/estacoes.json`)

```json
[
  {
    "id": "ingestao",
    "ordem": 1,
    "titulo": "Recebimento & Ingestão",
    "ambiente": 1,
    "peca": "base",
    "camadas": {
      "fundo": "salas/1/fundo.svg",
      "meio": "salas/1/meio.svg",
      "objetos": "salas/1/objetos.svg",
      "frente": "salas/1/frente.svg"
    },
    "saida": { "x": 820, "y": 1380, "zoom": 1.6, "rotulo": "Seguir pela esteira" },
    "hotspots": [
      {
        "id": "ingestao-caixas",
        "tipo": "card",
        "x": 260, "y": 1050, "zoom": 2.4,
        "rotulo": "Caixas de dados",
        "titulo": "Dados são a matéria-prima",
        "texto": "..."
      },
      {
        "id": "ingestao-quiz",
        "tipo": "quiz",
        "x": 640, "y": 900, "zoom": 2.2,
        "rotulo": "Prancheta do supervisor",
        "pergunta": "...",
        "alternativas": ["...", "...", "...", "..."],
        "correta": 2,
        "dica": "...",
        "explicacao": "..."
      }
    ]
  }
]
```

- `x`, `y` estão em coordenadas do mundo (0–1000 × 0–1600).
- `zoom` é o zoom da câmera **relativo ao tamanho do mundo** (ex.: 2.4 significa que 1 unidade do mundo vira 2,4 px). Ajustar na tela de debug (seção 12, Fase A).
- `rotulo` vira o `aria-label` do botão do hotspot.

### Progresso salvo (localStorage, chave `autolab:progresso`)

```json
{ "versao": 2, "salaAtual": 3, "lidos": ["ingestao-caixas", "..."], "quizzes": ["ingestao", "processamento"] }
```

Se encontrar dados da v1 (sem `versao: 2`), descartar e começar do zero.

## 9. Arquitetura de pastas

```
AutoLab/
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ salas/1..5/          # SVGs das camadas de cada sala
│  ├─ favicon.svg
│  └─ og-image.png
├─ src/
│  ├─ data/estacoes.json
│  ├─ styles/tokens.css
│  ├─ components/
│  │  ├─ Recepcao.jsx
│  │  ├─ Viewport.jsx       # tela fixa, contém o(s) mundo(s) e o overlay
│  │  ├─ Sala.jsx           # monta as camadas de uma sala dentro do mundo
│  │  ├─ Hotspot.jsx        # botão com anel pulsante e estados
│  │  ├─ CardPainel.jsx     # card de conteúdo (overlay)
│  │  ├─ QuizPainel.jsx     # quiz (overlay)
│  │  ├─ Hud.jsx            # nome da sala, contador, robô, menu
│  │  ├─ Robo.jsx           # SVG com peças por estado
│  │  └─ Expedicao.jsx
│  ├─ hooks/
│  │  ├─ useJogo.js         # máquina de estados (useReducer)
│  │  ├─ useCamera.js       # seção 6.3
│  │  ├─ useProgresso.js    # localStorage com try/catch
│  │  └─ useAmbiente.js     # interpola os tokens entre ambientes
│  ├─ lib/
│  │  ├─ transicoes.js      # abrirCard, transicaoEntreSalas
│  │  └─ metricas.js        # GoatCounter
│  ├─ App.jsx
│  └─ main.jsx
├─ PLANO.md
└─ README.md
```

## 10. Identidade visual

### Tokens (mantidos da v1)

| Token | Ambiente 1 — Galpão | Ambiente 2 — Transição | Ambiente 3 — Lab |
|---|---|---|---|
| `--bg` | `#1E222A` | `#3D444D` | `#F8FAFC` |
| `--card` | `#2A2F3B` | `#4A525C` | `#F1F5F9` (borda `#E2E8F0`) |
| `--titulo` | `#FBBF24` | `#67E8F9` | `#0E7490` |
| `--texto` | `#E7E5E2` | `#DDE3E8` | `#1E293B` |
| `--acento` | `#B45309` | `#0891B2` | `#059669` (`#047857` em texto pequeno) |

### Arte das salas

- Estilo **flat vetorial**, poucas cores por sala (derivadas dos tokens), contorno simples. Consistência importa mais que detalhe.
- Montar com formas simples em SVG e complementar com **assets CC0** (por exemplo, os pacotes do Kenney). Registrar no README a origem e a licença de cada asset.
- Cada camada é um SVG separado. Otimizar com SVGO. Meta: **até ~150 KB por sala** somando as camadas.
- Os objetos com hotspot devem se destacar levemente (um pouco mais de contraste ou um contorno em `--acento`), mas o anel pulsante é que sinaliza a interação.
- Fontes: Orbitron ou Chakra Petch nos títulos; Inter ou Space Grotesk no corpo (escolher na Fase C).

## 11. Acessibilidade e celular

- Hotspots são `<button>` com `aria-label` vindo de `rotulo`. Ordem de tabulação: hotspots da sala, depois a saída.
- Card e quiz abertos: foco vai para o título do painel, foco preso dentro do painel, `Esc` fecha, ao fechar o foco volta ao hotspot.
- Contraste WCAG AA (tokens já atendem). Indicadores não dependem só de cor (ícones ✓, cadeado, "?").
- Áreas de toque ≥ 44 px na tela (seção 6.5).
- Movimento reduzido (seção 6.7).
- Celular em pé é o caso principal. Em paisagem, a sala fica centralizada com faixas laterais na cor `--bg`.
- Testar em navegador interno do WhatsApp/Instagram (abre muito QR code assim).

---

## 12. Fases e cronograma

### Fase A — Fundação da navegação (04–10/10)
- [ ] Remover a navegação por scroll e o ScrollTrigger da navegação
- [ ] `Viewport`, `Sala` (com retângulos coloridos como placeholder das camadas), `useCamera`, `useJogo`
- [ ] **Uma sala** (Sala 1) com 3 hotspots de card + 1 de quiz, usando o JSON
- [ ] Zoom até o hotspot, card abrindo do objeto, fechar e voltar à visão geral
- [ ] Quiz trancado até ler os cards; acerto libera a saída
- [ ] Modo debug (`?debug=1`): mostra a grade do mundo e as coordenadas do toque, para posicionar hotspots
- **Critérios de aceite:**
  - a página **não rola**
  - no celular em pé, a sala inteira aparece na visão geral
  - nenhum texto de card aparece antes do toque no hotspot
  - tocar rápido várias vezes não quebra a câmera
  - virar o celular reenquadra a cena corretamente

### Fase B — Todas as salas e o jogo completo (11–17/10)
- [ ] Salas 2 a 5 com placeholders e hotspots posicionados
- [ ] Transição entre salas (seção 6.6) e da Recepção para a Sala 1
- [ ] `useProgresso` v2 (salvar, continuar, recomeçar)
- [ ] HUD com contador e robô simples
- [ ] Expedição (tela final básica)
- **Entrega (17/10):** jogável do início ao fim no celular, ainda com arte provisória

### Conteúdo, em paralelo (05–17/10)
- [ ] Shoity envia o texto do relatório PACEX (até 06/10)
- [ ] Rascunho dos cards, perguntas, dicas e explicações das 5 salas, já distribuídos pelos objetos da tabela da seção 7
- [ ] Conteúdo novo de métricas (Sala 4)
- [ ] Revisão técnica por Kamilla e Wellington
- [ ] Texto final no JSON até 17/10

### Fase C — Arte, polimento e métricas (18–26/10)
- [ ] Arte final das camadas das 5 salas e da Recepção
- [ ] Parallax ajustado, anel pulsante, estados dos hotspots
- [ ] Interpolação dos tokens entre ambientes
- [ ] Robô em SVG com encaixe `bounce.out`
- [ ] Expedição completa: créditos, compartilhar (Web Share API, com `wa.me` como alternativa)
- [ ] GoatCounter: visita, evento por sala concluída, evento "fim"
- [ ] `og-image` e meta tags para a prévia no WhatsApp
- **Entrega (26/10): versão final no ar**

### Fase D — QA, QR code e cartaz (27/10–01/11)
- [ ] Teste em pelo menos 2 Android de entrada e 1 iPhone, se houver
- [ ] Lighthouse mobile: Performance ≥ 85, Acessibilidade ≥ 95
- [ ] Teclado: jogar o jogo inteiro sem mouse
- [ ] Revisão final do texto
- [ ] QR code (alta correção de erro) para a URL do Pages
- [ ] Arte do cartaz e impressão

### Fase E — Distribuição e comprovação (02–07/11)
- [ ] Locais dos cartazes
- [ ] Cada membro distribui e tira as próprias fotos
- [ ] Exportar números do GoatCounter para o relatório

## 13. 3D (opcional, só se sobrar tempo)

Só começar se a Fase C estiver concluída até **22/10**, em branch `feat/3d`, sem tocar na `main`.

- React Three Fiber + drei `<CameraControls>` (biblioteca **camera-controls**, de yomotsu): `setLookAt(...)` e `fitToBox(objeto, true)` fazem o voo de câmera até o objeto, e retornam Promise, então dá para encadear com `await`.
- As mesmas coordenadas/IDs de hotspot do JSON, os mesmos painéis de card/quiz (overlay HTML) e a mesma máquina de estados. Só a camada de câmera muda.
- Orçamento: < 100 draw calls, < 100k vértices, `pixelRatio` ≤ 1.5, sem sombras dinâmicas, `frameloop="demand"`, até ~300 KB de JS 3D comprimido.
- Fallback automático para a versão 2.5D (sem WebGL, movimento reduzido ou < ~30 FPS).
- Se não estiver fluido num Android de entrada em 26/10, não entra.

## 14. Referências de jogos (estudar antes da Fase A)

| Jogo | O que observar |
|---|---|
| **Machinarium** (Amanita Design) | Cenários 2D detalhados, objetos interativos discretos, sistema de dica. Tema de robô e fábrica |
| **Cube Escape / Rusty Lake** | Fluxo visão geral → toque → aproxima → puzzle → volta. Exatamente o loop de cada sala |
| **The Room** (Fireproof Games) | Câmera voando até o detalhe tocado, pensado para celular |
| **Gorogoa** | Transição por zoom "através" de uma imagem até a próxima cena (modelo da seção 6.6) |
| **Professor Layton** | Toque em pontos da cena, enigmas, dica ao errar. É o loop educativo do AutoLab |
| **Hidden Folks** | Como sinalizar pontos escondidos numa ilustração grande sem poluir |
| **Human Resource Machine / 7 Billion Humans** | Ensino de computação com metáfora de escritório/fábrica |
| **Portfólios "3D room"** (three.js) | Salas com objetos clicáveis e estados de câmera na web |

Sugestão: gravar GIFs curtos de 2 ou 3 desses jogos e anexar ao pedido para a IA, junto com este documento. IAs acertam muito melhor a sensação de câmera vendo o resultado esperado.

## 15. Ferramentas para o agente de IA

### Skills oficiais do GSAP

```bash
npx skills add https://github.com/greensock/gsap-skills
```

No Claude Code também funciona pelo marketplace: `/plugin marketplace add greensock/gsap-skills`.

Cobrem API principal, timelines, plugins, integração com React e performance. Elas melhoram a **qualidade do código GSAP**; a **experiência** quem define é este plano.

### Como pedir para a IA (modelo de prompt)

```
Leia o PLANO.md inteiro, principalmente as seções 0, 4, 5 e 6.
Implemente SOMENTE a Fase A. Não use scroll para navegação.
Use a técnica de câmera 2.5D da seção 6 (mundo 1000x1600, transform-origin 0 0).
Ao terminar, verifique cada critério de aceite da Fase A e me diga quais passaram.
Commits pequenos, em português, formato "tipo: descrição".
```

Se o resultado se afastar do plano, responder citando a seção ("isso contradiz a seção 4.1, os cards devem estar ocultos") em vez de descrever de novo com outras palavras.

## 16. Regras do repositório

- Commits pequenos, um por tarefa, mensagem em português no formato `tipo: descrição` (`feat`, `fix`, `style`, `content`, `docs`, `chore`, `refactor`)
- A `main` sempre publicável. A refatoração da v2 vai numa branch `feat/salas` e entra na `main` ao fim da Fase A
- Commits sem linhas de coautoria ou assinaturas automáticas
- Nada de chaves ou segredos no repositório

## 17. Pendências

| Item | Responsável | Até |
|---|---|---|
| Enviar o texto do relatório PACEX | Shoity | 06/10 |
| Gravar GIFs de referência (Rusty Lake, Machinarium, Gorogoa) | Shoity | 06/10 |
| Distribuir o conteúdo pelos objetos de cada sala (seção 7) | Grupo | 12/10 |
| Criar a conta no GoatCounter | Shoity | 18/10 |
| Escolher as fontes finais | Shoity | 18/10 |
| Arte das salas (ou seleção dos assets CC0) | Kamilla / Wellington | 22/10 |
| Celular de entrada para teste | Grupo | 17/10 |
| Locais dos cartazes | Grupo | 26/10 |
| Arte do cartaz | Kamilla / Wellington | 30/10 |
