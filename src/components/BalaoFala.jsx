import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Mascote from './Mascote'
import { prefereMovimentoReduzido } from '../hooks/useCamera'
import { useVozDoZinos } from '../hooks/useSom'

/**
 * Avatar do Zinos + balão de fala. Usado no HUD (fala de entrada da sala),
 * no quiz (dica e explicação) e na Expedição. PLANO v2.1 seção 9.
 */
function BalaoFala({
  texto,
  expressao = 'explicando',
  compacto = false,
  piscar = true,
  semAvatar = false,
  className = '',
  aoFechar,
}) {
  const balaoRef = useRef(null)

  // Um bipe por sílaba enquanto o balão entra — vale para a fala de entrada da
  // sala, a dica do quiz, a explicação e a despedida da Expedição.
  useVozDoZinos(texto)

  useLayoutEffect(() => {
    if (!balaoRef.current || prefereMovimentoReduzido()) return
    const tween = gsap.fromTo(
      balaoRef.current,
      { scale: 0.8, opacity: 0, transformOrigin: '0% 100%' },
      { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.7)' },
    )
    return () => tween.kill()
  }, [texto])

  if (!texto) return null

  return (
    <div className={`flex items-end gap-2 ${className}`}>
      {!semAvatar && (
        <Mascote expressao={expressao} piscar={piscar} className={compacto ? 'w-12 shrink-0' : 'w-16 shrink-0'} />
      )}
      <div
        ref={balaoRef}
        className="relative max-w-sm rounded-2xl rounded-bl-sm border px-3 py-2 text-[12.5px] leading-snug"
        style={{
          background: 'var(--marca-creme)',
          borderColor: 'var(--marca-grafite)',
          color: 'var(--marca-tinta)',
        }}
      >
        {texto}
        {aoFechar && (
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Dispensar a fala do Zinos"
            className="btn-icone absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] leading-none active:scale-90"
            style={{
              background: 'var(--marca-tela)',
              borderColor: 'var(--marca-grafite)',
              color: 'var(--marca-creme)',
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default BalaoFala
