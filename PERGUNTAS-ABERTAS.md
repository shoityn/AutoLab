# Perguntas abertas — AutoLab (06/10/2026)

Estado: o jogo está **completo e jogável do início ao fim**, com a arte final das 5 salas, na branch `feat/visual`. O que falta não é código: é decisão.

Cada item tem **a pergunta**, **por que importa**, **o que eu faria** e **onde encosta no código**. Responda só o que quiser; o resto eu assumo o padrão sugerido.

---

## 1. Decisões que travam a publicação

### 1.1 ⚠️ Qual é a URL de verdade do site?

**A pergunta:** `shoityn.github.io/AutoLab` ou `glaubershoity.github.io/AutoLab`?

**Por que importa:** os dois aparecem em lugares diferentes e **um deles está errado**:

| Onde | URL que está lá |
|---|---|
| `index.html` (meta tags, og:image) | `shoityn` |
| `src/components/Expedicao.jsx` (botão Compartilhar) | `shoityn` |
| `PLANO_v2.1.md` e `PROMPT-AGENTE.md` | `glaubershoity` |
| **`qr-autolab.svg` / `.png` e os flyers já gerados** | `glaubershoity` |

Este é o item mais urgente da lista. **Se o QR do flyer apontar para a URL errada, todo cartaz impresso vira um 404** — e aí o trabalho de distribuição (Fase E) não comprova nada. Vale conferir abrindo o repositório no GitHub e olhando o endereço do Pages em Settings → Pages.

**O que eu faria:** confirmar no GitHub antes de imprimir qualquer coisa, e só então travar o valor nos dois arquivos de código.

**Onde encosta:** `index.html` (4 linhas) e a constante `SITE_URL` em `Expedicao.jsx`. Mudança de 2 minutos — mas tem que ser a certa.

---

### 1.2 O repositório vai ficar público?

**A pergunta:** o GitHub Pages já está ligado? O repositório é privado?

**Por que importa:** no plano o repositório é público e o Pages publica a cada push na `main`. Pelo que tenho anotado, hoje ele é privado. **GitHub Pages em repositório privado exige conta paga** (Pro/Team). Se for esse o caso, só há dois caminhos: tornar o repositório público ou publicar em outro lugar.

**O que eu faria:** tornar público. É trabalho de extensão, não tem segredo nenhum no código, e isso também ajuda na comprovação acadêmica.

---

### 1.3 Quando criar a conta do GoatCounter?

**A pergunta:** posso deixar sem métricas, ou vocês criam a conta antes de distribuir?

**Por que importa:** o plano prevê exportar os números do GoatCounter para o relatório (Fase E). Se a conta não existir **antes** dos flyers saírem, as visitas dos primeiros dias se perdem — e são justamente as que mais contam.

**Estado:** deixei pronto, atrás de uma constante vazia (`GOATCOUNTER_CODE` no `index.html`). Enquanto estiver vazia, o script nem é baixado. Basta preencher com o código da conta.

**O que eu faria:** criar a conta antes da impressão. É grátis e leva 5 minutos.

---

### 1.4 Juntar na `main` agora ou depois da revisão de vocês?

**A pergunta:** eu posso mesclar `feat/visual` na `main`, ou vocês querem ver rodando primeiro?

**Por que importa:** a `main` publica automaticamente. Enquanto não mesclar, nada vai ao ar — o que é bom para revisar com calma, e ruim se vocês quiserem testar no celular (precisa estar no ar, ou rodar `npm run dev` na mesma rede).

**O que eu faria:** mesclar depois que pelo menos uma pessoa jogar do início ao fim num celular deitado.

---

## 2. Conteúdo

### 2.1 A revisão técnica dos textos já aconteceu?

**A pergunta:** o conteúdo que está no site hoje é a versão revisada, ou ainda é o rascunho?

**Por que importa:** a discussão 05 diz que o conteúdo foi rascunhado a partir de conhecimento geral de ML e que **o grupo precisa conferir com o relatório PACEX**. Existe uma planilha para isso (`conteudo-salas-revisao.xlsx`). Hoje o site tem 17 cards, 5 quizzes, 5 falas do Zinos e os textos da Expedição — todos vindos dessa entrega.

Se a revisão mudar texto, não há problema: as coordenadas dos hotspots ficam intactas, só os textos trocam.

**O que eu faria:** Kamilla e Wellington revisam a planilha; você aprova; eu converto de volta para o JSON mantendo as coordenadas.

---

### 2.2 As falas do Zinos estão no tom certo?

**A pergunta:** o humor do mascote está adequado para um trabalho acadêmico?

**Por que importa:** o tom definido foi "técnico com humor". Exemplos que estão no ar hoje:

> *Sala 1:* "Bem-vindo à doca! Todo modelo começa aqui: nos dados. E já aviso: lixo que entra, lixo que sai."
>
> *Dica do quiz 1:* "Pensa assim: se eu só conhecesse este galpão, ia achar que o mundo inteiro tem cheiro de óleo."
>
> *Expedição:* "Bom turno, operador! Agora você entende mais de IA do que muita gente que fala dela por aí."

Essa última é a mais ousada. Funciona com estudante, mas se o professor for ler, talvez queiram algo mais contido.

**O que eu faria:** manter. O humor é o que faz alguém terminar os 10 minutos.

---

### 2.3 As Salas 3, 4 e 5 têm 3 cards; as Salas 1 e 2 têm 4. Fica assim?

**A pergunta:** incomoda a assimetria, ou é proposital?

**Por que importa:** foi uma decisão de orçamento de tempo no plano v2.1 ("as Salas 3 a 5 já começam com 3 cards"). Na prática funciona bem: as salas finais são mais rápidas e o jogo não cansa. Mas o contador no HUD mostra "Registros 0/3" em três salas e "0/4" em duas, e alguém pode achar que falta coisa.

**O que eu faria:** deixar como está. Acelerar no fim é bom ritmo de jogo, não defeito.

---

## 3. Arte e acabamento

### 3.1 ⚠️ O torso da cópia tem "ZN-07" desenhado no SVG

**A pergunta:** apago o "ZN-07" do arquivo, ou deixo?

**Por que importa:** cada jogador recebe um número de série sorteado (ZN-01 a ZN-99) que aparece embaixo da cópia montada. Mas o arquivo `public/mascote/pecas/2-tronco.svg` tem **"ZN-07" impresso no peito**. Então na Expedição aparece um robô com "ZN-07" no peito e "ZN-42" embaixo. Fica confuso.

**Três saídas:**
1. Apagar o texto do SVG (1 linha) — a cópia fica sem número no peito.
2. Deixar como está e tratar ZN-07 como "o modelo", ZN-42 como "a unidade".
3. Tirar o sorteio e usar ZN-07 para todo mundo — mas aí some a graça do "sua cópia".

**O que eu faria:** opção 1. É a mais limpa e mantém o sorteio, que é o que dá a sensação de "minha cópia".

---

### 3.2 Vale passar as cenas no Upscayl?

**A pergunta:** querem nitidez maior no PC?

**Por que importa:** as cenas estão em 1920 × 1080 nativo (a da Sala 5 veio em 1376 e eu ampliei para 1920). Num celular deitado ficam ótimas. Num monitor grande, levemente suaves. O plano sugere passar no Upscayl para 2560 × 1440 se quiserem mais nitidez — ao custo de arquivos maiores e carregamento mais lento no 4G.

**O que eu faria:** não fazer. O alvo é celular de entrada no 4G, e peso de arquivo é o que mais machuca ali.

---

### 3.3 Alguma sala merece camada de frente (parallax no PC)?

**A pergunta:** vale recortar 1 ou 2 objetos de primeiro plano?

**Por que importa:** o código já lê `camadas.frente` e move essa camada com o mouse no PC, mas **nenhuma sala tem esse arquivo**. Hoje o parallax move só a cena, de leve. Com um objeto recortado (a esteira da Sala 2, as caixas da Sala 1), o efeito de profundidade fica bem mais convincente — só no PC, e o custo é um recorte por sala no Figma.

