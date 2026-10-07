import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefereMovimentoReduzido } from '../hooks/useCamera'
import { comSalvaguarda } from '../lib/transicoes'

/**
 * Efeito de passagem entre salas, em overlay por cima de tudo — só CSS/SVG,
 * sem arte nova (doc 07, "Roteiro por saída").
 *
 * `onMeio` é chamado no instante em que a tela está coberta: é ali que o
 * reducer troca de sala. `onFim` libera os toques.
 *
 * Com `prefers-reduced-motion` qualquer tipo vira um crossfade de 0,3 s.
 */
function Passagem({ tipo = 'tunel', onMeio, onFim }) {
  const raizRef = useRef(null)
  const aRef = useRef(null)
  const bRef = useRef(null)
  const cRef = useRef(null)

  useLayoutEffect(() => {
    // Se o rAF congelar, a timeline para no meio e a sala nunca troca.
    // As duas salvaguardas garantem que a passagem sempre termina.
    const meio = comSalvaguarda(() => onMeio?.(), 2000)
    const fim = comSalvaguarda(() => onFim?.(), 3400)
    const trocar = () => meio.concluir()
    const terminar = () => {
      meio.concluir()
      fim.concluir()
    }

    const raiz = raizRef.current
    const a = aRef.current
    const b = bRef.current

    if (prefereMovimentoReduzido()) {
      const tl = gsap
        .timeline()
        .fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' })
        .add(() => trocar())
        .to(raiz, { opacity: 0, duration: 0.15, ease: 'none' })
        .add(() => terminar())
      return () => {
        meio.cancelar()
        fim.cancelar()
        tl.kill()
      }
    }

    let tl

    switch (tipo) {
      // Elevador: grade fecha da direita, a tela "sobe", grade abre.
      case 'elevador':
        tl = gsap.timeline()
        tl.fromTo(a, { xPercent: 100 }, { xPercent: 0, duration: 0.35, ease: 'power2.in' })
          .fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.15 }, '-=0.1')
          .to(raiz, { y: 8, duration: 0.08, repeat: 3, yoyo: true, ease: 'none' })
          .add(() => trocar())
          .to(b, { opacity: 0, duration: 0.2 })
          .to(a, { xPercent: -100, duration: 0.35, ease: 'power2.out' })
          .add(() => terminar())
        break

      // Porta pressurizada: duas folhas fecham, vapor, folhas abrem.
      case 'portaDupla':
        tl = gsap.timeline()
        tl.fromTo(
          [a, b],
          { xPercent: (i) => (i === 0 ? -100 : 100) },
          { xPercent: 0, duration: 0.3, ease: 'power2.in' },
        )
          .fromTo(cRef.current, { opacity: 0, scale: 0.6 }, { opacity: 0.85, scale: 1.4, duration: 0.3 })
          .add(() => trocar())
          .to(cRef.current, { opacity: 0, duration: 0.2 }, '-=0.1')
          .to([a, b], { xPercent: (i) => (i === 0 ? -100 : 100), duration: 0.4, ease: 'power2.out' })
          .add(() => terminar())
        break

      // Porta de vidro fosco: desfoca, troca por baixo, volta ao normal.
      case 'vidro':
        tl = gsap.timeline()
        tl.fromTo(
          raiz,
          { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(255,255,255,0)' },
          {
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(255,255,255,0.4)',
            duration: 0.4,
            ease: 'power2.in',
          },
        )
          .add(() => trocar())
          .to(raiz, {
            backdropFilter: 'blur(0px)',
            backgroundColor: 'rgba(255,255,255,0)',
            duration: 0.4,
            ease: 'power2.out',
          })
          .add(() => terminar())
        break

      // Doca com luz do dia: flash branco.
      case 'luz':
        tl = gsap.timeline()
        tl.fromTo(a, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.in' })
          .add(() => trocar())
          .to(a, { opacity: 0, duration: 0.3, ease: 'power2.out' })
          .add(() => terminar())
        break

      // Túnel: o escuro cobre a tela a partir do centro e abre na sala seguinte.
      default:
        tl = gsap.timeline()
        tl.fromTo(
          a,
          { opacity: 0, scale: 0.2 },
          { opacity: 1, scale: 2.6, duration: 0.5, ease: 'power2.in', transformOrigin: '50% 50%' },
        )
          .add(() => trocar())
          .to(a, { opacity: 0, duration: 0.45, ease: 'power2.out' })
          .add(() => terminar())
        break
    }

    return () => {
      meio.cancelar()
      fim.cancelar()
      tl?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo])

  return (
    <div ref={raizRef} className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {tipo === 'elevador' && (
        <>
          <svg ref={aRef} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <rect x="0" y="0" width="100" height="100" fill="#0B1118" opacity=".55" />
            {Array.from({ length: 13 }, (_, i) => (
              <rect key={i} x={i * 8 + 1} y="0" width="3.2" height="100" fill="#5B6470" />
            ))}
          </svg>
          <div ref={bRef} className="absolute inset-0" style={{ background: '#0B1118', opacity: 0 }} />
        </>
      )}

      {tipo === 'portaDupla' && (
        <>
          <div ref={aRef} className="absolute inset-y-0 left-0 w-1/2" style={{ background: '#5B6470' }}>
            <div className="absolute inset-y-0 right-0 w-3" style={{ background: 'var(--titulo)' }} />
          </div>
          <div ref={bRef} className="absolute inset-y-0 right-0 w-1/2" style={{ background: '#5B6470' }}>
            <div className="absolute inset-y-0 left-0 w-3" style={{ background: 'var(--titulo)' }} />
          </div>
          <div ref={cRef} className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
            <div
              className="h-64 w-64 rounded-full"
              style={{ background: '#fff', filter: 'blur(42px)' }}
            />
          </div>
        </>
      )}

      {tipo === 'luz' && <div ref={aRef} className="absolute inset-0" style={{ background: '#fff', opacity: 0 }} />}

      {tipo === 'tunel' && (
        <div ref={aRef} className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
          <div
            className="h-[120vmax] w-[120vmax] rounded-full"
            style={{ background: 'radial-gradient(circle, #0B1118 0%, #0B1118 55%, transparent 72%)' }}
          />
        </div>
      )}
    </div>
  )
}

export default Passagem
