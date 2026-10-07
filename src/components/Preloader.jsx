import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Mascote from './Mascote'
import { useLinhasCodigo } from '../hooks/useLinhasCodigo'
import { ABERTURA } from '../lib/conteudo'
import { assetsEssenciais, espera, precarregar } from '../lib/precarregar'
import { comSalvaguarda } from '../lib/transicoes'
import { prefereMovimentoReduzido } from '../hooks/useCamera'

const TEMPO_MINIMO = 1200

/**
 * Estado `carregando`. Segue as tabelas A e B do roteiro da discussão 04:
 * caracteres rolando na tela do Zinos + barra de progresso real; ao terminar,
 * os olhos acendem, "Sistema pronto!" é escrito e ele sorri.
 *
 * `carregado` é o que dispara a sequência de saída, e muda uma única vez.
 * O sorriso é um estado separado de propósito: se ele estivesse no mesmo
 * estado, a troca de expressão refaria o efeito e cancelaria os temporizadores
 * da própria saída — o jogo ficava preso na primeira tela.
 */
function Preloader({ onPronto }) {
  const [progresso, setProgresso] = useState(0)
  const [carregado, setCarregado] = useState(false)
  const [sorrindo, setSorrindo] = useState(false)
  const [escrito, setEscrito] = useState('')
  const containerRef = useRef(null)
  const linhas = useLinhasCodigo(!carregado)

  const textoPronto = ABERTURA.preloader.pronto

  // Carrega os assets da fachada + Sala 1, respeitando o tempo mínimo de tela.
  useEffect(() => {
    let vivo = true
    Promise.all([precarregar(assetsEssenciais(), (p) => vivo && setProgresso(p)), espera(TEMPO_MINIMO)]).then(() => {
      if (vivo) setCarregado(true)
    })
    return () => {
      vivo = false
    }
  }, [])

  // Sequência final (tabela B): olhos acendem → escreve → sorri → sai.
  useEffect(() => {
    if (!carregado) return undefined

    if (prefereMovimentoReduzido()) {
      setEscrito(textoPronto)
      const t = window.setTimeout(onPronto, 300)
      return () => window.clearTimeout(t)
    }

    // A saída não pode depender só do onComplete do GSAP: se o rAF congelar
    // (aba em segundo plano), o fade nunca termina e o jogo trava aqui.
    const saida = comSalvaguarda(onPronto, 2600)
    const temporizadores = []

    let i = 0
    const passo = Math.max(20, 350 / Math.max(textoPronto.length, 1))
    const escrever = window.setInterval(() => {
      i += 1
      setEscrito(textoPronto.slice(0, i))
      if (i >= textoPronto.length) window.clearInterval(escrever)
    }, passo)

    temporizadores.push(window.setTimeout(() => setSorrindo(true), 1200))
    temporizadores.push(
      window.setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.inOut',
          onComplete: saida.concluir,
        })
      }, 1600),
    )

    return () => {
      window.clearInterval(escrever)
      temporizadores.forEach(window.clearTimeout)
      saida.cancelar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carregado])

  const expressao = !carregado ? 'carregando' : sorrindo ? 'feliz' : 'pronto'

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
      style={{ background: 'var(--bg)' }}
      role="status"
      aria-label={ABERTURA.preloader.aria}
      aria-busy={!carregado}
    >
      <Mascote
        expressao={expressao}
        progresso={progresso}
        mensagem={carregado ? escrito : linhas}
        piscar={sorrindo}
        className="h-auto"
        style={{ width: 'min(42vw, 42vh)' }}
        titulo={ABERTURA.preloader.aria}
      />
      <span className="sr-only">{Math.round(progresso * 100)}%</span>
    </div>
  )
}

export default Preloader
