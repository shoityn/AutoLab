import { forwardRef } from 'react'
import Card from './Card'
import Quiz from './Quiz'

const Estacao = forwardRef(function Estacao({ estacao, desbloqueada, concluida, onConcluir }, ref) {
  if (!desbloqueada) {
    return (
      <section
        ref={ref}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-6 text-center text-[var(--texto)] opacity-40"
      >
        <h2 className="text-xl font-bold">
          {estacao.ordem}. {estacao.titulo}
        </h2>
        <p className="text-sm">🔒 Conclua a estação anterior para desbloquear</p>
      </section>
    )
  }

  return (
    <section id={estacao.id} ref={ref} className="flex min-h-screen flex-col justify-center gap-4 p-6">
      <h2 className="text-2xl font-bold text-[var(--titulo)]">
        {estacao.ordem}. {estacao.titulo}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {estacao.cards.map((card) => (
          <Card key={card.titulo} titulo={card.titulo} texto={card.texto} />
        ))}
      </div>

      <Quiz quiz={estacao.quiz} acertou={concluida} onAcerto={() => onConcluir(estacao.id)} />

      {concluida && (
        <p className="text-sm font-medium text-[var(--texto)] opacity-80">
          ✅ Estação concluída — role para a próxima.
        </p>
      )}
    </section>
  )
})

export default Estacao
