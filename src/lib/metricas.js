// Wrapper do GoatCounter. O pageview normal já é contado pelo script carregado em index.html;
// aqui só disparamos os eventos específicos do jogo (estação concluída, turno concluído).
// Nunca deve lançar erro nem travar o jogo se o script não tiver carregado (ex.: bloqueador de anúncios).

function registrarEvento(path, title) {
  try {
    window.goatcounter?.count({ path, title, event: true })
  } catch {
    // métricas são best-effort
  }
}

export function registrarEstacaoConcluida(id) {
  registrarEvento(`estacao-${id}`, `Estação concluída: ${id}`)
}

export function registrarFim() {
  registrarEvento('fim', 'Turno concluído')
}
