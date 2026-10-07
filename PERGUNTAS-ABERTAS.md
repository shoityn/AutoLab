# Perguntas abertas — AutoLab

> **Atualizado em 07/10.** Os itens 1.1, 1.2, 2.1 e 3.1 estão resolvidos. O 1.4 virou outra coisa: o site **não** estava publicado, e o motivo apareceu agora — ver 1.4 e 1.5.
>
> Cada item tem **a pergunta**, **por que importa**, **o que eu faria** e **onde encosta no código**. Responda só o que quiser; no resto eu sigo o padrão sugerido.

---

## 1. Decisões que travavam a publicação

### 1.1 ✅ RESOLVIDO — a URL é `shoityn.github.io/AutoLab`

Conferido na API do GitHub: **`shoityn/AutoLab` existe e está público**; **`glaubershoity/AutoLab` não existe**. O código já estava certo. O que trazia o endereço errado eram o `docs/PLANO_v2.1.md` e a discussão 06 — corrigidos, para o erro não voltar na próxima consulta ao plano.

#### Os QRs do repositório estão corretos

Decodifiquei os três arquivos de QR do repo em 07/10:

| Arquivo | Conteúdo |
|---|---|
| `cartaz/qrcode.svg` | `https://shoityn.github.io/AutoLab/` ✅ |
| `cartaz/qrcode.png` | `https://shoityn.github.io/AutoLab/` ✅ |
| `cartaz/qr-autolab.svg` | `https://shoityn.github.io/AutoLab/` ✅ |

Todos em versão 4 (33 módulos), correção de erro **H** (30%), como a discussão 06 pede.

⚠️ **Uma ressalva honesta:** uma anotação da sessão anterior dizia ter decodificado um `qr-autolab.png` apontando para `glaubershoity.github.io`. **Esse arquivo não existe no repositório** — não há como conferir a afirmação. Se você tem uma cópia solta dele na máquina ou dentro de um flyer já montado, vale escanear com o celular antes de imprimir. Para gerar o flyer novo, use `cartaz/qr-autolab.svg`.

---

### 1.2 ✅ RESOLVIDO — o repositório está público

`"private": false` na API, conferido em 07/10. Era a condição para o Pages funcionar sem conta paga, e o Pages está ligado (`has_pages: true`). Resolvido.

---

### 1.3 ✅ RESOLVIDO — o GoatCounter está contando

Conta criada em 07/10 e `GOATCOUNTER_CODE = 'glaubershoity'` preenchido no `index.html`. A constante guarda só o subdomínio; a URL `https://<código>.goatcounter.com/count` é montada ali mesmo. Painel em `https://glaubershoity.goatcounter.com`.

Além da visita, o `src/lib/metricas.js` dispara dois eventos que já estavam escritos: **estação concluída** (um por sala) e **turno concluído**. Isso vira um funil no relatório da Fase E — quantos entraram, até onde foram, quantos terminaram —, que diz bem mais do que um número solto de acessos.

⚠️ **Ressalva para o relatório:** bloqueadores de anúncio derrubam o `gc.zgo.at` em algumas listas, então o medido é **piso**, não total. Vale escrever "no mínimo N visitantes".

---

### 1.6 🕓 ABERTO — o som começa ligado ou desligado?

**A pergunta:** hoje o jogo abre **mudo**, com um botão "Ligar o som" na fachada. Fica assim?

**Por que importa:** quem chega vem de um QR num cartaz, quase sempre num corredor da faculdade e sem fone. Som tocando sozinho num lugar desses faz a pessoa fechar a página — e fechar a página é o pior resultado possível para um trabalho medido por engajamento. O contra é que a maioria não clica em nada e nunca ouve o que foi feito.

**Estado:** a escolha fica guardada em `autolab:som`, então quem liga uma vez não precisa ligar de novo. O botão aparece na fachada (com rótulo), no HUD de cada sala e na Expedição.

**O que eu faria:** manter desligado. Se vocês quiserem o contrário, é uma linha em `src/lib/som.js` — a leitura inicial de `lerPreferencia()`.

---

### 1.4 ⚠️ CORREÇÃO — a `feat/visual` **não** estava mesclada, nem enviada ao GitHub

Uma anotação de 06/10 dizia que o merge tinha sido feito. **Não foi.** Em 07/10, `git ls-remote` mostra que o `origin` tem só três branches — `main`, `feat/salas` e `feat/3d` — e as três estão no commit `74ef166`, a Fase A. A `feat/visual` nunca saiu da máquina: são **16 commits locais** de diferença.

Ou seja: o jogo completo, com a arte das 5 salas, nunca chegou ao GitHub. É por isso que o site no ar não é o jogo.

