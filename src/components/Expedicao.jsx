import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { aplicarAmbiente } from '../hooks/useAmbiente'
import { MARCA, PECAS } from '../lib/assets'
import Robo from './Robo'
import { ZinosFala } from './Zinos'

const URL_SITE = 'https://shoityn.github.io/AutoLab/'
const MENSAGEM = 'Acabei de montar meu robô na fábrica da AutoLab e aprendi como um modelo de IA é treinado. Testa aí:'
const TODAS = PECAS.map((p) => p.id)

function compartilhar() {
  if (navigator.share) {
    navigator.share({ title: 'AutoLab', text: MENSAGEM, url: URL_SITE }).catch(() => {})
    return
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${MENSAGEM} ${URL_SITE}`)}`, '_blank', 'noopener')
}

function Expedicao({ onRecomecar }) {
  const roboRef = useRef(null)

  useEffect(() => {
    aplicarAmbiente(3)
  }, [])

  // O robô "acorda": a cabeça acende e ele dá um pulinho.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const tl = gsap.fromTo(
      roboRef.current,
      { scale: 0.86, y: 18, autoAlpha: 0 },
      { scale: 1, y: 0, autoAlpha: 1, duration: 0.9, ease: 'back.out(1.6)', delay: 0.15 },
    )
    return () => tl.kill()
  }, [])

  return (
    <main
      className="fixed inset-0 overflow-y-auto"
      style={{ background: 'var(--bg)', color: 'var(--texto)' }}
    >
      <div
        className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-5 px-5 py-8 text-center"
        style={{
          paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
          paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
        }}
      >
        <img src={MARCA.horizontalClaro} alt="AutoLab" className="h-8" draggable="false" />

        <div ref={roboRef}>
          <Robo pecas={TODAS} completo className="h-44 w-33" />
        </div>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--titulo)' }}>
          Turno concluído
        </h1>

        <ZinosFala expressao="feliz" compacto className="text-left">
          Ficou pronto! Você acompanhou o lote da doca de recebimento até a expedição: coleta, pré-processamento,
          treinamento, avaliação e entrega. É exatamente esse caminho que um modelo de machine learning percorre.
        </ZinosFala>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={compartilhar}
            className="min-h-11 rounded-xl px-6 font-semibold active:scale-[.98]"
            style={{ background: 'var(--acento)', color: '#fff' }}
          >
            Compartilhar
          </button>
          <button
            type="button"
            onClick={onRecomecar}
            className="min-h-11 rounded-xl border px-6 font-semibold active:scale-[.98]"
            style={{ borderColor: 'color-mix(in srgb, var(--texto) 35%, transparent)' }}
          >
            Recomeçar turno
          </button>
        </div>

        <footer className="mt-4 space-y-1 text-xs opacity-75">
          <p>
            <strong>Equipe:</strong> Glauber Shoity Nakai, Kamilla Barros Silva e Wellington Henrique da Silva Lima
          </p>
          <p>8º período de Sistemas de Informação</p>
          <p>Estágio Supervisionado (PACEX VIII) — UNIPAR, prof. Elyssandro Piffer</p>
        </footer>
      </div>
    </main>
  )
}

export default Expedicao
