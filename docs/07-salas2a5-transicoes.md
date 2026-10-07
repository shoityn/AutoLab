# AutoLab — Salas 2 a 5: transições e prompt para o agente de código (06/10/2026)

## Ideia geral
As transições **não precisam de arte nova**. Cada sala já tem uma saída desenhada na cena (abertura, elevador, porta). A transição é sempre:

1. **Pan + zoom até a saída** (a câmera que já existe, `useCamera.ir`)
2. **Efeito de passagem** próprio da saída, feito só com CSS/SVG por cima da tela
3. **Próxima sala chega** (`scale 1.12 → 1`, `opacity 0 → 1`, 0,5 s, `power2.out`)

A peça encaixa na cópia **antes** da transição, logo depois do acerto do quiz, como já está no MVP.

## Roteiro por saída (tempos em segundos)

| De → para | Saída na cena | Efeito de passagem (overlay) | Duração total |
|---|---|---|---|
| Sala 1 → 2 | Esteira entrando na abertura escura | **Túnel**: zoom forte na abertura (`aproximacao` 4) até o escuro cobrir a tela; a Sala 2 surge do escuro | ~1,4 |
| Sala 2 → 3 | Elevador de carga | **Elevador**: grade (barras verticais em SVG) fecha da direita para a esquerda (0,35) → tela "sobe": a sala atual desliza para baixo e some, uma faixa escura passa com leve tremida (0,5) → grade abre na Sala 3 (0,35) | ~1,6 |
| Sala 3 → 4 | Porta pressurizada dupla | **Porta dupla**: duas folhas cinza com faixa amarela/preta entram pelas laterais e fecham no centro (0,3) → "puff" de vapor (3 círculos brancos com blur) (0,3) → folhas abrem para os lados, revelando a Sala 4 (0,4) | ~1,5 |
| Sala 4 → 5 | Porta de vidro fosco | **Vidro**: zoom na porta + `backdrop-filter: blur(0 → 16px)` e véu branco 40% (0,4) → troca a sala por baixo → blur volta a 0 (0,4) | ~1,2 |
| Sala 5 → Expedição | Doca com luz do dia | **Luz**: zoom na doca + flash branco (`opacity 0 → 1 → 0`, 0,6) → tela da Expedição | ~1,2 |

**Movimento reduzido** (`prefers-reduced-motion`): todas viram crossfade de 0,3 s.
**Toques bloqueados** durante todo o estado `transicao`.

## Tela da Expedição (sem arte nova)
- Fundo: a própria `salas/5/cena.webp` com desfoque leve (`blur(6px)`) e véu escuro 60%.
- Centro: a **cópia completa** (`CopiaRobo`, 5 peças) com a cabeça **desligada** → 0,6 s depois a tela **liga** (`desligado → feliz`, flash ciano rápido) → o número de série (ZN-xx) aparece.
- Ao lado: Zinos (`corpo-acenando.webp`) com o balão da `falaZinos`.
- Textos do JSON (`expedicao.titulo`, `texto`, `compartilharTexto`, créditos) e os botões **Compartilhar** (Web Share API, com fallback para copiar o link) e **Recomeçar** (com confirmação dentro da página).

## Enquanto as artes não chegam
Use os **blockouts limpos** (`salaN-blockout.png`) como `cena` provisória de cada sala. As coordenadas abaixo já batem com eles, então o fluxo completo (hotspots, quiz, peças, transições, Expedição) pode ser testado agora. Quando a arte final chegar, troca-se só o arquivo e, se algum objeto "andar", eu corrijo o x/y.

### Coordenadas (mundo 1920×1080; centros dos hotspots)
| Sala | id | x | y |
|---|---|---|---|
| 2 | processamento-lavadora | 340 | 575 |
| 2 | processamento-peneira | 710 | 585 |
| 2 | processamento-alavancas | 1010 | 350 |
| 2 | processamento-lixeira | 1260 | 710 |
| 2 | processamento-quiz | 1470 | 410 |
| 2 | saida (elevador) | 1710 | 595 |
| 3 | neural-quadro | 330 | 375 |
| 3 | neural-mostradores | 860 | 660 |
| 3 | neural-valvula | 1270 | 510 |
| 3 | neural-quiz | 370 | 730 |
| 3 | saida (porta pressurizada) | 1605 | 552 |
| 4 | inspecao-monitor | 710 | 345 |
| 4 | inspecao-lupa | 1080 | 465 |
| 4 | inspecao-gavetas | 270 | 615 |
| 4 | inspecao-quiz | 1270 | 340 |
| 4 | saida (porta de vidro) | 1625 | 538 |
| 5 | expedicao-quadro | 350 | 350 |
| 5 | expedicao-porque | 960 | 320 |
| 5 | expedicao-caixa | 680 | 700 |
| 5 | expedicao-quiz | 1260 | 685 |
| 5 | saida (doca) | 1600 | 545 |

O painel "Por quê?" da Sala 5 é uma tela em branco na imagem: o texto **"Por quê?"** entra por cima, em HTML (camada `rotulos`).

---

## Prompt para o agente de código
```
Projeto AutoLab, branch feat/visual. Leia claude/PLANO_v2.1.md (seções 4.6, 5, 6 e 8) e
TRANSICOES-e-prompt-codigo.md. O MVP já tem preloader, fachada e Sala 1 funcionando: reaproveite
useCamera, a máquina de estados e os componentes existentes. Consulte as skills do GSAP antes de animar.

Tarefas, em commits pequenos (em português, "tipo: descrição"):

1. Dados: adicione as Salas 2–5 ao estacoes.json usando o conteúdo de estacoes-conteudo.json e as
   coordenadas da tabela. Por enquanto, camadas.cena = salas/N/cena.png (blockouts provisórios que
   vou colocar em public/salas/N/). Sem camada "frente" nessas salas.

2. Componente <Passagem tipo="tunel|elevador|portaDupla|vidro|luz" onMeio onFim />: overlay
   fixo por cima de tudo, só CSS/SVG, que roda a timeline do roteiro. "onMeio" é o momento em que
   a tela está coberta: é ali que o reducer troca de sala. "onFim" libera os toques.
   Cada sala define no JSON: "saida": { ..., "passagem": "elevador" }.
   Sala 1 → tunel, 2 → elevador, 3 → portaDupla, 4 → vidro, 5 → luz.

3. Sequência ao TOCAR_SAIDA: estado "transicao" → câmera vai até a saída (useCamera.ir, .6 s,
   power2.in) → <Passagem> → onMeio troca a sala → próxima sala chega (scale 1.12→1, opacity, .5 s)
   → estado "visao-geral" + fala de entrada do Zinos no HUD.

4. Tela Expedicao.jsx conforme a seção "Tela da Expedição": cópia montada com a cabeça
   desligada que liga (expressão "feliz"), número de série, Zinos acenando, textos do JSON,
   Compartilhar (navigator.share com fallback para copiar o link) e Recomeçar (confirmação inline).

5. prefers-reduced-motion: toda <Passagem> vira crossfade de .3 s.

Regras: o reducer decide, a animação reage. Animar só transform/opacity/filter (nada de
left/top/width). Testar no Galaxy A12 deitado: cada transição sem engasgo, máx. ~1,6 s.
Aceite: jogar do início ao fim (Sala 1 → Expedição) com os blockouts provisórios.
```

---

## Atualização 06/10 — artes das Salas 2 a 4 aprovadas
- `salas/2/cena.webp`, `salas/3/cena.webp`, `salas/4/cena.webp` (1920×1080, 60 a 104 KB). Substituem os blockouts provisórios.
- **Sala 5:** a imagem gerada repetiu a Sala 4. Será corrigida **por edição** (roteiro em `PROMPT-sala5-edicao.txt`): quadro de avisos, caixa lacrada, tela vazia para o "Por quê?" e doca com luz do dia. Enquanto isso, o blockout segue como provisório.
- `og-image.png` (1200×630) pronta para as meta tags.

### Coordenadas corrigidas pela imagem
| Sala | id | x | y |
|---|---|---|---|
| 2 | processamento-lavadora | 350 | 575 |
| 2 | processamento-peneira | 710 | 560 |
| 2 | processamento-alavancas | 1010 | 350 |
| 2 | processamento-lixeira | 1285 | 680 |
| 2 | processamento-quiz | 1465 | 410 |
| 2 | saida | 1730 | 560 |
| 3 | neural-quadro | 340 | 370 |
| 3 | neural-mostradores | 860 | 660 |
| 3 | neural-valvula | 1270 | 510 |
| 3 | neural-quiz | 370 | 690 |
| 3 | saida | 1600 | 545 |
| 4 | inspecao-monitor | 960 | 340 |
| 4 | inspecao-lupa | 630 | 340 |
| 4 | inspecao-gavetas | 270 | 610 |
| 4 | inspecao-quiz | 1350 | 430 |
| 4 | saida | 1625 | 535 |

Na Sala 4, a lupa e o monitor grande trocaram de lugar em relação ao blockout. O monitor pequeno sobre a bancada é só decoração e não tem hotspot.
