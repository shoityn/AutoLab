# Zinos — ficha do mascote (v1, 04/10/2026)

## Identidade
- **Nome:** Zinos. Número de série do original: **ZN-00**.
- **Papel:** guia da fábrica (fala na entrada de cada sala, dá a dica quando a pessoa erra o quiz) e modelo das cópias.
- **Personalidade:** técnico com humor. Explica certo e solta uma piada de fábrica ou de dados de vez em quando.
  - Ex.: "Dado sujo entra, modelo confuso sai." / "Calma, até eu errei minha primeira previsão."

## Forma
- **Silhueta:** chibi, com cabeça grande e corpo pequeno (a cabeça tem ~1,8× a largura do tronco).
- **Cabeça:** tela retangular arredondada, moldura creme grossa e tela escura. Orelhas de metal e antena com bola ciano.
- **Movimento:** flutua. Embaixo do tronco fica a **base propulsora** (disco de metal com faixa ciano e brilho no chão).
- **Braços:** de metal, terminando em **pinças** de duas garras, com juntas creme no ombro e no pulso.
- **Tronco:** creme, com o **núcleo** ciano no peito e o número de série logo abaixo.

## Cores
| Uso | Hex |
|---|---|
| Corpo (creme) | `#F1EBDD` |
| Juntas e metal | `#7C8794` |
| Contorno (grafite) | `#2B2F36` |
| Tela | `#0B1118` |
| Brilho (ciano) | `#67E8F9` |
| Ciano escuro (apoio) | `#0891B2` |

## Rosto
- Olhos em pílula (retângulos arredondados) e boca de traço, tudo ciano com brilho.
- Expressões: `neutro`, `feliz`, `triste`, `explicando`, `indicando`, `pensando`, `carregando` + **`desligado`** (extra, usado na cabeça da cópia até a Expedição e na folha de personagem).

## Cópias
- Mesmo desenho do Zinos, mas com número de série **ZN-01 a ZN-99**, sorteado por jogador e salvo no progresso. O número aparece no peito e pode ir na tela de compartilhar ("Montei a ZN-42!").
- Peças, em ordem do jogo: **1 base propulsora** (ao encaixar, a cópia começa a flutuar) · 2 tronco · 3 núcleo · 4 braços/pinças · 5 cabeça-tela + antena (encaixa desligada e **liga na Expedição** com a expressão `feliz`).

## Arquivos
| Arquivo | Uso |
|---|---|
| `zinos-cabeca.svg` | Todas as expressões em grupos `#exp-<nome>` (só `neutro` visível). Base do `Mascote.jsx`: o GSAP troca/anima os grupos |
| `expressoes/zinos-<nome>.svg` | Uma expressão por arquivo, para revisar no Figma |
| `pecas/1-base.svg` … `5-cabeca.svg` | Peças da cópia, **todas no mesmo viewBox 240×320**: basta empilhar com `position:absolute`. `5-cabeca-ligada.svg` é a versão da Expedição |
| `zinos-corpo.svg` | Zinos inteiro (ZN-00). Também serve de "fantasma" das peças que faltam no HUD (opacidade 12%) |
| `copia-completa.svg` | Cópia completa e ligada |

## Prompt da versão ilustrada low-poly (folha de personagem)
Anexe `zinos-corpo.svg` exportado em PNG como referência de forma.

```
Character turnaround sheet of a cute small floating robot mascot, stylized low-poly 3D render,
chunky simple shapes with bevelled edges, Roblox/Kogama-like game art, flat-shaded materials
with subtle texture, soft ambient occlusion and soft shadows.
Chibi proportions: very large head, small body.
Head: wide rounded-rectangle TV-like casing in cream white (#F1EBDD) with a thick bezel;
the front is a dark glossy screen (#0B1118) showing two glowing cyan pill-shaped eyes
and a small straight line mouth (#67E8F9). Short grey metal antenna with a glowing cyan ball,
small grey metal ear caps on both sides of the head.
Body: small rounded cream torso with a round glowing cyan core in the chest inside a dark socket.
Two thin grey metal arms (#7C8794) ending in two-finger claw grippers, cream ball joints
at shoulders and wrists. No legs: under the torso a grey metal hover-thruster disc with a cyan
light strip, floating above the ground with a soft cyan glow beneath it.
Three views side by side on a plain light grey background, same scale:
(1) front view, neutral face; (2) three-quarter view, waving with one claw, happy face (^ ^ eyes);
(3) front view with the screen turned off (black screen, antenna light off).
No text, no letters, no numbers, no logos, no watermark.
```

Depois de aprovar a folha, ela entra como referência no gerador sempre que o Zinos aparecer numa cena (fachada e Expedição). O número de série **não** vem da imagem: ele é posto por cima em HTML/SVG.

## Decisões (para colar no plano, seção 9)
| Tema | Decisão |
|---|---|
| Nome | Zinos (o original é ZN-00) |
| Silhueta | Chibi: cabeça grande, corpo pequeno |
| Cabeça | Tela retangular arredondada, moldura creme grossa, tela escura |
| Movimento | Flutua (base propulsora com brilho ciano) |
| Braços | Metal, com pinças de 2 garras |
| Cor do corpo | Creme `#F1EBDD`, juntas em metal `#7C8794`, contorno grafite `#2B2F36` |
| Rosto | Olhos em pílula + boca de traço |
| Brilho da tela | Ciano `#67E8F9` |
| Personalidade | Técnico com humor |
| Cópias | Iguais ao Zinos, com número de série ZN-01 a ZN-99 sorteado por jogador |
| Peça 1 | Renomeada de "base/rodas" para **base propulsora** (a cópia passa a flutuar ao encaixar) |
| Expressões | As 7 do plano + `desligado` (cabeça da cópia antes da Expedição) |
| Arquivos | Peças no mesmo viewBox 240×320, empilháveis; cabeça com expressões em grupos `#exp-*` |
