# Discussão 04 — Preloader e fachada: resultado (04/10/2026)

## Decisões (para colar no plano, seções 4.1, 4.2 e 4.5)
| Tema | Decisão |
|---|---|
| Tela no preloader | **Caracteres aleatórios** (`01 { } </> ▮`) rolando + barra de progresso **dentro da tela** do Zinos |
| Porcentagem | Sim, discreta (`47%` em Plex Mono no canto superior direito da tela) |
| Fim do carregamento | Olhos acendem → **"Sistema pronto!"** escrito na tela → sorri (`feliz`) → fachada |
| Portão | **De enrolar, subindo** (`clip-path`), e a câmera entra pelo vão |
| Movimento na fachada | **Zinos flutuando + piscando** e **fumaça na chaminé**. Mais nada (sem parallax no celular) |
| "Continuar turno" | A **cópia ZN-xx** aparece ao lado do Zinos com as peças já montadas, e o Zinos fica `feliz` |
| Chamada | **"Como uma máquina aprende?"** + subtítulo "Entre na fábrica e monte uma IA em 5 estações." |
| Aviso de girar | Cabeça do Zinos (`indicando`) **gira junto** com o ícone do celular, em loop |
| Recomeçar | Confirmação **dentro da página** (nunca `confirm()` do navegador) |
| Movimento reduzido | Tudo vira crossfade de 0,3 s. Loops (flutuar, fumaça, piscar) desligados |

---

## Roteiro animado (tempos em segundos)

### A. Preloader — estado `carregando`
| t | O que acontece | GSAP |
|---|---|---|
| 0 | Fundo `#1E222A`. Cabeça do Zinos no centro (`min(42vw, 42vh)`), antena acesa, olhos **apagados**. Na tela: 3 linhas de caracteres aleatórios em Plex Mono, trocando a cada ~80 ms, + barra na base da tela + `0%` | `setInterval` (ou `gsap.ticker`) só troca o texto; nada de layout |
| contínuo | A barra e o número seguem o progresso real de `precarregar.js` (assets carregados / total) | `gsap.to(barra, { scaleX: p, duration: .3, ease: 'power1.out' })`, `transform-origin: left` |
| ≥ 1,2 | Só sai do preloader se `progresso === 1` **e** já se passaram 1,2 s | `Promise.all([assets, espera(1200)])` |

### B. Fim do preloader (≈ 2,1 s depois de chegar a 100%)
| t | O que acontece | GSAP |
|---|---|---|
| 0,00 | Caracteres, barra e % somem | `opacity → 0`, `.2`, `power1.in` |
| 0,20 | Olhos acendem (expressão `neutro`) | olhos `scale 0 → 1`, `.25`, `back.out(2)` |
| 0,45 | "Sistema pronto!" é escrito na tela, abaixo dos olhos | revelar letra a letra: `.35`, `steps(15)` |
| 0,80 | Pausa de leitura | — |
| 1,20 | Texto some e a boca vira sorriso (`feliz`) | crossfade dos grupos `#exp-*`, `.15` |
| 1,40 | Pisca uma vez | `#olhos scaleY 1 → .1 → 1`, `.12`, `yoyo` |
| 1,60 | Preloader → fachada | preloader `opacity → 0`, `.5`; a fachada já está montada por baixo |

### C. Fachada — entrada (estado `fachada`)
| t | O que acontece | GSAP |
|---|---|---|
| 0,00 | Cena da fachada aparece | `opacity 0 → 1`, `.5` |
| 0,20 | Logo assenta sobre a placa | `y -16 → 0`, `opacity 0 → 1`, `.4`, `power2.out` |
| 0,40 | Chamada e subtítulo | `y 12 → 0`, `opacity`, `.3`, `stagger .08` |
| 0,60 | Botão(ões) | `scale .9 → 1`, `opacity`, `.3`, `back.out(1.6)` |
| 0,60 | Zinos entra flutuando na área à direita do portão, expressão `indicando` | `x +40 → 0`, `opacity`, `.6`, `power2.out` |
| depois | **Loops**: Zinos sobe e desce ±6 px · pisca a cada 3–5 s (aleatório) · 3 bolinhas de fumaça sobem da chaminé | flutuar: `y: -6`, `2.4`, `sine.inOut`, `yoyo`, `repeat:-1` · fumaça: cada bolinha `y -70`, `scale .6 → 1.4`, `opacity .6 → 0`, `3`, `stagger 1`, `repeat:-1` |

**Com progresso salvo:** a cópia ZN-xx (componente `CopiaRobo`, ~80% do tamanho do Zinos) aparece ao lado dele com as peças já montadas, e o Zinos fica `feliz`. Os botões passam a ser "Continuar turno" (principal) e "Recomeçar" (secundário).

