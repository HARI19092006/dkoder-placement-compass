import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Group, type Mesh } from 'three'
import type { MotionValue } from 'motion/react'
import { COMPASS, NODE_ANGLE } from '../compass'
import { DESTINATIONS, type Destination } from '../data'

const SUN = '#FFC800'
const VIOLET = '#7C3AED'
const DEEP = '#40128A'
const LILAC = '#C9B6FF'

interface Props {
  active: Destination
  animate: boolean
  lite: boolean
  scroll?: MotionValue<number>
}

const angleDelta = (from: number, to: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from))

const ORB_COLORS = ['#FFC800', '#B79BFF', '#8B5CF6', '#FFF4CC']

function Orbs({ lite, animate, scroll }: { lite: boolean; animate: boolean; scroll?: MotionValue<number> }) {
  const group = useRef<Group>(null)
  const orbs = useMemo(() => {
    const n = lite ? 6 : 12
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + (i % 3) * 0.4
      const r = 2.7 + ((i * 37) % 10) / 22
      const z = -0.6 + ((i * 53) % 10) / 8
      return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.85, z, s: 0.03 + ((i * 17) % 5) / 110, c: ORB_COLORS[i % ORB_COLORS.length] }
    })
  }, [lite])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const k = Math.min(1, dt * 3)
    const scrolled = scroll ? scroll.get() : 0
    if (animate) g.rotation.z += dt * 0.04
    g.position.x += (state.pointer.x * 0.3 - g.position.x) * k
    g.position.y += (state.pointer.y * 0.2 - scrolled * 0.001 - g.position.y) * k
  })

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={[o.x, o.y, o.z]}>
          <sphereGeometry args={[o.s, 10, 10]} />
          <meshBasicMaterial color={o.c} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

const RINGS = [
  { r: 3.0, rot: [1.18, 0.32, 0.42] as const, color: '#B79BFF', ball: '#8B5CF6', size: 0.17, speed: 0.22, phase: 0.6 },
  { r: 3.25, rot: [1.32, -0.46, -0.3] as const, color: '#FFC800', ball: '#FFC800', size: 0.15, speed: -0.16, phase: 2.4 },
]

