/**
 * Posições dentro do mundo 1920x1080, transcritas de public/coordenadas.json
 * (o arquivo que veio junto com a arte). Mantidas aqui como constantes para o
 * bundle não depender de um fetch em runtime.
 *
 * Convenção: x/y é o canto superior esquerdo do elemento, como na entrega.
 */
export const FACHADA = {
  /** Vão do portão deixado em branco na ilustração — o asset entra exatamente aqui. */
  portao: { x: 838, y: 600, largura: 240, altura: 294 },
  /** Centro do vão: é para onde a câmera mergulha ao iniciar o turno. */
  centroPortao: { x: 958, y: 747 },
  aproximacaoPortao: 3.8,
  placa: { x: 815, y: 470, largura: 288, altura: 82 },
  logo: { x: 832, y: 486, largura: 254 },
  zinos: { x: 1180, y: 640, altura: 255 },
  chamine: { x: 650, y: 308 },
}
