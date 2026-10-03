import { useEffect, useRef, useState } from 'react'
import { abrirPainel, fecharPainel } from '../lib/transicoes'
import { usePainelAcessivel } from '../hooks/usePainelAcessivel'

function QuizPainel({ hotspot, salaId, origem, onAcertou, onFechar }) {
  const ref = useRef(null)
  const [selecionada, setSelecionada] = useState(null)
  const [acertou, setAcertou] = useState(false)

  useEffect(() => {
    const tween = abrirPainel(origem, ref.current)
    return () => tween.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function fechar(aoTerminar) {
    fecharPainel(ref.current, aoTerminar)
  }

  usePainelAcessivel(ref, () => fechar(onFechar))

  function responder(indice) {
    if (acertou) return
    setSelecionada(indice)
    if (indice === hotspot.correta) setAcertou(true)
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-labelledby="quiz-titulo">
      <div
        ref={ref}
        className="w-full max-w-sm rounded-xl border border-[var(--acento)]/30 bg-[var(--card)] p-5 text-[var(--texto)] shadow-2xl"
      >
        <h3
          id="quiz-titulo"
          tabIndex={-1}
          data-foco-inicial
          className="mb-3 text-base font-bold text-[var(--titulo)] outline-none"
        >
          {hotspot.pergunta}
        </h3>

        <div className="flex flex-col gap-2" role="radiogroup" aria-label={hotspot.pergunta}>
          {hotspot.alternativas.map((alternativa, indice) => {
            const ehSelecionada = selecionada === indice
            const ehCorreta = acertou && indice === hotspot.correta
            return (
              <button
                key={alternativa}
                type="button"
                role="radio"
                aria-checked={ehSelecionada}
                disabled={acertou}
                onClick={() => responder(indice)}
                className={[
                  'min-h-11 rounded-md border px-3 py-2 text-left text-sm',
                  ehCorreta
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : ehSelecionada
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-[var(--acento)]/20 bg-[var(--card)]',
                ].join(' ')}
              >
                {alternativa}
              </button>
            )
          })}
        </div>

        {selecionada !== null && !acertou && (
          <p className="mt-3 rounded-md bg-amber-100 p-3 text-sm text-amber-900">💡 {hotspot.dica}</p>
        )}

        {acertou && (
          <p className="mt-3 rounded-md bg-emerald-100 p-3 text-sm text-emerald-900">✅ {hotspot.explicacao}</p>
        )}

        <div className="mt-4 flex justify-end gap-3">
          {!acertou && (
            <button
              type="button"
              onClick={() => fechar(onFechar)}
              className="min-h-11 rounded-md px-4 text-sm underline opacity-70"
            >
              Fechar
            </button>
          )}
          {acertou && (
            <button
              type="button"
              onClick={() => fechar(() => onAcertou(salaId))}
              className="min-h-11 rounded-md bg-emerald-500 px-5 font-semibold text-black"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizPainel
