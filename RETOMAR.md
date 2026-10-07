# Retomar daqui — AutoLab

> Atualizado em **07/10/2026**. Este arquivo é o "comece por aqui" entre sessões: onde o projeto está, o que acabou de mudar e qual é o próximo passo. O detalhe técnico mora nos outros documentos; aqui é só o mapa.

---

## Onde o projeto está

**O jogo está completo e no ar**, com a arte final das 5 salas, som e métricas.

| | |
|---|---|
| **Site** | https://shoityn.github.io/AutoLab/ |
| **Repositório** | https://github.com/shoityn/AutoLab (público) |
| **Branch** | `main` e `feat/visual` sincronizadas em `b61a2e9` |
| **Métricas** | GoatCounter, conta `glaubershoity` — https://glaubershoity.goatcounter.com |
| **Prazo** | site no ar e cartazes distribuídos até **07/11/2026** |

### ⚠️ Armadilha do GitHub Pages — não esquecer

Em **Settings → Pages**, a origem **tem de ficar em "GitHub Actions"**.

Ela estava em "Deploy from a branch", e por isso o Pages publicava o repositório cru em vez do `dist` do build: o `index.html` servido pedia `/src/main.jsx`, que o navegador não executa. Resultado: **tela branca com a URL respondendo 200**.

Sintoma para reconhecer na hora: se `https://shoityn.github.io/AutoLab/README.md` responder 200, a fonte voltou a estar errada.

---

## O que mudou na sessão de 07/10

1. **Pages corrigido** e `feat/visual` mesclada na `main` — eram 16 commits que nunca tinham saído da máquina. O jogo completo nunca tinha chegado ao GitHub.
2. **GoatCounter ligado** (`GOATCOUNTER_CODE = 'glaubershoity'`). Mede visita, estação concluída e turno concluído.
3. **Som**, do zero: 11 efeitos mais a voz do Zinos, tudo sintetizado na Web Audio — **0 arquivos de áudio, +1,9 KB gzip**. Começa desligado.
4. **Hover e foco de teclado** nos 16 botões do jogo. Antes só o hotspot reagia ao mouse, e não havia estilo de foco nenhum.
5. **Revisão de movimento + plano da montagem peça por peça** → `docs/08-movimento-e-montagem.md`.

Duas anotações antigas que estavam **erradas** e foram corrigidas nos documentos: a que dizia que a `feat/visual` já tinha sido mesclada, e a que dizia que o QR entregue apontava para `glaubershoity`. Os três QRs do repositório foram decodificados e **todos levam à URL certa**.

---

## Próximo passo: o plano de movimento

Tudo está em **`docs/08-movimento-e-montagem.md`**. Resumo do que fazer, em ordem de retorno por hora:

### Ganho imediato, não depende de nada (≈ 1 h no total)

| # | O quê | Esforço |
|---|---|---|
| 1 | `animation-delay` escalonado nos anéis dos hotspots — hoje os 5 pulsam em uníssono | 10 min |
| 2 | `bounce.out` → `back.out(1.3)` na peça nova — hoje o metal quica como borracha | 5 min |
| 3 | Realce dos hotspots nas Salas 4 e 5 — `mixBlendMode: screen` é **invisível** sobre o laboratório claro | 30 min |
| 4 | `--acento` do Ambiente 2 — hoje é ciano, quase igual ao `--hotspot`, então "lido" e "novo" se confundem na Sala 3 | 10 min |

### A cerimônia de montagem (≈ 8 h)

Ordem obrigatória, porque um destrava o outro:

5. **Transcrever as peças em JSX** (`PecasZinos.jsx`). Hoje são `<img>`, e **nada dentro de um `<img>` é alcançável pelo GSAP** — sem isso o núcleo não acende, a antena não pisca e os braços não se movem separados. O `Mascote.jsx` já é uma transcrição pelo mesmo motivo.
6. Estado `montagem` no reducer (`quiz → montagem → visao-geral`), com `comSalvaguarda` e pulável ao toque.
7. Palco + FLIP (a cópia sai do selo do HUD, cresce no centro, volta).
8. As cinco coreografias — base sobe do chão, tronco cai da esteira com squash, **núcleo ignifica no peito**, braços desdobram e acenam, cabeça desce em arco e acorda.
9. Som novo: `ignicao`, para o núcleo.

### Melhorias no modelo do Zinos (≈ 1 h, é arte)

- **A cópia não tem rosto o jogo inteiro:** o grupo `<g id="tela">` de `5-cabeca.svg` está **vazio**. Dar um rosto de *standby* (dois traços em `--marca-aco` a 35%).
- Repetir o brilho especular da cabeça no tronco e na base — hoje a luz não vem do mesmo lugar.
- Sombra de contato escura sob a base, que hoje só tem o brilho ciano.

---

## Decisões que dependem de você

Estas cinco travam o item correspondente. Sem resposta, sigo o padrão sugerido no `docs/08`.

1. **Transcrever as peças em JSX** — aceita o mesmo débito de dupla fonte que o `Mascote` já carrega?
2. **Rosto de standby na cópia** — dois traços, ou mantém a tela preta lisa?
3. **`--acento` do Ambiente 2** — violeta, âmbar frio, ou deixa como está?
4. **Duração da cerimônia** — 2,2 s por peça (×5 = 11 s do turno), ou corta para ~1,5 s?
5. **Transição entre cenas** — hoje ~2,4 s, ×4 = ~10 s do turno. Comprimir para 1,6 s, ou mantém o drama?

As decisões de conteúdo, flyer e distribuição continuam em **`PERGUNTAS-ABERTAS.md`**.

---

## O que ainda falta fora do código

| O quê | Urgência |
|---|---|
| **Marca da UNIPAR no flyer** — é o que trava a impressão. Use `cartaz/qr-autolab.svg` como QR | **Alta** |
| **Jogar do início ao fim num Galaxy A12 deitado** — é o critério de aceite do plano | **Alta** |
| Revisão dos textos pela dupla (Kamilla e Wellington) | Média — até 17/10 |
| Cronometrar uma partida e conferir os ~10 min prometidos no flyer | Média |
| Lighthouse mobile — nunca foi medido | Média |

**Para o relatório da Fase E:** bloqueadores de anúncio derrubam o GoatCounter em algumas listas, então o número medido é **piso**, não total. Escreva "no mínimo N visitantes".

---

## Comandos

```bash
git checkout main
npm run dev     # http://localhost:5173/AutoLab/
npm run lint    # oxlint
npm run build   # tem de passar antes de qualquer push na main

# ?debug=1 na URL mostra a grade do mundo e as coordenadas do toque
```

Regras do repositório (PLANO.md seção 9): **commits pequenos, um por tarefa, sem linhas de coautoria**, e a `main` sempre publicável — ela vai ao ar a cada push.
