function Card({ titulo, texto }) {
  return (
    <article className="rounded-lg border border-[var(--acento)]/30 bg-[var(--card)] p-4 text-[var(--texto)]">
      <h3 className="mb-1 font-semibold text-[var(--titulo)]">{titulo}</h3>
      <p className="text-sm opacity-90">{texto}</p>
    </article>
  )
}

export default Card
