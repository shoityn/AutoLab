import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import gsap from 'gsap'
import { AMBIENTES } from '../hooks/useAmbiente'
import RoboModelo3D from './RoboModelo3D'

const DISTANCIA_ENTRE_SALAS = 3

// Esteira em formas básicas (orçamento: poucas dezenas de objetos, sem texturas/sombras).
function Esteira({ cor }) {
  const roletes = [-9, -6, -3, 0, 3, 6, 9]

  return (
    <group position={[0, -1.4, 0]}>
      <mesh>
        <boxGeometry args={[2, 0.2, 24]} />
        <meshStandardMaterial color={cor} />
      </mesh>
      {roletes.map((z) => (
        <mesh key={z} position={[0, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 6]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}
    </group>
  )
}

// A câmera se move de uma sala para a próxima (mesmo espaçamento usado pela esteira),
// acompanhando a troca de estação em vez do scroll da página.
function ControladorCamera({ indiceSala }) {
  const { camera, invalidate } = useThree()
  const primeiraVezRef = useRef(true)

  useEffect(() => {
    const z = 6 - indiceSala * DISTANCIA_ENTRE_SALAS

    if (primeiraVezRef.current) {
      camera.position.set(0, 1.2, z)
      camera.lookAt(0, 0.2, z - 6)
      invalidate()
      primeiraVezRef.current = false
      return undefined
    }

    const tween = gsap.to(camera.position, {
      z,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(0, 0.2, z - 6)
        invalidate()
      },
    })

    return () => tween.kill()
  }, [indiceSala, camera, invalidate])

  return null
}

function CenaFabrica({ ambiente, indiceSala, pecas, onDesempenhoBaixo }) {
  const cores = AMBIENTES[ambiente] ?? AMBIENTES[1]

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20">
      {/* frameloop padrão (always), não "demand": o PerformanceMonitor da drei mede FPS por
          frames contínuos de requestAnimationFrame — em "demand" os frames são esparsos e a
          medição fica sem sentido. A cena é simples o bastante (poucas dezenas de formas
          básicas, sem sombra) para manter "always" dentro do orçamento de performance. */}
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        camera={{ fov: 50, position: [0, 1.2, 6] }}
        shadows={false}
      >
        <PerformanceMonitor onDecline={() => onDesempenhoBaixo?.()} />
        <color attach="background" args={[cores['--bg']]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={0.6} />
        <Suspense fallback={null}>
          <Esteira cor={cores['--acento']} />
          <RoboModelo3D pecas={pecas} corAcento={cores['--acento']} corTitulo={cores['--titulo']} />
        </Suspense>
        <ControladorCamera indiceSala={indiceSala} />
      </Canvas>
    </div>
  )
}

export default CenaFabrica
