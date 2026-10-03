import { forwardRef } from 'react'
import { MUNDO } from '../hooks/useCamera'

const TAMANHO_OBJETO = { card: 150, quiz: 170 }

function ObjetoHotspot({ hotspot, lido }) {
  const tamanho = TAMANHO_OBJETO[hotspot.tipo] ?? 150
  return (
    <div
      className="absolute flex items-center justify-center rounded-xl border-2 border-dashed border-[var(--acento)]/60 bg-[var(--card)] text-center text-xs text-[var(--texto)]/70"
      style={{
        left: hotspot.x,
        top: hotspot.y,
        width: tamanho,
        height: tamanho,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span className="px-2">
        {lido && '✓ '}
        {hotspot.rotulo}
      </span>
    </div>
  )
}

function ObjetoSaida({ saida, liberada }) {
  return (
    <div
      className={[
        'absolute flex items-center justify-center rounded-xl border-2 text-center text-xs font-semibold',
        liberada
          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-50'
          : 'border-white/20 bg-black/30 text-white/50',
      ].join(' ')}
      style={{ left: saida.x, top: saida.y, width: 320, height: 110, transform: 'translate(-50%, -50%)' }}
    >
      {liberada ? saida.rotulo : '🔒 saída trancada'}
    </div>
  )
}

/** Monta as camadas de uma sala dentro do mundo (placeholders até a Fase C ter arte final). */
const Sala = forwardRef(function Sala({ estacao, lidos, saidaLiberada }, ref) {
  return (
    <div
      ref={ref}
      className="absolute left-0 top-0"
      style={{ width: MUNDO.largura, height: MUNDO.altura, transformOrigin: '0 0', willChange: 'transform' }}
    >
      <div className="absolute inset-0" data-profundidade="0.85" style={{ background: 'var(--bg)' }} />

      <div className="absolute inset-0" data-profundidade="0.95" aria-hidden="true">
        <div
          className="absolute rounded-lg bg-[var(--acento)]/10"
          style={{ left: 40, top: 160, width: 260, height: 180 }}
        />
        <div
          className="absolute rounded-lg bg-[var(--titulo)]/10"
          style={{ left: 620, top: 1180, width: 300, height: 220 }}
        />
      </div>

      <div className="absolute inset-0" data-profundidade="1">
        {estacao.hotspots.map((hotspot) => (
          <ObjetoHotspot key={hotspot.id} hotspot={hotspot} lido={lidos.includes(hotspot.id)} />
        ))}
        <ObjetoSaida saida={estacao.saida} liberada={saidaLiberada} />
      </div>

      <div className="pointer-events-none absolute inset-0" data-profundidade="1.15" />
    </div>
  )
})

export default Sala
