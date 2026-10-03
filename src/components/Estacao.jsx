import { useState } from 'react'
import Card from './Card'
import Quiz from './Quiz'

function Estacao({ estacao, concluida, ultima, onConcluir, onAvancar }) {
  const [cardIndex, setCardIndex] = useState(0)
  const [fase, setFase] = useState(concluida ? 'quiz' : 'cards')

  const totalCards = estacao.cards.length
  const ultimoCard = cardIndex === totalCards - 1

  function irParaCard(indice) {
    setCardIndex(indice)
  }

  function proximoCard() {
    if (ultimoCard) {
      setFase('quiz')
    } else {
      setCardIndex((indice) => indice + 1)
    }
  }

  function cardAnterior() {
    setCardIndex((indice) => Math.max(0, indice - 1))
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-5 p-6">
      <h2 className="text-2xl font-bold text-[var(--titulo)]">
        {estacao.ordem}. {estacao.titulo}
      </h2>

      {fase === 'cards' && (
        <>
          <Card titulo={estacao.cards[cardIndex].titulo} texto={estacao.cards[cardIndex].texto} />

          <div className="flex justify-center gap-1" role="group" aria-label="Navegação de cards">
            {estacao.cards.map((card, indice) => (
              <button
                key={card.titulo}
                type="button"
                aria-label={`Ir para o card ${indice + 1} de ${totalCards}`}
                aria-current={indice === cardIndex}
                onClick={() => irParaCard(indice)}
                className="flex h-11 w-9 items-center justify-center"
              >
                <span
                  className={[
                    'h-2.5 w-2.5 rounded-full transition-colors',
                    indice === cardIndex ? 'bg-[var(--acento)]' : 'bg-[var(--acento)]/25',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={cardAnterior}
              disabled={cardIndex === 0}
              className="min-h-11 rounded-md border border-[var(--acento)]/30 px-4 py-2 text-sm font-medium text-[var(--texto)] disabled:opacity-30"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={proximoCard}
              className="min-h-11 rounded-md bg-[var(--acento)] px-4 py-2 text-sm font-semibold text-white"
            >
              {ultimoCard ? 'Ir para o quiz →' : 'Próximo →'}
            </button>
          </div>
        </>
      )}

      {fase === 'quiz' && (
        <>
          <Quiz quiz={estacao.quiz} acertou={concluida} onAcerto={() => onConcluir(estacao.id)} />

          {concluida ? (
            <button
              type="button"
              onClick={onAvancar}
              className="min-h-11 self-center rounded-md bg-emerald-500 px-6 py-2 font-semibold text-black"
            >
              {ultima ? 'Ir para a expedição →' : 'Próxima estação →'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setFase('cards')}
              className="min-h-11 self-start text-sm underline opacity-70"
            >
              ← Rever os cards
            </button>
          )}
        </>
      )}
    </section>
  )
}

export default Estacao
