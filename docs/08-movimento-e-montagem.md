# Discussão 08 — Movimento, acabamento e a cerimônia de montagem (07/10/2026)

Dois assuntos: uma **revisão do que já existe** (animação, cor, brilho) e o **plano da montagem peça por peça** do Zinos ao fim de cada quiz.

Tudo aqui foi conferido no código, não suposto. Onde digo "hoje", é o estado em `10762b1`.

---

## 1. Identidade de movimento

Hoje o jogo tem animações boas e isoladas, mas **nenhuma constante escrita**: cada arquivo escolheu sua duração e sua curva. É o que faz o conjunto parecer menos acabado do que cada parte. Proposta de três constantes, para tudo novo seguir:

| Constante | Valor | Onde se usa |
|---|---|---|
| **Curva assinatura** | `cubic-bezier(.2, 0, 0, 1)` | 80% do que for interface |
| **Curva do Zinos** | `back.out(1.3)` | mascote, peças, recompensa |
| **Paleta de duração** | **110 ms** rápido · **280 ms** padrão · **560 ms** lento | respectivamente: hover/press · painel, card · câmera, cena |

A **personalidade** é mista de propósito, e vale deixar isso explícito: a **interface é Corporate** (limpa, sem exagero) e o **Zinos é Playful** (elástico, com overshoot). O erro a evitar é vazar um no outro — botão quicando parece amador, robô rígido parece morto.

Uma regra de material que o jogo ainda não segue: **a cópia é de metal**. Metal tem overshoot pequeno (3–8%) e assentamento rápido. Hoje a peça nova entra com `bounce.out`, que é a curva de **bola de borracha** — quica três vezes. É a troca mais barata de fazer e a que mais muda a leitura do material.

---

## 2. Revisão do fluxo atual

### 2.1 ⚠️ O realce dos hotspots some nas Salas 4 e 5

`Sala.jsx` → `RealceObjeto` usa `mixBlendMode: 'screen'`.

Screen clareia: o resultado é `1 − (1−a)(1−b)`. Sobre um fundo quase branco o resultado é branco **qualquer que seja a cor de cima**. As Salas 4 e 5 usam o Ambiente 3 (`--bg #f8fafc`), e a arte delas é um laboratório claro — então **o halo ciano que marca os objetos interativos é literalmente invisível lá**. Dá para confirmar olhando uma captura da Sala 5: os anéis de toque aparecem, o halo não.

**Correção:** trocar o blend por ambiente — `screen` no galpão escuro (Ambientes 1 e 2) e `multiply` com `--hotspot-escuro` no laboratório claro (Ambiente 3). Alternativa mais simples e previsível: abandonar o blend e usar um anel de contorno com `box-shadow` duplo, que funciona em qualquer fundo.

### 2.2 ⚠️ Na Sala 3, "lido" e "novo" têm quase a mesma cor

`--hotspot` é sempre `#67e8f9`. O `--acento`, que marca o hotspot já lido, muda por ambiente:

| Ambiente | `--acento` | Contra `--hotspot` |
|---|---|---|
| 1 (galpão) | `#b45309` âmbar | bem distinto |
| 2 (**Sala 3**) | `#0891b2` ciano | **quase igual** |
| 3 (Salas 4–5) | `#059669` verde | distinto |

Na Sala 3 os dois estados ficam azul-ciano. Não é falha dura — o ícone muda (informação × visto), e a regra "a sinalização nunca depende só de cor" continua respeitada. Mas o sinal enfraquece justo na sala mais densa. **Sugestão:** `--acento` do Ambiente 2 vira um violeta (`#8b5cf6`) ou um âmbar frio; ambos convivem com o azul da sala sem colidir com o ciano.

### 2.3 Todos os hotspots pulsam em uníssono

`.anel-pulso` é a mesma animação CSS, começando no mesmo instante, em **todos** os hotspots da sala — 5 anéis sincronizados na Sala 1. Isso quebra a regra de nunca ter mais de 1/3 dos elementos em movimento ao mesmo tempo, e é o que dá a sensação de "tela piscando".

**Correção de uma linha:** `animation-delay` escalonado por índice (`i * 380ms`). Os anéis passam a respirar em onda em vez de bater junto. Mesmo custo, leitura muito mais calma — e o olho passa a varrer a sala em vez de receber tudo de uma vez.

