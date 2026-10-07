import { MUNDO } from '../hooks/useCamera'
import { asset } from '../lib/assets'

/**
 * Uma sala: a parede vista de frente, dentro do mundo 1920 × 1080.
 *
 * As camadas vêm do JSON (`camadas.cena`, `camadas.frente`). Os rótulos
 * ("Por quê?", "CSV") são HTML por cima — texto nunca vem da imagem gerada
 * (PLANO v2.1 seção 6.2).
 */

function Rotulo({ rotulo }) {
  const ehTela = rotulo.estilo === 'tela'

  return (
    <div
      className="absolute flex items-center justify-center text-center"
      style={{
        left: rotulo.x,
        top: rotulo.y,
        transform: 'translate(-50%, -50%)',
        fontFamily: ehTela ? "'IBM Plex Mono', ui-monospace, monospace" : "'IBM Plex Sans', system-ui, sans-serif",
        fontSize: ehTela ? 72 : 34,
        fontWeight: ehTela ? 500 : 600,
        letterSpacing: ehTela ? '2px' : '1px',
        color: ehTela ? 'var(--marca-ciano)' : 'var(--marca-tinta)',
        textShadow: ehTela ? '0 0 26px rgba(103,232,249,.55)' : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {rotulo.texto}
    </div>
  )
}

/**
 * Realce sutil sobre o objeto que esconde um hotspot. Fica dentro do mundo, nas
 * coordenadas do JSON, então acompanha o zoom — o anel de toque, esse sim, é
 * overlay de tela (PLANO v2.1 seção 4.3).
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
          ? 'radial-gradient(circle, color-mix(in srgb, var(--acento) 20%, transparent) 0%, transparent 68%)'
          : 'radial-gradient(circle, color-mix(in srgb, var(--hotspot) 28%, transparent) 0%, transparent 68%)',
        mixBlendMode: 'screen',
      }}
    />
  )
}

function Sala({ estacao, lidos, saidaLiberada, frenteRef }) {
  const { cena, frente } = estacao.camadas

  return (
    <>
      <div className="absolute inset-0">
        <img
          src={asset(cena)}
          alt=""
          aria-hidden="true"
          draggable="false"
          width={MUNDO.largura}
          height={MUNDO.altura}
          className="absolute inset-0 h-full w-full select-none object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="absolute inset-0" aria-hidden="true">
        {estacao.hotspots.map((hotspot) => (
          <RealceObjeto key={`realce-${hotspot.id}`} hotspot={hotspot} lido={lidos.includes(hotspot.id)} />
        ))}
        {saidaLiberada && <RealceObjeto hotspot={{ ...estacao.saida, tipo: 'quiz' }} lido={false} />}
      </div>

      {/* Rótulos: texto em HTML por cima da ilustração */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {(estacao.rotulos ?? []).map((rotulo) => (
          <Rotulo key={`${rotulo.texto}-${rotulo.x}`} rotulo={rotulo} />
        ))}
      </div>

      {/* Camada de frente (parallax no PC). Só existe nas salas que a tiverem. */}
      {frente && (
        <div ref={frenteRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={asset(frente)}
            alt=""
            draggable="false"
            className="absolute inset-0 h-full w-full select-none object-cover"
            decoding="async"
          />
        </div>
      )}
    </>
  )
}

export default Sala
