'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TraversalPhase } from '@/types/treeTraversal';

interface TreeNodeModelProps {
  val: number;
  id: string;
  position: [number, number, number];
  isActive?: boolean;
  isVisited?: boolean;
  stackPhase?: TraversalPhase;
  onClick?: () => void;
}

export function TreeNodeModel({
  val,
  id,
  position,
  isActive = false,
  isVisited = false,
  stackPhase,
  onClick,
}: TreeNodeModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // State color mapping
  let coreColor = '#38bdf8'; // Electric Cyan (Default/Active)
  let glowIntensity = 1.0;
  let statusText = '';
  let badgeClass = 'border-slate-700 bg-slate-900/90 text-slate-300';

  if (isVisited) {
    coreColor = '#10b981'; // Emerald Green
    glowIntensity = 2.5;
    statusText = 'VISITED';
    badgeClass = 'border-emerald-500/80 bg-emerald-950/90 text-emerald-300 shadow-emerald-500/20';
  } else if (isActive) {
    coreColor = '#38bdf8'; // Cyan
    glowIntensity = 3.5;
    statusText = 'POPPED';
    badgeClass = 'border-sky-400 bg-sky-950/90 text-sky-200 shadow-sky-500/30 animate-pulse';
  } else if (stackPhase === 'visit') {
    coreColor = '#a855f7'; // Purple Marker
    glowIntensity = 2.0;
    statusText = 'VISIT MARKER';
    badgeClass = 'border-purple-500/80 bg-purple-950/90 text-purple-300 shadow-purple-500/20';
  } else if (stackPhase === 'expand') {
    coreColor = '#f59e0b'; // Amber
    glowIntensity = 1.8;
    statusText = 'EXPAND';
    badgeClass = 'border-amber-500/80 bg-amber-950/90 text-amber-300 shadow-amber-500/20';
  } else {
    coreColor = '#475569'; // Slate Idle
    glowIntensity = 0.4;
  }

  useFrame((state, delta) => {
    if (ringRef.current && (isActive || isVisited)) {
      ringRef.current.rotation.z += delta * 1.5;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
    }
    if (meshRef.current && isActive) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * 3) * 0.06;
    }
  });

  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* 1. Outer Frosted Glass Orb */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial
          color="#0f172a"
          transmission={0.85}
          opacity={0.8}
          transparent
          roughness={0.1}
          metalness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive={coreColor}
          emissiveIntensity={glowIntensity * 0.25}
        />
      </mesh>

      {/* 2. Inner Glowing Energy Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={glowIntensity}
          roughness={0.2}
        />
      </mesh>

      {/* 3. Subtle Metallic Equatorial Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.57, 0.02, 16, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 4. Active/Visited Orbital Laser Ring */}
      {(isActive || isVisited) && (
        <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[0.72, 0.015, 16, 32]} />
          <meshBasicMaterial color={coreColor} transparent opacity={0.8} />
        </mesh>
      )}

      {/* 5. Point Light for Bloom Halos */}
      <pointLight
        color={coreColor}
        intensity={isActive ? 4.0 : isVisited ? 2.5 : 1.0}
        distance={3.5}
      />

      {/* 6. High-Contrast Center 3D Label */}
      <Html position={[0, 0, 0]} center distanceFactor={13} className="pointer-events-none select-none">
        <div className="flex flex-col items-center">
          {/* Centered Node Number */}
          <span className="text-sm font-mono font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {val}
          </span>
        </div>
      </Html>

      {/* 7. Floating Status Badge Below Node */}
      {statusText && (
        <Html position={[0, -0.75, 0]} center distanceFactor={14} className="pointer-events-none select-none">
          <span
            className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border shadow-xl backdrop-blur-md whitespace-nowrap ${badgeClass}`}
          >
            {statusText} {isVisited && '✓'}
          </span>
        </Html>
      )}
    </group>
  );
}