function OrbitRings({ animate, lite }: { animate: boolean; lite: boolean }) {
  const balls = useRef<(Mesh | null)[]>([])
  const extra = useRef<(Mesh | null)[]>([])
  const clock = useRef(0)

  useFrame((_, dt) => {
    if (animate) clock.current += Math.min(dt, 0.05)
    RINGS.forEach((ring, i) => {
      const t = ring.phase + clock.current * ring.speed
      balls.current[i]?.position.set(Math.cos(t) * ring.r, Math.sin(t) * ring.r, 0)
      const u = t + Math.PI * 0.9
      extra.current[i]?.position.set(Math.cos(u) * ring.r, Math.sin(u) * ring.r, 0)
    })
  })

  return (
    <>
      {RINGS.map((ring, i) => (
        <group key={i} rotation={[ring.rot[0], ring.rot[1], ring.rot[2]]}>
          <mesh>
            <torusGeometry args={[ring.r, 0.014, 6, lite ? 96 : 160]} />
            <meshBasicMaterial color={ring.color} transparent opacity={0.75} />
          </mesh>
          <mesh ref={(m) => { balls.current[i] = m }}>
            <sphereGeometry args={[ring.size, 24, 24]} />
            <meshStandardMaterial color={ring.ball} roughness={0.22} metalness={0.25} emissive={ring.ball} emissiveIntensity={0.18} />
          </mesh>
          <mesh ref={(m) => { extra.current[i] = m }}>
            <sphereGeometry args={[ring.size * 0.6, 16, 16]} />
            <meshStandardMaterial color={i === 0 ? SUN : '#A78BFA'} roughness={0.25} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Dial({ active, animate, lite, scroll }: Props) {
  const ticks = useRef<Group>(null)
  const orbit = useRef<Group>(null)
  const needle = useRef<Group>(null)
  const comet = useRef<Mesh>(null)
  const nodes = useRef<Record<string, Group | null>>({})
  const clock = useRef(0)

  const R = COMPASS.nodeRadius
  const tickCount = lite ? 12 : 24
  const dotCount = lite ? 24 : 48
  const seg = lite ? 32 : 64
  const target = NODE_ANGLE[active] - Math.PI / 2

  const tickAngles = useMemo(() => Array.from({ length: tickCount }, (_, i) => (i / tickCount) * Math.PI * 2), [tickCount])
  const dotAngles = useMemo(() => Array.from({ length: dotCount }, (_, i) => (i / dotCount) * Math.PI * 2), [dotCount])

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05)
    clock.current += step
    const n = needle.current
    if (n) {
      n.rotation.z = animate ? n.rotation.z + angleDelta(n.rotation.z, target) * Math.min(1, step * 5) : target
    }
    for (const d of DESTINATIONS) {
      const g = nodes.current[d.id]
      if (!g) continue
      const s = d.id === active ? 1.35 : 1
      const next = animate ? g.scale.x + (s - g.scale.x) * Math.min(1, step * 6) : s
      g.scale.setScalar(next)
    }
    const scrolled = scroll ? scroll.get() : 0
    if (ticks.current) ticks.current.rotation.z = (animate ? clock.current * 0.06 : 0) + scrolled * 0.0025
    if (orbit.current) orbit.current.rotation.z = -scrolled * 0.0015
    const c = comet.current
    if (c) {
      c.visible = animate
      if (animate) {
        const t = (clock.current / 2.6) % 1
        const a = NODE_ANGLE[active]
        c.position.set(Math.cos(a) * R * t, Math.sin(a) * R * t, 0.12)
        c.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.6)
      }
    }
  })

  return (
    <group rotation={[COMPASS.tilt, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.08]}>
        <cylinderGeometry args={[COMPASS.discRadius, COMPASS.discRadius, 0.14, seg]} />
        <meshStandardMaterial color={DEEP} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.005]}>
        <cylinderGeometry args={[1.86, 1.86, 0.01, seg]} />
        <meshBasicMaterial color="#47189C" />
      </mesh>
      <mesh>
        <torusGeometry args={[COMPASS.discRadius, 0.09, 16, seg * 2]} />
        <meshStandardMaterial color={VIOLET} roughness={0.3} metalness={0.2} emissive="#6D28D9" emissiveIntensity={0.35} />
      </mesh>
      <mesh>
        <torusGeometry args={[COMPASS.discRadius + 0.04, 0.22, 8, seg * 2]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <group ref={ticks}>
        {tickAngles.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 2.0, Math.sin(a) * 2.0, 0.02]} rotation={[0, 0, a]}>
            <boxGeometry args={[i % (tickCount / 4) === 0 ? 0.28 : 0.15, 0.045, 0.04]} />
            <meshStandardMaterial color={i % (tickCount / 4) === 0 ? SUN : '#F3EDFF'} />
          </mesh>
        ))}
      </group>

      <group ref={orbit}>
        {dotAngles.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 0.02]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color={LILAC} />
          </mesh>
        ))}
      </group>

      {DESTINATIONS.map((d) => {
        const a = NODE_ANGLE[d.id]
        const on = d.id === active
        return (
          <mesh key={d.id} position={[(Math.cos(a) * R) / 2, (Math.sin(a) * R) / 2, 0.01]} rotation={[0, 0, a]}>
            <boxGeometry args={[R, on ? 0.07 : 0.035, 0.02]} />
            <meshStandardMaterial color={on ? SUN : '#8B5CF6'} emissive={on ? SUN : '#000000'} emissiveIntensity={on ? 0.35 : 0} />
          </mesh>
        )
      })}

      {DESTINATIONS.map((d) => {
        const a = NODE_ANGLE[d.id]
        const on = d.id === active
        return (
          <group key={d.id} ref={(g) => { nodes.current[d.id] = g }} position={[Math.cos(a) * R, Math.sin(a) * R, 0.12]}>
            <mesh>
              <sphereGeometry args={[0.2, seg / 2, seg / 2]} />
              <meshStandardMaterial color={on ? SUN : '#A78BFA'} emissive={on ? SUN : '#000000'} emissiveIntensity={on ? 0.45 : 0} roughness={0.25} metalness={0.2} />
            </mesh>
            {on && (
              <mesh>
                <torusGeometry args={[0.34, 0.035, 8, 48]} />
                <meshBasicMaterial color={SUN} />
              </mesh>
            )}
          </group>
        )
      })}

      <group ref={needle} position={[0, 0, 0.22]}>
        <mesh position={[0, 0.62, 0]}>
          <coneGeometry args={[0.17, 1.24, 4]} />
          <meshStandardMaterial color={SUN} emissive={SUN} emissiveIntensity={0.3} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0, -0.36, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.13, 0.72, 4]} />
          <meshStandardMaterial color="#F3EDFF" roughness={0.4} flatShading />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.17, seg / 2, seg / 2]} />
        <meshStandardMaterial color="#FFF4CC" emissive={SUN} emissiveIntensity={0.35} roughness={0.2} metalness={0.3} />
      </mesh>

      <mesh ref={comet}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={SUN} />
      </mesh>
    </group>
  )
}

export default function PlacementCompassScene(props: Props) {
  return (
    <Canvas
      className="compass-canvas"
      frameloop={props.animate ? 'always' : 'demand'}
      dpr={[1, 1.5]}
      resize={{ scroll: false, offsetSize: true }}
      camera={{ position: [0, 0, COMPASS.cameraZ], fov: COMPASS.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 6]} intensity={1.7} />
      <pointLight position={[0, 0, 1.4]} intensity={3} distance={4} color={SUN} />
      <Orbs lite={props.lite} animate={props.animate} scroll={props.scroll} />
      <OrbitRings animate={props.animate} lite={props.lite} />
      <Dial {...props} />
    </Canvas>
  )
}