import { useEffect } from 'react'
import { aplicarAmbiente } from '../hooks/useAmbiente'
import Robo from './Robo'

const URL_SITE = 'https://shoityn.github.io/AutoLab/'
const MENSAGEM_COMPARTILHAR = 'Acabei de montar meu robô na fábrica da AutoLab! Testa aí:'
const PECAS_COMPLETAS = ['base', 'tronco', 'nucleo', 'olhos', 'antena']

function compartilhar() {
  if (navigator.share) {
    navigator.share({ title: 'AutoLab', text: MENSAGEM_COMPARTILHAR, url: URL_SITE }).catch(() => {})
    return
  }
  const texto = encodeURIComponent(`${MENSAGEM_COMPARTILHAR} ${URL_SITE}`)
  window.open(`https://wa.me/?text=${texto}`, '_blank', 'noopener')
}

function Expedicao({ onRecomecar }) {
  useEffect(() => {
    aplicarAmbiente(3)
  }, [])

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center text-[var(--texto)]">
      <h1 className="text-3xl font-bold text-[var(--titulo)]">Turno concluído! 🤖</h1>

      <Robo pecas={PECAS_COMPLETAS} flutuante={false} />

      <p className="max-w-md opacity-90">
        Seu robô saiu da linha de montagem completo. Obrigado por percorrer a fábrica da AutoLab.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={compartilhar}
          className="min-h-11 rounded-md bg-emerald-500 px-6 py-2 font-semibold text-black"
        >
          Compartilhar
        </button>
        <button
          type="button"
          onClick={onRecomecar}
          className="min-h-11 rounded-md border border-[var(--acento)]/40 px-6 py-2 font-semibold"
        >
          Recomeçar turno
        </button>
      </div>

      <footer className="mt-6 text-xs opacity-60">
        <p>Equipe: Glauber Shoity Nakai, Kamilla Barros Silva e Wellington Henrique da Silva Lima</p>
        <p>Estágio Supervisionado (PACEX VIII) — UNIPAR, prof. Elyssandro Piffer</p>
      </footer>
    </section>
  )
}

export default Expedicao
