import { useEffect, useRef, useState } from 'react'
import { abrirPainel, fecharPainel } from '../lib/transicoes'
import { usePainelAcessivel } from '../hooks/usePainelAcessivel'
import { ZinosCabeca } from './Zinos'

/**
 * Registro final da sala: uma pergunta, tentativas livres e dica fixa ao errar
 * (PLANO.md seção 4.3). Acertar monta a peça do robô e acende a saída.
 */
function QuizPainel({ hotspot, salaId, origem, jaConcluido, onAcertou, onFechar }) {
  const ref = useRef(null)
  const [selecionada, setSelecionada] = useState(null)
  const [acertou, setAcertou] = useState(jaConcluido)
  const [tentativas, setTentativas] = useState(0)

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
    else setTentativas((n) => n + 1)
  }

  const errou = selecionada !== null && !acertou
  const expressao = acertou ? 'feliz' : errou ? 'triste' : 'pensando'

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-titulo"
      style={{ background: 'rgba(5,8,12,.5)' }}
    >
      <div
        ref={ref}
        className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border shadow-2xl"
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
          <ZinosCabeca expressao={expressao} className="h-8 w-10 shrink-0" />
          <p className="text-[10px] uppercase tracking-[2px] opacity-70">Registro final · {hotspot.rotulo}</p>
        </div>

        <div className="min-h-0 overflow-y-auto p-4">
          <h3
            id="quiz-titulo"
            tabIndex={-1}
            data-foco-inicial
            className="mb-3 text-[15px] font-bold leading-snug outline-none"
            style={{ color: 'var(--titulo)' }}
          >
            {hotspot.pergunta}
          </h3>

          <div className="flex flex-col gap-2" role="radiogroup" aria-label={hotspot.pergunta}>
            {hotspot.alternativas.map((alternativa, indice) => {
              const ehSelecionada = selecionada === indice
              const ehCorreta = acertou && indice === hotspot.correta
              const ehErrada = ehSelecionada && !acertou

              return (
                <button
                  key={alternativa}
                  type="button"
                  role="radio"
                  aria-checked={ehSelecionada}
                  disabled={acertou}
                  onClick={() => responder(indice)}
                  className="flex min-h-11 items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] leading-snug transition-colors"
                  style={{
                    borderColor: ehCorreta
                      ? 'var(--hotspot)'
                      : ehErrada
                        ? 'var(--acento)'
                        : 'color-mix(in srgb, var(--texto) 18%, transparent)',
                    background: ehCorreta
                      ? 'color-mix(in srgb, var(--hotspot) 16%, transparent)'
                      : ehErrada
                        ? 'color-mix(in srgb, var(--acento) 16%, transparent)'
                        : 'transparent',
                  }}
                >
                  <span aria-hidden="true" className="w-4 shrink-0 font-bold opacity-70">
                    {ehCorreta ? '✓' : ehErrada ? '✕' : String.fromCharCode(65 + indice)}
                  </span>
                  <span>{alternativa}</span>
                </button>
              )
            })}
          </div>

          <div aria-live="polite">
            {errou && (
              <p
                className="mt-3 rounded-xl p-3 text-[13px] leading-snug"
                style={{
                  background: 'color-mix(in srgb, var(--acento) 18%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--acento) 45%, transparent)',
                }}
              >
                <strong className="font-semibold">Ainda não.</strong> {hotspot.dica}
                {tentativas > 1 && ' Tente de novo, dá para errar à vontade.'}
              </p>
            )}

            {acertou && (
              <p
                className="mt-3 rounded-xl p-3 text-[13px] leading-snug"
                style={{
                  background: 'color-mix(in srgb, var(--hotspot) 15%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--hotspot) 45%, transparent)',
                }}
              >
                <strong className="font-semibold">Isso.</strong> {hotspot.explicacao}
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            {!acertou ? (
              <button
                type="button"
                onClick={() => fechar(onFechar)}
                className="min-h-11 rounded-xl px-4 text-sm underline opacity-70"
              >
                Voltar para a sala
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fechar(() => onAcertou(salaId))}
                className="min-h-11 rounded-xl px-6 font-semibold active:scale-[.98]"
                style={{ background: 'var(--hotspot)', color: 'var(--marca-tela)' }}
              >
                {jaConcluido ? 'Voltar para a sala' : 'Montar a peça'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPainel
