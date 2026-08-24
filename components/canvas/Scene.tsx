'use client';

import React from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useSimulationStore } from '@/lib/store/useSimulationStore';
import { SystemNode3D } from './SystemNode3D';
import { DataSplineStream } from './DataSplineStream';
import { GridFloor } from './GridFloor';
import { PostEffects } from './PostEffects';

export function Scene() {
  const currentScenario = useSimulationStore((s) => s.currentScenario);
  const currentStep = useSimulationStore((s) => s.getCurrentStep());

  return (
    <>
      {/* Cinematic Camera */}
      <PerspectiveCamera
        makeDefault
        position={[0, 8, 14]}
        fov={45}
        near={0.1}
        far={100}
      />

      {/* Orbit Controls with Smooth Damping */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.1} // Prevent going below floor
        minDistance={6}
        maxDistance={25}
        target={[0, 0, 0]}
      />

      {/* Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 15]}
        intensity={1.2}
        castShadow
      />
      {/* Accent Cyberpunk Neon Lights */}
      <pointLight position={[-10, 5, -5]} color="#0284c7" intensity={2} distance={20} />
      <pointLight position={[10, 5, 5]} color="#a855f7" intensity={2} distance={20} />

      {/* Isometric Grid Floor */}
      <GridFloor />

      {/* Connection Splines & Packet Streams */}
      {currentScenario.connections.map((conn) => (
        <DataSplineStream
          key={conn.id}
          connection={conn}
          nodes={currentScenario.nodes}
        />
      ))}

      {/* 3D System Nodes */}
      {currentScenario.nodes.map((node) => {
        const stateOverride = currentStep?.nodeStates?.[node.id];
        return (
          <SystemNode3D
            key={node.id}
            node={node}
            stateOverride={stateOverride}
          />
        );
      })}

      {/* Postprocessing Bloom & Vignette */}
      <PostEffects />
    </>
  );
}
