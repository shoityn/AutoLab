import { asset } from '../lib/assets'
import { ABERTURA } from '../lib/conteudo'

/**
 * Fachada da fábrica, em camadas (doc 03, "Fachada em camadas"):
 *
 *  1. o vão do portão mostra a própria Sala 1 — quando o portão sobe, a pessoa
 *     já vê para onde vai, e o zoom entra direto nela (estilo Gorogoa);
 *  2. fachada/cena.webp, que tem um furo transparente no portão;
 *  3. fachada/portao.webp, que enrola para cima por `clip-path`;
 *  4. o logotipo sobre a placa (a placa é vazia na ilustração);
 *  5. o Zinos à direita do portão;
 *  6. a fumaça da chaminé.
 */
function Fachada({ portaoRef, logoRef, zinosRef }) {
  const c = ABERTURA.fachada.camadas

  return (
    <>
      {/* 1. vão: a Sala 1 vista por dentro do portão */}
      <div
        className="absolute overflow-hidden"
        style={{ left: c.vao.x, top: c.vao.y, width: c.vao.largura, height: c.vao.altura, background: '#120d08' }}
        aria-hidden="true"
      >
        <img
          src={asset(c.vao.imagem)}
          alt=""
          draggable="false"
          className="h-full w-full select-none object-cover"
          style={{ objectPosition: '62% 55%' }}
          decoding="async"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,6,2,.35)' }} />
      </div>

      {/* 2. a fachada, com o furo no portão */}
      <img
        src={asset(c.cena)}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute inset-0 h-full w-full select-none object-cover"
        fetchPriority="high"
        decoding="async"
      />

      {/* 3. o portão, que sobe */}
      <div
        ref={portaoRef}
        className="absolute"
        style={{ left: c.portao?.x ?? c.vao.x, top: c.vao.y, width: c.vao.largura, height: c.vao.altura }}
        aria-hidden="true"
      >
        <img
          src={asset(c.portao)}
          alt=""
          draggable="false"
          className="h-full w-full select-none object-fill"
        />
      </div>

      {/* 4. logotipo sobre a placa */}
      <img
        ref={logoRef}
        src={asset(c.logo.arquivo)}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute select-none"
        style={{ left: c.logo.x, top: c.logo.y, width: c.logo.largura }}
      />

      {/* 5. Zinos esperando na calçada */}
      <img
        ref={zinosRef}
        src={asset(c.zinos.arquivo)}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="zinos-flutua absolute select-none"
        style={{
          left: c.zinos.x,
          top: c.zinos.y,
          height: c.zinos.altura,
          filter: 'drop-shadow(0 8px 22px rgba(103,232,249,.35))',
        }}
      />

      {/* 6. fumaça da chaminé */}
      <div
        className="pointer-events-none absolute"
        style={{ left: c.chamineTopo.x, top: c.chamineTopo.y, transform: 'translate(-50%, -100%)' }}
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
    </>
  )
}

export default Fachada
