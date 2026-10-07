# Discussão 05 — Conteúdo das salas: resultado (05/10/2026)

## Decisões
| Tema | Decisão |
|---|---|
| Escrita | Claude rascunhou as 5 salas (17 cards, 5 quizzes, 5 falas, textos da Expedição) |
| Fonte | Conhecimento geral de ML. **O grupo precisa conferir com o relatório PACEX** |
| Estilo do quiz | **Aplicação/cenário** ("neste caso, qual é o problema?"), com erros comuns como alternativas erradas |
| Tom do Zinos | Técnico com humor (falas de entrada e dicas) |
| Revisão final | **Shoity** |
| Formato | `estacoes-conteudo.json` (vai para o site) + `conteudo-salas-revisao.xlsx` (para revisar). Depois da revisão, a planilha é convertida de volta para JSON |
| `correta` | Na planilha vai de 1 a 4; no JSON é o índice de 0 a 3 |

## Ids de hotspot por sala (usados no JSON e nos blockouts)
| Sala | Cards | Quiz |
|---|---|---|
| 1 `ingestao` | caixas, balanca, etiqueta, contador | prancheta |
| 2 `processamento` | lavadora, peneira, alavancas, lixeira | painel de controle |
| 3 `neural` | quadro, mostradores, valvula | terminal central |
| 4 `inspecao` | monitor, lupa, gavetas | prancheta de laudo |
| 5 `expedicao` | quadro, porque, caixa | terminal de liberação |

Na Sala 2, o card de normalização foi amarrado a "alavancas de ajuste" para não confundir com o "painel de controle" do quiz.

## Pendências
- [ ] Revisão do grupo na planilha (até 17/10)
- [ ] Shoity aprova e Claude converte a planilha para o JSON final
- [ ] Juntar os textos ao JSON de coordenadas (x, y, aproximacao) de cada sala
