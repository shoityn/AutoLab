import { useEffect, useRef } from 'react'
import { abrirPainel, fecharPainel } from '../lib/transicoes'
import { usePainelAcessivel } from '../hooks/usePainelAcessivel'
import Mascote from './Mascote'

/**
 * Card de conteúdo. Fica fora do mundo, num overlay, para o texto não escalar.
 *
 * Em celular deitado a altura útil é pequena (~350 px), então o painel abre
 * como **painel lateral** ocupando ~55% da largura, do lado oposto ao objeto
 * focado. No PC e em retrato abre centralizado (PLANO v2.1 seção 4.4).
 */
function CardPainel({ hotspot, origem, lateral, lado, jaLido, onEntendi, onFechar }) {
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

  const posicao = lateral
    ? `fixed inset-y-0 ${lado === 'direita' ? 'right-0' : 'left-0'} z-30 flex w-[55%] items-stretch p-2`
    : 'fixed inset-0 z-30 flex items-center justify-center p-4'

  return (
    <div
      className={posicao}
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-titulo"
      style={lateral ? undefined : { background: 'rgba(5,8,12,.45)' }}
    >
      <div
        ref={ref}
        className={`flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border shadow-2xl ${lateral ? '' : 'max-w-md'}`}
        style={{
          background: 'var(--card)',
          borderColor: 'color-mix(in srgb, var(--hotspot) 32%, transparent)',
          color: 'var(--texto)',
        }}
      >
        <div
          className="flex shrink-0 items-center gap-2 px-3 py-1.5"
          style={{ background: 'color-mix(in srgb, var(--marca-tela) 45%, transparent)' }}
        >
          <Mascote expressao="explicando" className="w-9 shrink-0" />
          <p className="truncate text-[10px] uppercase tracking-[2px] opacity-70">{hotspot.rotulo}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <h3
            id="card-titulo"
            tabIndex={-1}
            data-foco-inicial
            className="mb-1.5 text-[17px] font-bold outline-none"
            style={{ color: 'var(--titulo)' }}
          >
            {hotspot.titulo}
          </h3>
          <p className="text-[13.5px] leading-relaxed opacity-95">{hotspot.texto}</p>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 px-4 pb-3 pt-1">
          <button
            type="button"
            onClick={() => fechar(onFechar)}
            className="min-h-11 rounded-xl px-3 text-sm underline opacity-70"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => fechar(() => onEntendi(hotspot.id))}
            className="min-h-11 rounded-xl px-5 font-semibold active:scale-[.98]"
            style={{ background: 'var(--hotspot)', color: 'var(--marca-tela)' }}
          >
            {jaLido ? 'Fechar registro' : 'Entendi'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardPainel
