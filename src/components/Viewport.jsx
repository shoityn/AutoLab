import { forwardRef } from 'react'

/** Tela fixa (sem rolagem) que contém o mundo e os overlays. Ver PLANO.md seção 6.1. */
const Viewport = forwardRef(function Viewport({ children }, ref) {
  return (
    <div
      ref={ref}
      className="fixed inset-0 overflow-hidden bg-[var(--bg)]"
      style={{ height: '100dvh', touchAction: 'manipulation' }}
    >
      {children}
    </div>
  )
})

export default Viewport
