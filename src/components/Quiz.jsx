import { useState } from 'react'

function Quiz({ quiz, acertou, onAcerto }) {
  const [selecionada, setSelecionada] = useState(null)
  const [errou, setErrou] = useState(false)

  function responder(indice) {
    if (acertou) return
    setSelecionada(indice)
    if (indice === quiz.correta) {
      setErrou(false)
      onAcerto()
    } else {
      setErrou(true)
    }
  }

  return (
    <div className="rounded-lg border border-[var(--acento)]/30 bg-[var(--card)] p-4 text-[var(--texto)]">
      <p className="mb-3 font-semibold text-[var(--titulo)]">{quiz.pergunta}</p>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={quiz.pergunta}>
        {quiz.alternativas.map((alternativa, indice) => {
          const ehSelecionada = selecionada === indice
          const ehCorreta = acertou && indice === quiz.correta
          return (
            <button
              key={alternativa}
              type="button"
              role="radio"
              aria-checked={ehSelecionada}
              disabled={acertou}
              onClick={() => responder(indice)}
              className={[
                'min-h-11 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                ehCorreta
                  ? 'border-emerald-400 bg-emerald-500/20'
                  : ehSelecionada
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-[var(--acento)]/20 bg-[var(--card)] hover:bg-[var(--acento)]/10',
              ].join(' ')}
            >
              {alternativa}
            </button>
          )
        })}
      </div>

      {errou && !acertou && (
        <p className="mt-3 rounded-md bg-amber-100 p-3 text-sm text-amber-900">💡 {quiz.dica}</p>
      )}

      {acertou && (
        <p className="mt-3 rounded-md bg-emerald-100 p-3 text-sm text-emerald-900">
          ✅ {quiz.explicacao}
        </p>
      )}
    </div>
  )
}

export default Quiz
