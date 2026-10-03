# AutoLab — Plano de Desenvolvimento

> Site-jogo estático sobre Machine Learning, ambientado numa fábrica com esteira. Quem escaneia o QR code do cartaz percorre 5 estações com cards e um quiz em cada uma, e vê um robô sendo montado a cada acerto até a expedição.

- **Disciplina:** Estágio Supervisionado (PACEX VIII), UNIPAR, prof. Elyssandro Piffer
- **Equipe:** Glauber Shoity Nakai (desenvolvimento), Kamilla Barros Silva e Wellington Henrique da Silva Lima, todos do 8º período de Sistemas de Informação
- **Repositório:** github.com/glaubershoity/AutoLab
- **Publicação:** GitHub Pages (`https://glaubershoity.github.io/AutoLab/`)
- **Prazo final:** site no ar e cartazes distribuídos até **07/11/2026**

---

## 1. Decisões fechadas

| Tema | Decisão |
|---|---|
| Estrutura | Recepção + **5 estações** (Opção A) |
| Tela inicial | **Recepção curta**: nome, premissa da fábrica e o botão "Iniciar turno" |
| Quiz | **1 pergunta por estação**, tentativas livres. Ao errar, aparece uma dica fixa e a pessoa tenta de novo. A correção é sempre local |
| Progressão | **Robô sendo montado**: cada estação concluída adiciona uma peça |
| Final | Tela de conclusão, créditos (equipe/UNIPAR/disciplina) e botão de compartilhar |
| Progresso | Salvo no navegador (`localStorage`), com botão "Recomeçar turno" |
| Métricas | **GoatCounter** (gratuito, sem cookies) para contar acessos e conclusões, como comprovação no relatório |
| 3D | **Fase extra com limite de tempo e fallback**: o site sai completo em 2.5D, depois entra o fundo 3D leve, que só fica se rodar bem em celular de entrada |
| Conteúdo | Rascunho a partir do relatório PACEX, revisão técnica do grupo |
| Código antigo | O esqueleto em HTML/CSS/JS puro é **apagado** (fica no histórico do git) |

## 2. Stack

| Camada | Tecnologia | Observação |
|---|---|---|
| Base | React + Vite | `base: '/AutoLab/'` no `vite.config.js` |
| Estilo | Tailwind CSS + variáveis CSS | As cores dos 3 ambientes ficam em tokens, não são recriadas por estação |
| Animação | GSAP + `@gsap/react` | ScrollTrigger (transições), easing `bounce.out` (encaixe das peças), parallax |
| 3D (fase 3) | three + @react-three/fiber (+ drei, só o necessário) | Carregado sob demanda (*lazy*), com fallback automático para 2.5D |
| Deploy | GitHub Actions → GitHub Pages | Publica a cada push na `main` |
| Métricas | GoatCounter | Um script, mais eventos por estação |

**Descartados** (não voltar sem motivo novo): Next.js, Framer Motion, backend ou API em tempo de execução, IA corrigindo o quiz, Ollama, mundo 3D navegável, Spline (runtime pesado demais para celular), glassmorphism nos cards, cenário "praça" e estrutura de 7 estações.

## 3. Fluxo do usuário

```
QR code → Recepção → Est.1 → Est.2 → Est.3 → Est.4 → Est.5 → Expedição (tela final)
                      └─ cards (scroll) → quiz → acertou? → peça encaixa no robô → próxima estação
                                                  └─ errou → dica fixa → tenta de novo
```

- Rolagem vertical (pensada para celular). A próxima estação fica bloqueada até acertar o quiz da atual.
- Se a pessoa voltar ao site com progresso salvo, a Recepção oferece "Continuar do ponto onde parou" ou "Recomeçar".

## 4. Conteúdo: Recepção + 5 estações

| # | Estação | Ambiente | Conteúdo | Peça do robô | Fonte |
|---|---|---|---|---|---|
| 0 | Recepção | 1 | Premissa: "você é o novo operador da AutoLab, onde se fabrica um modelo de IA" | (robô vazio) | novo |
| 1 | Recebimento & Ingestão | 1 – Galpão Rústico | Fornecimento e qualidade dos dados | **Base/chassi** (os dados são a fundação) | Relatório PACEX |
| 2 | Linha de Processamento | 1 – Galpão Rústico | Processamento e limpeza dos dados | **Tronco/estrutura** | Relatório PACEX |
| 3 | Processamento Neural | 2 – Transição Industrial | Redes neurais: perceptron, pesos, bias, função de ativação | **Núcleo/cérebro** | Relatório + aprofundamento |
| 4 | Inspeção de Qualidade | 3 – Lab Clean | Métricas (precision/recall), seleção artificial e gerações | **Olhos/sensores** | Métricas: **novo**; seleção: relatório |
| 5 | Expedição & Análise | 3 – Lab Clean | Problemas, limitações, explicabilidade (XAI) e conclusão | **Antena + selo de aprovado** | Relatório PACEX |

