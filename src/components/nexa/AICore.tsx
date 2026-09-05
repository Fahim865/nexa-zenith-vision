import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const TEAL = new THREE.Color("#3ee0cf");
const AMBER = new THREE.Color("#f2b25c");
const VIOLET = new THREE.Color("#7c6bf0");

function damp(current: number, target: number, k: number, dt: number) {
  return target + (current - target) * Math.exp(-k * dt);
}

/** Glowing inner core with layered transparent glass shells. */
function Core({ quality }: { quality: number }) {
  const inner = useRef<THREE.Mesh>(null);
  const shellA = useRef<THREE.Mesh>(null);
  const shellB = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (inner.current) {
      const s = 1 + Math.sin(t * 1.1) * 0.035;
      inner.current.scale.setScalar(s);
      inner.current.rotation.y += dt * 0.25;
    }
    if (shellA.current) {
      shellA.current.rotation.y -= dt * 0.12;
      shellA.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (shellB.current) {
      shellB.current.rotation.y += dt * 0.08;
      shellB.current.rotation.z = Math.cos(t * 0.25) * 0.12;
    }
  });

  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.62, quality > 1 ? 4 : 2]} />
        <meshStandardMaterial
          color={TEAL}
          emissive={TEAL}
          emissiveIntensity={1.1}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      <mesh scale={1.12}>
        <icosahedronGeometry args={[0.62, 2]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.1} />
      </mesh>

      <mesh ref={shellA}>
        <icosahedronGeometry args={[1.05, quality > 1 ? 2 : 1]} />
        <meshPhysicalMaterial
          color={"#9fd9ff"}
          transparent
          opacity={0.07}
          roughness={0.08}
          metalness={0.2}
          transmission={0.6}
          thickness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={shellB} scale={1.35}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.16} />
      </mesh>

      <pointLight color={TEAL} intensity={7} distance={8} />
    </group>
  );
}

/** Thin orbital rings at varied tilts. */
function Rings({ quality }: { quality: number }) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () => [
      { r: 1.55, tilt: [1.35, 0.2, 0.1], color: TEAL, speed: 0.22, op: 0.55 },
      { r: 1.9, tilt: [1.05, 0.9, 0.3], color: AMBER, speed: -0.16, op: 0.42 },
      { r: 2.35, tilt: [1.5, -0.5, 0.6], color: VIOLET, speed: 0.11, op: 0.3 },
      { r: 2.8, tilt: [1.2, 0.4, -0.4], color: TEAL, speed: -0.08, op: 0.18 },
    ],
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.rotation.z += dt * rings[i]!.speed;
    });
  });

  return (
    <group ref={group}>
      {rings.slice(0, quality > 1 ? 4 : 3).map((ring, i) => (
        <group key={i} rotation={ring.tilt as unknown as THREE.Euler}>
          <mesh>
            <torusGeometry args={[ring.r, 0.006, 6, quality > 1 ? 160 : 90]} />
            <meshBasicMaterial color={ring.color} transparent opacity={ring.op} />
          </mesh>
          <mesh position={[ring.r, 0, 0]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color={ring.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Ambient particle field / data points. */
function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 4.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={"#bcd8ff"}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Small floating data nodes around the core. */
function DataNodes({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2,
        radius: 2.1 + (i % 3) * 0.45,
        y: Math.sin(i * 1.7) * 0.9,
        size: 0.05 + (i % 2) * 0.03,
        color: i % 3 === 0 ? AMBER : TEAL,
      })),
    [count],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!group.current) return;
    group.current.rotation.y += dt * 0.06;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      child.position.y = nodes[i]!.y + Math.sin(t * 0.7 + i) * 0.16;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh
          key={i}
          position={[Math.cos(n.angle) * n.radius, n.y, Math.sin(n.angle) * n.radius]}
        >
          <boxGeometry args={[n.size, n.size, n.size]} />
          <meshBasicMaterial color={n.color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** Pointer + scroll driven parallax rig. */
function Rig({ children, intensity }: { children: React.ReactNode; intensity: number }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const scroll = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    scroll.current = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollNorm = Math.min(scroll.current / 900, 1);

    const px = state.pointer.x * intensity;
    const py = state.pointer.y * intensity;

    if (group.current) {
      group.current.rotation.y = damp(group.current.rotation.y, px * 0.5 + t * 0.03, 3, dt);
      group.current.rotation.x = damp(group.current.rotation.x, -py * 0.32 + scrollNorm * 0.4, 3, dt);
      group.current.position.y = damp(
        group.current.position.y,
        -1.15 + Math.sin(t * 0.5) * 0.12 - scrollNorm * 1.2,
        2.5,
        dt,
      );
      const s = 1 - scrollNorm * 0.18;
      group.current.scale.setScalar(damp(group.current.scale.x, s, 3, dt));
    }

    camera.position.x = damp(camera.position.x, px * 0.6, 2.5, dt);
    camera.position.y = damp(camera.position.y, py * 0.4, 2.5, dt);
    camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

export default function AICore({ lowPower = false }: { lowPower?: boolean }) {
  const quality = lowPower ? 1 : 2;
  const particles = lowPower ? 220 : 900;

  return (
    <Canvas
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.6, 9], fov: 45 }}
      gl={{ antialias: !lowPower, powerPreference: "high-performance", alpha: true }}
      frameloop="always"
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color={"#cfe6ff"} />
      <pointLight position={[-5, -2, -3]} intensity={12} color={"#f2b25c"} distance={14} />
      <pointLight position={[5, 3, -4]} intensity={10} color={"#7c6bf0"} distance={16} />

      <Environment resolution={64}>
        <Lightformer intensity={1.6} position={[0, 4, 2]} scale={[8, 8, 1]} color="#9fd9ff" />
        <Lightformer
          intensity={1}
          color="#f2b25c"
          position={[-5, 0, 1]}
          rotation-y={Math.PI / 2}
          scale={[12, 2, 1]}
        />
      </Environment>

      <Rig intensity={lowPower ? 0.25 : 1}>
        <Core quality={quality} />
        <Rings quality={quality} />
        <DataNodes count={lowPower ? 6 : 12} />
        <Particles count={particles} />
      </Rig>
    </Canvas>
  );
}
