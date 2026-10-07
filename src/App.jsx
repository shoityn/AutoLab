import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { EXPEDICAO, useJogo } from './hooks/useJogo'
import {
  ALTURA_PAINEL_LATERAL,
  MUNDO,
  alvoDe,
  pontoParaTela,
  prefereMovimentoReduzido,
  useCamera,
} from './hooks/useCamera'
import { useOrientacao, tentarPaisagem } from './hooks/useOrientacao'
import { aplicarAmbiente } from './hooks/useAmbiente'
import { registrarEstacaoConcluida, registrarFim } from './lib/metricas'
import { abrirPortao } from './lib/transicoes'
import { PECAS } from './lib/assets'
import { ABERTURA, SALAS, TOTAL_SALAS, cardsDaSala, salaPorIndice } from './lib/conteudo'
import { precarregarEmSegundoPlano } from './lib/precarregar'

import Viewport from './components/Viewport'
import Mundo from './components/Mundo'
import Preloader from './components/Preloader'
import Fachada from './components/Fachada'
import PainelFachada from './components/PainelFachada'
import Sala from './components/Sala'
import Hotspot from './components/Hotspot'
import Passagem from './components/Passagem'
import CardPainel from './components/CardPainel'
import QuizPainel from './components/QuizPainel'
import Hud from './components/Hud'
import Expedicao from './components/Expedicao'
import AvisoOrientacao from './components/AvisoOrientacao'

gsap.registerPlugin(useGSAP)

if (import.meta.env.DEV) {
  // Ajuda a depurar com a aba em segundo plano (o navegador throttla o rAF).
  window.gsap = gsap
  gsap.ticker.lagSmoothing(0)
}

const TOTAL_PECAS = PECAS.length
const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1'

function todosCardsLidos(sala, lidos) {
  return cardsDaSala(sala).every((h) => lidos.includes(h.id))
}

/** Parallax do PC: só com mouse de verdade e sem movimento reduzido. Seção 6.3. */
function temParallax() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefereMovimentoReduzido()
}