**Por estação:** 3 a 5 cards curtos (cerca de 60 palavras cada, com terminologia técnica, já que o público é de TI/IA) e 1 pergunta de 4 alternativas com dica fixa e explicação curta exibida após o acerto.

## 5. Estrutura de dados (`src/data/estacoes.json`)

```json
[
  {
    "id": "ingestao",
    "ordem": 1,
    "titulo": "Recebimento & Ingestão",
    "ambiente": 1,
    "peca": "base",
    "cards": [
      { "titulo": "Dados são a matéria-prima", "texto": "..." }
    ],
    "quiz": {
      "pergunta": "...",
      "alternativas": ["...", "...", "...", "..."],
      "correta": 2,
      "dica": "...",
      "explicacao": "..."
    }
  }
]
```

Todo o conteúdo fica nesse arquivo. Os componentes não têm texto fixo no código, então o grupo revisa só o JSON.

## 6. Arquitetura de pastas

```
AutoLab/
├─ .github/workflows/deploy.yml
├─ public/                 # favicon, og-image (prévia no WhatsApp)
├─ src/
│  ├─ data/estacoes.json
│  ├─ styles/tokens.css    # variáveis dos 3 ambientes
│  ├─ components/
│  │  ├─ Recepcao.jsx
│  │  ├─ Estacao.jsx       # seção da esteira (cards + quiz)
│  │  ├─ Card.jsx
│  │  ├─ Quiz.jsx
│  │  ├─ Robo.jsx          # robô em SVG, com peças por estado
│  │  ├─ BarraProgresso.jsx
│  │  └─ Expedicao.jsx     # tela final, créditos, compartilhar
│  ├─ hooks/
│  │  ├─ useProgresso.js   # localStorage com try/catch
│  │  └─ useAmbiente.js    # troca de tokens por estação/scroll
│  ├─ lib/metricas.js      # wrapper do GoatCounter
│  ├─ three/               # fase 3 (lazy)
│  │  └─ CenaFabrica.jsx
│  ├─ App.jsx
│  └─ main.jsx
├─ PLANO.md
└─ README.md
```

## 7. Identidade visual (tokens)

| Token | Ambiente 1 — Galpão | Ambiente 2 — Transição | Ambiente 3 — Lab |
|---|---|---|---|
| `--bg` | `#1E222A` | `#3D444D` | `#F8FAFC` |
| `--card` | `#2A2F3B` | `#4A525C` | `#F1F5F9` (borda `#E2E8F0`) |
| `--titulo` | `#FBBF24` | `#67E8F9` | `#0E7490` |
| `--texto` | `#E7E5E2` | `#DDE3E8` | `#1E293B` |
| `--acento` | `#B45309` | `#0891B2` | `#059669` (`#047857` em texto pequeno) |

- **Fontes:** Orbitron ou Chakra Petch nos títulos; Inter ou Space Grotesk no corpo (escolher uma de cada na Fase 2).
- **Contraste:** todas as combinações já estão em WCAG AA. Os cards são sólidos, sem `backdrop-blur`.
- **Transição:** o GSAP interpola as variáveis do `:root` conforme o scroll entra em cada ambiente.

## 8. Fases e cronograma

### Fase 0 — Setup (03–04/10)
- [ ] Apagar o esqueleto antigo (vanilla)
- [ ] Criar o projeto Vite + React, instalar Tailwind e GSAP (`@gsap/react`)
- [ ] Configurar `base: '/AutoLab/'` e o workflow do GitHub Actions para o Pages
- [ ] Deploy de um "Hello AutoLab" para validar o pipeline
- [ ] README com descrição, equipe e link

