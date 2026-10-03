import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import estacoes from './data/estacoes.json'
import { useProgresso } from './hooks/useProgresso'
import { aplicarAmbiente } from './hooks/useAmbiente'
import { registrarEstacaoConcluida, registrarFim } from './lib/metricas'
import { suporta3D } from './three/suporte3D'
import Recepcao from './components/Recepcao'
import Estacao from './components/Estacao'
import BarraProgresso from './components/BarraProgresso'
import Expedicao from './components/Expedicao'
import Robo from './components/Robo'

const estacoesOrdenadas = [...estacoes].sort((a, b) => a.ordem - b.ordem)
const CenaFabrica = lazy(() => import('./three/CenaFabrica'))

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function JogoEsteira({ concluidas, onConcluir, onFinalizar }) {
  const [indiceExibido, setIndiceExibido] = useState(concluidas.length)
  const salaRef = useRef(null)
  const [modo3D, setModo3D] = useState(false)
  const [desempenhoBaixo, setDesempenhoBaixo] = useState(false)

  const usar3D = modo3D && !desempenhoBaixo
  const estacaoExibida = estacoesOrdenadas[indiceExibido]
  const concluidaExibida = estacaoExibida ? concluidas.includes(estacaoExibida.id) : false
  const ultima = indiceExibido === estacoesOrdenadas.length - 1

  useEffect(() => {
    setModo3D(suporta3D())
  }, [])

  useEffect(() => {
    if (estacaoExibida) aplicarAmbiente(estacaoExibida.ambiente, { animado: true })
  }, [estacaoExibida])

  // Efeito de "câmera chegando" na sala atual.
  useEffect(() => {
    if (prefereMovimentoReduzido() || !salaRef.current) return
    gsap.fromTo(
      salaRef.current,
      { opacity: 0, scale: 1.04, x: 24 },
      { opacity: 1, scale: 1, x: 0, duration: 0.45, ease: 'power2.out' },
    )
  }, [indiceExibido])

  function sair(aoTerminar) {
    if (prefereMovimentoReduzido() || !salaRef.current) {
      aoTerminar()
      return
    }
    gsap.to(salaRef.current, {
      opacity: 0,
      scale: 0.94,
      x: -24,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: aoTerminar,
    })
  }

  function avancar() {
    if (indiceExibido + 1 >= estacoesOrdenadas.length) {
      sair(onFinalizar)
      return
    }
    sair(() => setIndiceExibido((indice) => indice + 1))
  }

  const pecas = estacoesOrdenadas.filter((estacao) => concluidas.includes(estacao.id)).map((estacao) => estacao.peca)

  return (
    <div className="relative min-h-screen">
      {usar3D ? (
        <Suspense fallback={null}>
          <CenaFabrica
            ambiente={estacaoExibida?.ambiente ?? 1}
            indiceSala={indiceExibido}
            pecas={pecas}
            onDesempenhoBaixo={() => setDesempenhoBaixo(true)}
          />
        </Suspense>
      ) : (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 top-[10vh] h-72 w-72 rounded-full bg-[var(--acento)]/10 blur-3xl" />
          <div className="absolute -right-24 top-[60vh] h-96 w-96 rounded-full bg-[var(--titulo)]/10 blur-3xl" />
        </div>
      )}

      <BarraProgresso total={estacoesOrdenadas.length} concluidas={concluidas.length} />
      <Robo pecas={pecas} />

      {estacaoExibida && (
        <div ref={salaRef}>
          <Estacao
            key={estacaoExibida.id}
            estacao={estacaoExibida}
            concluida={concluidaExibida}
            ultima={ultima}
            onConcluir={onConcluir}
            onAvancar={avancar}
          />
        </div>
      )}
    </div>
  )
}

function App() {
  const { concluidas, concluirEstacao, reiniciar } = useProgresso()
  const [tela, setTela] = useState('recepcao')

  const todasConcluidas = concluidas.length === estacoesOrdenadas.length

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

  function finalizarJogo() {
    registrarFim()
    setTela('expedicao')
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

  return <JogoEsteira concluidas={concluidas} onConcluir={aoConcluirEstacao} onFinalizar={finalizarJogo} />
}

export default App