**O que eu faria:** enviar a `feat/visual` para o GitHub agora (a branch sozinha não publica nada, é seguro) e mesclar na `main` quando você quiser que o site vá ao ar. A pergunta original continua de pé: **publicar antes ou depois da revisão de conteúdo da dupla?** O conteúdo que está no ar hoje é o rascunho (item 2.1).

---

### 1.5 ⚠️ A causa da tela branca — a fonte do Pages está errada

**O que está acontecendo:** `https://shoityn.github.io/AutoLab/` responde **200**, mas o que vem é o `index.html` **cru do repositório**, não o resultado do build. A última linha dele é:

```html
<script type="module" src="/src/main.jsx"></script>
```

Nenhum navegador executa JSX. O React nunca monta, a `<div id="root">` fica vazia e você vê uma página branca. Dá para confirmar de fora: `/README.md` e `/package.json` também respondem 200 no site — prova de que o Pages está servindo a pasta do repositório inteira.

**Por que:** em **Settings → Pages**, a origem está em **"Deploy from a branch" → `main` / `(root)`**. Nesse modo o Pages ignora o `.github/workflows/deploy.yml` e simplesmente copia os arquivos do repositório. O workflow existe e está correto (`npm ci`, `npm run build`, publica `dist`), mas nunca é usado como fonte.

**A correção:** Settings → Pages → **Source: GitHub Actions**. Um clique. A partir daí o `deploy.yml` assume e o que vai ao ar é o `dist` do Vite, com o `base: '/AutoLab/'` já configurado.

---

## 2. Conteúdo

### 2.1 🕓 EM ANDAMENTO — a dupla revisa a planilha, eu converto depois

O conteúdo que está no ar hoje (17 cards, 5 quizzes, 5 falas do Zinos, textos da Expedição) é o rascunho da entrega, escrito a partir de conhecimento geral de ML. A discussão 05 diz que **o grupo precisa conferir com o relatório PACEX**, usando a planilha `conteudo-salas-revisao.xlsx`.

Quando a revisão voltar, eu converto a planilha para o JSON **mantendo todas as coordenadas** — mudar texto não mexe em hotspot.

---

### 2.2 🕓 ABERTO — as falas do Zinos estão no tom certo?

**A pergunta:** o humor do mascote é adequado para um trabalho acadêmico?

**Por que importa:** o tom definido foi "técnico com humor". O que está no ar:

> *Sala 1:* "Bem-vindo à doca! Todo modelo começa aqui: nos dados. E já aviso: lixo que entra, lixo que sai."
>
> *Dica do quiz 1:* "Pensa assim: se eu só conhecesse este galpão, ia achar que o mundo inteiro tem cheiro de óleo."
>
> *Expedição:* "Bom turno, operador! Agora você entende mais de IA do que muita gente que fala dela por aí."

A última é a mais ousada. Funciona com estudante, mas se o professor for ler, talvez queiram algo mais contido.

**O que eu faria:** manter. O humor é o que faz alguém terminar os 10 minutos.

---

### 2.3 🕓 ABERTO — Salas 3, 4 e 5 têm 3 cards; as Salas 1 e 2 têm 4

**A pergunta:** incomoda a assimetria, ou é proposital?

**Por que importa:** foi decisão de orçamento de tempo no plano v2.1 ("as Salas 3 a 5 já começam com 3 cards"). Na prática funciona: as salas finais são mais rápidas e o jogo não cansa. Mas o HUD mostra "Registros 0/3" em três salas e "0/4" em duas, e alguém pode achar que falta conteúdo.

**O que eu faria:** deixar. Acelerar no fim é bom ritmo de jogo, não defeito.

---

## 3. Arte e acabamento

### 3.1 ✅ RESOLVIDO — o "ZN-07" saiu do SVG

O `public/mascote/pecas/2-tronco.svg` tinha "ZN-07" desenhado no peito, enquanto cada jogador recebe um serial sorteado (ZN-01 a ZN-99). Os dois apareciam juntos na Expedição. O texto foi apagado do arquivo; agora só o serial sorteado aparece, embaixo da cópia.

---

### 3.2 🕓 ABERTO — vale passar as cenas no Upscayl?

**A pergunta:** querem nitidez maior no PC?

**Por que importa:** as cenas estão em 1920 × 1080 (a da Sala 5 veio em 1376 × 768 e foi ampliada). Num celular deitado ficam ótimas. Num monitor grande, levemente suaves. O plano sugere subir para 2560 × 1440 — ao custo de arquivos maiores e carregamento mais lento no 4G.

**O que eu faria:** não fazer. O alvo é celular de entrada no 4G, e peso de arquivo é o que mais machuca ali.

---

### 3.3 🕓 ABERTO — alguma sala merece camada de frente (parallax no PC)?

