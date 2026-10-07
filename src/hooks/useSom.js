import { useEffect, useRef, useSyncExternalStore } from 'react'
import { EXPEDICAO } from './useJogo'
import { alternar, estaLigado, falar, observar, tocar } from '../lib/som'

/**
 * Liga/desliga do som, compartilhado por toda a árvore sem contexto: a fonte da
 * verdade é o módulo `lib/som`, e o React só assina as mudanças.
 */
export function useSom() {
  const ligado = useSyncExternalStore(observar, estaLigado, () => false)
  return { ligado, alternar }
}

/**
 * Camada de som da máquina de estados. Segue a mesma regra das animações no
 * PLANO v2.1 seção 5 — **o reducer decide, o som reage**: nada aqui despacha
 * ação nenhuma, só observa a transição e toca.
 *
 * Os retornos tácteis imediatos (toque no hotspot, acerto e erro do quiz) ficam
 * nos próprios componentes, porque precisam soar no instante do toque e não
 * passam pelo reducer.
 */
export function useSomDoJogo(estado) {
  const anteriorRef = useRef(null)

  useEffect(() => {
    const antes = anteriorRef.current
    anteriorRef.current = estado
    if (!antes) return

    const mudouEstado = antes.estado !== estado.estado
    const leuRegistro = estado.lidos.length > antes.lidos.length
    const montouPeca = estado.quizzes.length > antes.quizzes.length

    // Chegou na Expedição: fanfarra do fim do turno.
    if (mudouEstado && estado.estado === EXPEDICAO) {
      tocar('fanfarra')
      return
    }

    if (mudouEstado && estado.estado === 'transicao') {
      // Entrar na fábrica pelo portão x passar para a próxima sala.
      tocar(estado.origemTransicao === 'fachada' ? 'portao' : 'passagem')
      return
    }

    // O painel só abre quando a câmera termina de enquadrar (foco -> card/quiz).
    if (mudouEstado && antes.estado === 'foco' && (estado.estado === 'card' || estado.estado === 'quiz')) {
      tocar('abrir')
      return
    }

    if (mudouEstado && (antes.estado === 'card' || antes.estado === 'quiz')) {
      // A peça encaixando e o registro marcado substituem o som de fechar —
      // tocar os dois juntos embolaria o momento que importa.
      if (montouPeca) tocar('peca')
      else if (leuRegistro) tocar('marcado')
      else tocar('fechar')
    }
  }, [estado])
}

/** Janela em que o mesmo texto não fala de novo (ms). */
const ANTI_ECO = 500

/**
 * Faz o Zinos "falar" o texto de um balão assim que ele aparece. Um bipe por
 * sílaba — ver `falar()` em lib/som.
 *
 * O guarda de eco existe porque o mesmo balão pode montar duas vezes seguidas:
 * o <StrictMode> dobra os efeitos em desenvolvimento, e uma remontagem do HUD
 * faria a fala sair em dobro. Repetir a mesma frase mais tarde — reabrir a dica
 * do quiz, por exemplo — continua valendo.
 */
export function useVozDoZinos(texto) {
  const ultimaRef = useRef({ texto: null, quando: 0 })

  useEffect(() => {
    if (!texto) return
    const agora = Date.now()
    const ultima = ultimaRef.current
    if (ultima.texto === texto && agora - ultima.quando < ANTI_ECO) return
    ultimaRef.current = { texto, quando: agora }
    falar(texto)
  }, [texto])
}
