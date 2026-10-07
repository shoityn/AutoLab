import dados from '../data/estacoes.json'

/**
 * Único ponto de leitura do conteúdo. Todo texto do jogo — inclusive as falas do
 * Zinos, o preloader e a Expedição — vem daqui (PLANO v2.1 seção 0, item 6).
 *
 * Formato v3: { versao, mundo, abertura, salas[], expedicao }.
 */
export const VERSAO_CONTEUDO = dados.versao

export const MUNDO = dados.mundo

export const SALAS = [...dados.salas].sort((a, b) => a.ordem - b.ordem)

export const ABERTURA = dados.abertura

export const EXPEDICAO_TEXTOS = dados.expedicao

export const TOTAL_SALAS = SALAS.length

export function salaPorIndice(indice) {
  return SALAS[indice] ?? SALAS[0]
}

export function cardsDaSala(sala) {
  return sala.hotspots.filter((h) => h.tipo === 'card')
}

export function quizDaSala(sala) {
  return sala.hotspots.find((h) => h.tipo === 'quiz') ?? null
}

/** Substitui {serie} (e outros marcadores) nos textos do JSON. */
export function preencher(texto, valores) {
  if (!texto) return ''
  return Object.entries(valores).reduce(
    (acc, [chave, valor]) => acc.replaceAll(`{${chave}}`, valor),
    texto,
  )
}
