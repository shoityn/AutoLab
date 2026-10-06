# AutoLab

Site-jogo estático sobre Machine Learning, ambientado numa fábrica. Quem escaneia o QR code do cartaz percorre **5 salas ilustradas**: cada sala é vista inteira, com pontos de interação escondidos nos objetos. Tocar num ponto aproxima a câmera e abre um registro; ao responder o registro final da sala, uma peça do robô é montada, até a expedição.

🔗 **Acesse:** https://shoityn.github.io/AutoLab/

> **O jogo é em paisagem.** As cenas são ilustradas em 1920 × 1080; em retrato aparece uma tela pedindo para girar o aparelho (com a opção de jogar assim mesmo). Ver `DECISOES.md`.

## Equipe

- Glauber Shoity Nakai (desenvolvimento)
- Kamilla Barros Silva
- Wellington Henrique da Silva Lima

8º período de Sistemas de Informação — **Estágio Supervisionado (PACEX VIII)**, UNIPAR, prof. Elyssandro Piffer.

## Stack

React + Vite, Tailwind CSS v4, GSAP (`@gsap/react`). Sem backend: tudo estático, progresso em `localStorage`, métricas no GoatCounter.

## Desenvolvimento

```bash
npm install
npm run dev      # ambiente local (http://localhost:5173/AutoLab/)
npm run build    # build de produção em dist/
npm run lint     # oxlint
```

Publicação automática no GitHub Pages a cada push na branch `main` (ver `.github/workflows/deploy.yml`).

### Modo debug

`?debug=1` liga a grade do mundo (linhas a cada 120 unidades, com rótulos) e mostra a coordenada de cada toque no canto inferior. É assim que se posicionam os hotspots de uma sala nova.

## Como o jogo é montado

| Conceito | Onde fica |
|---|---|
| Mundo 1920 × 1080 e câmera (x, y, zoom) | `src/hooks/useCamera.js` |
| Máquina de estados da navegação | `src/hooks/useJogo.js` |
| Transições de câmera (abrir card, atravessar a saída) | `src/lib/transicoes.js` |
| Conteúdo (salas, cards, quizzes, coordenadas) | `src/data/estacoes.json` |
| Posições dentro da ilustração da fachada | `src/lib/coordenadas.js` |
| Caminhos dos arquivos de `public/` | `src/lib/assets.js` |

**Todo texto de conteúdo vive em `src/data/estacoes.json`.** Nenhum componente tem texto de card ou de quiz escrito dentro dele.

Para acrescentar um hotspot: abrir a sala com `?debug=1`, tocar no objeto, anotar o `x`/`y` que aparece e colar no JSON com um `zoom` entre 1,4 e 1,8.

## Arte e assets (`public/`)

| Pasta | Conteúdo |
|---|---|
| `marca/` | Logotipo AutoLab (horizontal, vertical, mono preto/branco, símbolo) |
| `mascote/` | Zinos: poses de corpo inteiro (`.webp`), folha de expressões da cabeça (`.svg`) e as 5 peças do robô |
| `fachada/` | Cena da fachada + portão (o vão é deixado em branco na ilustração e o portão entra por cima) |
| `salas/<n>/` | Cena de cada sala em 1920 × 1080 |
| `coordenadas.json` | Coordenadas entregues junto com a arte (referência; o código usa `src/lib/coordenadas.js` e `estacoes.json`) |

As cenas e as poses do mascote foram geradas para este projeto pela equipe; o logotipo, a folha de expressões do Zinos e as peças do robô são vetores próprios. **Se entrar algum asset de terceiros (CC0 ou não), registrar aqui a origem e a licença antes do commit.**

A imagem de prévia de link (`public/og-image.jpg`) é gerada a partir de `ferramentas/og.html` — instruções dentro do próprio arquivo.

## Documentos

- `PLANO.md` — plano de desenvolvimento v2 (fases, cronograma, técnica de câmera, pendências)
- `DECISOES.md` — decisões tomadas durante a integração da arte, incluindo as que divergem do `PLANO.md`
