import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import estacoes from './data/estacoes.json'
import { EXPEDICAO, useJogo } from './hooks/useJogo'
import { MUNDO, ehRetrato, pontoParaTela, useCamera } from './hooks/useCamera'
import { aplicarAmbiente } from './hooks/useAmbiente'
import { registrarEstacaoConcluida, registrarFim } from './lib/metricas'
import { abrirPortao, transicaoEntreCenas } from './lib/transicoes'
import { PECAS } from './lib/assets'
import { FACHADA } from './lib/coordenadas'

import Viewport from './components/Viewport'
import Mundo from './components/Mundo'
import Fachada from './components/Fachada'
import Sala from './components/Sala'
import Hotspot from './components/Hotspot'
import CardPainel from './components/CardPainel'
import QuizPainel from './components/QuizPainel'
import Hud from './components/Hud'
import Recepcao from './components/Recepcao'
import Expedicao from './components/Expedicao'
import GirarCelular from './components/GirarCelular'

gsap.registerPlugin(useGSAP)

if (import.meta.env.DEV) {
  // Ajuda a depurar com a aba em segundo plano (o navegador throttla o rAF).
  window.gsap = gsap
  gsap.ticker.lagSmoothing(0)
}

const SALAS = [...estacoes].sort((a, b) => a.ordem - b.ordem)
const TOTAL_PECAS = PECAS.length
const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1'

function reduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function cardsDaSala(sala) {
  return sala.hotspots.filter((h) => h.tipo === 'card')
}

function todosCardsLidos(sala, lidos) {
  return cardsDaSala(sala).every((h) => lidos.includes(h.id))
}

/**
 * Retângulo de onde o painel "nasce": o objeto está no centro da tela depois que
 * a câmera chegou nele, e o tamanho aparente cresce com o zoom. Ver seção 6.4.
 */
function origemDoPainel(hotspot, tela) {
  const centro = pontoParaTela(hotspot, hotspot, tela.vw, tela.vh)
  const lado = Math.min(220, 110 * hotspot.zoom)
  return { left: centro.left - lado / 2, top: centro.top - lado / 2, width: lado, height: lado }
}