### 2.4 A recompensa é comemorada num selo de 44 × 32 px

É o achado mais importante da revisão, e é o que motiva a seção 4.

Hoje, ao acertar o quiz: o painel fecha → a cópia **no HUD** (`className="h-11 w-8"`, ou seja **44 × 32 px**) quica a peça nova com `bounce.out`. O maior momento do jogo — a razão de ter respondido tudo — acontece num selo do tamanho de uma unha, no canto superior direito, enquanto o olho do jogador ainda está no centro da tela de onde o painel acabou de sumir.

Ninguém vê.

### 2.5 Durações fora da tabela

| O quê | Hoje | Referência | Observação |
|---|---|---|---|
| `abrirPainel` | 500 ms | 300–400 ms (modal) | Longo. 380 ms com a curva assinatura resolve. |
| `fecharPainel` | 250 ms | — | ✅ Correto: saída mais curta que entrada. |
| `transicaoEntreCenas` | **~2,4 s** | 400–600 ms (página) | É revelação dramática, então estender é legítimo — mas ×4 transições são ~10 s dos 10 min prometidos. Sugiro comprimir para ~1,6 s. |
| `.anel-pulso` | 2 s em laço | — | ✅ Ambiente, correto. |

### 2.6 Dois detalhes técnicos

**`CopiaRobo` tem React e GSAP disputando a mesma propriedade.** O `<img>` recebe `style={{ opacity: presente ? 1 : 0 }}` do React, e o GSAP escreve `opacity` inline no mesmo elemento. Hoje não quebra porque os valores coincidem no fim, mas é frágil: qualquer re-render no meio da animação a corta. **Correção:** o React controla só `visibility`/montagem; a opacidade é do GSAP.

**`src/components/Recepcao.jsx` é órfão.** Ninguém importa, e o Vite não o inclui no bundle (conferido: 0 ocorrências no `dist`). Sobrou do fluxo por rolagem da v1. Não custa peso, mas confunde quem for mexer. Vale apagar ou mover para um `_antigo/`.

---

## 3. O modelo do Zinos

Geometria conferida nos SVGs — todos compartilham `viewBox 0 0 240 320`, o que é o que permite empilhá-los no mesmo quadro:

| Peça | Arquivo | Âncora | Extensão |
|---|---|---|---|
| Base | `1-base.svg` | (120, 250) | y 238–295, com 2 elipses de brilho ciano |
| Tronco | `2-tronco.svg` | (120, 197) | x 72–168, y 148–234 (pescoço em 148–164) |
| Núcleo | `3-nucleo.svg` | (120, 191) | círculo r=12, ciano, com `filter: glow` |
| Braços | `4-bracos.svg` | ombros (74, 183) e (166, 183) | mãos em (48, 218) e (192, 218) |
| Cabeça | `5-cabeca.svg` | (120, 87) | y 22–152, antena em (120, 9) |

### 3.1 ⚠️ A cópia não tem rosto durante o jogo inteiro

Em `5-cabeca.svg`, o grupo da tela está **vazio**:

```xml
<g id="tela" filter="url(#glow)">
</g>
```

Os olhos só existem em `5-cabeca-ligada.svg`, que só é usado na Expedição. Então, da Sala 5 até o fim do turno, a cópia tem uma tela preta lisa no lugar do rosto.

Dá para defender como intencional ("ela está desligada"), mas o efeito é de peça faltando, não de robô dormindo. **Sugestão:** dar um rosto de *standby* — dois traços horizontais curtos em `--marca-aco` a 35% de opacidade, na linha dos olhos. Lê como "desligado" em vez de "sem desenho", e torna o acender da Expedição muito mais forte, porque há um antes.

### 3.2 A luz não vem do mesmo lugar em todas as peças

A cabeça tem um brilho especular no canto superior esquerdo:

```xml
<path d="M42 56 Q44 50 52 50 H68" stroke="#fff" stroke-opacity=".14" stroke-width="4" .../>
```

O tronco e a base não têm nada equivalente. Resultado: a cabeça parece volumétrica e o corpo parece recortado em papel.

**Sugestão:** repetir o mesmo traço (branco, opacidade .14, mesma espessura) no alto-esquerda do tronco e na aba da base. Três linhas de SVG, e o modelo inteiro passa a ter uma direção de luz só.

### 3.3 A base flutua sem sombra de contato

