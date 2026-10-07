# Discussão 03 — Estilo e cenas: resultado (04/10/2026)

## Decisões (para colar no plano, seção 7)
| Tema | Decisão |
|---|---|
| Teto | Faixa fina (~10% do topo) com viga e **2 lâmpadas penduradas** |
| Piso | ~25% da altura, com objetos apoiados no chão (caixas, balança, esteira) |
| Desgaste | **Rústico mas limpo**: metal gasto, tijolo, ferrugem só nas bordas. Sem sujeira que esconda os objetos |
| Mascote nas cenas | **Não**. Nas salas, o Zinos fica só no HUD e no balão. Ilustrado, aparece só na fachada e na Expedição, **composto por cima** (não gerado junto com a cena) |
| Fachada | **Entardecer**: céu laranja/roxo, luzes âmbar da fábrica acesas |
| Blockout | Feito em SVG/PNG (sem gastar créditos do Figma). O `*-figma.svg` importa no Figma já com as camadas `hotspot:<id>` e `saida` nomeadas |
| Gerador | A definir no primeiro teste (Gemini × ChatGPT, mesmo prompt e mesmo blockout) |

## Coordenadas da Sala 1 (centros dos retângulos do blockout, mundo 1920×1080)
| id | x | y | objeto |
|---|---|---|---|
| `ingestao-caixas` | 305 | 640 | pilha de caixas (fontes) |
| `ingestao-etiqueta` | 480 | 640 | etiqueta rasgada (faltantes) |
| `ingestao-balanca` | 725 | 718 | balança industrial (qualidade) |
| `ingestao-contador` | 700 | 355 | contador mecânico (volume) |
| `ingestao-quiz` | 1430 | 410 | prancheta do supervisor |
| `saida` | 1705 | 725 | esteira saindo pela abertura |

A menor distância entre hotspots é 175 (caixas × etiqueta), acima do mínimo de 120. **Depois que a cena for gerada**, sobreponha a imagem ao `sala1-anotado.png` e, se algum objeto "andou", mova o hotspot para o objeto (a imagem manda).

Fachada: o portão (`saida`) fica em **960, 700** (zoom através dele). A placa da fachada é vazia: o logo entra por cima em SVG.

---

## Prompt-base v2 (ajustado com as decisões)
```
Stylized low-poly 3D render, chunky simple shapes with bevelled edges, Roblox/Kogama-like game art,
flat-shaded materials with subtle texture, soft ambient occlusion and soft cast shadows,
straight-on frontal view of ONE wall of a room at human eye level, one-point perspective,
camera parallel to the wall, a thin strip of ceiling with a dark beam at the top edge,
the floor occupies the bottom quarter of the image, wide 16:9 composition,
clean readable silhouettes, each object clearly separated from the others, rustic but tidy,
light wear only on edges, no dirt or clutter covering objects,
no people, no characters, no robots, no readable text, no letters, no numbers, no logos, no watermark.
Keep the exact layout, positions and sizes of the grey blocks in the attached blockout image.
```

### Sala 1 — Recebimento & Ingestão (ambiente 1)
Anexe: `sala1-limpo.png` (e, a partir da 2ª sala, a Sala 1 aprovada como referência de estilo).
```
[prompt-base v2]
Environment: old industrial warehouse loading dock, riveted metal panels and red-brown brick wall,
worn concrete floor, warm amber light from two hanging industrial lamps, rust and dark steel accents,
palette of charcoal #1E222A, amber #FBBF24, burnt orange #B45309.
Scene, left to right, matching the blockout:
- Left, on the floor: a stack of five wooden crates and cardboard boxes, blank paper labels.
- On the right crate of that stack: a small torn blank paper tag, clearly visible.
- On the wall, upper center-left: a mechanical counter display box with rolling digit wheels (digits blank).
- Center-left, on the floor below it: an industrial platform floor scale with a vertical post and a round dial.
- Center: a large closed corrugated metal roller door in a dark steel frame (the loading dock door).
- Wall, right of the door: a clipboard with a blank sheet hanging on a nail.
- Right: a short conveyor belt that runs on the floor toward the right and exits through a dark opening in the wall.
- Top: two hanging industrial lamps with warm amber glow.
```

### Fachada (ambiente 1, entardecer)
Anexe: `fachada-limpo.png`.
```
Stylized low-poly 3D render, chunky simple shapes with bevelled edges, Roblox/Kogama-like game art,
flat-shaded materials, soft ambient occlusion and soft shadows,
straight-on frontal view of the front facade of a small old factory at human eye level, one-point perspective,
wide 16:9 composition, clean readable silhouettes.
Golden-hour dusk: warm orange to purple gradient sky, a few soft low-poly clouds, long soft shadows.
Factory: brick and riveted metal panels, sawtooth roof, one brick chimney with a thin wisp of smoke,
four windows glowing warm amber from inside, two wall lamps with amber light on both sides of the door,
a large closed corrugated metal roller door in the center inside a dark steel frame,
a blank light-colored sign panel above the door (no text), concrete sidewalk and asphalt in front.
Leave the area to the right of the door, at ground level, empty (a character will be added later).
Palette: charcoal #1E222A, amber #FBBF24, burnt orange #B45309, dusk purple #6D28D9 in the sky only.
No people, no characters, no robots, no readable text, no letters, no logos, no watermark.
Keep the exact layout, positions and sizes of the grey blocks in the attached blockout image.
```
**Portão em camada separada:** depois de aprovar a fachada, peça uma 2ª versão por edição: *"same image, but the roller door is fully open showing a dark warm-lit interior"*. No site, o portão fechado é recortado de uma das versões e sobe por cima da outra.

