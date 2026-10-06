import { MUNDO } from '../hooks/useCamera'
import { asset } from '../lib/assets'

/**
 * Uma sala dentro do mundo 1920x1080.
 *
 * Sala 1 já tem arte final (public/salas/1/cena.webp). As salas 2 a 5 ainda não,
 * e usam o cenário provisório desenhado aqui, no mesmo enquadramento — assim as
 * coordenadas dos hotspots já ficam válidas quando a arte final chegar.
 */

const LINHA_HORIZONTE = 0.68 // onde a parede encontra o chão

function CenaFinal({ estacao }) {
  return (
    <img
      src={asset(estacao.cena)}
      alt=""
      aria-hidden="true"
      draggable="false"
      width={MUNDO.largura}
      height={MUNDO.altura}
      className="absolute inset-0 h-full w-full select-none object-cover"
      // A cena é o chão da composição: carrega cedo e não bloqueia o resto.
      fetchPriority="high"
      decoding="async"
    />
  )
}

function Lampada({ x }) {
  return (
    <g>
      <path d={`M${x} 0 V120`} stroke="var(--marca-grafite)" strokeWidth="6" />
      <path d={`M${x - 52} 168 Q${x} 110 ${x + 52} 168 Z`} fill="var(--marca-grafite)" />
      <circle cx={x} cy="172" r="14" fill="var(--titulo)" />
      <path d={`M${x - 150} 760 L${x - 46} 178 H${x + 46} L${x + 150} 760 Z`} fill="var(--titulo)" opacity="0.07" />
    </g>
  )
}

function CenaProvisoria({ estacao }) {
  const yHorizonte = MUNDO.altura * LINHA_HORIZONTE

  return (
    <svg
      viewBox={`0 0 ${MUNDO.largura} ${MUNDO.altura}`}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`parede-${estacao.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg)" />
          <stop offset="100%" stopColor="var(--card)" />
        </linearGradient>
        <linearGradient id={`chao-${estacao.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--bg)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={MUNDO.largura} height={yHorizonte} fill={`url(#parede-${estacao.id})`} />
      <rect
        x="0"
        y={yHorizonte}
        width={MUNDO.largura}
        height={MUNDO.altura - yHorizonte}
        fill={`url(#chao-${estacao.id})`}
      />
      <rect x="0" y={yHorizonte - 6} width={MUNDO.largura} height="6" fill="var(--acento)" opacity="0.35" />

      {/* Frisos da parede, para a câmera ter referência de profundidade ao aproximar */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={i * 320 + 8}
          y="40"
          width="304"
          height={yHorizonte - 80}
          rx="18"
          fill="none"
          stroke="var(--texto)"
          strokeOpacity="0.06"
          strokeWidth="4"
        />
      ))}

      <Lampada x={520} />
      <Lampada x={1400} />

      <text
        x={MUNDO.largura / 2}
        y="96"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        letterSpacing="10"
        fill="var(--texto)"
        opacity="0.28"
      >
        {estacao.titulo.toUpperCase()}
      </text>
      <text
        x={MUNDO.largura / 2}
        y="138"
        textAnchor="middle"
        fontSize="20"
        letterSpacing="4"
        fill="var(--texto)"
        opacity="0.18"
      >
        CENÁRIO PROVISÓRIO — ARTE FINAL NA FASE C
      </text>
    </svg>
  )
}

