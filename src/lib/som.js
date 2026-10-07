/**
 * Som do AutoLab — sintetizado na Web Audio API, sem um único arquivo de áudio.
 *
 * Por que sintetizado: o alvo é celular de entrada no 4G (PLANO v2.1 seção 2), e
 * samples seriam o maior peso novo do projeto. Osciladores e ruído filtrado custam
 * 0 KB e 0 requisições, e a estética de "computador de fábrica" pede bipe mesmo.
 *
 * Três regras que o resto do código pode assumir:
 *
 * 1. **Nada aqui lança erro.** Se a Web Audio não existir, estiver bloqueada ou o
 *    contexto morrer, as funções viram no-op. Som nunca derruba o jogo.
 * 2. **Começa desligado.** O jogo é aberto por QR num corredor, quase sempre sem
 *    fone. Ligar é escolha explícita, guardada em `autolab:som` — chave separada
 *    de `autolab:progresso`, que é versionada e some quando o formato muda.
 * 3. **Precisa de um gesto.** Navegador não deixa tocar áudio antes do primeiro
 *    toque. `desbloquear()` tem de ser chamado de dentro de um clique.
 */

const CHAVE = 'autolab:som'
const VOLUME_MESTRE = 0.32

let ctx = null
let mestre = null
let ligado = lerPreferencia()
const ouvintes = new Set()

function lerPreferencia() {
  try {
    return window.localStorage.getItem(CHAVE) === 'ligado'
  } catch {
    return false
  }
}

function gravarPreferencia(valor) {
  try {
    window.localStorage.setItem(CHAVE, valor ? 'ligado' : 'desligado')
  } catch {
    // modo anônimo / storage bloqueado: a escolha vale só nesta sessão
  }
}

function avisar() {
  for (const ouvinte of ouvintes) {
    try {
      ouvinte(ligado)
    } catch {
      // um ouvinte quebrado não pode derrubar os outros
    }
  }
}

/** Assina mudanças do liga/desliga. Devolve a função de cancelar. */
export function observar(ouvinte) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

export function estaLigado() {
  return ligado
}

/**
 * Cria (ou retoma) o contexto de áudio. Só funciona dentro de um gesto do
 * usuário — no iOS o contexto nasce `suspended` e nunca sai disso sozinho.
 */
export function desbloquear() {
  try {
    const Contexto = window.AudioContext || window.webkitAudioContext
    if (!Contexto) return false

    if (!ctx) {
      ctx = new Contexto()
      mestre = ctx.createGain()
      mestre.gain.value = VOLUME_MESTRE
      mestre.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') ctx.resume()
    return true
  } catch {
    ctx = null
    mestre = null
    return false
  }
}

export function ligar() {
  ligado = true
  gravarPreferencia(true)
  desbloquear()
  avisar()
  tocar('toque')
}

export function desligar() {
  ligado = false
  gravarPreferencia(false)
  avisar()
}

export function alternar() {
  if (ligado) desligar()
  else ligar()
  return ligado
}

// ---------------------------------------------------------------------------
// Vozes
// ---------------------------------------------------------------------------

let bufferRuido = null

/** Um segundo de ruído branco, gerado uma vez e reaproveitado. */
function ruidoBranco() {
  if (bufferRuido) return bufferRuido
  const quadros = ctx.sampleRate
  bufferRuido = ctx.createBuffer(1, quadros, ctx.sampleRate)
  const dados = bufferRuido.getChannelData(0)
  for (let i = 0; i < quadros; i += 1) dados[i] = Math.random() * 2 - 1
  return bufferRuido
}

/**
 * Uma nota. `de`/`para` em Hz fazem glissando; `vol` é relativo ao mestre.
 * O decaimento é exponencial porque linear soa artificial em nota curta.
 */
function nota(inicio, { de, para, tipo = 'sine', dur = 0.12, vol = 0.3, ataque = 0.004 }) {
  const osc = ctx.createOscillator()
  const ganho = ctx.createGain()

  osc.type = tipo
  osc.frequency.setValueAtTime(de, inicio)
  if (para && para !== de) osc.frequency.exponentialRampToValueAtTime(para, inicio + dur)

  ganho.gain.setValueAtTime(0.0001, inicio)
  ganho.gain.exponentialRampToValueAtTime(vol, inicio + ataque)
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + dur)

  osc.connect(ganho)
  ganho.connect(mestre)
  osc.start(inicio)
  osc.stop(inicio + dur + 0.02)
}