`1-base.svg` tem duas elipses **ciano** embaixo (o rastro do propulsor), mas nenhuma sombra escura. Objeto que flutua precisa das duas coisas: a luz que ele emite e a sombra que ele projeta. Sem a sombra, ele não "pousa" em lugar nenhum.

**Sugestão:** uma elipse `#0B1118` a ~22% de opacidade, com `blur6`, logo abaixo do brilho ciano.

### 3.4 O núcleo merece um bloom mais largo

Os SVGs definem um `glow` único com `stdDeviation="2.2"`, usado tanto na faixa da base quanto no núcleo. 2.2 é um halo apertado — bom para uma faixa fina, fraco para o que deve ser a fonte de energia do robô.

**Sugestão:** um segundo filtro `glowForte` com `stdDeviation="5"`, só para o núcleo.

### 3.5 ⚠️ Decisão técnica que destrava tudo: transcrever as peças em JSX

Hoje `CopiaRobo` renderiza cada peça como `<img src={...svg}>`. **Conteúdo dentro de um `<img>` é inacessível ao CSS e ao GSAP** — não dá para alcançar `#antena`, `#tela` ou o círculo do núcleo. Isso impede, do jeito atual:

- a antena piscar quando a cabeça pousa;
- os olhos acenderem;
- o núcleo pulsar;
- os braços se moverem separados um do outro.

Ou seja: quase tudo que faz a montagem valer a pena.

**O projeto já resolveu exatamente este problema uma vez.** `Mascote.jsx` é uma transcrição em JSX de `zinos-cabeca.svg`, e o `DECISOES.md` item 2 explica o porquê. O mesmo caminho serve aqui: um `PecasZinos.jsx` com os cinco grupos inline, num único `<svg viewBox="0 0 240 320">`.

Ganhos: um nó de DOM em vez de cinco requisições de imagem, sub-elementos animáveis, e as cores podem virar `currentColor`/variáveis — o que permitiria, por exemplo, a cópia refletir o ambiente da sala.

Custo: os SVGs passam a ter duas fontes de verdade (o arquivo e a transcrição), o mesmo débito que o `Mascote` já carrega. **Mitigação:** manter os arquivos em `public/` como a fonte de arte e anotar no topo do JSX que ele é uma transcrição, igual ao `Mascote`.

---

## 4. A cerimônia de montagem

### 4.1 Onde ela entra na máquina de estados

A regra do projeto é "o reducer decide, a animação reage" (PLANO v2.1 seção 5). Então a montagem **é um estado**, não um efeito solto:

```
quiz --QUIZ_ACERTOU--> montagem --MONTAGEM_CONCLUIDA--> visao-geral
```

```js
case 'QUIZ_ACERTOU':
  if (estado.estado !== 'quiz') return estado
  return {
    ...estado,
    estado: 'montagem',
    pecaNova: acao.peca,            // 'base' | 'tronco' | 'nucleo' | 'bracos' | 'cabeca'
    hotspotAtivo: null,
    quizzes: estado.quizzes.includes(acao.salaId) ? estado.quizzes : [...estado.quizzes, acao.salaId],
  }

case 'MONTAGEM_CONCLUIDA':
  if (estado.estado !== 'montagem') return estado
  return { ...estado, estado: 'visao-geral', pecaNova: null }
```

Três cuidados, todos com precedente no código:

1. **Salvaguarda obrigatória.** Usar `comSalvaguarda(concluir, 4000)`. O projeto já apanhou disso: transições presas quando o rAF congela estão documentadas em `DECISOES.md`. A cerimônia depende de `onComplete` e tem o mesmo risco.
2. **Pulável.** Toque em qualquer lugar chama `concluir()` na hora. É instalação pública: quem já viu cinco vezes não pode ser obrigado a ver a sexta.
3. **A cópia do HUD não recebe a peça antes da hora.** Como `quizzes` já cresceu no `QUIZ_ACERTOU`, o HUD mostraria a peça nova imediatamente e estragaria a revelação. No `App.jsx`, durante `montagem`, passar `pecas` menos `estado.pecaNova`.

### 4.2 Estrutura comum às cinco — ~2,2 s

A técnica central é **FLIP**: a cópia sai de onde ela já está (o selo do HUD) e volta para lá. Isso conecta a cerimônia ao HUD em vez de ela aparecer do nada — o jogador entende que o que cresceu no centro é a mesma coisa que vive no canto. `gsap/Flip.js` está disponível na versão instalada (3.15), ou se faz na mão medindo os dois `getBoundingClientRect`.

