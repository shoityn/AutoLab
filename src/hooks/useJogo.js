import { useEffect, useReducer } from 'react'
import { useProgresso } from './useProgresso'
import { TOTAL_SALAS } from '../lib/conteudo'

/**
 * Máquina de estados da navegação. PLANO v2.1 seção 5.
 * carregando | fachada | visao-geral | foco | card | quiz | transicao | expedicao
 *
 * Regra: o reducer decide o estado; o componente reage ao estado disparando a
 * animação; a animação, ao terminar, despacha o próximo evento. Enquanto o
 * estado for `transicao`, nenhum toque é aceito.
 *
 * O aviso de orientação NÃO é um estado: é uma camada por cima.
 */
export const EXPEDICAO = 'expedicao'

function reducer(estado, acao) {
  switch (acao.type) {
    case 'ASSETS_PRONTOS':
      if (estado.estado !== 'carregando') return estado
      return { ...estado, estado: 'fachada' }

    // Sai da fachada mergulhando pelo portão.
    case 'INICIAR':
      if (estado.estado !== 'fachada') return estado
      return { ...estado, estado: 'transicao', origemTransicao: 'fachada', destino: 0, salaAtual: 0 }

    case 'CONTINUAR':
      if (estado.estado !== 'fachada') return estado
      return { ...estado, estado: 'transicao', origemTransicao: 'fachada', destino: estado.salaAtual }

    case 'TOCAR_HOTSPOT':
      if (estado.estado !== 'visao-geral') return estado
      return { ...estado, estado: 'foco', hotspotAtivo: acao.id, ancoraPainel: acao.ancoraX ?? 0.5 }

    case 'FOCO_PRONTO':
      if (estado.estado !== 'foco') return estado
      return { ...estado, estado: acao.tipo === 'quiz' ? 'quiz' : 'card' }

    case 'ENTENDI':
      if (estado.estado !== 'card') return estado
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
      if (estado.estado !== 'quiz') return estado
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
        destino: proxima < TOTAL_SALAS ? proxima : EXPEDICAO,
        hotspotAtivo: null,
      }
    }

    // Momento em que a tela está coberta pela <Passagem>: é aqui que a sala troca.
    case 'TRANSICAO_MEIO':
      if (estado.estado !== 'transicao' || estado.destino === EXPEDICAO) return estado
      return { ...estado, salaAtual: estado.destino ?? estado.salaAtual, trocou: true }

    case 'TRANSICAO_CONCLUIDA':
      if (estado.estado !== 'transicao') return estado
      if (estado.destino === EXPEDICAO) {
        return { ...estado, estado: EXPEDICAO, destino: null, origemTransicao: null, trocou: false }
      }
      return {
        ...estado,
        estado: 'visao-geral',
        salaAtual: estado.destino ?? estado.salaAtual,
        destino: null,
        origemTransicao: null,
        hotspotAtivo: null,
        trocou: false,
      }

    case 'RECOMECAR':
      return {
        estado: 'fachada',
        salaAtual: 0,
        destino: null,
        origemTransicao: null,
        hotspotAtivo: null,
        ancoraPainel: 0.5,
        lidos: [],
        quizzes: [],
        serie: acao.serie,
        trocou: false,
      }

    default:
      return estado
  }
}

export function useJogo() {
  const { progresso, salvar, reiniciar } = useProgresso()

  const [estado, dispatch] = useReducer(reducer, null, () => ({
    estado: 'carregando',
    salaAtual: progresso.salaAtual,
    destino: null,
    origemTransicao: null,
    hotspotAtivo: null,
    ancoraPainel: 0.5,
    lidos: progresso.lidos,
    quizzes: progresso.quizzes,
    serie: progresso.serie,
    trocou: false,
  }))

  // Persiste sala atual, registros lidos, quizzes concluídos e o número de série.
  useEffect(() => {
    salvar({
      versao: 3,
      salaAtual: estado.salaAtual,
      lidos: estado.lidos,
      quizzes: estado.quizzes,
      serie: estado.serie,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.salaAtual, estado.lidos, estado.quizzes, estado.serie])

  function recomecar() {
    const vazio = reiniciar()
    dispatch({ type: 'RECOMECAR', serie: vazio.serie })
  }

  const temProgresso = estado.salaAtual > 0 || estado.lidos.length > 0 || estado.quizzes.length > 0

  return { estado, dispatch, recomecar, temProgresso }
}
