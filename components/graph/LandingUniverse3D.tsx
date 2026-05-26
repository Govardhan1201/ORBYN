'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, OrbitControls, Environment, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Generate random nodes
const NODE_COUNT = 60;
const BOUNDS = 25;

function UniverseNodes() {
  const group = useRef<THREE.Group>(null);

  // Generate random positions and connections
  const { nodes, lines } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * BOUNDS,
          (Math.random() - 0.5) * BOUNDS,
          (Math.random() - 0.5) * BOUNDS
        )
      );
    }

    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      // Connect each node to 1-3 nearest neighbors
      const current = nodes[i];
      const neighbors = [...nodes]
        .map((n, idx) => ({ node: n, dist: current.distanceTo(n), idx }))
        .filter(n => n.idx !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, Math.floor(Math.random() * 3) + 1);

      neighbors.forEach(n => {
        if (n.dist < 10) {
          lines.push([current, n.node]);
        }
      });
    }

    return { nodes, lines };
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Nodes */}
      {nodes.map((pos, i) => {
        const size = Math.random() * 0.4 + 0.2;
        const color = i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#a855f7' : '#ffffff';
        return (
          <Float key={`node-${i}`} speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[size, 32, 32]} position={pos}>
              <meshPhysicalMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={0.5}
                roughness={0.1}
                metalness={0.8}
                transmission={0.9} // glass-like
                thickness={0.5}
                ior={1.5}
              />
            </Sphere>
          </Float>
        );
      })}

      {/* Lines */}
      {lines.map((line, i) => (
        <Line 
          key={`line-${i}`}
          points={[line[0], line[1]]}
          color="white"
          opacity={0.15}
          transparent
          lineWidth={1}
        />
      ))}
    </group>
  );
}

export function LandingUniverse3D() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#020617] overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
        <fog attach="fog" args={['#020617', 15, 45]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
        
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <UniverseNodes />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
