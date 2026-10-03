function BarraProgresso({ total, concluidas }) {
  const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100)

  return (
    <div className="fixed inset-x-0 top-0 z-10 bg-black/40 px-4 py-2 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-sm items-center gap-3 text-xs text-white">
        <span className="whitespace-nowrap">
          {concluidas}/{total} estações
        </span>
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-white/20"
          role="progressbar"
          aria-valuenow={percentual}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-emerald-400 transition-[width] duration-500"
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default BarraProgresso
