/**
 * Caminho de um arquivo de `public/`, respeitando o `base` do Vite ('/AutoLab/').
 * Usar sempre isto em vez de escrever "/salas/..." na mão, senão quebra no Pages.
 */
export function asset(caminho) {
  return `${import.meta.env.BASE_URL}${caminho.replace(/^\//, '')}`
}

export const MARCA = {
  horizontalClaro: asset('marca/autolab-horizontal-claro.svg'),
  horizontalEscuro: asset('marca/autolab-horizontal-escuro.svg'),
  horizontalMonoBranco: asset('marca/autolab-horizontal-mono-branco.svg'),
  verticalClaro: asset('marca/autolab-vertical-claro.svg'),
  verticalEscuro: asset('marca/autolab-vertical-escuro.svg'),
  simbolo: asset('marca/autolab-simbolo.svg'),
  simboloMonoBranco: asset('marca/autolab-simbolo-mono-branco.svg'),
}

export const ZINOS_CORPO = {
  acenando: asset('mascote/corpo-acenando.webp'),
  neutro: asset('mascote/corpo-neutro.webp'),
  desligado: asset('mascote/corpo-desligado.webp'),
}

/** As 5 peças do robô, na ordem de empilhamento (de trás para a frente). */
export const PECAS = [
  { id: 'base', arquivo: asset('mascote/pecas/1-base.svg'), nome: 'Base de flutuação' },
  { id: 'bracos', arquivo: asset('mascote/pecas/4-bracos.svg'), nome: 'Braços' },
  { id: 'tronco', arquivo: asset('mascote/pecas/2-tronco.svg'), nome: 'Tronco' },
  { id: 'nucleo', arquivo: asset('mascote/pecas/3-nucleo.svg'), nome: 'Núcleo' },
  { id: 'cabeca', arquivo: asset('mascote/pecas/5-cabeca.svg'), nome: 'Cabeça' },
]

export const CABECA_LIGADA = asset('mascote/pecas/5-cabeca-ligada.svg')