function Jogo({ jogo }) {
  const { estado, dispatch, recomecar, temProgresso } = jogo

  const viewportRef = useRef(null)
  const mundoARef = useRef(null)
  const mundoBRef = useRef(null)
  const portaoRef = useRef(null)
  const hotspotRefs = useRef({})
  const origemRef = useRef(null)
  const cenaPosicionadaRef = useRef(null)
  const avisoTimeoutRef = useRef(null)

  // Tamanho real do viewport. Em celular `100dvh` nem sempre bate com
  // `innerHeight`, e a câmera e o overlay de hotspots precisam da MESMA medida,
  // senão os anéis param deslocados em relação aos objetos.
  const [tela, setTela] = useState(() => ({ vw: window.innerWidth, vh: window.innerHeight }))
  const [aviso, setAviso] = useState(null)
  const [debugToque, setDebugToque] = useState(null)

  const camera = useCamera(viewportRef, mundoARef)
  const { contextSafe } = useGSAP({ scope: viewportRef })

  const naFachada =
    estado.estado === 'recepcao' || (estado.estado === 'transicao' && estado.origemTransicao === 'fachada')
  const sala = SALAS[estado.salaAtual] ?? SALAS[0]
  const emTransicao = estado.estado === 'transicao'
  const salaDestino = emTransicao && estado.destino !== EXPEDICAO ? SALAS[estado.destino] : null
  const cenaId = naFachada ? 'fachada' : sala.id

  const hotspotAtivo = estado.hotspotAtivo ? sala.hotspots.find((h) => h.id === estado.hotspotAtivo) : null
  const saidaLiberada = estado.quizzes.includes(sala.id)
  const cards = cardsDaSala(sala)
  const lidosNaSala = cards.filter((h) => estado.lidos.includes(h.id)).length
  const pecas = SALAS.filter((s) => estado.quizzes.includes(s.id)).map((s) => s.peca)

  const mostrarAviso = useCallback((texto) => {
    setAviso(texto)
    window.clearTimeout(avisoTimeoutRef.current)
    avisoTimeoutRef.current = window.setTimeout(() => setAviso(null), 2400)
  }, [])

  useEffect(() => () => window.clearTimeout(avisoTimeoutRef.current), [])

  // Cor do ambiente da cena atual (a fachada usa o Ambiente 1).
  useEffect(() => {
    aplicarAmbiente(naFachada ? 1 : sala.ambiente, { animado: true })
  }, [naFachada, sala.ambiente])

  // Ao trocar de cena no slot A, o enquadramento vai direto para a visão geral,
  // antes do paint, para não piscar a cena em escala 1:1.
  useLayoutEffect(() => {
    if (!mundoARef.current) return
    if (cenaPosicionadaRef.current === cenaId) return
    cenaPosicionadaRef.current = cenaId
    gsap.set(mundoARef.current, { ...camera.enquadrar(camera.visaoGeral()), autoAlpha: 1 })
  }, [cenaId, camera])

  // Mede o viewport de verdade e reenquadra ao girar o aparelho / redimensionar.
  useLayoutEffect(() => {
    function medir() {
      const el = viewportRef.current
      if (!el) return
      const { width, height } = el.getBoundingClientRect()
      setTela((atual) => (atual.vw === width && atual.vh === height ? atual : { vw: width, vh: height }))
    }

    function aoRedimensionar() {
      medir()
      if (estado.estado === 'visao-geral' || estado.estado === 'recepcao') {
        camera.ir(camera.visaoGeral(), { duracao: 0 })
      } else {
        camera.reenquadrar()
      }
    }

    medir()
    window.addEventListener('resize', aoRedimensionar)
    window.addEventListener('orientationchange', aoRedimensionar)
    return () => {
      window.removeEventListener('resize', aoRedimensionar)
      window.removeEventListener('orientationchange', aoRedimensionar)
    }
  }, [estado.estado, camera])

  // Volta para a visão geral ao sair de um painel.
  useEffect(() => {
    if (estado.estado !== 'visao-geral') return undefined
    const tl = camera.ir(camera.visaoGeral())
    return () => tl.kill()
  }, [estado.estado, estado.hotspotAtivo, camera])

  // Foco: câmera vai até o hotspot tocado e, ao chegar, abre o painel.
  useEffect(() => {
    if (estado.estado !== 'foco' || !hotspotAtivo) return undefined
    const tl = camera.ir(hotspotAtivo, {
      onComplete: () => dispatch({ type: 'FOCO_PRONTO', tipo: hotspotAtivo.tipo }),
    })
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.estado, estado.hotspotAtivo])

  // Transições de câmera entre cenas (PLANO.md seções 4.4 e 6.6).
  useEffect(() => {
    if (estado.estado !== 'transicao') return undefined

    const concluir = () => dispatch({ type: 'TRANSICAO_CONCLUIDA' })
    const mundoA = mundoARef.current
    const mundoB = mundoBRef.current
    let tl

    if (estado.origemTransicao === 'fachada') {
      // Portão enrola para cima e a câmera mergulha pelo vão até a Sala 1.
      const geral = camera.visaoGeral()
      const perto = { ...FACHADA.centroPortao, zoom: 1.5 }
      const dentro = { ...FACHADA.centroPortao, zoom: FACHADA.aproximacaoPortao }
      const d = reduzido() ? 0 : 1

      tl = gsap.timeline({ onComplete: concluir })
      tl.add(abrirPortao(portaoRef.current))
        .to(mundoA, { ...camera.enquadrar(perto), duration: 0.75 * d, ease: 'power2.inOut' })
        .to(mundoA, { ...camera.enquadrar(dentro), duration: 0.8 * d, ease: 'power2.in' })
        .to(mundoA, { autoAlpha: 0, duration: 0.3 * d }, `>-${0.3 * d}`)
        .fromTo(
          mundoB,
          { ...camera.enquadrar({ ...geral, zoom: geral.zoom * 0.62 }), autoAlpha: 0 },
          { ...camera.enquadrar(geral), autoAlpha: 1, duration: 0.9 * d, ease: 'power3.out' },
          `>-${0.15 * d}`,
        )
    } else if (estado.destino === EXPEDICAO) {
      // Última sala: mergulha pela doca e entrega a tela final.
      const d = reduzido() ? 0 : 1
      tl = gsap.timeline({ onComplete: concluir })
      tl.to(mundoA, { ...camera.enquadrar(sala.saida), duration: 0.8 * d, ease: 'power2.inOut' })
        .to(
          mundoA,
          { ...camera.enquadrar({ ...sala.saida, zoom: sala.saida.zoom * 4 }), duration: 0.7 * d, ease: 'power2.in' },
        )
        .to(mundoA, { autoAlpha: 0, duration: 0.3 * d }, `>-${0.3 * d}`)
    } else {
      tl = transicaoEntreCenas({
        enquadrar: camera.enquadrar,
        visaoGeral: camera.visaoGeral,
        mundoAtual: mundoA,
        mundoProximo: mundoB,
        saida: sala.saida,
        aoTerminar: concluir,
      })
    }

    return () => tl?.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.estado, estado.origemTransicao, estado.destino])

  const tocarHotspot = contextSafe((hotspot) => {
    if (estado.estado !== 'visao-geral') return

    if (hotspot.tipo === 'quiz' && !todosCardsLidos(sala, estado.lidos)) {
      mostrarAviso('Leia todos os registros desta sala primeiro.')
      return
    }

    origemRef.current = origemDoPainel(hotspot, tela)
    dispatch({ type: 'TOCAR_HOTSPOT', id: hotspot.id })
  })

  const tocarSaida = contextSafe(() => {
    if (estado.estado !== 'visao-geral') return
    if (!saidaLiberada) {
      mostrarAviso('Responda ao registro final desta sala antes de seguir.')
      return
    }
    dispatch({ type: 'TOCAR_SAIDA', total: SALAS.length })
  })

  function aoTocarDebug(evento) {
    if (!DEBUG) return
    const geral = camera.visaoGeral()
    const vw = window.innerWidth
    const vh = window.innerHeight
    setDebugToque({
      x: Math.round((evento.clientX - vw / 2) / geral.zoom + MUNDO.largura / 2),
      y: Math.round((evento.clientY - vh / 2) / geral.zoom + MUNDO.altura / 2),
    })
  }

  const overlayVisivel = estado.estado === 'visao-geral'
  const geral = camera.visaoGeral()

  return (
    <Viewport ref={viewportRef} onPointerDown={DEBUG ? aoTocarDebug : undefined}>
      <Mundo ref={mundoARef} key={cenaId} tela={tela}>
        {naFachada ? (
          <Fachada portaoRef={portaoRef} />
        ) : (
          <Sala estacao={sala} lidos={estado.lidos} saidaLiberada={saidaLiberada} />
        )}
        {DEBUG && <GradeDebug />}
      </Mundo>

      {salaDestino && (
        <Mundo ref={mundoBRef} key={`destino-${salaDestino.id}`} tela={tela}>
          <Sala estacao={salaDestino} lidos={estado.lidos} saidaLiberada={false} />
        </Mundo>
      )}

      {estado.estado === 'recepcao' && (
        <Recepcao
          temProgresso={temProgresso}
          onIniciar={() => dispatch({ type: 'INICIAR' })}
          onContinuar={() => dispatch({ type: 'CONTINUAR' })}
          onRecomecar={recomecar}
        />
      )}

      {!naFachada && (
        <>
          {sala.hotspots.map((hotspot) => {
            const pos = pontoParaTela(hotspot, geral, tela.vw, tela.vh)
            const lido = estado.lidos.includes(hotspot.id)
            const estadoVisual =
              hotspot.tipo === 'quiz'
                ? todosCardsLidos(sala, estado.lidos)
                  ? estado.quizzes.includes(sala.id)
                    ? 'lido'
                    : 'liberado'
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
                oculto={!overlayVisivel}
                onClick={() => tocarHotspot(hotspot)}
              />
            )
          })}

          <Hotspot
            x={pontoParaTela(sala.saida, geral, tela.vw, tela.vh).left}
            y={pontoParaTela(sala.saida, geral, tela.vw, tela.vh).top}
            rotulo={sala.saida.rotulo}
            estadoVisual={saidaLiberada ? 'saida' : 'trancado'}
            oculto={!overlayVisivel}
            onClick={tocarSaida}
          />

          <Hud
            rotuloSala={sala.rotuloSala}
            titulo={sala.titulo}
            lidosCount={lidosNaSala}
            totalCards={cards.length}
            pecas={pecas}
            totalPecas={TOTAL_PECAS}
            onRecomecar={recomecar}
          />
        </>
      )}

      {estado.estado === 'card' && hotspotAtivo && (
        <CardPainel
          hotspot={hotspotAtivo}
          origem={origemRef.current}
          jaLido={estado.lidos.includes(hotspotAtivo.id)}
          onEntendi={(id) => dispatch({ type: 'ENTENDI', id })}
          onFechar={() => dispatch({ type: 'FECHAR' })}
        />
      )}

      {estado.estado === 'quiz' && hotspotAtivo && (
        <QuizPainel
          hotspot={hotspotAtivo}
          salaId={sala.id}
          origem={origemRef.current}
          jaConcluido={estado.quizzes.includes(sala.id)}
          onAcertou={(salaId) => {
            dispatch({ type: 'QUIZ_ACERTOU', salaId })
            registrarEstacaoConcluida(salaId)
            if (estado.salaAtual === SALAS.length - 1) registrarFim()
          }}
          onFechar={() => dispatch({ type: 'FECHAR' })}
        />
      )}

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-6">
        {aviso && (
          <p
            className="rounded-full px-4 py-2 text-sm shadow-lg"
            style={{ background: 'color-mix(in srgb, var(--marca-tela) 92%, transparent)', color: '#fff' }}
          >
            {aviso}
          </p>
        )}
      </div>

      {DEBUG && (
        <div className="pointer-events-none fixed bottom-3 left-3 z-40 rounded-md bg-black/80 px-3 py-2 font-mono text-xs text-emerald-300">
          mundo {MUNDO.largura}x{MUNDO.altura} · zoom {geral.zoom.toFixed(3)}
          {debugToque && ` · toque x:${debugToque.x} y:${debugToque.y}`}
        </div>
      )}
    </Viewport>
  )
}

