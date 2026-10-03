import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import estacoes from './data/estacoes.json'
import { useJogo } from './hooks/useJogo'
import { useCamera, pontoParaTelaVisaoGeral } from './hooks/useCamera'
import { aplicarAmbiente } from './hooks/useAmbiente'
import { registrarEstacaoConcluida, registrarFim } from './lib/metricas'
import Recepcao from './components/Recepcao'
import Expedicao from './components/Expedicao'
import Viewport from './components/Viewport'
import Sala from './components/Sala'
import Hotspot from './components/Hotspot'
import CardPainel from './components/CardPainel'
import QuizPainel from './components/QuizPainel'
import Hud from './components/Hud'

gsap.registerPlugin(useGSAP)

if (import.meta.env.DEV) {
  // Ajuda a depurar com a aba em segundo plano (o navegador throttla o rAF e trava as animações).
  window.gsap = gsap
  gsap.ticker.lagSmoothing(0)
}

const estacoesOrdenadas = [...estacoes].sort((a, b) => a.ordem - b.ordem)
const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1'

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function encontrarHotspot(sala, id) {
  return sala.hotspots.find((hotspot) => hotspot.id === id) ?? null
}

function todosCardsLidos(sala, lidos) {
  return sala.hotspots.filter((h) => h.tipo === 'card').every((h) => lidos.includes(h.id))
}

function Jogo({ jogo }) {
  const { estado, dispatch, recomecar } = jogo
  const viewportRef = useRef(null)
  const mundoRef = useRef(null)
  const hotspotRefs = useRef({})
  const origemRef = useRef(null)
  const primeiraVezRef = useRef(true)
  const avisoTimeoutRef = useRef(null)
  const [, forcarAtualizacao] = useState(0)
  const [aviso, setAviso] = useState(null)
  const [debugToque, setDebugToque] = useState(null)

  const camera = useCamera(viewportRef, mundoRef)
  const { contextSafe } = useGSAP({ scope: viewportRef })

  const sala = estacoesOrdenadas[estado.salaAtual] ?? estacoesOrdenadas[0]
  const hotspotAtivo = estado.hotspotAtivo ? encontrarHotspot(sala, estado.hotspotAtivo) : null
  const saidaLiberada = estado.quizzes.includes(sala.id)
  const transicaoAtiva = estado.estado === 'transicao'

  // Reenquadra ao girar o celular / redimensionar.
  useEffect(() => {
    function aoRedimensionar() {
      if (estado.estado === 'visao-geral') {
        camera.ir(camera.visaoGeral(), { duracao: 0 })
      } else {
        camera.reenquadrar()
      }
      forcarAtualizacao((n) => n + 1)
    }
    window.addEventListener('resize', aoRedimensionar)
    window.addEventListener('orientationchange', aoRedimensionar)
    return () => {
      window.removeEventListener('resize', aoRedimensionar)
      window.removeEventListener('orientationchange', aoRedimensionar)
    }
  }, [estado.estado, camera])

  // Visão geral: ao entrar na sala ou voltar do foco.
  useEffect(() => {
    if (estado.estado !== 'visao-geral') return undefined
    const duracao = primeiraVezRef.current ? 0 : 1.2
    primeiraVezRef.current = false
    const tl = camera.ir(camera.visaoGeral(), { duracao })
    return () => tl.kill()
  }, [estado.estado, estado.salaAtual, camera])

  // Foco: câmera vai até o hotspot tocado.
  useEffect(() => {
    if (estado.estado !== 'foco' || !hotspotAtivo) return undefined
    const tl = camera.ir(hotspotAtivo, {
      onComplete: () => dispatch({ type: 'FOCO_PRONTO', tipo: hotspotAtivo.tipo }),
    })
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.estado, estado.hotspotAtivo])

  // Transição entre salas — crossfade simples na Fase A; vira a animação da seção 6.6 na Fase B.
  useEffect(() => {
    if (estado.estado !== 'transicao') return undefined
    const proximoIndex = estado.salaAtual + 1
    const atraso = prefereMovimentoReduzido() ? 0 : 450
    const temporizador = setTimeout(() => {
      if (proximoIndex < estacoesOrdenadas.length) {
        dispatch({ type: 'TRANSICAO_PARA_SALA', sala: proximoIndex })
      } else {
        registrarFim()
        dispatch({ type: 'IR_EXPEDICAO' })
      }
    }, atraso)
    return () => clearTimeout(temporizador)
  }, [estado.estado, estado.salaAtual, dispatch])

  // Cor do ambiente da sala atual.
  useEffect(() => {
    aplicarAmbiente(sala.ambiente, { animado: true })
  }, [sala.ambiente])

  function mostrarAviso(texto) {
    setAviso(texto)
    window.clearTimeout(avisoTimeoutRef.current)
    avisoTimeoutRef.current = window.setTimeout(() => setAviso(null), 2200)
  }

  const tocarHotspot = contextSafe((hotspot) => {
    if (estado.estado !== 'visao-geral') return

    if (hotspot.tipo === 'quiz' && !todosCardsLidos(sala, estado.lidos)) {
      mostrarAviso('Leia todos os registros desta sala primeiro.')
      return
    }

    const el = hotspotRefs.current[hotspot.id]
    origemRef.current = el ? el.getBoundingClientRect() : null
    dispatch({ type: 'TOCAR_HOTSPOT', id: hotspot.id })
  })

  const tocarSaida = contextSafe(() => {
    if (estado.estado !== 'visao-geral') return
    if (!saidaLiberada) {
      mostrarAviso('Conclua o registro desta sala antes de seguir.')
      return
    }
    dispatch({ type: 'TOCAR_SAIDA' })
  })

  function aoTocarViewportDebug(evento) {
    if (!DEBUG || estado.estado !== 'visao-geral') return
    const geral = camera.visaoGeral()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const x = Math.round((evento.clientX - vw / 2) / geral.zoom + 500)
    const y = Math.round((evento.clientY - vh / 2) / geral.zoom + 800)
    setDebugToque({ x, y })
  }

  const totalCards = sala.hotspots.filter((h) => h.tipo === 'card').length
  const lidosNaSala = sala.hotspots.filter((h) => h.tipo === 'card' && estado.lidos.includes(h.id)).length
  const pecas = estacoesOrdenadas.filter((e) => estado.quizzes.includes(e.id)).map((e) => e.peca)
  const posSaida = pontoParaTelaVisaoGeral(sala.saida)

  return (
    <Viewport ref={viewportRef}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        onClick={aoTocarViewportDebug}
        className={
          transicaoAtiva ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'
        }
      >
        <Sala ref={mundoRef} estacao={sala} lidos={estado.lidos} saidaLiberada={saidaLiberada} />

        {DEBUG && <GradeDebug />}
      </div>

      {estado.estado === 'visao-geral' && (
        <>
          {sala.hotspots.map((hotspot) => {
            const pos = pontoParaTelaVisaoGeral(hotspot)
            const lido = estado.lidos.includes(hotspot.id)
            const estadoVisual =
              hotspot.tipo === 'quiz'
                ? todosCardsLidos(sala, estado.lidos)
                  ? 'liberado'
                  : 'trancado'
                : lido
                  ? 'lido'
                  : 'novo'
            return (
              <Hotspot
                key={hotspot.id}
                ref={(el) => {
                  hotspotRefs.current[hotspot.id] = el
                }}
                x={pos.left}
                y={pos.top}
                rotulo={hotspot.rotulo}
                estadoVisual={estadoVisual}
                onClick={() => tocarHotspot(hotspot)}
              />
            )
          })}

          <Hotspot
            x={posSaida.left}
            y={posSaida.top}
            rotulo={sala.saida.rotulo}
            estadoVisual={saidaLiberada ? 'liberado' : 'trancado'}
            icone={saidaLiberada ? '→' : undefined}
            onClick={tocarSaida}
          />
        </>
      )}

      <Hud titulo={sala.titulo} lidosCount={lidosNaSala} totalCards={totalCards} pecas={pecas} onRecomecar={recomecar} />

      {estado.estado === 'card' && hotspotAtivo && (
        <CardPainel
          hotspot={hotspotAtivo}
          origem={origemRef.current}
          onEntendi={(id) => dispatch({ type: 'ENTENDI', id })}
          onFechar={() => dispatch({ type: 'FECHAR' })}
        />
      )}

      {estado.estado === 'quiz' && hotspotAtivo && (
        <QuizPainel
          hotspot={hotspotAtivo}
          salaId={sala.id}
          origem={origemRef.current}
          onAcertou={(salaId) => {
            dispatch({ type: 'QUIZ_ACERTOU', salaId })
            registrarEstacaoConcluida(salaId)
          }}
          onFechar={() => dispatch({ type: 'FECHAR' })}
        />
      )}

      {aviso && (
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-6">
          <p className="rounded-full bg-black/80 px-4 py-2 text-sm text-white">{aviso}</p>
        </div>
      )}

      {DEBUG && debugToque && (
        <div className="pointer-events-none fixed bottom-4 left-4 z-40 rounded-md bg-black/80 px-3 py-2 font-mono text-xs text-emerald-300">
          x: {debugToque.x} · y: {debugToque.y}
        </div>
      )}
    </Viewport>
  )
}

function GradeDebug() {
  const linhas = []
  for (let x = 0; x <= 1000; x += 100) linhas.push({ tipo: 'v', pos: x })
  for (let y = 0; y <= 1600; y += 100) linhas.push({ tipo: 'h', pos: y })

  return (
    <div className="pointer-events-none absolute inset-0" data-profundidade="1">
      {linhas.map((linha) =>
        linha.tipo === 'v' ? (
          <div key={`v${linha.pos}`} className="absolute top-0 h-full w-px bg-red-500/30" style={{ left: linha.pos }} />
        ) : (
          <div key={`h${linha.pos}`} className="absolute left-0 h-px w-full bg-red-500/30" style={{ top: linha.pos }} />
        ),
      )}
    </div>
  )
}

function App() {
  const jogo = useJogo()
  const { estado, dispatch, recomecar, temProgresso } = jogo

  function iniciar() {
    dispatch({ type: 'INICIAR' })
  }

  function continuar() {
    dispatch({ type: 'CONTINUAR' })
  }

  if (estado.estado === 'recepcao') {
    return <Recepcao temProgresso={temProgresso} onIniciar={iniciar} onContinuar={continuar} onRecomecar={recomecar} />
  }

  if (estado.estado === 'expedicao') {
    return <Expedicao onRecomecar={recomecar} />
  }

  return <Jogo jogo={jogo} />
}

export default App