/** Ruído filtrado: serve de sopro, de batida mecânica e de passagem. */
function sopro(inicio, { de, para, q = 1, dur = 0.3, vol = 0.2, tipo = 'bandpass' }) {
  const fonte = ctx.createBufferSource()
  const filtro = ctx.createBiquadFilter()
  const ganho = ctx.createGain()

  fonte.buffer = ruidoBranco()
  fonte.loop = true

  filtro.type = tipo
  filtro.Q.value = q
  filtro.frequency.setValueAtTime(de, inicio)
  if (para && para !== de) filtro.frequency.exponentialRampToValueAtTime(para, inicio + dur)

  ganho.gain.setValueAtTime(0.0001, inicio)
  ganho.gain.exponentialRampToValueAtTime(vol, inicio + Math.min(0.04, dur / 3))
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + dur)

  fonte.connect(filtro)
  filtro.connect(ganho)
  ganho.connect(mestre)
  fonte.start(inicio)
  fonte.stop(inicio + dur + 0.02)
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

/**
 * Cada som recebe o instante em que começa. Tudo é agendado no relógio do
 * contexto, não em setTimeout: é o que mantém os arpejos no tempo certo mesmo
 * com a thread principal ocupada animando.
 */
const SONS = {
  // Toque num hotspot: clique seco de painel industrial.
  toque: (t) => {
    nota(t, { de: 1180, para: 820, tipo: 'square', dur: 0.045, vol: 0.12 })
  },

  // Ação bloqueada (registro trancado, saída trancada): dois graves descendo.
  // Curto e sem aspereza — avisa, não repreende.
  negado: (t) => {
    nota(t, { de: 220, tipo: 'sawtooth', dur: 0.09, vol: 0.14 })
    nota(t + 0.09, { de: 165, tipo: 'sawtooth', dur: 0.12, vol: 0.12 })
  },

  // Painel abrindo: sopro subindo com um bipe de confirmação no fim.
  abrir: (t) => {
    sopro(t, { de: 420, para: 1900, q: 1.1, dur: 0.22, vol: 0.1 })
    nota(t + 0.1, { de: 660, para: 880, tipo: 'triangle', dur: 0.12, vol: 0.14 })
  },

  // Painel fechando: o mesmo sopro ao contrário, mais discreto.
  fechar: (t) => {
    sopro(t, { de: 1700, para: 380, q: 1.1, dur: 0.18, vol: 0.08 })
  },

  // Registro marcado como lido.
  marcado: (t) => {
    nota(t, { de: 784, tipo: 'triangle', dur: 0.1, vol: 0.16 })
    nota(t + 0.07, { de: 1047, tipo: 'triangle', dur: 0.14, vol: 0.13 })
  },

  // Quiz certo: arpejo maior de três notas (dó-mi-sol).
  acerto: (t) => {
    nota(t, { de: 523.25, tipo: 'triangle', dur: 0.12, vol: 0.18 })
    nota(t + 0.085, { de: 659.25, tipo: 'triangle', dur: 0.12, vol: 0.18 })
    nota(t + 0.17, { de: 783.99, tipo: 'triangle', dur: 0.26, vol: 0.2 })
  },

  // Quiz errado: um grave curto com leve desafinação. De propósito NÃO é um
  // buzz agressivo — errar faz parte do jogo e tentar de novo é livre.
  erro: (t) => {
    nota(t, { de: 196, tipo: 'square', dur: 0.16, vol: 0.1 })
    nota(t + 0.01, { de: 185, tipo: 'square', dur: 0.15, vol: 0.08 })
  },

  // A peça encaixando na cópia: batida mecânica. É o prêmio de cada sala, então
  // é o som mais "físico" do jogo — baque grave + estalo filtrado + nota limpa.
  peca: (t) => {
    nota(t, { de: 150, para: 60, tipo: 'sine', dur: 0.16, vol: 0.3 })
    sopro(t, { de: 2600, para: 900, q: 2.4, dur: 0.1, vol: 0.18 })
    nota(t + 0.12, { de: 880, para: 1320, tipo: 'triangle', dur: 0.22, vol: 0.14 })
  },

  // Portão da fachada enrolando: ruído rasgado subindo, com o baque do fim.
  portao: (t) => {
    sopro(t, { de: 260, para: 1500, q: 0.8, dur: 0.85, vol: 0.14 })
    sopro(t + 0.78, { de: 180, q: 1.4, dur: 0.22, vol: 0.2, tipo: 'lowpass' })
    nota(t + 0.78, { de: 110, para: 55, tipo: 'sine', dur: 0.3, vol: 0.26 })
  },

  // Passagem entre salas: sopro largo, acompanha a <Passagem> cobrindo a tela.
  passagem: (t) => {
    sopro(t, { de: 300, para: 2400, q: 0.7, dur: 0.38, vol: 0.13 })
    sopro(t + 0.3, { de: 2200, para: 400, q: 0.7, dur: 0.34, vol: 0.1 })
  },

  // Expedição: fanfarra curta, dó-mi-sol-dó com o acorde segurando no fim.
  fanfarra: (t) => {
    const melodia = [523.25, 659.25, 783.99, 1046.5]
    melodia.forEach((f, i) => {
      nota(t + i * 0.13, { de: f, tipo: 'triangle', dur: 0.2, vol: 0.18 })
    })
    const fim = t + 0.52
    for (const f of melodia) {
      nota(fim, { de: f, tipo: 'triangle', dur: 0.75, vol: 0.1 })
    }
  },
}

