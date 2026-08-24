'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NodeConnection, SystemNode } from '@/types/simulation';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

interface DataSplineStreamProps {
  connection: NodeConnection;
  nodes: SystemNode[];
}

export function DataSplineStream({ connection, nodes }: DataSplineStreamProps) {
  const fromNode = nodes.find((n) => n.id === connection.from);
  const toNode = nodes.find((n) => n.id === connection.to);

  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const playbackSpeed = useSimulationStore((s) => s.playbackSpeed);
  const currentStep = useSimulationStore((s) => s.getCurrentStep());
  const nextStep = useSimulationStore((s) => s.nextStep);

  const packetRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  // Check if this connection is currently carrying active traffic
  const isActivePath =
    currentStep?.activePath &&
    ((currentStep.activePath.from === connection.from && currentStep.activePath.to === connection.to) ||
      (connection.bidirectional &&
        currentStep.activePath.from === connection.to &&
        currentStep.activePath.to === connection.from));

  // Compute 3D Curve between nodes
  const { curve, points } = useMemo(() => {
    if (!fromNode || !toNode) {
      const dummy = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
      return { curve: dummy, points: [] };
    }

    const start = new THREE.Vector3(...fromNode.position);
    const end = new THREE.Vector3(...toNode.position);

    // Calculate elevated midpoint for 3D arc
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5);

    // Elevation arc
    const distance = start.distanceTo(end);
    const arcHeight = Math.min(distance * 0.25, 1.8);
    mid.y += arcHeight;

    if (connection.curveOffset) {
      mid.x += connection.curveOffset[0];
      mid.y += connection.curveOffset[1];
      mid.z += connection.curveOffset[2];
    }

    const catmullCurve = new THREE.CatmullRomCurve3([start, mid, end]);
    return {
      curve: catmullCurve,
      points: catmullCurve.getPoints(50),
    };
  }, [fromNode, toNode, connection]);

  // Determine active packet color
  const packetColor = currentStep?.activePath?.color || connection.color || '#38bdf8';

  // Animate packet along spline curve
  useFrame((_, delta) => {
    if (!isActivePath || !packetRef.current) return;

    if (isPlaying) {
      // Advance packet progress
      progressRef.current += delta * 0.7 * playbackSpeed;
      if (progressRef.current >= 1) {
        progressRef.current = 1;
        // Auto advance to next step after brief pause
        setTimeout(() => {
          if (useSimulationStore.getState().isPlaying) {
            nextStep();
            progressRef.current = 0;
          }
        }, 500 / playbackSpeed);
      }
    }

    const t = Math.min(Math.max(progressRef.current, 0), 1);
    const position = curve.getPointAt(t);
    packetRef.current.position.copy(position);

    // Dynamic rotation of packet along tangent
    const tangent = curve.getTangentAt(t);
    packetRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  });

  if (!fromNode || !toNode) return null;

  return (
    <group>
      {/* 1. Static Neon Conduit Tube / Path */}
      <mesh>
        <tubeGeometry args={[curve, 40, 0.035, 8, false]} />
        <meshStandardMaterial
          color={isActivePath ? packetColor : '#334155'}
          emissive={isActivePath ? packetColor : '#1e293b'}
          emissiveIntensity={isActivePath ? 1.0 : 0.2}
          transparent
          opacity={isActivePath ? 0.9 : 0.35}
        />
      </mesh>

      {/* 2. Active Glowing Particle Packet */}
      {isActivePath && (
        <group ref={packetRef}>
          {/* Glowing Sphere */}
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color={packetColor}
              emissive={packetColor}
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Trailing Energy Ring */}
          <mesh ref={trailRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.28, 0.36, 16]} />
            <meshBasicMaterial color={packetColor} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>

          {/* Local Point Light for High Bloom Halo */}
          <pointLight color={packetColor} intensity={3.5} distance={3} />

          {/* Floating Packet Label */}
          {currentStep?.activePath?.label && (
            <Html position={[0, 0.5, 0]} center distanceFactor={14} className="pointer-events-none select-none">
              <div className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight bg-slate-950/90 border border-sky-400/50 text-sky-200 shadow-xl backdrop-blur-md whitespace-nowrap animate-pulse">
                📦 {currentStep.activePath.label}
              </div>
            </Html>
          )}
        </group>
      )}
    </group>
  );
}
