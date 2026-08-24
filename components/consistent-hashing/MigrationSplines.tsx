'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface MigrationSplinesProps {
  migratingKeys: {
    key: string;
    fromServerId: string;
    toServerId: string;
    fromAngle: number;
    toAngle: number;
  }[];
}

const RING_RADIUS = 5.5;

export function MigrationSplines({ migratingKeys }: MigrationSplinesProps) {
  if (migratingKeys.length === 0) return null;

  return (
    <group>
      {migratingKeys.map((item, idx) => (
        <SingleMigrationSpline key={`${item.key}-${idx}`} item={item} index={idx} />
      ))}
    </group>
  );
}

function SingleMigrationSpline({
  item,
  index,
}: {
  item: { key: string; fromAngle: number; toAngle: number };
  index: number;
}) {
  const packetRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  const { curve } = useMemo(() => {
    const pStart = new THREE.Vector3(
      RING_RADIUS * Math.cos(item.fromAngle),
      0.6,
      RING_RADIUS * Math.sin(item.fromAngle)
    );
    const pEnd = new THREE.Vector3(
      RING_RADIUS * Math.cos(item.toAngle),
      0.6,
      RING_RADIUS * Math.sin(item.toAngle)
    );

    // Elevated Mid Arc Point
    const pMid = new THREE.Vector3()
      .addVectors(pStart, pEnd)
      .multiplyScalar(0.5);
    pMid.y += 2.0 + (index % 3) * 0.4;

    const catmull = new THREE.CatmullRomCurve3([pStart, pMid, pEnd]);
    return { curve: catmull };
  }, [item, index]);

  useFrame((_, delta) => {
    if (!packetRef.current) return;
    progressRef.current = (progressRef.current + delta * 0.8) % 1.0;
    const pos = curve.getPointAt(progressRef.current);
    packetRef.current.position.copy(pos);
  });

  return (
    <group>
      {/* Curved Neon Conduit Path */}
      <mesh>
        <tubeGeometry args={[curve, 30, 0.03, 8, false]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#f43f5e"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Migrating Glowing Packet */}
      <group ref={packetRef}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={3.0} />
        </mesh>
        <pointLight color="#f43f5e" intensity={3} distance={3} />

        <Html position={[0, 0.4, 0]} center distanceFactor={16}>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-950/90 border border-rose-500/80 text-rose-200 whitespace-nowrap animate-pulse">
            🔄 {item.key}
          </span>
        </Html>
      </group>
    </group>
  );
}