**O que eu faria:** fazer só na Sala 1, que é a primeira impressão. Se der tempo, Sala 2.

---

### 3.4 A Sala 5 ficou com uma tela escura grande. Está bom?

**A pergunta:** o painel "Por quê?" convence?

**Por que importa:** a arte nova entregou a tela em branco (certo, porque texto nunca vem da imagem gerada) e o site escreve "Por quê?" por cima, em ciano monoespaçado. Ficou legível e no estilo. Só sinalizo que a tela é grande e fica bem escura no ambiente claro do laboratório — se quiserem, dá para acender um brilho ciano de fundo nela.

**O que eu faria:** deixar. O contraste chama atenção para o hotspot.

---

## 4. Flyer e distribuição

### 4.1 O flyer A5 já está fechado?

**A pergunta:** o `flyer-2porA4.pdf` é a versão final, ou ainda falta a marca da UNIPAR?

**Por que importa:** a discussão 06 deixou uma **área reservada de 80 × 30 mm no rodapé** para a arte oficial da UNIPAR, que depende dos arquivos e das regras de marca da universidade. Isso costuma demorar mais do que parece.

**Pendências que a própria discussão 06 lista e ainda não vi resolvidas:**
- [ ] Inserir a arte da UNIPAR
- [ ] Imprimir 1 teste e escanear com 3 celulares, a 1 m e a 2 m
- [ ] Confirmar o tempo de jogo (~10 min) com o site pronto

---

### 4.2 Quanto tempo o jogo leva de verdade?

**A pergunta:** alguém pode cronometrar uma partida completa?

**Por que importa:** o flyer promete **~10 minutos**. Pela quantidade de texto (17 cards de ~60 palavras + 5 quizzes + as animações de câmera), meu palpite é **6 a 9 minutos** para quem lê tudo sem pressa. Se ficar bem abaixo de 10, vale ajustar o número no flyer antes de imprimir — promessa quebrada para menos é melhor do que para mais, mas o número certo é melhor ainda.

**O que eu faria:** cronometrar na primeira partida de teste no celular e ajustar o flyer se der diferença grande.

---

## 5. Se o tempo apertar

O plano tem uma "escada de cortes" definida de antemão. Como o jogo já está completo, **nada precisa ser cortado** — mas se algo der errado na reta final, a ordem de sacrifício seria:

1. Camada de frente e parallax no PC (item 3.3) — nem existe ainda, é o mais barato de abandonar
2. Upscale das cenas (item 3.2)
3. Expressões do mascote, reduzindo para `neutro`, `feliz`, `triste`

**Nunca cortar:** preloader, fachada, Sala 1 com qualidade, quiz com dica, progresso salvo, e funcionar no Galaxy A12 deitado.

---

## 6. Teste que só vocês podem fazer

Não consigo fazer daqui, e é critério de aceite do plano:

- [ ] **Jogar do início ao fim num Galaxy A12 deitado**, sem travar, com cada transição em até ~1,6 s
- [ ] Testar no **navegador interno do WhatsApp e do Instagram** (é assim que a maioria vai abrir, vindo do QR)
- [ ] Testar num **iPhone**, se houver — lá não dá para forçar a orientação, então o aviso de girar precisa funcionar bem
- [ ] **Lighthouse mobile**: meta de Performance ≥ 85 e Acessibilidade ≥ 95
- [ ] Jogar **só pelo teclado**, sem mouse

Se algum desses falhar, me manda o que aconteceu e eu corrijo.

---

## Resumo: o que eu preciso de você para seguir

Se for responder só três coisas, que sejam estas:

1. **A URL certa** (1.1) — bloqueia a impressão do flyer
2. **ZN-07 no peito da cópia: apago?** (3.1)
3. **Mesclo na `main` agora?** (1.4)

O resto eu toco com os padrões que sugeri acima.
