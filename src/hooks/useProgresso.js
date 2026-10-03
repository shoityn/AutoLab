import { useCallback, useState } from 'react'

const CHAVE = 'autolab:progresso'

function lerStorage() {
  try {
    const bruto = window.localStorage.getItem(CHAVE)
    if (!bruto) return []
    const dados = JSON.parse(bruto)
    return Array.isArray(dados) ? dados : []
  } catch {
    return []
  }
}

function gravarStorage(concluidas) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(concluidas))
  } catch {
    // localStorage indisponível (modo privado, cota excedida etc.) — progresso segue só em memória
  }
}

export function useProgresso() {
  const [concluidas, setConcluidas] = useState(lerStorage)

  const concluirEstacao = useCallback((id) => {
    setConcluidas((atual) => {
      if (atual.includes(id)) return atual
      const proximo = [...atual, id]
      gravarStorage(proximo)
      return proximo
    })
  }, [])

  const reiniciar = useCallback(() => {
    gravarStorage([])
    setConcluidas([])
  }, [])

  return { concluidas, concluirEstacao, reiniciar }
}
