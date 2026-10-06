import { useEffect, useReducer } from 'react'
import { useProgresso } from './useProgresso'

/**
 * Máquina de estados da navegação. Ver PLANO.md seção 5.
 * Estados: recepcao | visao-geral | foco | card | quiz | transicao | expedicao
 *
 * Regra: o reducer decide o estado, o componente reage ao estado disparando a
 * animação, e a animação, ao terminar, despacha o próximo evento. Enquanto o
 * estado for `transicao`, nenhum toque é aceito.
 */
export const EXPEDICAO = 'expedicao'

function reducer(estado, acao) {
  switch (acao.type) {
    // Sai da fachada: sempre passa por uma transição (o mergulho pelo portão).
    case 'INICIAR':
      return { ...estado, estado: 'transicao', origemTransicao: 'fachada', destino: 0, salaAtual: 0 }

    case 'CONTINUAR':
      return { ...estado, estado: 'transicao', origemTransicao: 'fachada', destino: estado.salaAtual }

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
      if (estado.estado !== 'card' && estado.estado !== 'quiz') return estado
      return { ...estado, estado: 'visao-geral', hotspotAtivo: null }

    case 'QUIZ_ACERTOU':
      return {
        ...estado,
        estado: 'visao-geral',
        hotspotAtivo: null,
        quizzes: estado.quizzes.includes(acao.salaId) ? estado.quizzes : [...estado.quizzes, acao.salaId],
      }

    case 'TOCAR_SAIDA': {
      if (estado.estado !== 'visao-geral') return estado
      const proxima = estado.salaAtual + 1
      return {
        ...estado,
        estado: 'transicao',
        origemTransicao: 'saida',
        destino: proxima < acao.total ? proxima : EXPEDICAO,
        hotspotAtivo: null,
      }
    }

    case 'TRANSICAO_CONCLUIDA':
      if (estado.estado !== 'transicao') return estado
      if (estado.destino === EXPEDICAO) {
        return { ...estado, estado: EXPEDICAO, destino: null, origemTransicao: null }
      }
      return {
        ...estado,
        estado: 'visao-geral',
        salaAtual: estado.destino ?? estado.salaAtual,
        destino: null,
        origemTransicao: null,
        hotspotAtivo: null,
      }

    case 'RECOMECAR':
      return {
        estado: 'recepcao',
        salaAtual: 0,
        destino: null,
        origemTransicao: null,
        hotspotAtivo: null,
        lidos: [],
        quizzes: [],
      }

    default:
      return estado
  }
}

export function useJogo() {
  const { progresso, salvar, reiniciar } = useProgresso()

  const [estado, dispatch] = useReducer(reducer, null, () => ({
    estado: 'recepcao',
    salaAtual: progresso.salaAtual,
    destino: null,
    origemTransicao: null,
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
