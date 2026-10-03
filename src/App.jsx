import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import estacoes from './data/estacoes.json'
import { useProgresso } from './hooks/useProgresso'
import { useAmbienteScroll } from './hooks/useAmbiente'
import { registrarEstacaoConcluida, registrarFim } from './lib/metricas'
import { suporta3D } from './three/suporte3D'
import Recepcao from './components/Recepcao'
import Estacao from './components/Estacao'
import BarraProgresso from './components/BarraProgresso'
import Expedicao from './components/Expedicao'
import Robo from './components/Robo'

gsap.registerPlugin(ScrollTrigger)

const estacoesOrdenadas = [...estacoes].sort((a, b) => a.ordem - b.ordem)
const CenaFabrica = lazy(() => import('./three/CenaFabrica'))

function JogoEsteira({ concluidas, onConcluir }) {
  const refsSecoes = useRef(estacoesOrdenadas.map(() => ({ current: null })))
  const fundoRef = useRef(null)
  const [ambienteAtual, setAmbienteAtual] = useState(estacoesOrdenadas[0]?.ambiente ?? 1)
  const [modo3D, setModo3D] = useState(false)
  const [desempenhoBaixo, setDesempenhoBaixo] = useState(false)

  const usar3D = modo3D && !desempenhoBaixo

  useAmbienteScroll(
    estacoesOrdenadas.map((estacao, indice) => ({ ref: refsSecoes.current[indice], ambiente: estacao.ambiente })),
    setAmbienteAtual,
  )

  // Seções trocam de altura conforme desbloqueiam — recalcula os pontos de disparo do scroll.
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [concluidas.length])

  useEffect(() => {
    setModo3D(suporta3D())
  }, [])

  // Parallax leve em 2.5D — só roda quando o fundo 3D não está ativo.
  useEffect(() => {
    if (usar3D || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const contexto = gsap.context(() => {
      gsap.to(fundoRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
    })

    return () => contexto.revert()
  }, [usar3D])

  const pecas = estacoesOrdenadas.filter((estacao) => concluidas.includes(estacao.id)).map((estacao) => estacao.peca)

  return (
    <main className="relative pt-10">
      {usar3D ? (
        <Suspense fallback={null}>
          <CenaFabrica ambiente={ambienteAtual} pecas={pecas} onDesempenhoBaixo={() => setDesempenhoBaixo(true)} />
        </Suspense>
      ) : (
        <div
          ref={fundoRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-24 top-[10vh] h-72 w-72 rounded-full bg-[var(--acento)]/10 blur-3xl" />
          <div className="absolute -right-24 top-[60vh] h-96 w-96 rounded-full bg-[var(--titulo)]/10 blur-3xl" />
        </div>
      )}

      <BarraProgresso total={estacoesOrdenadas.length} concluidas={concluidas.length} />
      <Robo pecas={pecas} />

      {estacoesOrdenadas.map((estacao, indice) => (
        <Estacao
          key={estacao.id}
          ref={(el) => {
            refsSecoes.current[indice].current = el
          }}
          estacao={estacao}
          desbloqueada={indice <= concluidas.length}
          concluida={concluidas.includes(estacao.id)}
          onConcluir={onConcluir}
        />
      ))}
    </main>
  )
}

function App() {
  const { concluidas, concluirEstacao, reiniciar } = useProgresso()
  const [tela, setTela] = useState('recepcao')

  const todasConcluidas = concluidas.length === estacoesOrdenadas.length

  useEffect(() => {
    if (tela === 'jogo' && todasConcluidas) {
      registrarFim()
      setTela('expedicao')
    }
  }, [tela, todasConcluidas])

  function iniciar() {
    setTela('jogo')
  }

  function continuar() {
    setTela(todasConcluidas ? 'expedicao' : 'jogo')
  }

  function recomecar() {
    reiniciar()
    setTela('jogo')
  }

  function aoConcluirEstacao(id) {
    concluirEstacao(id)
    registrarEstacaoConcluida(id)
  }

  if (tela === 'recepcao') {
    return (
      <Recepcao
        temProgresso={concluidas.length > 0}
        onIniciar={iniciar}
        onContinuar={continuar}
        onRecomecar={recomecar}
      />
    )
  }

  if (tela === 'expedicao') {
    return <Expedicao onRecomecar={recomecar} />
  }

  return <JogoEsteira concluidas={concluidas} onConcluir={aoConcluirEstacao} />
}

export default App