### Fase 1 — Núcleo jogável (05–11/10)
- [ ] `estacoes.json` com conteúdo provisório nas 5 estações
- [ ] Componentes Recepção, Estação, Card e Quiz
- [ ] Lógica do quiz: validar, mostrar dica, tentar de novo, liberar a próxima estação
- [ ] `useProgresso` (salvar, retomar, recomeçar)
- [ ] Barra de progresso
- **Entrega:** dá para jogar do início ao fim no celular, mesmo sem visual final

### Fase 2 — Visual, final e métricas (12–18/10)
- [ ] Tokens dos 3 ambientes e transição com ScrollTrigger
- [ ] Robô em SVG com as 5 peças e animação de encaixe (`bounce.out`)
- [ ] Parallax leve no fundo, desligado com `prefers-reduced-motion`
- [ ] Expedição: conclusão, créditos e compartilhar (Web Share API, com link `wa.me` como alternativa)
- [ ] GoatCounter: visita, evento por estação concluída e evento "fim"
- [ ] `og-image` e meta tags para a prévia do link no WhatsApp
- **Entrega (18/10): MVP no ar.** A partir daqui o projeto já pode ser apresentado

### Conteúdo, em paralelo (05–18/10)
- [ ] Shoity envia o texto do relatório PACEX
- [ ] Rascunho dos cards, perguntas, dicas e explicações das 5 estações
- [ ] Conteúdo novo de métricas de avaliação (Estação 4)
- [ ] Revisão técnica por Kamilla e Wellington
- [ ] Texto final inserido no JSON até 18/10

### Fase 3 — Imersão 3D, com limite de tempo (19–25/10)
- [ ] Cena low-poly da esteira (formas básicas ou kit CC0), num único `<Canvas>` fixo atrás do conteúdo
- [ ] Câmera percorre a esteira guiada pelo ScrollTrigger
- [ ] Robô 3D substitui o SVG (mesmas 5 peças)
- [ ] Cores da cena lidas dos tokens CSS
- [ ] Orçamento para celular: menos de 100 objetos desenhados por quadro, menos de 100k vértices, `pixelRatio` no máximo 1.5, sem sombras dinâmicas, `frameloop="demand"`
- [ ] Fallback automático para 2.5D: sem WebGL, `prefers-reduced-motion`, ou abaixo de ~30 FPS (via `PerformanceMonitor`)
- [ ] Carregamento sob demanda: o 3D só baixa depois que a Recepção aparece
- **Critério para manter o 3D (decisão em 25/10):** fluido num Galaxy A ou Moto G de entrada, com até ~300 KB comprimidos de código 3D e até 1 MB de modelos. Se não atingir, o 3D fica desligado e o MVP 2.5D segue

### Fase 4 — QA, QR code e cartaz (26/10–01/11)
- [ ] Teste em pelo menos 2 celulares Android de entrada e 1 iPhone, se houver
- [ ] Lighthouse mobile: Performance ≥ 85 e Acessibilidade ≥ 95
- [ ] Acessibilidade: áreas de toque ≥ 44px, foco visível, quiz utilizável por teclado
- [ ] Revisão final do texto (ortografia e termos)
- [ ] Gerar o QR code (alta correção de erro) apontando para a URL do Pages
- [ ] Arte do cartaz: nome, chamada, QR code, UNIPAR/disciplina
- [ ] Impressão

### Fase 5 — Distribuição e comprovação (02–07/11)
- [ ] Definir os locais dos cartazes na cidade
- [ ] Cada membro distribui e tira **as próprias fotos** (comprovação individual)
- [ ] Exportar os números do GoatCounter (acessos e conclusões) para o relatório

## 9. Regras do repositório

- Commits pequenos, um por tarefa, com mensagem em português no formato `tipo: descrição` (`feat`, `fix`, `style`, `content`, `docs`, `chore`)
- A `main` sempre publicável. Funcionalidades maiores, como o 3D, ficam em branch própria (`feat/3d`)
- Commits sem linhas de coautoria ou assinaturas automáticas
- Nada de chaves ou segredos no repositório (o site é 100% estático)

## 10. Pendências

| Item | Responsável | Até |
|---|---|---|
| Enviar o texto do relatório PACEX | Shoity | 06/10 |
| Criar a conta no GoatCounter (gerar o código do site) | Shoity | 12/10 |
| Escolher as fontes finais (Orbitron/Chakra Petch; Inter/Space Grotesk) | Shoity | 12/10 |
| Celular de entrada para teste | Grupo | 19/10 |
| Locais dos cartazes | Grupo | 26/10 |
| Arte do cartaz | Kamilla / Wellington | 30/10 |