function GradeDebug() {
  const verticais = []
  const horizontais = []
  for (let x = 0; x <= MUNDO.largura; x += 120) verticais.push(x)
  for (let y = 0; y <= MUNDO.altura; y += 120) horizontais.push(y)

  return (
    <div className="pointer-events-none absolute inset-0" data-profundidade="1">
      {verticais.map((x) => (
        <div key={`v${x}`} className="absolute top-0 h-full w-px bg-red-500/40" style={{ left: x }}>
          <span className="absolute left-1 top-1 font-mono text-[11px] text-red-300">{x}</span>
        </div>
      ))}
      {horizontais.map((y) => (
        <div key={`h${y}`} className="absolute left-0 h-px w-full bg-red-500/40" style={{ top: y }}>
          <span className="absolute left-1 top-1 font-mono text-[11px] text-red-300">{y}</span>
        </div>
      ))}
    </div>
  )
}

function App() {
  const jogo = useJogo()
  const [retrato, setRetrato] = useState(() => ehRetrato())
  const [ignorarRetrato, setIgnorarRetrato] = useState(false)

  useEffect(() => {
    const avaliar = () => setRetrato(ehRetrato())
    window.addEventListener('resize', avaliar)
    window.addEventListener('orientationchange', avaliar)
    return () => {
      window.removeEventListener('resize', avaliar)
      window.removeEventListener('orientationchange', avaliar)
    }
  }, [])

  if (retrato && !ignorarRetrato) {
    return <GirarCelular onJogarAssimMesmo={() => setIgnorarRetrato(true)} />
  }

  if (jogo.estado.estado === EXPEDICAO) {
    return <Expedicao onRecomecar={jogo.recomecar} />
  }

  return <Jogo jogo={jogo} />
}

export default App
