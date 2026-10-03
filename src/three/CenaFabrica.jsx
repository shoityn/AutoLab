import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AMBIENTES } from '../hooks/useAmbiente'
import RoboModelo3D from './RoboModelo3D'

gsap.registerPlugin(ScrollTrigger)

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

// A câmera "percorre" a esteira acompanhando o progresso do scroll da página inteira.
function ControladorCamera() {
  const { camera, invalidate } = useThree()

  useEffect(() => {
    camera.position.set(0, 1.2, 6)
    camera.lookAt(0, 0.2, 0)
    invalidate()

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const z = 6 - self.progress * 12
        camera.position.z = z
        camera.lookAt(0, 0.2, z - 6)
        invalidate()
      },
    })

    return () => trigger.kill()
  }, [camera, invalidate])

  return null
}

function CenaFabrica({ ambiente, pecas, onDesempenhoBaixo }) {
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
        <ControladorCamera />
      </Canvas>
    </div>
  )
}

export default CenaFabrica
