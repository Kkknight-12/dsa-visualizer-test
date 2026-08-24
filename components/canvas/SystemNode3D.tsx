'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { SystemNode, NodeState } from '@/types/simulation';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

interface SystemNode3DProps {
  node: SystemNode;
  stateOverride?: NodeState;
}

export function SystemNode3D({ node, stateOverride }: SystemNode3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectedNodeId = useSimulationStore((s) => s.selectedNodeId);
  const selectNode = useSimulationStore((s) => s.selectNode);

  const isSelected = selectedNodeId === node.id;
  const activeState = stateOverride || node.state;

  // Determine glow and accent colors based on state
  let accentColor = '#38bdf8'; // cyan default
  let emissiveIntensity = 0.4;
  let statusBadgeColor = 'bg-sky-500/20 text-sky-400 border-sky-500/40';

  if (activeState === 'active' || activeState === 'processing') {
    accentColor = '#f59e0b'; // amber/orange
    emissiveIntensity = 1.2;
    statusBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse';
  } else if (activeState === 'hit' || activeState === 'success') {
    accentColor = '#10b981'; // emerald green
    emissiveIntensity = 1.5;
    statusBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
  } else if (activeState === 'miss' || activeState === 'warning') {
    accentColor = '#f97316'; // orange/red
    emissiveIntensity = 1.3;
    statusBadgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/50';
  } else if (activeState === 'error') {
    accentColor = '#ef4444'; // red
    emissiveIntensity = 1.8;
    statusBadgeColor = 'bg-red-500/20 text-red-300 border-red-500/50 animate-bounce';
  }

  // Subtle floating & rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle bobbing
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = node.position[1] + Math.sin(time * 2 + node.position[0]) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group
      ref={meshRef}
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(isSelected ? null : node.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      scale={hovered ? 1.08 : isSelected ? 1.12 : 1}
    >
      {/* Selection Halo Ring */}
      {(isSelected || hovered || activeState === 'active' || activeState === 'processing') && (
        <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.4, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Point Light for Local Bloom Glow */}
      <pointLight
        color={accentColor}
        intensity={activeState !== 'idle' ? 3.5 : 1.2}
        distance={4.5}
      />

      {/* --- RENDER 3D GEOMETRY BY TYPE --- */}

      {/* 1. CLIENT / BROWSER NODE */}
      {node.type === 'client' && (
        <group>
          {/* Base Stand */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 0.1, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Monitor Screen Frame */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.6, 1.0, 0.12]} />
            <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Glowing Screen Face */}
          <mesh position={[0, 0.4, 0.07]}>
            <planeGeometry args={[1.4, 0.82]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive={accentColor}
              emissiveIntensity={emissiveIntensity}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* 2. API GATEWAY / LOAD BALANCER */}
      {node.type === 'gateway' && (
        <group>
          {/* Outer Rotating Hex Ring */}
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.95, 0.05, 16, 6]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={emissiveIntensity * 1.2}
            />
          </mesh>
          {/* Central Hub Core */}
          <mesh>
            <cylinderGeometry args={[0.7, 0.7, 0.8, 6]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.9}
              roughness={0.2}
              emissive="#0284c7"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Glowing Aperture Core */}
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={emissiveIntensity * 1.5}
            />
          </mesh>
        </group>
      )}

      {/* 3. REDIS IN-MEMORY CACHE */}
      {node.type === 'cache' && (
        <group>
          {/* Tiered Hexagonal Memory Disks */}
          {[-0.35, 0, 0.35].map((yOffset, i) => (
            <group key={i} position={[0, yOffset, 0]}>
              <mesh>
                <cylinderGeometry args={[0.75, 0.75, 0.22, 6]} />
                <meshStandardMaterial
                  color="#1e1b4b"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Glowing Ruby Ring */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.78, 0.78, 0.06, 6]} />
                <meshStandardMaterial
                  color="#e11d48"
                  emissive={accentColor}
                  emissiveIntensity={emissiveIntensity * 1.4}
                />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 4. POSTGRESQL DATABASE */}
      {node.type === 'database' && (
        <group>
          {/* Cylindrical Storage Platters */}
          {[-0.45, -0.15, 0.15, 0.45].map((yOffset, i) => (
            <group key={i} position={[0, yOffset, 0]}>
              <mesh>
                <cylinderGeometry args={[0.7, 0.7, 0.2, 32]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.85}
                  roughness={0.15}
                />
              </mesh>
              {/* Glowing Emerald Data Stripe */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.72, 0.72, 0.04, 32]} />
                <meshStandardMaterial
                  color="#059669"
                  emissive={accentColor}
                  emissiveIntensity={emissiveIntensity * 1.2}
                />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 5. KAFKA MESSAGE QUEUE */}
      {node.type === 'queue' && (
        <group>
          {/* Main Buffer Conveyor Box */}
          <mesh>
            <boxGeometry args={[1.8, 0.7, 0.9]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Partition Slots */}
          {[-0.6, -0.2, 0.2, 0.6].map((xOffset, i) => (
            <mesh key={i} position={[xOffset, 0, 0.46]}>
              <boxGeometry args={[0.26, 0.45, 0.05]} />
              <meshStandardMaterial
                color="#8b5cf6"
                emissive={accentColor}
                emissiveIntensity={emissiveIntensity * (i === 1 ? 1.8 : 0.8)}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 6. WORKER / MICROSERVICE CHIP */}
      {node.type === 'worker' && (
        <group>
          {/* Compute Silicon Chip */}
          <mesh>
            <boxGeometry args={[1.2, 0.3, 1.2]} />
            <meshStandardMaterial color="#042f2e" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Glowing Processor Core */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.6]} />
            <meshStandardMaterial
              color="#0d9488"
              emissive={accentColor}
              emissiveIntensity={emissiveIntensity * 1.5}
            />
          </mesh>
          {/* Golden Pin Edges */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.25, 0.06, 1.25]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* 7. GENERIC / DSA NODE (LRU Cache DLL / Hash Node) */}
      {node.type === 'node' && (
        <group>
          <RoundedBox args={[1.2, 0.8, 0.8]} radius={0.08} smoothness={4}>
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.7}
              roughness={0.3}
              emissive={accentColor}
              emissiveIntensity={0.3}
            />
          </RoundedBox>
          <mesh position={[0, 0, 0.41]}>
            <planeGeometry args={[0.9, 0.5]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        </group>
      )}

      {/* --- 2D/3D FLOATING HTML BADGE & LABEL --- */}
      <Html
        position={[0, 1.1, 0]}
        center
        distanceFactor={15}
        zIndexRange={[100, 0]}
        className="pointer-events-none select-none"
      >
        <div className="flex flex-col items-center gap-1">
          {/* State indicator pill */}
          <div
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md transition-all duration-300 ${statusBadgeColor}`}
          >
            {activeState}
          </div>
          {/* Node name badge */}
          <div className="bg-slate-950/80 border border-slate-700/60 px-2.5 py-1 rounded-md shadow-xl text-center backdrop-blur-md min-w-[110px]">
            <p className="text-xs font-semibold text-slate-100 whitespace-nowrap">{node.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">{node.sublabel}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}
