import { useEffect, useState } from 'react'
import { prefereMovimentoReduzido } from './useCamera'

const LINHAS = ['01 { } 10', '</> 0110', 'train() ▮', '0x1F { }', '[..] 1011', '>> fit()', '1001 ::']

function sortear() {
  return LINHAS[Math.floor(Math.random() * LINHAS.length)]
}

/**
 * As 3 linhas de caracteres que rolam na tela do Zinos durante o preloader,
 * trocando a cada ~80 ms (roteiro 04, tabela A). Só troca o texto: nada de
 * layout, para não custar nada no celular de entrada.
 */
export function useLinhasCodigo(ativo) {
  const [linhas, setLinhas] = useState(() => [sortear(), sortear(), sortear()])

  useEffect(() => {
    if (!ativo || prefereMovimentoReduzido()) return undefined
    const id = window.setInterval(() => setLinhas([sortear(), sortear(), sortear()]), 80)
    return () => window.clearInterval(id)
  }, [ativo])

  return linhas
}