/** O "móvel" que guarda cada hotspot no cenário provisório. */
function ObjetoProvisorio({ hotspot, lido }) {
  const largura = hotspot.tipo === 'quiz' ? 300 : 230
  const altura = hotspot.tipo === 'quiz' ? 200 : 170

  return (
    // O rótulo fica na faixa de baixo para o anel do hotspot (que é overlay de
    // tela, centrado nas coordenadas) não cair em cima do texto.
    <div
      className="absolute flex flex-col items-center justify-end gap-1 rounded-2xl border-2 pb-3 text-center"
      style={{
        left: hotspot.x,
        top: hotspot.y,
        width: largura,
        height: altura,
        transform: 'translate(-50%, -50%)',
        borderColor: lido ? 'var(--acento)' : 'var(--hotspot)',
        background: 'color-mix(in srgb, var(--card) 88%, transparent)',
        boxShadow: '0 18px 40px rgba(0,0,0,.35)',
      }}
    >
      <span className="px-3 text-[19px] font-semibold leading-tight" style={{ color: 'var(--texto)' }}>
        {hotspot.rotulo}
      </span>
      <span className="text-[13px] uppercase tracking-[3px] opacity-55" style={{ color: 'var(--texto)' }}>
        {hotspot.tipo === 'quiz' ? 'registro final' : 'registro'}
      </span>
    </div>
  )
}

function ObjetoSaidaProvisoria({ saida, liberada }) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-xl border-4 text-center text-[20px] font-semibold"
      style={{
        left: saida.x,
        top: saida.y,
        width: 260,
        height: 330,
        transform: 'translate(-50%, -50%)',
        borderColor: liberada ? 'var(--hotspot)' : 'color-mix(in srgb, var(--texto) 20%, transparent)',
        background: liberada ? 'color-mix(in srgb, var(--hotspot) 16%, transparent)' : 'rgba(0,0,0,.28)',
        color: liberada ? 'var(--hotspot)' : 'color-mix(in srgb, var(--texto) 45%, transparent)',
        paddingBottom: 36,
        alignItems: 'flex-end',
      }}
    >
      {liberada ? 'SAÍDA' : 'TRANCADA'}
    </div>
  )
}

/**
 * Realce sutil sobre o objeto que esconde um hotspot. Fica na camada de
 * profundidade 1, exatamente nas coordenadas do JSON, por isso acompanha o zoom
 * (o anel de toque, esse sim, é overlay de tela — ver PLANO.md seção 6.5).
 */
function RealceObjeto({ hotspot, lido }) {
  const raio = hotspot.tipo === 'quiz' ? 150 : 120
  return (
    <div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: hotspot.x,
        top: hotspot.y,
        width: raio * 2,
        height: raio * 2,
        transform: 'translate(-50%, -50%)',
        background: lido
          ? 'radial-gradient(circle, color-mix(in srgb, var(--acento) 22%, transparent) 0%, transparent 68%)'
          : 'radial-gradient(circle, color-mix(in srgb, var(--hotspot) 30%, transparent) 0%, transparent 68%)',
        mixBlendMode: 'screen',
      }}
    />
  )
}

function Sala({ estacao, lidos, saidaLiberada }) {
  const temArte = Boolean(estacao.cena)

  return (
    <>
      {/* Fundo — a cena ilustrada ou o cenário provisório */}
      <div className="absolute inset-0" data-profundidade="1">
        {temArte ? <CenaFinal estacao={estacao} /> : <CenaProvisoria estacao={estacao} />}
      </div>

      {/* Objetos: só no cenário provisório; na arte final eles já estão na ilustração */}
      <div className="absolute inset-0" data-profundidade="1">
        {!temArte && (
          <>
            {estacao.hotspots.map((hotspot) => (
              <ObjetoProvisorio key={hotspot.id} hotspot={hotspot} lido={lidos.includes(hotspot.id)} />
            ))}
            <ObjetoSaidaProvisoria saida={estacao.saida} liberada={saidaLiberada} />
          </>
        )}

        {estacao.hotspots.map((hotspot) => (
          <RealceObjeto key={`realce-${hotspot.id}`} hotspot={hotspot} lido={lidos.includes(hotspot.id)} />
        ))}

        {saidaLiberada && <RealceObjeto hotspot={{ ...estacao.saida, tipo: 'quiz' }} lido={false} />}
      </div>
    </>
  )
}

export default Sala
