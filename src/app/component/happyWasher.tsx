'use client'
import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  MeshDistortMaterial,
  RoundedBox,
  Float,
  PerspectiveCamera
} from '@react-three/drei'
import * as THREE from 'three'
import { LimbProps } from '@/types/index'
/* =======================
   THEME COLORS
======================= */
const BODY_COLOR = '#F5EDED'     
const METAL_COLOR = '#E2D6CE'     
const WATER_COLOR = '#9ADCFD'     
const EYE_COLOR = '#111'

/* =======================
   Eye Component
======================= */
const Eye = ({ position }: { position: [number, number, number] }) => {
  const pupilRef = useRef<THREE.Group>(null!)

  useFrame(({ pointer }) => {
    pupilRef.current.position.x = THREE.MathUtils.lerp(
      pupilRef.current.position.x,
      pointer.x * 0.08,
      0.1
    )
    pupilRef.current.position.y = THREE.MathUtils.lerp(
      pupilRef.current.position.y,
      pointer.y * 0.08,
      0.1
    )
  })

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={EYE_COLOR} />
      </mesh>

      <group ref={pupilRef}>
        <mesh position={[0.06, 0.06, 0.12]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  )
}

/* =======================
   Limb
======================= */
const StylizedLimb = ({ position, rotation = [0, 0 , 0], isArm = false }: LimbProps) => (
  <mesh position={position} rotation={rotation}>
    <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
    <meshStandardMaterial color={BODY_COLOR} roughness={0.35} />
    <mesh position={[0, -0.4, 0]}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={isArm ? BODY_COLOR : '#222'} />
    </mesh>
  </mesh>
)


const Bubbles = () => {
  const COUNT = 26
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const bubbles = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: THREE.MathUtils.randFloat(-0.55, 0.55),
        y: THREE.MathUtils.randFloat(-0.7, 0.3),
        z: THREE.MathUtils.randFloat(-0.15, 0.15),
        size: THREE.MathUtils.randFloat(0.06, 0.14),
        speed: THREE.MathUtils.randFloat(0.004, 0.008),
        wobble: Math.random() * Math.PI * 2,
      })),
    []
  )

  useFrame(() => {
    bubbles.forEach((b, i) => {
      b.y += b.speed
      b.wobble += 0.02

      if (b.y > 1.1) {
        b.y = -0.7
        b.x = THREE.MathUtils.randFloat(-0.55, 0.55)
        b.size = THREE.MathUtils.randFloat(0.06, 0.14)
      }

      dummy.position.set(
        b.x + Math.sin(b.wobble) * 0.05,
        b.y,
        b.z + Math.cos(b.wobble) * 0.05
      )

      dummy.scale.setScalar(b.size)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })

    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial
        transparent
        opacity={0.22}
        transmission={1}
        roughness={0}
        thickness={0.4}
        ior={1.33}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={1.3}
      />
    </instancedMesh>
  )
}


const HappyWasherHero: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!)
  const waterRef = useRef<THREE.Mesh>(null!)

  useFrame(({ pointer, clock }) => {
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.3,
      0.08
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.2,
      0.08
    )

    waterRef.current.rotation.z =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.05
  })

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
      <group ref={groupRef}>
        <RoundedBox args={[2.5, 3.3, 2]} radius={0.4} smoothness={10}>
          <meshStandardMaterial
            color={BODY_COLOR}
            roughness={0.45}
            metalness={0.05}
          />
        </RoundedBox>

        <group position={[0, 0.8, 1.05]}>
          <Eye position={[-0.45, 0, 0]} />
          <Eye position={[0.45, 0, 0]} />
          <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.25, 0.035, 16, 32, Math.PI]} />
            <meshStandardMaterial color={EYE_COLOR} />
          </mesh>
        </group>

        <group position={[0, -0.6, 1.05]}>
          <mesh>
            <torusGeometry args={[0.7, 0.07, 16, 64]} />
            <meshStandardMaterial
              color={METAL_COLOR}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          <mesh ref={waterRef} position={[0, 0, 0.05]}>
            <circleGeometry args={[0.65, 64]} />
            <MeshDistortMaterial
              color={WATER_COLOR}
              speed={6}
              distort={0.25}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>

        <StylizedLimb position={[-0.7, -1.5, 0]} />
        <StylizedLimb position={[0.7, -1.5, 0]} />
        <StylizedLimb
          position={[-1.5, 0.3, 0]}
          rotation={[0, 0, Math.PI / 1.6]}
          isArm
        />
        <StylizedLimb
          position={[1.5, 0.3, 0]}
          rotation={[0, 0, -Math.PI / 1.6]}
          isArm
        />

        {/* BUBBLES */}
        <group position={[0, -0.4, 1]}>
          <Bubbles />
        </group>
      </group>
    </Float>
  )
}


export default function WasherScene() {
  return (
    <div className="w-full h-[600px] bg-transparent">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[0, -0.5, 3]} intensity={1.5} />

        <HappyWasherHero />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
