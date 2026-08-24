'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BranchConduitModelProps {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  isActive?: boolean;
  isVisited?: boolean;
  type?: 'left' | 'right';
}

export function BranchConduitModel({
  fromPos,
  toPos,
  isActive = false,
  isVisited = false,
  type = 'left',
}: BranchConduitModelProps) {
  const photonRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  // Compute Natural Tree S-Curve Branch
  const { curve } = useMemo(() => {
    // Branch exits from bottom of parent
    const p1 = new THREE.Vector3(fromPos[0], fromPos[1] - 0.52, fromPos[2]);
    // Mid control points
    const midY = (fromPos[1] + toPos[1]) / 2;
    const p2 = new THREE.Vector3(fromPos[0], midY, fromPos[2] + 0.1);
    const p3 = new THREE.Vector3(toPos[0], midY, toPos[2] + 0.1);
    // Branch enters top of child
    const p4 = new THREE.Vector3(toPos[0], toPos[1] + 0.52, toPos[2]);

    const catmull = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
    return { curve: catmull };
  }, [fromPos, toPos]);

  const color = isActive ? '#38bdf8' : isVisited ? '#10b981' : '#334155';
  const emissiveIntensity = isActive ? 3.0 : isVisited ? 1.5 : 0.2;

  useFrame((_, delta) => {
    if (!isActive || !photonRef.current) return;
    progressRef.current = (progressRef.current + delta * 1.5) % 1.0;
    const pos = curve.getPointAt(progressRef.current);
    photonRef.current.position.copy(pos);
  });

  return (
    <group>
      {/* 1. Frosted Outer Glass Branch Conduit */}
      <mesh>
        <tubeGeometry args={[curve, 32, 0.045, 8, false]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Inner Glowing Core Line */}
      <mesh>
        <tubeGeometry args={[curve, 32, 0.016, 8, false]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 1.5}
        />
      </mesh>

      {/* 3. Traveling Energy Photon (When Active) */}
      {isActive && (
        <mesh ref={photonRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={4.0} />
          <pointLight color="#38bdf8" intensity={2.5} distance={1.5} />
        </mesh>
      )}
    </group>
  );
}
