import { useEffect, useReducer } from 'react'
import { useProgresso } from './useProgresso'

/**
 * Máquina de estados da navegação. Ver PLANO.md seção 5.
 * Estados: recepcao | visao-geral | foco | card | quiz | transicao | expedicao
 */
function reducer(estado, acao) {
  switch (acao.type) {
    case 'INICIAR':
      return { ...estado, estado: 'visao-geral', salaAtual: 0 }

    case 'CONTINUAR':
      return { ...estado, estado: 'visao-geral' }

    case 'TOCAR_HOTSPOT':
      if (estado.estado !== 'visao-geral') return estado
      return { ...estado, estado: 'foco', hotspotAtivo: acao.id }

    case 'FOCO_PRONTO':
      if (estado.estado !== 'foco') return estado
      return { ...estado, estado: acao.tipo === 'quiz' ? 'quiz' : 'card' }

    case 'ENTENDI':
      return {
        ...estado,
        estado: 'visao-geral',
        hotspotAtivo: null,
        lidos: estado.lidos.includes(acao.id) ? estado.lidos : [...estado.lidos, acao.id],
      }

    case 'FECHAR':
      return { ...estado, estado: 'visao-geral', hotspotAtivo: null }

    case 'QUIZ_ACERTOU':
      return {
        ...estado,
        estado: 'visao-geral',
        hotspotAtivo: null,
        quizzes: estado.quizzes.includes(acao.salaId) ? estado.quizzes : [...estado.quizzes, acao.salaId],
      }

    case 'TOCAR_SAIDA':
      if (estado.estado !== 'visao-geral') return estado
      return { ...estado, estado: 'transicao' }

    case 'TRANSICAO_PARA_SALA':
      return { ...estado, estado: 'visao-geral', salaAtual: acao.sala, hotspotAtivo: null }

    case 'IR_EXPEDICAO':
      return { ...estado, estado: 'expedicao', hotspotAtivo: null }

    case 'RECOMECAR':
      return { estado: 'recepcao', salaAtual: 0, hotspotAtivo: null, lidos: [], quizzes: [] }

    default:
      return estado
  }
}

export function useJogo() {
  const { progresso, salvar, reiniciar } = useProgresso()

  const [estado, dispatch] = useReducer(reducer, null, () => ({
    estado: 'recepcao',
    salaAtual: progresso.salaAtual,
    hotspotAtivo: null,
    lidos: progresso.lidos,
    quizzes: progresso.quizzes,
  }))

  // Persiste sala atual, registros lidos e quizzes concluídos a cada mudança.
  useEffect(() => {
    salvar({ versao: 2, salaAtual: estado.salaAtual, lidos: estado.lidos, quizzes: estado.quizzes })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.salaAtual, estado.lidos, estado.quizzes])

  function recomecar() {
    reiniciar()
    dispatch({ type: 'RECOMECAR' })
  }

  const temProgresso = estado.salaAtual > 0 || estado.lidos.length > 0 || estado.quizzes.length > 0

  return { estado, dispatch, recomecar, temProgresso }
}
