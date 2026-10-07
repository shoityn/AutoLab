import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import CopiaRobo from './CopiaRobo'
import { MARCA } from '../lib/assets'
import { ABERTURA, preencher } from '../lib/conteudo'
import { prefereMovimentoReduzido } from '../hooks/useCamera'

/**
 * Overlay da fachada: logotipo, chamada, botões e — se houver progresso — a
 * cópia ZN-xx já montada ao lado. Segue a tabela C do roteiro da discussão 04.
 * O "Recomeçar" confirma dentro da página, nunca com `confirm()`.
 */
function PainelFachada({ temProgresso, pecas, serie, onIniciar, onContinuar, onRecomecar }) {
  const t = ABERTURA.fachada
  const [confirmando, setConfirmando] = useState(false)
  const raizRef = useRef(null)

  useLayoutEffect(() => {
    if (!raizRef.current) return
    const alvos = raizRef.current.querySelectorAll('[data-entrada]')
    if (prefereMovimentoReduzido()) {
      gsap.set(alvos, { opacity: 1, y: 0, scale: 1 })
      return
    }
    const tl = gsap.fromTo(
      alvos,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.08, delay: 0.2 },
    )
    return () => tl.kill()
  }, [])

  return (
    <div
      ref={raizRef}
      className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-end p-4"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        data-entrada
        className="pointer-events-auto w-full max-w-sm rounded-2xl border p-3.5 shadow-2xl backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--marca-tela) 84%, transparent)',
          borderColor: 'color-mix(in srgb, var(--marca-ciano) 35%, transparent)',
        }}
      >
        <img src={MARCA.horizontalMonoBranco} alt="AutoLab" className="mb-2 h-4" draggable="false" />
        <h1 className="text-[17px] font-bold leading-tight" style={{ color: 'var(--marca-ciano)' }}>
          {t.chamada}
        </h1>
        <p className="mt-1 text-[12.5px] leading-snug text-white/85">{t.subtitulo}</p>

        {temProgresso && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-2.5 py-2">
            <CopiaRobo pecas={pecas} serie={serie} className="h-14 w-10 shrink-0" />
            <p className="text-[11px] uppercase tracking-[1.5px] text-white/70">
              {preencher(t.rotuloCopia, { serie })}
            </p>
          </div>
        )}

        {confirmando ? (
          <div className="mt-3" role="alertdialog" aria-label={t.confirmarRecomecar}>
            <p className="text-[12.5px] text-white/90">{t.confirmarRecomecar}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmando(false)
                  onRecomecar()
                }}
                className="min-h-11 flex-1 rounded-xl px-4 text-sm font-semibold active:scale-[.98]"
                style={{ background: 'var(--acento)', color: '#fff' }}
              >
                {t.confirmarSim}
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 rounded-xl border border-white/25 px-4 text-sm font-semibold text-white active:scale-[.98]"
              >
                {t.confirmarNao}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {temProgresso ? (
              <>
                <button
                  type="button"
                  onClick={onContinuar}
                  className="min-h-11 flex-1 rounded-xl px-5 font-semibold active:scale-[.98]"
                  style={{ background: 'var(--marca-ciano)', color: 'var(--marca-tela)' }}
                >
                  {t.continuar}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmando(true)}
                  className="min-h-11 rounded-xl border border-white/25 px-4 font-semibold text-white active:scale-[.98]"
                >
                  {t.recomecar}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onIniciar}
                className="min-h-11 w-full rounded-xl px-6 font-semibold active:scale-[.98]"
                style={{ background: 'var(--marca-ciano)', color: 'var(--marca-tela)' }}
              >
                {t.iniciar}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PainelFachada
