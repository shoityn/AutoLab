import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Robo({ pecas, flutuante = true }) {
  const refsPecas = useRef({})
  const anterioresRef = useRef([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const novas = pecas.filter((peca) => !anterioresRef.current.includes(peca))

    novas.forEach((peca) => {
      const el = refsPecas.current[peca]
      if (!el) return
      if (prefersReduced) {
        gsap.set(el, { opacity: 1, scale: 1 })
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'bounce.out' },
        )
      }
    })

    anterioresRef.current = pecas
  }, [pecas])

  const temPeca = (peca) => pecas.includes(peca)

  return (
    <div
      aria-hidden="true"
      className={
        flutuante
          ? 'fixed bottom-4 right-4 z-10 h-24 w-24 rounded-full border border-[var(--acento)]/30 bg-[var(--card)]/90 p-2 backdrop-blur-sm'
          : 'mx-auto h-48 w-48'
      }
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* base/chassi — estação 1 */}
        <rect
          ref={(el) => (refsPecas.current.base = el)}
          x="30"
          y="72"
          width="40"
          height="18"
          rx="4"
          fill="var(--acento)"
          style={{ opacity: temPeca('base') ? 1 : 0 }}
        />

        {/* tronco/estrutura — estação 2 */}
        <rect
          ref={(el) => (refsPecas.current.tronco = el)}
          x="36"
          y="42"
          width="28"
          height="32"
          rx="5"
          fill="var(--titulo)"
          style={{ opacity: temPeca('tronco') ? 1 : 0 }}
        />

        {/* núcleo/cérebro — estação 3 */}
        <circle
          ref={(el) => (refsPecas.current.nucleo = el)}
          cx="50"
          cy="30"
          r="13"
          fill="var(--acento)"
          style={{ opacity: temPeca('nucleo') ? 1 : 0 }}
        />

        {/* olhos/sensores — estação 4 */}
        <g ref={(el) => (refsPecas.current.olhos = el)} style={{ opacity: temPeca('olhos') ? 1 : 0 }}>
          <circle cx="44" cy="29" r="2.5" fill="#ffffff" />
          <circle cx="56" cy="29" r="2.5" fill="#ffffff" />
        </g>

        {/* antena + selo de aprovado — estação 5 */}
        <g ref={(el) => (refsPecas.current.antena = el)} style={{ opacity: temPeca('antena') ? 1 : 0 }}>
          <line x1="50" y1="17" x2="50" y2="7" stroke="var(--titulo)" strokeWidth="2" />
          <circle cx="50" cy="6" r="3" fill="var(--titulo)" />
        </g>
      </svg>
    </div>
  )
}

export default Robo
