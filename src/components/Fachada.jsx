import { MUNDO } from '../hooks/useCamera'
import { MARCA, ZINOS_CORPO, asset } from '../lib/assets'
import { FACHADA } from '../lib/coordenadas'

/**
 * A fachada da fábrica (Recepção), montada dentro do mesmo mundo 1920x1080 das
 * salas. As posições vêm de public/coordenadas.json ("fachada"), que marca os
 * buracos deixados na ilustração: a placa (onde entra o logotipo), o portão e
 * o lugar do Zinos.
 */
function Fachada({ portaoRef }) {
  return (
    <>
      <div className="absolute inset-0" data-profundidade="1">
        <img
          src={asset('fachada/cena.webp')}
          alt=""
          aria-hidden="true"
          draggable="false"
          width={MUNDO.largura}
          height={MUNDO.altura}
          className="absolute inset-0 h-full w-full select-none object-cover"
          fetchPriority="high"
          decoding="async"
        />

        {/* Fumaça da chaminé */}
        <div
          className="pointer-events-none absolute"
          style={{ left: FACHADA.chamine.x, top: FACHADA.chamine.y, transform: 'translate(-50%, -100%)' }}
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="fumaca absolute block rounded-full"
              style={{
                left: 0,
                bottom: 0,
                width: 26 + i * 6,
                height: 26 + i * 6,
                background: 'rgba(255,255,255,.22)',
                animationDelay: `${i * 1.8}s`,
              }}
            />
          ))}
        </div>

        {/* Interior escuro atrás do portão: é o que aparece quando ele enrola
            para cima, antes da câmera mergulhar para a Sala 1. */}
        <div
          className="absolute"
          style={{
            left: FACHADA.portao.x,
            top: FACHADA.portao.y,
            width: FACHADA.portao.largura,
            height: FACHADA.portao.altura,
            background: 'radial-gradient(ellipse at 50% 85%, #3a2a18 0%, #120d08 55%, #06040a 100%)',
          }}
          aria-hidden="true"
        />

        {/* Portão: a ilustração deixa o vão em branco, o asset entra por cima */}
        <div
          ref={portaoRef}
          className="absolute overflow-hidden"
          style={{
            left: FACHADA.portao.x,
            top: FACHADA.portao.y,
            width: FACHADA.portao.largura,
            height: FACHADA.portao.altura,
            transformOrigin: '50% 0%',
            willChange: 'transform',
          }}
        >
          <img
            src={asset('fachada/portao.webp')}
            alt=""
            aria-hidden="true"
            draggable="false"
            className="h-full w-full select-none object-fill"
          />
        </div>

        {/* Logotipo na placa luminosa */}
        <img
          src={MARCA.horizontalClaro}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute select-none"
          style={{ left: FACHADA.logo.x, top: FACHADA.logo.y, width: FACHADA.logo.largura }}
        />

        {/* Zinos esperando na calçada */}
        <img
          src={ZINOS_CORPO.acenando}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="zinos-flutua absolute select-none"
          style={{ left: FACHADA.zinos.x, top: FACHADA.zinos.y, height: FACHADA.zinos.altura }}
        />
      </div>
    </>
  )
}

export default Fachada
