import { forwardRef } from 'react'

const ICONE = { novo: 'i', liberado: '?', lido: '✓', trancado: '🔒' }

/**
 * Botão do hotspot, renderizado num overlay em tela (não escala com a câmera). Ver seção 6.5.
 * `estadoVisual`: 'novo' | 'lido' | 'trancado' | 'liberado'
 */
const Hotspot = forwardRef(function Hotspot({ x, y, rotulo, estadoVisual, icone, onClick }, ref) {
  const trancado = estadoVisual === 'trancado'

  return (
    <button
      ref={ref}
      type="button"
      aria-label={trancado ? `${rotulo} — trancado, leia todos os registros desta sala primeiro` : rotulo}
      onClick={onClick}
      style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}
      className={[
        'flex h-11 w-11 items-center justify-center rounded-full border-2 font-bold text-white shadow-lg transition-transform active:scale-95',
        trancado ? 'border-white/40 bg-black/50' : 'border-[var(--acento)] bg-[var(--acento)]',
        (estadoVisual === 'novo' || estadoVisual === 'liberado') && 'animate-pulse',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true">{icone ?? ICONE[estadoVisual]}</span>
    </button>
  )
})

export default Hotspot
