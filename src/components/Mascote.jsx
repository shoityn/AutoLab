import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefereMovimentoReduzido } from '../hooks/useCamera'

/**
 * Zinos — a cabeça-tela do mascote.
 *
 * Transcrição de public/mascote/zinos-cabeca.svg em JSX, em vez de injetar o
 * arquivo em runtime: o preloader precisa desenhar o Zinos *antes* de qualquer
 * asset carregar, e um fetch ali atrasaria justamente a primeira tela.
 * Os grupos continuam acessíveis por ref (expressão e olhos), que é o que as
 * animações do roteiro pedem.
 *
 * Props: expressao, piscar, progresso (0–1, só na expressão "carregando"),
 * mensagem (texto escrito na tela, ex.: "Sistema pronto!").
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

const CIANO = '#67E8F9'
function Olhos({ children }) {
  return <g data-olhos>{children}</g>
}

function Tela({ expressao, progresso, mensagem }) {
  switch (expressao) {
    case 'feliz':
      return (
        <g>
          <Olhos>
            <path
              d="M62 88 Q74 68 86 88 M114 88 Q126 68 138 88"
              stroke={CIANO}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Olhos>
          <path
            d="M86 106 Q100 122 114 106"
            stroke={CIANO}
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
          <Olhos>
            <g fill={CIANO}>
              <rect x="65" y="73" width="18" height="22" rx="9" />
              <rect x="117" y="73" width="18" height="22" rx="9" />
            </g>
          </Olhos>
          <path
            d="M62 66 L86 59 M114 59 L138 66"
            stroke={CIANO}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M88 118 Q100 108 112 118"
            stroke={CIANO}
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
          <Olhos>
            <g fill={CIANO}>
              <rect x="65" y="65" width="18" height="30" rx="9" />
              <rect x="117" y="65" width="18" height="30" rx="9" />
            </g>
          </Olhos>
          <path
            d="M116 58 L138 54"
            stroke={CIANO}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M88 106 H112 Q112 122 100 122 Q88 122 88 106 Z" fill={CIANO} />
        </g>
      )
    case 'indicando':
      return (
        <g>
          <Olhos>
            <g fill={CIANO}>
              <rect x="75" y="65" width="18" height="30" rx="9" />
              <rect x="125" y="65" width="18" height="30" rx="9" />
            </g>
          </Olhos>
          <path
            d="M96 110 Q106 117 116 110"
            stroke={CIANO}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M152 102 l8 8 l-8 8"
            stroke={CIANO}
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
          <Olhos>
            <g fill={CIANO}>
              <rect x="71" y="58" width="18" height="28" rx="9" />
              <rect x="119" y="68" width="18" height="12" rx="6" />
            </g>
          </Olhos>
          <path d="M90 114 H106" stroke={CIANO} strokeWidth="6" strokeLinecap="round" fill="none" />
          <g fill={CIANO}>
            <circle cx="146" cy="52" r="3" />
            <circle cx="155" cy="52" r="3" />
            <circle cx="164" cy="52" r="3" />
          </g>
        </g>
      )
    case 'carregando': {
      const p = Math.max(0, Math.min(1, progresso ?? 0))
      return (
        <g>
          <g fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="13" fill={CIANO}>
            <text x="40" y="62" opacity=".85">
              {mensagem?.[0] ?? ''}
            </text>
            <text x="40" y="80" opacity=".55">
              {mensagem?.[1] ?? ''}
            </text>
            <text x="40" y="98" opacity=".85">
              {mensagem?.[2] ?? ''}
            </text>
            <text x="160" y="56" textAnchor="end" fontSize="11" opacity=".9">
              {Math.round(p * 100)}%
            </text>
          </g>
          <rect x="40" y="110" width="120" height="7" rx="3.5" fill={CIANO} opacity=".18" />
          <rect
            x="40"
            y="110"
            width="120"
            height="7"
            rx="3.5"
            fill={CIANO}
            style={{ transform: `scaleX(${p})`, transformOrigin: '40px 0', transition: 'transform .3s ease-out' }}
          />
        </g>
      )
    }
    case 'pronto':
      return (
        <g>
          <Olhos>
            <g fill={CIANO}>
              <rect x="65" y="58" width="18" height="26" rx="9" />
              <rect x="117" y="58" width="18" height="26" rx="9" />
            </g>
          </Olhos>
          <text
            x="100"
            y="112"
            textAnchor="middle"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontSize="14"
            fill={CIANO}
          >
            {mensagem ?? ''}
          </text>
        </g>
      )
    case 'desligado':
      return null
    default:
      return (
        <g>
          <Olhos>
            <g fill={CIANO}>
              <rect x="65" y="65" width="18" height="30" rx="9" />
              <rect x="117" y="65" width="18" height="30" rx="9" />
            </g>
          </Olhos>
          <path d="M92 112 H108" stroke={CIANO} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      )
  }
}

function Mascote({
  expressao = 'neutro',
  piscar = false,
  progresso,
  mensagem,
  className = '',
  style,
  titulo,
  antenaAcesa = true,
}) {
  const uid = useId().replace(/:/g, '')
  const telaRef = useRef(null)
  const apagado = expressao === 'desligado'
  const rotulo = titulo ?? LEGENDA[expressao] ?? LEGENDA.neutro

  // Troca de expressão: crossfade curto (roteiro 04, .15 s).
  useLayoutEffect(() => {
    if (!telaRef.current || prefereMovimentoReduzido()) return
    const tween = gsap.fromTo(telaRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' })
    return () => tween.kill()
  }, [expressao])

  // Piscar: scaleY nos olhos, em intervalo aleatório de 3 a 5 s.
  useEffect(() => {
    if (!piscar || prefereMovimentoReduzido()) return undefined
    let temporizador
    const agendar = () => {
      temporizador = window.setTimeout(
        () => {
          const olhos = telaRef.current?.querySelector('[data-olhos]')
          if (olhos) {
            gsap.fromTo(
              olhos,
              { scaleY: 1 },
              { scaleY: 0.1, duration: 0.09, yoyo: true, repeat: 1, transformOrigin: '50% 50%' },
            )
          }
          agendar()
        },
        3000 + Math.random() * 2000,
      )
    }
    agendar()
    return () => window.clearTimeout(temporizador)
  }, [piscar, expressao])

  return (
    <svg viewBox="0 0 200 160" className={className} style={style} role="img" aria-label={rotulo}>
      <title>{rotulo}</title>
      <defs>
        <filter id={`brilho-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
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
        fill={apagado || !antenaAcesa ? '#5B6470' : CIANO}
        stroke="#2B2F36"
        strokeWidth="3"
        filter={apagado || !antenaAcesa ? undefined : `url(#brilho-${uid})`}
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

      <g ref={telaRef} filter={`url(#brilho-${uid})`}>
        <Tela expressao={expressao} progresso={progresso} mensagem={mensagem} />
      </g>
    </svg>
  )
}


export default Mascote
