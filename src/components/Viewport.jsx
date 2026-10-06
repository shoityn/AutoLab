import { forwardRef } from 'react'

/** Tela fixa (sem rolagem) que contém os mundos e os overlays. Ver PLANO.md seção 6.1. */
const Viewport = forwardRef(function Viewport({ children, onPointerDown }, ref) {
  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      className="fixed inset-0 overflow-hidden"
      style={{
        height: '100dvh',
        touchAction: 'manipulation',
        background: 'var(--bg)',
      }}
    >
      {children}
      {/* Vinheta: escurece as bordas e dá foco ao centro da sala.
          z-10 a deixa acima das cenas e abaixo do HUD e dos painéis. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.45) 100%)' }}
      />
    </div>
  )
})

export default Viewport
