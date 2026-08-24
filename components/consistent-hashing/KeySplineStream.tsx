'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface KeySplineStreamProps {
  activeKey: {
    key: string;
    hash: number;
    serverId: string;
    serverColor: string;
    serverAngle: number;
    angleRad: number;
  } | null;
  onArrival?: () => void;
}

const RING_RADIUS = 5.5;

export function KeySplineStream({ activeKey, onArrival }: KeySplineStreamProps) {
  const packetRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  // Compute 3D CatmullRom spline trajectory from Client Ingestion Point to Ring Point to Server Target
  const { curve, isReady } = useMemo(() => {
    if (!activeKey) return { curve: null, isReady: false };

    // 1. Start: Client Cloud Ingestion Point in the Sky
    const pStart = new THREE.Vector3(0, 5.5, 0);

    // 2. Mid: Parabolic Arc entry point on Hash Ring
    const pEntry = new THREE.Vector3(
      RING_RADIUS * Math.cos(activeKey.angleRad),
      1.5,
      RING_RADIUS * Math.sin(activeKey.angleRad)
    );

    // 3. Ring Perimeter Point (Hash location)
    const pRing = new THREE.Vector3(
      RING_RADIUS * Math.cos(activeKey.angleRad),
      0.2,
      RING_RADIUS * Math.sin(activeKey.angleRad)
    );

    // 4. Target Server Point (Clockwise destination)
    const pServer = new THREE.Vector3(
      RING_RADIUS * Math.cos(activeKey.serverAngle),
      0.6,
      RING_RADIUS * Math.sin(activeKey.serverAngle)
    );

    const catmullCurve = new THREE.CatmullRomCurve3([pStart, pEntry, pRing, pServer]);
    return { curve: catmullCurve, isReady: true };
  }, [activeKey]);

  // Animate Key Packet along 3D Spline
  useFrame((_, delta) => {
    if (!curve || !packetRef.current || !activeKey) return;

    progressRef.current += delta * 0.9;
    if (progressRef.current >= 1) {
      progressRef.current = 1;
      if (onArrival) onArrival();
    }

    const t = Math.min(Math.max(progressRef.current, 0), 1);
    const position = curve.getPointAt(t);
    packetRef.current.position.copy(position);

    // Orient packet along tangent
    const tangent = curve.getTangentAt(t);
    packetRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  });

  if (!activeKey || !curve) return null;

  return (
    <group>
      {/* 1. Glowing 3D Spline Arc Conduit Tube */}
      <mesh>
        <tubeGeometry args={[curve, 40, 0.04, 8, false]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 2. Fast Animated Glowing Particle Packet */}
      <group ref={packetRef}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={3.5}
          />
        </mesh>

        <pointLight color="#f59e0b" intensity={4} distance={4} />

        {/* Trailing Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.36, 16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>

        {/* Floating In-Flight Payload Label */}
        <Html position={[0, 0.5, 0]} center distanceFactor={14}>
          <div className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/90 border border-amber-400 text-amber-200 shadow-2xl backdrop-blur-md whitespace-nowrap animate-pulse">
            ⚡ Ingest: {activeKey.key}
          </div>
        </Html>
      </group>
    </group>
  );
}