---

## Teste dos geradores (pergunta 6, ainda aberta)
1. Mesmo prompt + mesmo `sala1-limpo.png` no **Gemini** e no **ChatGPT**, 2 variações em cada.
2. Critérios, em ordem: (a) respeitou o layout do blockout? (b) os objetos estão separados e legíveis em tamanho de celular? (c) cara de low-poly cartoon, não realista? (d) inventou texto?
3. Traga os 4 resultados para a revisão. Aí eu ajusto o prompt-base e atualizo as coordenadas.

## Arquivos
| Arquivo | Uso |
|---|---|
| `sala1-limpo.png`, `fachada-limpo.png` | Anexar no gerador |
| `sala1-anotado.png`, `fachada-anotado.png` | Conferência: hotspots, horizonte, linhas de fuga e área do painel do celular |
| `sala1-figma.svg`, `fachada-figma.svg` | Arrastar para o Figma: camadas nomeadas, prontas para sobrepor a cena gerada |
| `coordenadas.json` | x/y prontos para o `estacoes.json` |

---

## Atualização 05/10 — cenas aprovadas

### Estilo oficial (substitui o "low-poly 3D")
O gerador entregou um **cartoon ilustrado com contorno escuro e sombreamento suave**, no mesmo traço da folha do Zinos. Esse passa a ser o estilo do projeto. A Sala 1 aprovada é a referência de estilo de todas as próximas cenas.

**Prompt-base v3** (troca a 1ª linha do v2; o resto continua igual):
```
Stylized cartoon game illustration with clean dark ink outlines, soft cel shading and subtle painted
textures, slightly chunky simplified shapes, warm cinematic lighting, soft ambient occlusion,
straight-on frontal view of ONE wall of a room at human eye level, one-point perspective,
camera parallel to the wall, a thin strip of ceiling with a dark beam at the top edge,
the floor occupies the bottom quarter of the image, wide 16:9 composition (1920x1080),
clean readable silhouettes, each object clearly separated from the others, rustic but tidy,
no people, no characters, no robots, no readable text, no letters, no numbers, no logos, no watermark.
Keep the exact layout of the attached blockout image. Match the art style of the attached reference image.
Generate ONE single image with only this scene.
```
Regra: **uma conversa nova por cena**, anexando (1) o blockout limpo da sala e (2) a `salas/1/cena.webp` como referência de estilo.

### Coordenadas corrigidas pela imagem (Sala 1)
| id | x | y |
|---|---|---|
| `ingestao-caixas` | 240 | 600 |
| `ingestao-etiqueta` | 460 | 712 |
| `ingestao-balanca` | 690 | 640 |
| `ingestao-contador` | 655 | 355 |
| `ingestao-quiz` | 1455 | 505 |
| `saida` | 1760 | 680 |
A menor distância entre hotspots é 241.

### Fachada em camadas (de baixo para cima)
1. **Vão do portão:** a própria `salas/1/cena.webp` em `object-fit: cover` dentro do retângulo do portão (x 838, y 600, 240×294). Quando o portão sobe, a pessoa já vê a Sala 1, e o zoom entra direto nela (estilo Gorogoa).
2. `fachada/cena.webp`: a fachada com **furo transparente** no portão.
3. `fachada/portao.webp`: o portão recortado. Anima com `clip-path: inset(0 0 0 0) → inset(0 0 100% 0)`.
4. Logo `marca/autolab-horizontal-claro.svg` sobre a placa (x 832, y 486, largura 254).
5. Zinos `mascote/corpo-acenando.webp` à direita do portão (x 1180, y 640, altura 255), com `drop-shadow` ciano.
6. Fumaça animada saindo do topo da chaminé (650, 308).
Zoom através do portão: centro (958, 747), `aproximacao` 3.8.

A imagem "portão aberto" gerada à parte foi **descartada**: ela mudava o enquadramento e o interior e trazia um robô extra. O vão com a Sala 1 resolve melhor.

### Arquivos finais (pasta `public/`)
`salas/1/cena.webp` (128 KB) · `fachada/cena.webp` (58 KB) · `fachada/portao.webp` · `mascote/corpo-{neutro,acenando,desligado}.webp` (fundo transparente) · `coordenadas.json`. Todos em 1920×1080, sem upscale. Se quiser mais nitidez no PC, passe as cenas no Upscayl para 2560×1440 antes de converter para WebP.
