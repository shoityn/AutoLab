import { asset } from './assets'
import { ABERTURA, SALAS } from './conteudo'

/**
 * Carrega os arquivos e informa o progresso ao Preloader.
 * Erro conta como carregado: um asset que falhou não pode travar a entrada no
 * jogo (PLANO v2.1 seção 4.1).
 */
function carregarImagem(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = url
  })
}

/** O que precisa estar pronto antes da fachada aparecer. */
export function assetsEssenciais() {
  const fachada = ABERTURA.fachada.camadas
  return [
    fachada.cena,
    fachada.portao,
    fachada.logo.arquivo,
    fachada.zinos.arquivo,
    fachada.vao.imagem,
    SALAS[0].camadas.cena,
  ].map(asset)
}

/** O resto, carregado em segundo plano depois que a fachada aparece. */
export function assetsSecundarios() {
  return SALAS.slice(1)
    .map((s) => s.camadas.cena)
    .concat(['mascote/corpo-neutro.webp', 'mascote/corpo-desligado.webp'])
    .map(asset)
}

export function precarregar(urls, aoProgredir) {
  const total = urls.length
  if (total === 0) {
    aoProgredir?.(1)
    return Promise.resolve()
  }

  let prontos = 0
  return Promise.all(
    urls.map((url) =>
      carregarImagem(url).then(() => {
        prontos += 1
        aoProgredir?.(prontos / total)
      }),
    ),
  )
}

/** Dispara o carregamento secundário sem bloquear nada. */
export function precarregarEmSegundoPlano() {
  precarregar(assetsSecundarios()).catch(() => {})
}

export function espera(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