**A pergunta:** vale recortar 1 ou 2 objetos de primeiro plano?

**Por que importa:** o código já lê `camadas.frente` e move essa camada com o mouse no PC, mas **nenhuma sala tem esse arquivo**. Hoje o parallax move só a cena, de leve. Com um objeto recortado (a esteira da Sala 2, as caixas da Sala 1) a profundidade fica bem mais convincente — só no PC, e o custo é um recorte por sala no Figma.

**O que eu faria:** fazer só na Sala 1, que é a primeira impressão. Se der tempo, a Sala 2.

---

### 3.4 🕓 ABERTO — a tela grande da Sala 5 está boa assim?

**A pergunta:** o painel "Por quê?" convence?

**Por que importa:** a arte entregou a tela em branco (certo — texto nunca vem da imagem gerada) e o site escreve "Por quê?" por cima, em ciano monoespaçado. Ficou legível e no estilo. Só sinalizo que a tela é grande e bem escura dentro do laboratório claro; se quiserem, dá para acender um brilho ciano de fundo nela.

**O que eu faria:** deixar. O contraste chama atenção para o hotspot.

---

## 4. Flyer e distribuição

### 4.1 🕓 ABERTO — o flyer ainda não está fechado

O travamento real é a **marca da UNIPAR**: a discussão 06 reservou 80 × 30 mm no rodapé para a arte oficial, que depende dos arquivos e das regras de marca da universidade. Isso costuma demorar mais do que parece.

Pendências que a própria discussão 06 lista e continuam em aberto:

- [ ] Inserir a arte da UNIPAR
- [ ] Usar `cartaz/qr-autolab.svg` como QR (conferido em 07/10 — item 1.1)
- [ ] Imprimir 1 teste e escanear com 3 celulares, a 1 m e a 2 m — só vale depois que o site estiver realmente no ar (item 1.5)
- [ ] Confirmar o tempo de jogo (~10 min) com o site pronto

---

### 4.2 🕓 ABERTO — quanto tempo o jogo leva de verdade?

**A pergunta:** alguém pode cronometrar uma partida completa?

**Por que importa:** o flyer promete **~10 minutos**. Pela quantidade de texto (17 cards de ~60 palavras + 5 quizzes + as animações de câmera), meu palpite é **6 a 9 minutos** para quem lê tudo sem pressa. Se ficar bem abaixo de 10, vale ajustar o número antes de imprimir.

**O que eu faria:** cronometrar na primeira partida de teste no celular e ajustar o flyer se a diferença for grande.

---

## 5. Se o tempo apertar

O plano tem uma "escada de cortes" definida de antemão. Como o jogo já está completo, **nada precisa ser cortado** — mas se algo der errado na reta final, a ordem de sacrifício seria:

1. Camada de frente e parallax no PC (item 3.3) — nem existe ainda, é o mais barato de abandonar
2. Upscale das cenas (item 3.2)
3. Expressões do mascote, reduzindo para `neutro`, `feliz`, `triste`

**Nunca cortar:** preloader, fachada, Sala 1 com qualidade, quiz com dica, progresso salvo, e funcionar no Galaxy A12 deitado.

---

## 6. Testes que só vocês podem fazer

Não consigo fazer daqui, e são critério de aceite do plano:

- [ ] **Jogar do início ao fim num Galaxy A12 deitado**, sem travar, com cada transição em até ~1,6 s
- [ ] Testar no **navegador interno do WhatsApp e do Instagram** (é assim que a maioria vai abrir, vindo do QR)
- [ ] Testar num **iPhone**, se houver — lá não dá para forçar a orientação, então o aviso de girar precisa funcionar bem
- [ ] **Lighthouse mobile**: meta de Performance ≥ 85 e Acessibilidade ≥ 95
- [ ] Jogar **só pelo teclado**, sem mouse

Se algum falhar, me manda o que aconteceu e eu corrijo.

---

## Resumo: o que ainda falta de você

| # | Item | Urgência |
|---|---|---|
| 4.1 | **Fechar o flyer:** inserir a marca da UNIPAR e usar `cartaz/qr-autolab.svg` | **Alta** — trava a impressão |
| 1.6 | **Decidir se o som começa ligado ou desligado** (hoje: desligado) | Média — muda em uma linha |
| 6 | Jogar do início ao fim num Galaxy A12 deitado | Alta — é o critério de aceite |
| 2.1 | Revisão dos textos pela dupla | Média — até 17/10 |
| 4.2 | Cronometrar uma partida e ajustar o tempo prometido no flyer | Média |
| 2.2, 2.3, 3.2, 3.3, 3.4 | Preferências de tom, arte e acabamento | Baixa — sigo o padrão sugerido |
