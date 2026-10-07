import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Mascote from './Mascote'
import { useLinhasCodigo } from '../hooks/useLinhasCodigo'
import { ABERTURA } from '../lib/conteudo'
import { assetsEssenciais, espera, precarregar } from '../lib/precarregar'
import { prefereMovimentoReduzido } from '../hooks/useCamera'

const TEMPO_MINIMO = 1200

/**
 * Estado `carregando`. Segue as tabelas A e B do roteiro da discussão 04:
 * caracteres rolando na tela do Zinos + barra de progresso real; ao terminar,
 * os olhos acendem, "Sistema pronto!" é escrito e ele sorri.
 */
function Preloader({ onPronto }) {
  const [progresso, setProgresso] = useState(0)
  const [fase, setFase] = useState('carregando') // carregando | pronto | feliz
  const [escrito, setEscrito] = useState('')
  const containerRef = useRef(null)
  const linhas = useLinhasCodigo(fase === 'carregando')

  const textoPronto = ABERTURA.preloader.pronto

  // Carrega os assets da fachada + Sala 1, respeitando o tempo mínimo de tela.
  useEffect(() => {
    let vivo = true
    Promise.all([precarregar(assetsEssenciais(), (p) => vivo && setProgresso(p)), espera(TEMPO_MINIMO)]).then(() => {
      if (vivo) setFase('pronto')
    })
    return () => {
      vivo = false
    }
  }, [])

  // Sequência final (tabela B): olhos acendem → escreve → sorri → sai.
  useEffect(() => {
    if (fase !== 'pronto') return undefined

    if (prefereMovimentoReduzido()) {
      setEscrito(textoPronto)
      const t = window.setTimeout(onPronto, 300)
      return () => window.clearTimeout(t)
    }

    const temporizadores = []
    // 0,45 s: revela letra a letra em ~0,35 s
    let i = 0
    const passo = Math.max(20, 350 / Math.max(textoPronto.length, 1))
    const escrever = window.setInterval(() => {
      i += 1
      setEscrito(textoPronto.slice(0, i))
      if (i >= textoPronto.length) window.clearInterval(escrever)
    }, passo)

    temporizadores.push(window.setTimeout(() => setFase('feliz'), 1200))
    temporizadores.push(
      window.setTimeout(() => {
        gsap.to(containerRef.current, { opacity: 0, duration: 0.5, ease: 'power1.inOut', onComplete: onPronto })
      }, 1600),
    )

    return () => {
      window.clearInterval(escrever)
      temporizadores.forEach(window.clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase])

  const expressao = fase === 'carregando' ? 'carregando' : fase === 'pronto' ? 'pronto' : 'feliz'

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
      style={{ background: 'var(--bg)' }}
      role="status"
      aria-label={ABERTURA.preloader.aria}
      aria-busy={fase === 'carregando'}
    >
      <Mascote
        expressao={expressao}
        progresso={progresso}
        mensagem={fase === 'carregando' ? linhas : escrito}
        piscar={fase === 'feliz'}
        className="h-auto"
        style={{ width: 'min(42vw, 42vh)' }}
        titulo={ABERTURA.preloader.aria}
      />
      <span className="sr-only">{Math.round(progresso * 100)}%</span>
    </div>
  )
}

export default Preloader
