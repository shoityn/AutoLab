import { useEffect, useRef } from 'react'
import { abrirPainel, fecharPainel } from '../lib/transicoes'
import { usePainelAcessivel } from '../hooks/usePainelAcessivel'

function CardPainel({ hotspot, origem, onEntendi, onFechar }) {
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
    <div className="fixed inset-0 z-30 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-labelledby="card-titulo">
      <div
        ref={ref}
        className="w-full max-w-sm rounded-xl border border-[var(--acento)]/30 bg-[var(--card)] p-5 text-[var(--texto)] shadow-2xl"
      >
        <h3
          id="card-titulo"
          tabIndex={-1}
          data-foco-inicial
          className="mb-2 text-lg font-bold text-[var(--titulo)] outline-none"
        >
          {hotspot.titulo}
        </h3>
        <p className="text-sm">{hotspot.texto}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => fechar(onFechar)}
            className="min-h-11 rounded-md px-4 text-sm underline opacity-70"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => fechar(() => onEntendi(hotspot.id))}
            className="min-h-11 rounded-md bg-emerald-500 px-5 font-semibold text-black"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardPainel
