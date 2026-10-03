import { useEffect, useState } from 'react'
import estacoes from './data/estacoes.json'
import { useProgresso } from './hooks/useProgresso'
import Recepcao from './components/Recepcao'
import Estacao from './components/Estacao'
import BarraProgresso from './components/BarraProgresso'
import Expedicao from './components/Expedicao'

const estacoesOrdenadas = [...estacoes].sort((a, b) => a.ordem - b.ordem)

function App() {
  const { concluidas, concluirEstacao, reiniciar } = useProgresso()
  const [tela, setTela] = useState('recepcao')

  const todasConcluidas = concluidas.length === estacoesOrdenadas.length

  useEffect(() => {
    if (tela === 'jogo' && todasConcluidas) {
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

  return (
    <main className="pt-10">
      <BarraProgresso total={estacoesOrdenadas.length} concluidas={concluidas.length} />
      {estacoesOrdenadas.map((estacao, indice) => (
        <Estacao
          key={estacao.id}
          estacao={estacao}
          desbloqueada={indice <= concluidas.length}
          concluida={concluidas.includes(estacao.id)}
          onConcluir={concluirEstacao}
        />
      ))}
    </main>
  )
}

export default App
