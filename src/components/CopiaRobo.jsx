import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { CABECA_LIGADA, PECAS } from '../lib/assets'
import { prefereMovimentoReduzido } from '../hooks/useCamera'

const ORDEM = PECAS.map((p) => p.id)

/**
 * A cópia do Zinos que o jogador monta, peça por peça.
 * As 5 peças de public/mascote/pecas/ compartilham o viewBox 240x320, então
 * basta empilhá-las no mesmo quadro. A peça nova entra com `bounce.out`
 * (PLANO v2.1 seção 4.4).
 *
 * `ligada` troca a cabeça apagada pela acesa — é o momento da Expedição em que
 * a cópia "acorda".
 */
function CopiaRobo({ pecas = [], ligada = false, serie, className = '' }) {
  const refs = useRef({})
  const anterioresRef = useRef(null)

  useEffect(() => {
    const reduzido = prefereMovimentoReduzido()

    // Na primeira renderização não anima (pode estar só restaurando o progresso).
    if (anterioresRef.current === null) {
      anterioresRef.current = pecas
      return
    }

    const novas = pecas.filter((peca) => !anterioresRef.current.includes(peca))
    anterioresRef.current = pecas

    novas.forEach((peca) => {
      const el = refs.current[peca]
      if (!el) return
      if (reduzido) {
        gsap.set(el, { opacity: 1, scale: 1, y: 0 })
        return
      }
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.35, y: -28, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'bounce.out' },
      )
    })
  }, [pecas])

  const nomes = PECAS.filter((p) => pecas.includes(p.id)).map((p) => p.nome)
  const descricao = nomes.length
    ? `Cópia ${serie ?? ''} em montagem: ${nomes.join(', ')}. ${pecas.length} de ${ORDEM.length} peças.`
    : 'Cópia ainda sem peças.'

  return (
    <div className={`relative ${className}`} role="img" aria-label={descricao.trim()}>
      {PECAS.map((peca) => {
        const presente = pecas.includes(peca.id)
        const arquivo = peca.id === 'cabeca' && ligada ? CABECA_LIGADA : peca.arquivo
        return (
          <img
            key={peca.id}
            ref={(el) => {
              refs.current[peca.id] = el
            }}
            src={arquivo}
            alt=""
            aria-hidden="true"
            draggable="false"
            className="absolute inset-0 h-full w-full select-none object-contain"
            style={{ opacity: presente ? 1 : 0, willChange: 'transform' }}
          />
        )
      })}
    </div>
  )
}

export default CopiaRobo