| Fase | Tempo | O quê | Camada |
|---|---|---|---|
| **0 · Palco** | 0–280 ms | Fundo escurece a 72%; a cópia faz FLIP do HUD até o centro e cresce até ~34 vh | primária |
| **1 · Antecipação** | 280–400 ms | A cópia encolhe para `scale .97` | primária |
| **2 · Encaixe** | 400–900 ms | A peça percorre seu caminho e trava (ver 4.3) | primária |
| **3 · Confirmação** | 900–1300 ms | Flash ciano radial; som `peca`; o contador do HUD incrementa | secundária |
| **4 · Resolução** | 1300–1800 ms | Zinos entra pela esquerda com a fala da peça; a cópia "respira" (scale 1 → 1.012 → 1) | secundária |
| **5 · Saída** | 1800–2200 ms | Overlay sobe; FLIP de volta ao HUD | primária |

**Camada ambiente**, o tempo todo: um gradiente radial ciano muito sutil atrás da cópia, pulsando a 4 s. É o que impede a cena de parecer um GIF recortado sobre um retângulo preto.

**Com `prefers-reduced-motion`:** sem FLIP e sem percurso. A cópia aparece centralizada, a peça surge com um crossfade de 150 ms, o flash vira um brilho estático de 400 ms, total ~700 ms. O conteúdo é o mesmo; só o deslocamento sai.

### 4.3 Coreografia peça por peça

A ordem de conquista é ditada pelas salas — e, felizmente, ela também funciona como ordem de montagem: do chão para a cabeça, com o núcleo acendendo no meio.

#### Sala 1 → **Base** · *"a cópia ganha chão"*

- **Caminho:** sobe de baixo, `y: +90 → 0`. É a fundação; ela vem do chão.
- **Curva:** `power3.out`, 420 ms. **Sem overshoot** — o que é chão não quica.
- **Secundária:** as duas elipses de brilho ciano acendem **depois** do pouso (+120 ms, fade de 260 ms). A ordem importa: primeiro o objeto existe, depois ele liga.
- **Ambiente:** uma clareada ciano no piso sob a cópia, 500 ms.
- **Fala do Zinos:** "Chão primeiro. Sem dado bom embaixo, nada do que vem em cima para de pé."

#### Sala 2 → **Tronco** · *"o corpo cai da linha"*

- **Caminho:** desce de cima, `y: −110 → 0`, com arco de 12 px em X — vem da esteira, não do céu.
- **Curva:** `back.out(1.2)`, 480 ms. É a peça mais pesada: overshoot mínimo, ~3%.
- **Squash no pouso:** `scaleY .94 → 1` em 160 ms, `transformOrigin` na base do tronco. É o princípio de squash & stretch da Disney — e é o que faz metal pesado parecer pesado.
- **Secundária:** a base **comprime 2 px e volta**, repassando o impacto para baixo. Detalhe pequeno, leitura grande: as duas peças viram um corpo só em vez de dois adesivos.
- **Fala:** "Corpo montado. Agora ele tem onde guardar o que aprendeu."

#### Sala 3 → **Núcleo** · *"ele acende"*

Esta é a melhor cena das cinco, e deve ser tratada como tal — a Sala 3 é "o cérebro da fábrica".

- **Caminho: nenhum.** O núcleo não voa até o peito. Ele **ignifica** lá dentro. A propriedade primária é escala, não posição.
- **Curva:** `scale 0 → 1.35 → 1` com `back.out(2.4)`, 380 ms, junto de `opacity 0 → 1`.
- **Secundária 1:** um anel ciano expande de (120, 191) — `scale 1 → 3.4`, `opacity .7 → 0`, 500 ms, `power2.out`.
- **Secundária 2:** a cavidade escura que o tronco já desenha (`circle r=18 fill=#2B2F36` em 120, 191) ganha um brilho interno. Isso **exige a transcrição em JSX** da seção 3.5.
- **Ambiente:** luz de contorno ciano em toda a cópia por 600 ms, como se o núcleo iluminasse o resto.
- **Fala:** "Esse é o cérebro. Spoiler: não tem mágica, só multiplicação e soma."

#### Sala 4 → **Braços** · *"ele abre os braços"*