/** Toca um som do catálogo. Silencioso se o som estiver desligado. */
export function tocar(nome) {
  if (!ligado || !ctx || !mestre) return
  const faz = SONS[nome]
  if (!faz) return
  try {
    if (ctx.state === 'suspended') ctx.resume()
    faz(ctx.currentTime + 0.01)
  } catch {
    // contexto morto ou sem vozes livres: o jogo segue mudo e inteiro
  }
}

// ---------------------------------------------------------------------------
// Voz do Zinos
// ---------------------------------------------------------------------------

const MAX_BIPES = 14
const INTERVALO_BIPE = 0.062

/**
 * "Voz" do Zinos: um bipe curto por sílaba enquanto o balão aparece, com o tom
 * sorteado numa faixa estreita. Não é fala gravada de propósito — gravação
 * travaria a revisão de texto da dupla (PERGUNTAS-ABERTAS 2.1) e pesaria.
 *
 * O número de bipes vem do tamanho do texto, limitado para a fala nunca virar
 * zumbido: um card longo soa como uma frase, não como um motor.
 */
export function falar(texto) {
  if (!ligado || !ctx || !mestre || !texto) return
  try {
    if (ctx.state === 'suspended') ctx.resume()
    // ~3 letras por sílaba, que é a média do português.
    const silabas = Math.min(MAX_BIPES, Math.max(2, Math.round(texto.length / 3.2)))
    const inicio = ctx.currentTime + 0.02
    for (let i = 0; i < silabas; i += 1) {
      const base = 520 + Math.random() * 260
      nota(inicio + i * INTERVALO_BIPE, {
        de: base,
        para: base * (0.88 + Math.random() * 0.26),
        tipo: 'square',
        dur: 0.042,
        vol: 0.055,
      })
    }
  } catch {
    // idem: voz é enfeite
  }
}
