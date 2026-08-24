'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TreeStepState } from '@/types/treeTraversal';

interface StackChamber3DProps {
  currentStep: TreeStepState;
}

const CHAMBER_X = 4.2;

export function StackChamber3D({ currentStep }: StackChamber3DProps) {
  const stack = currentStep.stackSnapshot; // 0 is bottom, last is top

  return (
    <group position={[CHAMBER_X, 0, 0]}>
      {/* 1. Chamber Floor Base */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.2, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Glowing Chamber Floor Laser Ring */}
      <mesh position={[0, -1.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Glass Holographic Cylinder Container */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 4.8, 24, 1, true]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#7c3aed"
          emissiveIntensity={0.2}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Guide Vertical Laser Pillars */}
      {[-1.3, 1.3].map((xOffset, i) => (
        <mesh key={i} position={[xOffset, 0.8, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 4.8, 8]} />
          <meshStandardMaterial color="#a855f7" emissive="#c084fc" emissiveIntensity={2.0} />
        </mesh>
      ))}

      {/* Chamber Header Label */}
      <Html position={[0, 3.8, 0]} center distanceFactor={14}>
        <div className="flex flex-col items-center gap-0.5 select-none pointer-events-none">
          <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-950/90 border border-purple-500/60 text-purple-300 shadow-2xl backdrop-blur-xl whitespace-nowrap">
            3D Call Stack (Depth: {stack.length})
          </span>
          <span className="text-[9px] font-mono text-slate-400">LIFO Chamber</span>
        </div>
      </Html>

      {/* 3. Physical 3D Stack Frame Blocks */}
      {stack.map((frame, idx) => {
        const isTop = idx === stack.length - 1;
        const isVisit = frame.phase === 'visit';
        const blockColor = isVisit ? '#a855f7' : '#f59e0b';
        const yPos = -1.2 + idx * 0.65;

        return (
          <group key={`${frame.node.id}-${frame.phase}-${idx}`} position={[0, yPos, 0]}>
            {/* Physical Frame Box */}
            <mesh>
              <boxGeometry args={[2.0, 0.45, 1.0]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.8}
                roughness={0.2}
                emissive={blockColor}
                emissiveIntensity={isTop ? 1.8 : 0.8}
              />
            </mesh>

            {/* Glowing Accent Border */}
            <mesh position={[0, 0, 0.51]}>
              <planeGeometry args={[1.8, 0.35]} />
              <meshBasicMaterial color={blockColor} transparent opacity={0.6} />
            </mesh>

            {/* Local Glow Light for Top Block */}
            {isTop && <pointLight color={blockColor} intensity={2.5} distance={2.5} />}

            {/* Block Text Label */}
            <Html position={[0, 0, 0.6]} center distanceFactor={15}>
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-100 whitespace-nowrap select-none">
                {isTop && <span className="text-sky-400 font-extrabold animate-pulse">TOP →</span>}
                <span className="px-1 py-0.2 rounded bg-slate-900 border border-slate-700">
                  Node({frame.node.val})
                </span>
                <span
                  className={`px-1 py-0.2 rounded uppercase ${
                    isVisit
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50'
                      : 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                  }`}
                >
                  {frame.phase}
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* 4. Popped Frame Animation (Floating above chamber) */}
      {currentStep.poppedFrame && (
        <group position={[0, 3.1, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 0.4, 0.9]} />
            <meshStandardMaterial
              color="#0369a1"
              emissive="#38bdf8"
              emissiveIntensity={2.5}
            />
          </mesh>
          <pointLight color="#38bdf8" intensity={4} distance={3} />
          <Html position={[0, 0.5, 0]} center distanceFactor={14}>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-950 border border-sky-400 text-sky-200 shadow-2xl backdrop-blur-md animate-bounce whitespace-nowrap">
              ⚡ POPPED Node {currentStep.poppedFrame.node.val} [{currentStep.poppedFrame.phase}]
            </span>
          </Html>
        </group>
      )}
    </group>
  );
}