- **Caminho:** os dois ombros estão em (74, 183) e (166, 183), espelhados em x=120. Em vez de voarem de fora, **desdobram**: `scaleX 0 → 1` com `transformOrigin: 50% 57%` (a linha dos ombros, 183/320).
- **Curva:** `back.out(1.4)`, 400 ms.
- **Secundária:** depois do encaixe, um aceno — rotação ±4° em 300 ms, assentando em 0. É a sala da **Inspeção de Qualidade**: o gesto é temático, não enfeite.
- **Fala:** "Braços para medir o que saiu certo. E para apontar o que saiu torto."

#### Sala 5 → **Cabeça** · *"ele acorda"*

Última peça: além do encaixe, é o fecho do turno inteiro.

- **Caminho:** desce de `y: −130 → 0` com rotação `−8° → 0`. Arco, nunca queda reta — queda reta é objeto, arco é ser vivo.
- **Curva:** `back.out(1.2)`, 520 ms.
- **Secundária 1:** a antena (120, 9) pisca ao pousar, +180 ms.
- **Secundária 2:** a tela troca do rosto de standby (3.1) para `5-cabeca-ligada.svg` — os olhos acendem com `glow`, +320 ms.
- **Resolução estendida:** a cópia completa dá um *bob* de 360 ms (`y: 0 → −6 → 0`), a fanfarra toca, e **só então** a Expedição entra. Hoje a Expedição já faz uma animação de acordar; esta cerimônia é o ensaio dela, e as duas precisam ser afinadas juntas para não repetir a mesma batida duas vezes em 4 segundos.
- **Fala:** "Pronto. ZN-xx acordado, montado por você."

### 4.4 Som

Os ganchos já existem (`src/lib/som.js`). O que a cerimônia pede:

| Momento | Hoje | Proposta |
|---|---|---|
| Encaixe | `peca` | ✅ serve como está |
| Acender do núcleo | — | novo: `ignicao` — sweep de ruído subindo + nota ciano sustentada |
| Antena / olhos | — | reaproveitar `marcado`, mais agudo |
| Fim (5ª peça) | `fanfarra` | ✅ já existe |

### 4.5 Orçamento

5 × 2,2 s = **11 s** num turno de ~10 min. Aceitável **porque é pulável**. Se a cronometragem da discussão 06 apertar, o corte certo é a fase 4 (resolução), não a 2 (encaixe) — a fala do Zinos pode migrar para o balão do HUD, que já existe.

---

## 5. Ordem de implementação

Em ordem de retorno por hora de trabalho:

| # | O quê | Esforço | Depende de |
|---|---|---|---|
| 1 | `animation-delay` escalonado nos anéis (2.3) | 10 min | — |
| 2 | `bounce.out` → `back.out(1.3)` na peça (1) | 5 min | — |
| 3 | Realce dos hotspots nas Salas 4 e 5 (2.1) | 30 min | — |
| 4 | `--acento` do Ambiente 2 (2.2) | 10 min | decisão de cor |
| 5 | Rosto de standby + luz unificada + sombra de contato (3.1–3.3) | 1 h | arte |
| 6 | **Transcrição das peças em JSX** (3.5) | 2 h | — |
| 7 | Estado `montagem` + salvaguarda + pular (4.1) | 1 h | — |
| 8 | Palco, FLIP e estrutura comum (4.2) | 2 h | 6, 7 |
| 9 | As cinco coreografias (4.3) | 3 h | 8 |
| 10 | Som `ignicao` (4.4) | 20 min | — |

Os itens 1 a 4 são ganho imediato e independem de tudo. O 6 é o que destrava a cerimônia de verdade — sem ele, o núcleo não acende e a antena não pisca.

---

## 6. O que precisa de decisão sua

1. **Transcrever as peças em JSX** (3.5) — aceita o mesmo débito que o `Mascote` já tem?
2. **Rosto de standby na cópia** (3.1) — a cabeça desligada ganha dois traços, ou fica a tela preta lisa?
3. **`--acento` do Ambiente 2** (2.2) — violeta, âmbar frio, ou deixa como está?
4. **Orçamento da cerimônia** (4.5) — 2,2 s por peça está bom, ou corta para ~1,5 s?
5. **Encurtar a transição entre cenas** (2.5) — 2,4 s → 1,6 s, ou mantém o drama?
