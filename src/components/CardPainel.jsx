import { useEffect, useRef } from 'react'
import { abrirPainel, fecharPainel } from '../lib/transicoes'
import { usePainelAcessivel } from '../hooks/usePainelAcessivel'
import { ZinosCabeca } from './Zinos'

/** Card de conteúdo. Fica fora do mundo, num overlay, para o texto não escalar. */
function CardPainel({ hotspot, origem, jaLido, onEntendi, onFechar }) {
  const ref = useRef(null)

  useEffect(() => {
    const tween = abrirPainel(origem, ref.current)
    return () => tween.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function fechar(aoTerminar) {
    fecharPainel(ref.current, aoTerminar)
  }

  usePainelAcessivel(ref, () => fechar(onFechar))

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-titulo"
      style={{ background: 'rgba(5,8,12,.45)' }}
    >
      <div
        ref={ref}
        className="w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background: 'var(--card)',
          borderColor: 'color-mix(in srgb, var(--hotspot) 32%, transparent)',
          color: 'var(--texto)',
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ background: 'color-mix(in srgb, var(--marca-tela) 45%, transparent)' }}
        >
          <ZinosCabeca expressao="explicando" className="h-8 w-10 shrink-0" />
          <p className="text-[10px] uppercase tracking-[2px] opacity-70">{hotspot.rotulo}</p>
        </div>

        <div className="p-4">
          <h3
            id="card-titulo"
            tabIndex={-1}
            data-foco-inicial
            className="mb-2 text-lg font-bold outline-none"
            style={{ color: 'var(--titulo)' }}
          >
            {hotspot.titulo}
          </h3>
          <p className="text-[13.5px] leading-relaxed opacity-95">{hotspot.texto}</p>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => fechar(onFechar)}
              className="min-h-11 rounded-xl px-4 text-sm underline opacity-70"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => fechar(() => onEntendi(hotspot.id))}
              className="min-h-11 rounded-xl px-6 font-semibold active:scale-[.98]"
              style={{ background: 'var(--hotspot)', color: 'var(--marca-tela)' }}
            >
              {jaLido ? 'Fechar registro' : 'Entendi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardPainel
