'use client';

import React from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { GridFloor } from '@/components/canvas/GridFloor';
import { PostEffects } from '@/components/canvas/PostEffects';
import { HashRing3D } from './HashRing3D';
import { KeySplineStream } from './KeySplineStream';
import { MigrationSplines } from './MigrationSplines';
import { ConsistentHashingEngine } from '@/ConsistentHashing';

interface HashRingSceneProps {
  ring: ConsistentHashingEngine.ConsistentHashRing;
  activeKey: {
    key: string;
    hash: number;
    serverId: string;
    serverColor: string;
    serverAngle: number;
    angleRad: number;
  } | null;
  migratingKeys: {
    key: string;
    fromServerId: string;
    toServerId: string;
    fromAngle: number;
    toAngle: number;
  }[];
  showVNodes: boolean;
  onKeyArrival: () => void;
}

export function HashRingScene({
  ring,
  activeKey,
  migratingKeys,
  showVNodes,
  onKeyArrival,
}: HashRingSceneProps) {
  return (
    <>
      {/* Cinematic Isometric Camera */}
      <PerspectiveCamera
        makeDefault
        position={[0, 9, 14]}
        fov={48}
        near={0.1}
        far={100}
      />

      {/* Orbit Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={5}
        maxDistance={25}
        target={[0, 0, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 15]} intensity={1.3} castShadow />
      <pointLight position={[-12, 6, -6]} color="#0284c7" intensity={2.5} distance={20} />
      <pointLight position={[12, 6, 6]} color="#a855f7" intensity={2.5} distance={20} />

      {/* Grid Floor */}
      <GridFloor />

      {/* 3D Hash Ring with Physical Servers & Virtual Nodes */}
      <HashRing3D
        ring={ring}
        activeKey={activeKey}
        migratingKeys={migratingKeys}
        showVNodes={showVNodes}
      />

      {/* 3D CatmullRom Key Trajectory Stream */}
      <KeySplineStream activeKey={activeKey} onArrival={onKeyArrival} />

      {/* 3D Migration Splines on Node Add/Crash */}
      <MigrationSplines migratingKeys={migratingKeys} />

      {/* Postprocessing Neon Bloom & Vignette */}
      <PostEffects />
    </>
  );
}
