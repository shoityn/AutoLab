import { forwardRef } from 'react'
import { MUNDO, cameraVisaoGeral, enquadrarEm } from '../hooks/useCamera'

/**
 * Um "slot" de cena: o retângulo fixo de 1920x1080 que a câmera move por
 * transform (PLANO.md seção 6.1). O jogo mantém dois slots montados durante a
 * transição entre salas.
 *
 * O transform inicial já sai pronto no primeiro paint, calculado a partir do
 * tamanho da tela, para a cena nunca piscar em escala 1:1 antes do GSAP assumir.
 */
const Mundo = forwardRef(function Mundo({ children, camera, tela, oculto = false, className = '' }, ref) {
  const vw = tela?.vw ?? window.innerWidth
  const vh = tela?.vh ?? window.innerHeight
  const alvo = camera ?? cameraVisaoGeral(vw, vh)
  const t = enquadrarEm(alvo, vw, vh)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute left-0 top-0 ${className}`}
      style={{
        width: MUNDO.largura,
        height: MUNDO.altura,
        transformOrigin: '0 0',
        willChange: 'transform',
        backgroundColor: 'var(--bg)',
        transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})`,
        visibility: oculto ? 'hidden' : 'visible',
      }}
    >
      {children}
    </div>
  )
})

export default Mundo