### D. "Iniciar turno" → Sala 1 (≈ 2,1 s)
| t | O que acontece | GSAP |
|---|---|---|
| 0,00 | Bloqueia toques. No Android tenta `requestFullscreen()` + `screen.orientation.lock('landscape')` (falha em silêncio) | — |
| 0,00 | Logo, textos e botões somem. Zinos vira `feliz` | `opacity → 0`, `.25` |
| 0,20 | O portão treme e sobe, revelando o interior quente | tremida: `y ±2`, `.05`, `repeat 3` · subir: `clip-path: inset(0 0 0 0) → inset(0 0 100% 0)`, `.8`, `power2.inOut` |
| 1,00 | A câmera entra pelo vão e o Zinos sai de quadro | `useCamera.ir({ x: 960, y: 700, zoom: base × 4 })`, `.6`, `power2.in` · Zinos `opacity → 0`, `.3` |
| 1,55 | A Sala 1 chega em visão geral | Sala 1 `scale 1.12 → 1`, `opacity 0 → 1`, `.5`, `power2.out` |
| 2,05 | O avatar do Zinos entra no HUD e mostra a `fala` da sala | balão `scale .8 → 1`, `.25`, `back.out` |

### E. Aviso de girar (camada por cima, não é estado)
- Aparece quando `orientation: portrait` e o usuário ainda não escolheu "continuar assim".
- No centro, a cabeça do Zinos (`indicando`) e um ícone de celular **giram juntos**: `rotation 0 → -90`, `.6`, `power2.inOut`, pausa de `.8`, volta. Loop.
- Textos e botão logo abaixo. Ao girar o celular, a camada some (`.2`) e a cena reenquadra.

---

## Textos finais (para o `estacoes.json`)
```json
{
  "abertura": {
    "preloader": { "pronto": "Sistema pronto!", "aria": "Carregando a fábrica" },
    "fachada": {
      "chamada": "Como uma máquina aprende?",
      "subtitulo": "Entre na fábrica e monte uma IA em 5 estações.",
      "iniciar": "Iniciar turno",
      "continuar": "Continuar turno",
      "recomecar": "Recomeçar",
      "confirmarRecomecar": "Apagar seu progresso e começar do zero?",
      "confirmarSim": "Sim, recomeçar",
      "confirmarNao": "Cancelar",
      "rotuloCopia": "Sua cópia: {serie}"
    },
    "orientacao": {
      "titulo": "Gire o celular para ver a fábrica",
      "continuar": "Continuar assim mesmo"
    }
  }
}
```

---

## Prompt de implementação (Fase B — colar para o agente de código)
```
Projeto AutoLab, branch feat/visual. Leia claude/PLANO_v2.1.md (seções 0, 4, 5, 6 e 11) e
claude/discussoes/04-preloader-fachada-RESULTADO.md (roteiro com tempos). Antes de escrever
animação, consulte as skills oficiais do GSAP.

Implemente, em commits pequenos (em português, "tipo: descrição"):

1. src/lib/precarregar.js — recebe a lista de assets da fachada + Sala 1 (imagens e SVGs), carrega
   com Image()/fetch, chama onProgresso(carregados/total). Erros contam como carregados (não travar).
   As Salas 2–5 carregam em segundo plano depois que a fachada aparecer.

2. Mascote.jsx — injeta public/mascote/zinos-cabeca.svg inline (os grupos #exp-<nome> e #olhos
   precisam ficar acessíveis). Props: expressao, piscar (bool), onPronto. Troca de expressão = crossfade
   de .15 s entre grupos. Piscar = scaleY em #olhos, intervalo aleatório 3–5 s.
   Expressão "carregando" com os caracteres aleatórios + barra + % controlados por prop "progresso".

3. Preloader.jsx — estado "carregando" da máquina. Segue as tabelas A e B do roteiro: mínimo de 1,2 s,
   sequência final de ~2,1 s, despacha ASSETS_PRONTOS ao terminar. Texto "Sistema pronto!" vem do JSON.

4. Fachada.jsx (substitui Recepcao.jsx) — camadas: public/fachada/cena.webp, portao.webp (recortado),
   logo SVG sobre a placa, Zinos (corpo vetorial por enquanto; trocar pelo low-poly quando existir) na
   área à direita do portão, fumaça (3 círculos SVG sobre a chaminé). Tabela C do roteiro.
   Com progresso salvo: CopiaRobo ao lado, botões Continuar/Recomeçar. Recomeçar abre confirmação
   inline (nada de confirm()). Ao INICIAR/CONTINUAR: tabela D (tentar fullscreen + lock landscape em
   try/catch; portão com clip-path; câmera pelo vão em 960,700; chega na Sala 1).

5. AvisoOrientacao.jsx + useOrientacao.js — camada por cima de tudo (não é estado da máquina).
   Seção E do roteiro. "Continuar assim mesmo" grava a escolha em sessionStorage (com try/catch).

6. prefers-reduced-motion: todas as sequências viram crossfade de .3 s; loops desligados.

Regras: o reducer decide, a animação reage (as timelines só começam depois do dispatch e chamam
o próximo evento no onComplete). Todos os textos vêm de estacoes.json. Toques bloqueados durante
"transicao". Botões com mínimo de 44 px.
Aceite: no Galaxy A12 deitado, preloader → fachada → Sala 1 roda sem engasgar e o preloader
termina em menos de ~4 s no 4G (testar com throttling "Fast 4G" no DevTools).
```

## Pendências
- Cena da fachada (e a versão com o portão aberto) — depende do teste dos geradores (discussão 03, pergunta 6).
- Versão low-poly do Zinos para a fachada — prompt pronto em `01-mascote-RESULTADO.md`.
- `og-image.png` (1200×630): Zinos `feliz` + logo + "Como uma máquina aprende?". Fica para a Fase C.
