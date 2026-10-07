import { useCallback, useState } from 'react'

const CHAVE = 'autolab:progresso'
const VERSAO = 3

/** Número de série da cópia montada pelo jogador: ZN-01 a ZN-99. */
export function sortearSerie() {
  return `ZN-${String(1 + Math.floor(Math.random() * 99)).padStart(2, '0')}`
}

function estadoVazio() {
  return { versao: VERSAO, salaAtual: 0, lidos: [], quizzes: [], serie: sortearSerie() }
}

/** Progresso salvo com outra versão é descartado (PLANO v2.1 seção 10). */
function lerStorage() {
  try {
    const bruto = window.localStorage.getItem(CHAVE)
    if (!bruto) return estadoVazio()
    const dados = JSON.parse(bruto)
    if (!dados || dados.versao !== VERSAO) return estadoVazio()
    return {
      versao: VERSAO,
      salaAtual: typeof dados.salaAtual === 'number' ? dados.salaAtual : 0,
      lidos: Array.isArray(dados.lidos) ? dados.lidos : [],
      quizzes: Array.isArray(dados.quizzes) ? dados.quizzes : [],
      serie: typeof dados.serie === 'string' && dados.serie ? dados.serie : sortearSerie(),
    }
  } catch {
    return estadoVazio()
  }
}

function gravarStorage(progresso) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(progresso))
  } catch {
    // localStorage indisponível (modo privado, cota excedida) — segue só em memória
  }
}

export function useProgresso() {
  const [progresso, setProgresso] = useState(lerStorage)

  const salvar = useCallback((proximo) => {
    setProgresso(proximo)
    gravarStorage(proximo)
  }, [])

  const reiniciar = useCallback(() => {
    const vazio = estadoVazio()
    setProgresso(vazio)
    gravarStorage(vazio)
    return vazio
  }, [])

  return { progresso, salvar, reiniciar }
}
