'use client';

import React from 'react';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { TraversalFrame } from '@/types/treeTraversal';
import { StackCartridgeModel } from './StackCartridgeModel';

interface StackChamberModelProps {
  stack: TraversalFrame[];
  poppedFrame?: TraversalFrame | null;
  position?: [number, number, number];
}

const SLOT_HEIGHT = 0.55;
const BASE_Y = -1.2;

export function StackChamberModel({
  stack,
  poppedFrame,
  position = [4.2, 0, 0],
}: StackChamberModelProps) {
  return (
    <group position={position}>
      {/* 1. Stack Tray Solid Bottom Base */}
      <group position={[0, -1.6, 0]}>
        <RoundedBox args={[3.0, 0.25, 1.2]} radius={0.06}>
          <meshStandardMaterial color="#0b0f19" metalness={0.9} roughness={0.2} />
        </RoundedBox>
        {/* Glowing Floor Alignment Line */}
        <mesh position={[0, 0.13, 0]}>
          <planeGeometry args={[2.6, 0.04]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>

      {/* 2. Left & Right Transparent Glass Guide Rails (U-Rack) */}
      {[-1.38, 1.38].map((xOffset, i) => (
        <group key={i} position={[xOffset, 0.5, 0]}>
          {/* Main Acrylic Rail */}
          <RoundedBox args={[0.12, 4.0, 0.9]} radius={0.04}>
            <meshPhysicalMaterial
              color="#05070e"
              transmission={0.85}
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.3}
              emissive="#7c3aed"
              emissiveIntensity={0.2}
            />
          </RoundedBox>

          {/* Neon Edge Strip */}
          <mesh position={[xOffset > 0 ? -0.065 : 0.065, 0, 0.46]}>
            <boxGeometry args={[0.02, 3.9, 0.02]} />
            <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* 3. Back Smoked Acrylic Glass Backplate */}
      <mesh position={[0, 0.5, -0.42]}>
        <planeGeometry args={[2.7, 4.0]} />
        <meshPhysicalMaterial
          color="#030712"
          transmission={0.9}
          roughness={0.15}
          metalness={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* 4. Slot Shelf Ticks (0 to 4) */}
      {[0, 1, 2, 3, 4].map((slotIdx) => {
        const y = BASE_Y + slotIdx * SLOT_HEIGHT;
        return (
          <group key={slotIdx} position={[0, y - 0.22, 0]}>
            {/* Subtle Horizontal Shelf Line */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.6, 0.02, 0.8]} />
              <meshBasicMaterial color="#334155" transparent opacity={0.3} />
            </mesh>
            {/* Slot Label */}
            <Html position={[1.65, 0, 0]} center distanceFactor={15} className="pointer-events-none select-none">
              <span className="text-[8px] font-mono text-slate-500 bg-slate-950/80 px-1 py-0.2 rounded border border-slate-800">
                [{slotIdx}]
              </span>
            </Html>
          </group>
        );
      })}

      {/* 5. Top Intake Header: CALL STACK (LIFO) */}
      <group position={[0, 2.8, 0]}>
        <Html position={[0, 0, 0]} center distanceFactor={14} className="pointer-events-none select-none">
          <div className="flex flex-col items-center gap-1">
            <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-950/90 border border-purple-500/60 text-purple-300 shadow-2xl backdrop-blur-xl whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              CALL STACK (LIFO)
            </span>
            <span className="text-[9px] font-mono font-bold text-sky-400 animate-bounce">
              ↓ PUSH / POP INTAKE
            </span>
          </div>
        </Html>
      </group>

      {/* 6. Stacked Physical Token Cards */}
      {stack.map((frame, idx) => {
        const isTop = idx === stack.length - 1;
        const yPos = BASE_Y + idx * SLOT_HEIGHT;
        return (
          <StackCartridgeModel
            key={`${frame.node.id}-${frame.phase}-${idx}`}
            val={frame.node.val}
            phase={frame.phase}
            isTop={isTop}
            position={[0, yPos, 0]}
          />
        );
      })}

      {/* 7. Popped Card (Hovering with Cyan Energy Beam above the tray) */}
      {poppedFrame && (
        <group position={[0, 3.8, 0]}>
          <StackCartridgeModel
            val={poppedFrame.node.val}
            phase={poppedFrame.phase}
            isTop={true}
          />
          <pointLight color="#38bdf8" intensity={4.0} distance={3.0} />
          <Html position={[0, 0.65, 0]} center distanceFactor={14} className="pointer-events-none select-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-950 border border-sky-400 text-sky-200 shadow-2xl backdrop-blur-md animate-bounce whitespace-nowrap flex items-center gap-1">
              ⚡ POPPED Node {poppedFrame.node.val} [{poppedFrame.phase.toUpperCase()}]
            </span>
          </Html>
        </group>
      )}
    </group>
  );
}
