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

React + Vite, Tailwind CSS v4, GSAP (`@gsap/react`), IBM Plex Sans/Mono. Sem backend: tudo estático, progresso em `localStorage`, métricas no GoatCounter.

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
| Abrir/fechar painel, portão e salvaguarda de animação | `src/lib/transicoes.js` |
| Efeitos de passagem entre salas | `src/components/Passagem.jsx` |
| Conteúdo (abertura, salas, quizzes, Expedição) | `src/data/estacoes.json` |
| Leitura do conteúdo | `src/lib/conteudo.js` |
| Carregamento dos assets e progresso do preloader | `src/lib/precarregar.js` |
| Caminhos dos arquivos de `public/` | `src/lib/assets.js` |

**Todo texto de conteúdo vive em `src/data/estacoes.json`.** Nenhum componente tem texto de card ou de quiz escrito dentro dele.

Para acrescentar um hotspot: abrir a sala com `?debug=1`, tocar no objeto, anotar o `x`/`y` que aparece e colar no JSON com uma `aproximacao` entre 2,0 e 3,0 (é um **multiplicador da visão geral**, não zoom absoluto).

## Arte e assets (`public/`)

| Pasta | Conteúdo |
|---|---|
| `marca/` | Logotipo AutoLab (horizontal, vertical, mono preto/branco, símbolo) |
| `mascote/` | Zinos: poses de corpo inteiro (`.webp`), folha de expressões da cabeça (`.svg`) e as 5 peças do robô |
| `fachada/` | Cena da fachada + portão (o vão é deixado em branco na ilustração e o portão entra por cima) |
| `salas/<n>/` | Cena de cada sala em 1920 × 1080. A Sala 5 ainda usa `cena-provisoria.png` (blockout) |
| `og-image.png` | Prévia de link (1200 × 630) |

As coordenadas de todos os hotspots e dos encaixes da fachada vivem em `src/data/estacoes.json` — não há arquivo de coordenadas separado.

As cenas e as poses do mascote foram geradas para este projeto pela equipe; o logotipo, a folha de expressões do Zinos e as peças do robô são vetores próprios. **Se entrar algum asset de terceiros (CC0 ou não), registrar aqui a origem e a licença antes do commit.**

### Trocar a arte de uma sala

1. Salvar a cena nova em `public/salas/<n>/cena.webp` (1920 × 1080).
2. Apontar `camadas.cena` daquela sala no `estacoes.json` para o arquivo novo.
3. Abrir com `?debug=1` e conferir se algum objeto "andou"; se andou, corrigir o `x`/`y` do hotspot.

### Formato do conteúdo (v3)

`estacoes.json` é um objeto com `versao`, `mundo`, `abertura` (preloader, fachada, orientação), `salas[]` e `expedicao`. Progresso salvo com outra `versao` é descartado automaticamente.

## Documentos

- **`docs/PLANO_v2.1.md` — o plano em vigor.** Substitui o v2 no que diz respeito a mundo, orientação, câmera, preloader e arte. O que ele não cita como alterado continua valendo do `PLANO.md`.
- `PLANO.md` — plano v2 (máquina de estados, acessibilidade, regras do repositório)
- `DECISOES.md` — o que foi decidido sem o grupo, o que divergiu dos planos e o que ficou pendente
- `PERGUNTAS-ABERTAS.md` — as decisões que faltam, com contexto e sugestão para cada uma
- `docs/01` a `docs/07` — resultados das discussões: mascote, logo, estilo e cenas, preloader e fachada (com o roteiro de tempos), conteúdo, cartaz, e as transições das salas 2 a 5
- `docs/PROMPT-sala5-edicao.txt` — roteiro para corrigir a arte da Sala 5 por edição
