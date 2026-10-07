import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { aplicarAmbiente } from '../hooks/useAmbiente'
import { prefereMovimentoReduzido } from '../hooks/useCamera'
import { EXPEDICAO_TEXTOS, SALAS, preencher } from '../lib/conteudo'
import { PECAS, ZINOS_CORPO, asset } from '../lib/assets'
import CopiaRobo from './CopiaRobo'
import BalaoFala from './BalaoFala'
import BotaoSom from './BotaoSom'

const SITE_URL = import.meta.env.BASE_URL.startsWith('http')
  ? import.meta.env.BASE_URL
  : 'https://shoityn.github.io/AutoLab/'

const TODAS = PECAS.map((p) => p.id)
const CENA_FUNDO = SALAS[SALAS.length - 1].camadas.cena

/**
 * Tela final (doc 07, "Tela da Expedição"). Sem arte nova: o fundo é a própria
 * cena da Sala 5 com desfoque e véu escuro. A cópia aparece com a cabeça
 * desligada e liga 0,6 s depois.
 */
function Expedicao({ serie, onRecomecar }) {
  const [ligada, setLigada] = useState(() => prefereMovimentoReduzido())
  const [confirmando, setConfirmando] = useState(false)
  const [avisoCopia, setAvisoCopia] = useState('')
  const copiaRef = useRef(null)
  const flashRef = useRef(null)

  useEffect(() => {
    aplicarAmbiente(3)
  }, [])

  // A cópia entra, e a tela da cabeça acende com um flash ciano.
  useEffect(() => {
    if (prefereMovimentoReduzido()) return undefined

    const tl = gsap.timeline()
    tl.fromTo(
      copiaRef.current,
      { scale: 0.86, y: 18, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' },
    )
      .add(() => setLigada(true), '+=0.6')
      .fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.85, duration: 0.12 })
      .to(flashRef.current, { opacity: 0, duration: 0.45, ease: 'power2.out' })

    return () => tl.kill()
  }, [])

  async function compartilhar() {
    const texto = preencher(EXPEDICAO_TEXTOS.compartilharTexto, { serie })
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AutoLab', text: texto, url: SITE_URL })
        return
      } catch {
        // cancelou ou falhou: cai no fallback
      }
    }
    try {
      await navigator.clipboard.writeText(`${texto} ${SITE_URL}`)
      setAvisoCopia('Link copiado!')
    } catch {
      setAvisoCopia(SITE_URL)
    }
    window.setTimeout(() => setAvisoCopia(''), 2600)
  }

  const t = EXPEDICAO_TEXTOS

  return (
    <main className="fixed inset-0 overflow-y-auto" style={{ color: 'var(--texto)' }}>
      {/* Fundo: a Sala 5 desfocada sob um véu escuro */}
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <img
          src={asset(CENA_FUNDO)}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: 'blur(6px)', transform: 'scale(1.06)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(5,8,12,.6)' }} />
      </div>

      {/* A fanfarra toca na chegada: o mudo precisa estar ao alcance da mão. */}
      <div
        className="fixed z-20"
        style={{
          top: 'max(.75rem, env(safe-area-inset-top))',
          right: 'max(.75rem, env(safe-area-inset-right))',
        }}
      >
        <BotaoSom />
      </div>

      <div
        className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-4 px-5 py-8 text-center"
        style={{
          paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
          paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
          color: '#F1EBDD',
        }}
      >
        <div className="relative">
          <div ref={copiaRef}>
            <CopiaRobo pecas={TODAS} ligada={ligada} serie={serie} className="h-40 w-30" />
          </div>
          <div
            ref={flashRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, #67E8F9 0%, transparent 65%)', opacity: 0 }}
          />
        </div>

        <p
          className="font-mono text-[13px] tracking-[3px]"
          style={{ color: 'var(--marca-ciano)', fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
        >
          {serie}
        </p>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--marca-ciano)' }}>
          {t.titulo}
        </h1>

        <p className="max-w-lg text-sm leading-relaxed opacity-90">{preencher(t.texto, { serie })}</p>

        <div className="flex items-end gap-3">
          <img src={ZINOS_CORPO.acenando} alt="" aria-hidden="true" className="h-24 select-none" draggable="false" />
          <BalaoFala texto={t.falaZinos} semAvatar compacto className="max-w-xs text-left" />
        </div>

        {confirmando ? (
          <div
            className="w-full max-w-sm rounded-2xl border border-white/20 bg-black/40 p-3 backdrop-blur-sm"
            role="alertdialog"
            aria-label="Recomeçar o turno?"
          >
            <p className="text-sm">Apagar seu progresso e começar do zero?</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onRecomecar}
                className="min-h-11 flex-1 rounded-xl px-4 text-sm font-semibold"
                style={{ background: 'var(--acento)', color: '#fff' }}
              >
                Sim, recomeçar
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 rounded-xl border border-white/25 px-4 text-sm font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={compartilhar}
              className="min-h-11 rounded-xl px-6 font-semibold active:scale-[.98]"
              style={{ background: 'var(--marca-ciano)', color: 'var(--marca-tela)' }}
            >
              {t.compartilhar}
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="min-h-11 rounded-xl border border-white/30 px-6 font-semibold active:scale-[.98]"
            >
              {t.recomecar}
            </button>
          </div>
        )}

        <p aria-live="polite" className="h-4 text-xs opacity-80">
          {avisoCopia}
        </p>

        <footer className="mt-2 max-w-xl text-[11px] leading-relaxed opacity-70">{t.creditos}</footer>
      </div>
    </main>
  )
}

export default Expedicao