function Jogo({ jogo }) {
  const { estado, dispatch, recomecar, temProgresso } = jogo

  const viewportRef = useRef(null)
  const mundoARef = useRef(null)
  const portaoRef = useRef(null)
  const logoRef = useRef(null)
  const zinosRef = useRef(null)
  const frenteRef = useRef(null)
  const origemRef = useRef(null)
  const cenaPosicionadaRef = useRef(null)
  const avisoTimeoutRef = useRef(null)

  const [tela, setTela] = useState(() => ({ vw: window.innerWidth, vh: window.innerHeight }))
  const [aviso, setAviso] = useState(null)
  const [falaVisivel, setFalaVisivel] = useState(true)
  const [debugToque, setDebugToque] = useState(null)

  const camera = useCamera(viewportRef, mundoARef)
  const { contextSafe } = useGSAP({ scope: viewportRef })

  const naFachada =
    estado.estado === 'fachada' || (estado.estado === 'transicao' && estado.origemTransicao === 'fachada')
  const sala = salaPorIndice(estado.salaAtual)
  const emTransicao = estado.estado === 'transicao'
  const cenaId = naFachada ? 'fachada' : sala.id

  const hotspotAtivo = estado.hotspotAtivo ? sala.hotspots.find((h) => h.id === estado.hotspotAtivo) : null
  const saidaLiberada = estado.quizzes.includes(sala.id)
  const cards = cardsDaSala(sala)
  const lidosNaSala = cards.filter((h) => estado.lidos.includes(h.id)).length
  const pecas = SALAS.filter((s) => estado.quizzes.includes(s.id)).map((s) => s.peca)

  // Painel lateral só no deitado com pouca altura; no PC e em retrato é centralizado.
  const painelLateral = tela.vh <= ALTURA_PAINEL_LATERAL && tela.vw / tela.vh >= 1.2
  const ladoPainel = hotspotAtivo && hotspotAtivo.x < MUNDO.largura / 2 ? 'direita' : 'esquerda'

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

  // A fala de entrada reaparece a cada sala nova.
  useEffect(() => {
    setFalaVisivel(true)
  }, [sala.id])

  // Ao trocar a cena do slot, o enquadramento vai direto para a visão geral,
  // antes do paint, para não piscar a cena em escala 1:1.
  useLayoutEffect(() => {
    if (!mundoARef.current) return
    if (cenaPosicionadaRef.current === cenaId) return
    cenaPosicionadaRef.current = cenaId
    gsap.set(mundoARef.current, { ...camera.enquadrar(camera.visaoGeral()), opacity: 1 })
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
      if (estado.estado === 'visao-geral' || estado.estado === 'fachada') {
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

  // Foco: câmera vai até o hotspot e, ao chegar, o painel abre.
  useEffect(() => {
    if (estado.estado !== 'foco' || !hotspotAtivo) return undefined
    const tl = camera.ir(camera.alvo(hotspotAtivo), {
      ancoraX: estado.ancoraPainel,
      onComplete: () => dispatch({ type: 'FOCO_PRONTO', tipo: hotspotAtivo.tipo }),
    })
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.estado, estado.hotspotAtivo])

  // Parallax do PC: o mouse move a camada de frente ±12 px e a cena ±4 px.
  useEffect(() => {
    if (!temParallax()) return undefined
    if (estado.estado !== 'visao-geral' && estado.estado !== 'fachada') return undefined

    const mundo = mundoARef.current
    const frente = frenteRef.current
    if (!mundo) return undefined

    const moverCena = gsap.quickTo(mundo, 'xPercent', { duration: 0.6, ease: 'power2.out' })
    const moverFrente = frente ? gsap.quickTo(frente, 'x', { duration: 0.6, ease: 'power2.out' }) : null

    function aoMover(evento) {
      const dx = evento.clientX / window.innerWidth - 0.5
      moverCena(dx * 0.4)
      moverFrente?.(dx * -24)
    }

    window.addEventListener('pointermove', aoMover)
    return () => {
      window.removeEventListener('pointermove', aoMover)
      gsap.to(mundo, { xPercent: 0, duration: 0.3 })
      if (frente) gsap.to(frente, { x: 0, duration: 0.3 })
    }
  }, [estado.estado, sala.id])

  // Entrada na fábrica: portão enrola e a câmera mergulha pelo vão. Tabela D.
  useEffect(() => {
    if (estado.estado !== 'transicao' || estado.origemTransicao !== 'fachada') return undefined

    const mundo = mundoARef.current
    const d = prefereMovimentoReduzido() ? 0 : 1
    const alvoVao = alvoDe(ABERTURA.fachada.saida, tela.vw, tela.vh)

    const tl = gsap.timeline({ onComplete: () => dispatch({ type: 'TRANSICAO_CONCLUIDA' }) })
    tl.to([logoRef.current, zinosRef.current], { opacity: 0, duration: 0.25 * d }, 0)
      .add(abrirPortao(portaoRef.current), 0.2 * d)
      .to(mundo, { ...camera.enquadrar(alvoVao), duration: 0.6 * d, ease: 'power2.in' }, 0.9 * d)
      .to(mundo, { opacity: 0, duration: 0.25 * d }, `>-${0.25 * d}`)

    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.estado, estado.origemTransicao])

  // Saída da sala: a câmera vai até a saída e a <Passagem> assume.
  useEffect(() => {
    if (estado.estado !== 'transicao' || estado.origemTransicao !== 'saida') return undefined
    const tl = camera.ir(camera.alvo(sala.saida), { duracao: 0.6, ease: 'power2.in' })
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.estado, estado.origemTransicao])

  // A sala nova chega em visão geral depois que a passagem cobre a tela.
  useLayoutEffect(() => {
    if (!estado.trocou || !mundoARef.current) return
    if (prefereMovimentoReduzido()) {
      gsap.set(mundoARef.current, { ...camera.enquadrar(camera.visaoGeral()), opacity: 1, scale: undefined })
      return
    }
    const alvo = camera.enquadrar(camera.visaoGeral())
    gsap.fromTo(
      mundoARef.current,
      { ...alvo, scale: alvo.scale * 1.12, opacity: 0 },
      { ...alvo, opacity: 1, duration: 0.5, ease: 'power2.out' },
    )
  }, [estado.trocou, estado.salaAtual, camera])

  const tocarHotspot = contextSafe((hotspot) => {
    if (estado.estado !== 'visao-geral') return

    if (hotspot.tipo === 'quiz' && !todosCardsLidos(sala, estado.lidos)) {
      mostrarAviso('Leia todos os registros desta sala primeiro.')
      return
    }

    const lado = painelLateral ? (hotspot.x < MUNDO.largura / 2 ? 0.225 : 0.775) : 0.5
    const centro = pontoParaTela(hotspot, camera.alvo(hotspot), tela.vw, tela.vh, lado)
    const ladoPx = Math.min(220, 110 * (hotspot.aproximacao ?? 2))
    origemRef.current = {
      left: centro.left - ladoPx / 2,
      top: centro.top - ladoPx / 2,
      width: ladoPx,
      height: ladoPx,
    }
    setFalaVisivel(false)
    dispatch({ type: 'TOCAR_HOTSPOT', id: hotspot.id, ancoraX: lado })
  })

  const tocarSaida = contextSafe(() => {
    if (estado.estado !== 'visao-geral') return
    if (!saidaLiberada) {
      mostrarAviso('Responda ao registro final desta sala antes de seguir.')
      return
    }
    dispatch({ type: 'TOCAR_SAIDA' })
  })

  function aoTocarDebug(evento) {
    if (!DEBUG) return
    const geral = camera.visaoGeral()
    setDebugToque({
      x: Math.round((evento.clientX - tela.vw / 2) / geral.zoom + MUNDO.largura / 2),
      y: Math.round((evento.clientY - tela.vh / 2) / geral.zoom + MUNDO.altura / 2),
    })
  }

  async function iniciar(acao) {
    await tentarPaisagem()
    dispatch({ type: acao })
  }

  const overlayVisivel = estado.estado === 'visao-geral'
  const geral = camera.visaoGeral()
  const expressaoHud = saidaLiberada ? 'feliz' : lidosNaSala === cards.length ? 'indicando' : 'neutro'

  return (
    <Viewport ref={viewportRef} onPointerDown={DEBUG ? aoTocarDebug : undefined}>
      <Mundo ref={mundoARef} key={cenaId} tela={tela}>
        {naFachada ? (
          <Fachada portaoRef={portaoRef} logoRef={logoRef} zinosRef={zinosRef} />
        ) : (
          <Sala estacao={sala} lidos={estado.lidos} saidaLiberada={saidaLiberada} frenteRef={frenteRef} />
        )}
        {DEBUG && <GradeDebug />}
      </Mundo>

      {estado.estado === 'fachada' && (
        <PainelFachada
          temProgresso={temProgresso}
          pecas={pecas}
          serie={estado.serie}
          onIniciar={() => iniciar('INICIAR')}
          onContinuar={() => iniciar('CONTINUAR')}
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
            motivoTrancado="Responda ao registro final desta sala antes de seguir."
            oculto={!overlayVisivel}
            onClick={tocarSaida}
          />

          <Hud
            ordem={sala.ordem}
            titulo={sala.titulo}
            lidosCount={lidosNaSala}
            totalCards={cards.length}
            pecas={pecas}
            totalPecas={TOTAL_PECAS}
            serie={estado.serie}
            expressao={expressaoHud}
            fala={overlayVisivel && falaVisivel ? sala.fala : null}
            onDispensarFala={() => setFalaVisivel(false)}
            onRecomecar={recomecar}
          />
        </>
      )}

      {/* Passagem entre salas: cobre a tela, troca a sala no meio e libera no fim */}
      {emTransicao && estado.origemTransicao === 'saida' && (
        <Passagem
          key={`passagem-${sala.id}`}
          tipo={sala.saida.passagem}
          onMeio={() => dispatch({ type: 'TRANSICAO_MEIO' })}
          onFim={() => {
            if (estado.destino === EXPEDICAO) registrarFim()
            dispatch({ type: 'TRANSICAO_CONCLUIDA' })
          }}
        />
      )}

      {estado.estado === 'card' && hotspotAtivo && (
        <CardPainel
          hotspot={hotspotAtivo}
          origem={origemRef.current}
          lateral={painelLateral}
          lado={ladoPainel}
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
          lateral={painelLateral}
          lado={ladoPainel}
          jaConcluido={estado.quizzes.includes(sala.id)}
          onAcertou={(salaId) => {
            dispatch({ type: 'QUIZ_ACERTOU', salaId })
            registrarEstacaoConcluida(salaId)
          }}
          onFechar={() => dispatch({ type: 'FECHAR' })}
        />
      )}

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-6"
      >
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
          mundo {MUNDO.largura}×{MUNDO.altura} · base {geral.zoom.toFixed(3)}
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
    <div className="pointer-events-none absolute inset-0">
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
  const { retrato, mostrarAviso, ignorar } = useOrientacao()

  // Assim que a fachada aparece, o resto das salas carrega em segundo plano.
  useEffect(() => {
    if (jogo.estado.estado === 'fachada') precarregarEmSegundoPlano()
  }, [jogo.estado.estado])

  if (jogo.estado.estado === 'carregando') {
    return <Preloader onPronto={() => jogo.dispatch({ type: 'ASSETS_PRONTOS' })} />
  }

  return (
    <>
      {jogo.estado.estado === EXPEDICAO ? (
        <Expedicao serie={jogo.estado.serie} onRecomecar={jogo.recomecar} />
      ) : (
        <Jogo jogo={jogo} />
      )}

      {/* Camada por cima, não é estado da máquina (seção 5) */}
      {mostrarAviso && retrato && <AvisoOrientacao onContinuar={ignorar} />}
    </>
  )
}

export default App

export { TOTAL_SALAS }
