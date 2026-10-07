import { useEffect, useRef, useState } from 'react'
import { abrirPainel, fecharPainel } from '../lib/transicoes'
import { usePainelAcessivel } from '../hooks/usePainelAcessivel'
import { tocar } from '../lib/som'
import Mascote from './Mascote'
import BalaoFala from './BalaoFala'

/**
 * Registro final da sala: uma pergunta, tentativas livres e a dica dita pelo
 * Zinos num balão (PLANO v2.1 seção 4.4). Ao errar ele fica `triste` e depois
 * `explicando`; ao acertar, `feliz`, e a peça encaixa na cópia.
 */
function QuizPainel({ hotspot, salaId, origem, lateral, lado, jaConcluido, onAcertou, onFechar }) {
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
    // Soa no toque, não no reducer: a resposta é estado local do painel, e o
    // retorno precisa chegar junto com a cor da alternativa.
    if (indice === hotspot.correta) {
      setAcertou(true)
      tocar('acerto')
    } else {
      setTentativas((n) => n + 1)
      tocar('erro')
    }
  }

  const errou = selecionada !== null && !acertou
  const expressao = acertou ? 'feliz' : errou ? 'explicando' : 'pensando'

  const posicao = lateral
    ? `fixed inset-y-0 ${lado === 'direita' ? 'right-0' : 'left-0'} z-30 flex w-[55%] items-stretch p-2`
    : 'fixed inset-0 z-30 flex items-center justify-center p-4'

  return (
    <div
      className={posicao}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-titulo"
      style={lateral ? undefined : { background: 'rgba(5,8,12,.5)' }}
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
          <Mascote expressao={expressao} className="w-9 shrink-0" />
          <p className="truncate text-[10px] uppercase tracking-[2px] opacity-70">
            Registro final · {hotspot.rotulo}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <h3
            id="quiz-titulo"
            tabIndex={-1}
            data-foco-inicial
            className="mb-2.5 text-[14.5px] font-bold leading-snug outline-none"
            style={{ color: 'var(--titulo)' }}
          >
            {hotspot.pergunta}
          </h3>

          <div className="flex flex-col gap-1.5" role="radiogroup" aria-label={hotspot.pergunta}>
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
                  className="btn-opcao flex min-h-11 items-start gap-2 rounded-xl border px-3 py-2 text-left text-[12.5px] leading-snug"
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

          <div aria-live="polite" className="mt-3">
            {errou && (
              <BalaoFala
                texto={`${hotspot.dica}${tentativas > 1 ? ' Pode tentar de novo à vontade.' : ''}`}
                expressao="triste"
                compacto
                piscar={false}
              />
            )}
            {acertou && <BalaoFala texto={hotspot.explicacao} expressao="feliz" compacto piscar={false} />}
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2 px-4 pb-3 pt-1">
          {!acertou ? (
            <button
              type="button"
              onClick={() => fechar(onFechar)}
              className="btn-fantasma min-h-11 rounded-xl px-3 text-sm underline opacity-70 active:scale-[.98]"
            >
              Voltar para a sala
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fechar(() => onAcertou(salaId))}
              className="btn-primario min-h-11 rounded-xl px-5 font-semibold active:scale-[.98]"
              style={{ background: 'var(--hotspot)', color: 'var(--marca-tela)' }}
            >
              {jaConcluido ? 'Voltar para a sala' : 'Montar a peça'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizPainel
