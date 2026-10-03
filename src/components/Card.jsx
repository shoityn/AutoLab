function Card({ titulo, texto }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="mb-1 font-semibold">{titulo}</h3>
      <p className="text-sm opacity-90">{texto}</p>
    </article>
  )
}

export default Card
