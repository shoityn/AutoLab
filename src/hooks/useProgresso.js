import { useCallback, useState } from 'react'

const CHAVE = 'autolab:progresso'
const VERSAO = 2

function estadoVazio() {
  return { versao: VERSAO, salaAtual: 0, lidos: [], quizzes: [] }
}

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
    }
  } catch {
    return estadoVazio()
  }
}

function gravarStorage(progresso) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(progresso))
  } catch {
    // localStorage indisponível (modo privado, cota excedida etc.) — progresso segue só em memória
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
  }, [])

  return { progresso, salvar, reiniciar }
}
