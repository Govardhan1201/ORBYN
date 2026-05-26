'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force-3d';
import type { GraphData, TopicNode } from '@/types/topic.types';
import { useTheme } from '@/components/providers/ThemeProvider';

function Node({ node, onNodeClick, activeNodeId }: { node: TopicNode & { x?: number, y?: number, z?: number }, onNodeClick?: (n: TopicNode) => void, activeNodeId: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const isActive = activeNodeId === node.id;

  // Visuals based on theme / glow
  const size = (node.val || 4) * 0.5;
  let color = '#6366f1';
  if (node.glowState === 'blue') color = '#3b82f6';
  if (node.glowState === 'gold') color = '#f59e0b';
  if (node.glowState === 'green') color = '#10b981';
  if (node.glowState === 'purple') color = '#8b5cf6';
  if (node.glowState === 'red') color = '#ef4444';

  const finalColor = isActive ? '#ffffff' : color;
  const opacity = activeNodeId && !isActive ? 0.3 : 1;

  useFrame(() => {
    if (meshRef.current && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
      // Lerp to position for smooth physics updates
      meshRef.current.position.lerp(new THREE.Vector3(node.x, node.y, node.z), 0.1);
    }
  });

  return (
    <group>
      <Sphere 
        ref={meshRef}
        args={[size, 32, 32]} 
        onClick={(e) => { e.stopPropagation(); if(onNodeClick) onNodeClick(node); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { setHover(false); document.body.style.cursor = 'auto'; }}
      >
        <meshPhysicalMaterial 
          color={finalColor} 
          emissive={finalColor}
          emissiveIntensity={hovered || isActive ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
          transmission={0.8} 
          transparent
          opacity={opacity}
          thickness={1}
          ior={1.5}
        />
        {(hovered || isActive || size > 5) && (
          <Html center distanceFactor={100} zIndexRange={[100, 0]} style={{ transition: 'all 0.2s', opacity: opacity }}>
            <div className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap backdrop-blur-md border ${isActive ? 'bg-white/20 border-white text-white shadow-glow-blue scale-110' : 'bg-black/50 border-white/20 text-white/90'}`}>
              {node.name}
            </div>
          </Html>
        )}
      </Sphere>
    </group>
  );
}

function Edges({ links, nodes }: { links: any[], nodes: any[] }) {
  const linesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Dynamic line updating would go here if we used raw line geometries,
    // but Drei's Line component handles ref updates differently.
    // For performance, we'll let React handle reconciliation for now, 
    // or build a custom BufferGeometry for 1000s of links.
  });

  return (
    <group ref={linesRef}>
      {links.map((link, i) => {
        const source = nodes.find(n => n.id === link.source.id || n.id === link.source);
        const target = nodes.find(n => n.id === link.target.id || n.id === link.target);
        if (!source || !target || source.x === undefined || target.x === undefined) return null;
        
        return (
          <Line 
            key={`link-${i}`}
            points={[[source.x, source.y, source.z], [target.x, target.y, target.z]]}
            color="white"
            opacity={0.15}
            transparent
            lineWidth={link.weight || 1}
          />
        );
      })}
    </group>
  );
}

function SimulationEngine({ data, activeNodeId, onNodeClick }: { data: GraphData, activeNodeId: string | null, onNodeClick?: (n: TopicNode) => void }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [simNodes, setSimNodes] = useState<any[]>([]);
  const [simLinks, setSimLinks] = useState<any[]>([]);

  useEffect(() => {
    // Initialize D3 Force 3D
    const nodes = data.nodes.map(n => ({ ...n, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50, z: Math.random() * 100 - 50 }));
    const links = data.links.map(l => ({ ...l }));

    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id((d: any) => d.id).distance(30))
      .force('charge', forceManyBody().strength(-100))
      .force('center', forceCenter(0, 0, 0))
      .on('tick', () => {
        // Trigger re-render or update refs
        setSimNodes([...nodes]);
        setSimLinks([...links]);
      });

    return () => {
      simulation.stop();
    };
  }, [data]);

  useEffect(() => {
    if (activeNodeId) {
      const node = simNodes.find(n => n.id === activeNodeId);
      if (node && node.x !== undefined && controlsRef.current) {
        // Simple camera fly-to logic
        const targetPos = new THREE.Vector3(node.x, node.y, node.z);
        const camPos = targetPos.clone().add(new THREE.Vector3(0, 0, 40));
        camera.position.lerp(camPos, 0.1);
        controlsRef.current.target.lerp(targetPos, 0.1);
      }
    }
  }, [activeNodeId, simNodes, camera]);

  return (
    <>
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
      {simNodes.map(node => (
        <Node key={node.id} node={node} onNodeClick={onNodeClick} activeNodeId={activeNodeId} />
      ))}
      <Edges links={simLinks} nodes={simNodes} />
    </>
  );
}

export default function KnowledgeGraph3D({ data, onNodeClick }: { data: GraphData, onNodeClick?: (node: TopicNode) => void }) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const handleNodeClick = (node: TopicNode) => {
    setActiveNodeId(node.id === activeNodeId ? null : node.id);
    if (onNodeClick) onNodeClick(node);
  };

  return (
    <div className="w-full h-full relative bg-[#020617] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 150], fov: 60 }}>
        <fog attach="fog" args={['#020617', 50, 400]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={2} color="#ffffff" />
        <pointLight position={[-100, -100, -100]} intensity={1} color="#60a5fa" />
        
        <SimulationEngine data={data} activeNodeId={activeNodeId} onNodeClick={handleNodeClick} />
      </Canvas>

      {/* Active Node ControlsOverlay */}
      {activeNodeId && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full flex items-center gap-4 animate-slide-up border-primary/30 shadow-glow-blue z-20">
          <span className="text-sm font-medium text-white">Exploring Node</span>
          <button 
            onClick={() => setActiveNodeId(null)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Reset Camera
          </button>
        </div>
      )}
    </div>
  );
}
