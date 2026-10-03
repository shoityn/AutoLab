function Recepcao({ temProgresso, onIniciar, onContinuar, onRecomecar }) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-bold">AutoLab</h1>
      <p className="max-w-md text-balance opacity-90">
        Você é o novo operador da AutoLab, a fábrica onde se constrói um modelo de inteligência
        artificial do zero. Percorra as estações da esteira, responda ao quiz de cada uma e monte
        o robô até a expedição.
      </p>

      {temProgresso ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onContinuar}
            className="min-h-11 rounded-md bg-emerald-500 px-6 py-2 font-semibold text-black"
          >
            Continuar do ponto onde parou
          </button>
          <button
            type="button"
            onClick={onRecomecar}
            className="min-h-11 rounded-md border border-white/30 px-6 py-2 font-semibold"
          >
            Recomeçar turno
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onIniciar}
          className="min-h-11 rounded-md bg-emerald-500 px-8 py-2 font-semibold text-black"
        >
          Iniciar turno
        </button>
      )}
    </section>
  )
}

export default Recepcao
