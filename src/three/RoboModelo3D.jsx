import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

function RoboModelo3D({ pecas, corAcento, corTitulo }) {
  const refsPecas = useRef({})
  const anterioresRef = useRef([])
  const { invalidate } = useThree()

  useEffect(() => {
    const novas = pecas.filter((peca) => !anterioresRef.current.includes(peca))

    novas.forEach((peca) => {
      const objeto = refsPecas.current[peca]
      if (!objeto) return
      gsap.fromTo(
        objeto.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.7, ease: 'bounce.out', onUpdate: invalidate },
      )
    })

    anterioresRef.current = pecas
    invalidate()
  }, [pecas, invalidate])

  const temPeca = (peca) => pecas.includes(peca)

  return (
    <group position={[0, 0.5, 1]}>
      <mesh
        ref={(el) => {
          refsPecas.current.base = el
          if (el) el.scale.setScalar(temPeca('base') ? 1 : 0)
        }}
        position={[0, -0.6, 0]}
        visible={temPeca('base')}
      >
        <boxGeometry args={[1.1, 0.45, 0.75]} />
        <meshStandardMaterial color={corAcento} />
      </mesh>

      <mesh
        ref={(el) => {
          refsPecas.current.tronco = el
          if (el) el.scale.setScalar(temPeca('tronco') ? 1 : 0)
        }}
        position={[0, 0.05, 0]}
        visible={temPeca('tronco')}
      >
        <boxGeometry args={[0.85, 0.85, 0.65]} />
        <meshStandardMaterial color={corTitulo} />
      </mesh>

      <mesh
        ref={(el) => {
          refsPecas.current.nucleo = el
          if (el) el.scale.setScalar(temPeca('nucleo') ? 1 : 0)
        }}
        position={[0, 0.75, 0]}
        visible={temPeca('nucleo')}
      >
        <sphereGeometry args={[0.38, 12, 10]} />
        <meshStandardMaterial color={corAcento} />
      </mesh>

      <group
        ref={(el) => {
          refsPecas.current.olhos = el
          if (el) el.scale.setScalar(temPeca('olhos') ? 1 : 0)
        }}
        visible={temPeca('olhos')}
      >
        <mesh position={[-0.14, 0.78, 0.33]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.14, 0.78, 0.33]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      <group
        ref={(el) => {
          refsPecas.current.antena = el
          if (el) el.scale.setScalar(temPeca('antena') ? 1 : 0)
        }}
        visible={temPeca('antena')}
      >
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
          <meshStandardMaterial color={corTitulo} />
        </mesh>
        <mesh position={[0, 1.46, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={corTitulo} />
        </mesh>
      </group>
    </group>
  )
}

export default RoboModelo3D
