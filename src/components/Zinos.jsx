import { useId } from 'react'

/**
 * Zinos, o mascote. A cabeça é a transcrição de public/mascote/zinos-cabeca.svg,
 * inline para que a expressão possa ser trocada sem recarregar o arquivo.
 * O corpo inteiro (public/mascote/corpo-*.webp) é usado como <img> onde cabe.
 */
const LEGENDA = {
  neutro: 'Zinos, atento',
  feliz: 'Zinos, contente',
  triste: 'Zinos, desanimado',
  explicando: 'Zinos, explicando',
  indicando: 'Zinos, apontando o caminho',
  pensando: 'Zinos, pensando',
  carregando: 'Zinos, processando',
  desligado: 'Zinos, desligado',
}

function Tela({ expressao }) {
  switch (expressao) {
    case 'feliz':
      return (
        <g>
          <path
            d="M62 88 Q74 68 86 88 M114 88 Q126 68 138 88"
            stroke="#67E8F9"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M86 106 Q100 122 114 106"
            stroke="#67E8F9"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )
    case 'triste':
      return (
        <g>
          <g fill="#67E8F9">
            <rect x="65" y="73" width="18" height="22" rx="9" />
            <rect x="117" y="73" width="18" height="22" rx="9" />
          </g>
          <path
            d="M62 66 L86 59 M114 59 L138 66"
            stroke="#67E8F9"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M88 118 Q100 108 112 118"
            stroke="#67E8F9"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )
    case 'explicando':
      return (
        <g>
          <g fill="#67E8F9">
            <rect x="65" y="65" width="18" height="30" rx="9" />
            <rect x="117" y="65" width="18" height="30" rx="9" />
          </g>
          <path
            d="M116 58 L138 54"
            stroke="#67E8F9"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M88 106 H112 Q112 122 100 122 Q88 122 88 106 Z" fill="#67E8F9" />
        </g>
      )
    case 'indicando':
      return (
        <g>
          <g fill="#67E8F9">
            <rect x="75" y="65" width="18" height="30" rx="9" />
            <rect x="125" y="65" width="18" height="30" rx="9" />
          </g>
          <path
            d="M96 110 Q106 117 116 110"
            stroke="#67E8F9"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M152 102 l8 8 l-8 8"
            stroke="#67E8F9"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )
    case 'pensando':
      return (
        <g>
          <g fill="#67E8F9">
            <rect x="71" y="58" width="18" height="28" rx="9" />
            <rect x="119" y="68" width="18" height="12" rx="6" />
          </g>
          <path
            d="M90 114 H106"
            stroke="#67E8F9"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <g fill="#67E8F9">
            <circle cx="146" cy="52" r="3" />
            <circle cx="155" cy="52" r="3" />
            <circle cx="164" cy="52" r="3" />
          </g>
        </g>
      )
    case 'carregando':
      return (
        <g>
          <g fontFamily="ui-monospace, 'IBM Plex Mono', monospace" fontSize="13" fill="#67E8F9">
            <text x="44" y="66" opacity=".9">
              01 {'{ }'} 10
            </text>
            <text x="44" y="84" opacity=".6">
              &lt;/&gt; 0110
            </text>
            <text x="44" y="102" opacity=".9">
              train() ▮
            </text>
          </g>
          <rect x="44" y="112" width="112" height="7" rx="3.5" fill="#67E8F9" opacity=".18" />
          <rect x="44" y="112" width="68" height="7" rx="3.5" fill="#67E8F9" />
        </g>
      )
    case 'desligado':
      return null
    default:
      return (
        <g>
          <g fill="#67E8F9">
            <rect x="65" y="65" width="18" height="30" rx="9" />
            <rect x="117" y="65" width="18" height="30" rx="9" />
          </g>
          <path
            d="M92 112 H108"
            stroke="#67E8F9"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )
  }
}

/** Só a cabeça do Zinos (viewBox 200x160). */
export function ZinosCabeca({ expressao = 'neutro', className = '', titulo }) {
  const uid = useId().replace(/:/g, '')
  const apagado = expressao === 'desligado'
  const rotulo = titulo ?? LEGENDA[expressao] ?? LEGENDA.neutro

  return (
    <svg viewBox="0 0 200 160" className={className} role="img" aria-label={rotulo}>
      <title>{rotulo}</title>
      <defs>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M100 24 V12" stroke="#7C8794" strokeWidth="5" strokeLinecap="round" />
      <circle
        cx="100"
        cy="9"
        r="6"
        fill={apagado ? '#5B6470' : '#67E8F9'}
        stroke="#2B2F36"
        strokeWidth="3"
        filter={apagado ? undefined : `url(#glow-${uid})`}
      />
      <rect x="2" y="70" width="14" height="36" rx="6" fill="#7C8794" stroke="#2B2F36" strokeWidth="3" />
      <rect x="184" y="70" width="14" height="36" rx="6" fill="#7C8794" stroke="#2B2F36" strokeWidth="3" />
      <rect x="10" y="22" width="180" height="130" rx="36" fill="#F1EBDD" stroke="#2B2F36" strokeWidth="5" />
      <rect x="28" y="40" width="144" height="94" rx="22" fill="#0B1118" stroke="#2B2F36" strokeWidth="3" />
      <path
        d="M42 56 Q44 50 52 50 H68"
        stroke="#fff"
        strokeOpacity=".14"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <g filter={`url(#glow-${uid})`}>
        <Tela expressao={expressao} />
      </g>
    </svg>
  )
}

/**
 * Zinos falando: cabeça + balão. Usado na Recepção, no quiz e na Expedição.
 * `lado` controla de que lado o balão nasce.
 */
export function ZinosFala({ expressao = 'explicando', children, className = '', compacto = false }) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <ZinosCabeca expressao={expressao} className={compacto ? 'h-12 w-15 shrink-0' : 'h-20 w-25 shrink-0'} />
      <div
        className="relative rounded-2xl rounded-bl-sm border px-4 py-2.5 text-sm leading-snug"
        style={{
          background: 'var(--marca-creme)',
          borderColor: 'var(--marca-grafite)',
          color: 'var(--marca-tinta)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ZinosCabeca
