'use client';

import React from 'react';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { TraversalPhase } from '@/types/treeTraversal';

interface StackCartridgeModelProps {
  val: number;
  phase: TraversalPhase;
  isTop?: boolean;
  position?: [number, number, number];
}

export function StackCartridgeModel({
  val,
  phase,
  isTop = false,
  position = [0, 0, 0],
}: StackCartridgeModelProps) {
  const isVisit = phase === 'visit';
  const themeColor = isVisit ? '#c084fc' : '#fbbf24'; // Violet vs Amber
  const emissiveColor = isVisit ? '#9333ea' : '#d97706';
  const glowIntensity = isTop ? 2.5 : 1.2;

  return (
    <group position={position}>
      {/* 1. Sleek Glassmorphic Rounded Token Card */}
      <RoundedBox args={[2.4, 0.42, 0.4]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color="#070a12"
          transmission={0.8}
          roughness={0.12}
          metalness={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={glowIntensity * 0.4}
        />
      </RoundedBox>

      {/* 2. Embedded Center Glowing Laser Bar */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[2.2, 0.08]} />
        <meshStandardMaterial
          color={themeColor}
          emissive={themeColor}
          emissiveIntensity={glowIntensity * 1.5}
        />
      </mesh>

      {/* 3. Top Point Light */}
      {isTop && <pointLight color={themeColor} intensity={2.8} distance={2.2} />}

      {/* 4. Crisp High-Contrast Typography */}
      <Html position={[0, 0, 0.25]} center distanceFactor={14} className="pointer-events-none select-none">
        <div className="flex items-center justify-between w-48 px-2 font-mono text-[10px] font-bold text-white">
          <div className="flex items-center gap-1.5">
            {isTop && (
              <span className="text-[9px] font-extrabold text-sky-400 bg-sky-500/20 px-1 py-0.2 rounded border border-sky-500/40 animate-pulse">
                TOP
              </span>
            )}
            <span className="bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
              Node {val}
            </span>
          </div>

          <span
            className={`px-1.5 py-0.5 rounded uppercase text-[9px] border ${
              isVisit
                ? 'bg-purple-950/90 text-purple-300 border-purple-500/60'
                : 'bg-amber-950/90 text-amber-300 border-amber-500/60'
            }`}
          >
            {phase}
          </span>
        </div>
      </Html>
    </group>
  );
}
