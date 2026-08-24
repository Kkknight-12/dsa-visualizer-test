'use client';

import React from 'react';
import * as THREE from 'three';

export function GridFloor() {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Primary Tech Grid */}
      <gridHelper
        args={[36, 36, '#0284c7', '#1e293b']}
        position={[0, 0, 0]}
      />

      {/* Secondary Fine Grid */}
      <gridHelper
        args={[36, 72, '#0f172a', '#0f172a']}
        position={[0, -0.01, 0]}
      />

      {/* Dark Reflective Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#05070e"
          roughness={0.8}
          metalness={0.5}
        />
      </mesh>

      {/* Center glowing cyber ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[8, 8.08, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[14, 14.08, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
