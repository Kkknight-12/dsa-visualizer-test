'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ConsistentHashingEngine } from '@/ConsistentHashing';

interface HashRing3DProps {
  ring: ConsistentHashingEngine.ConsistentHashRing;
  activeKey: { key: string; hash: number; serverId: string; angleRad: number } | null;
  migratingKeys: { key: string; fromServerId: string; toServerId: string; fromAngle: number; toAngle: number }[];
  showVNodes: boolean;
}

const RING_RADIUS = 5.5;

export function HashRing3D({ ring, activeKey, migratingKeys, showVNodes }: HashRing3DProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const servers = ring.getServers();
  const vnodes = ring.getRingTopology();

  // Subtle rotation of outer ring halo
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main 3D Glowing Hash Ring (0 to 2^32 - 1) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, 0.06, 16, 100]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Halo Guide Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RING_RADIUS + 0.3, RING_RADIUS + 0.35, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Ring Hash Space Labels (0°, 90°, 180°, 270°) */}
      {[
        { label: '0 (2^0)', angle: 0, textPos: [RING_RADIUS + 1.2, 0, 0] },
        { label: '2^30 (90°)', angle: Math.PI / 2, textPos: [0, 0, RING_RADIUS + 1.2] },
        { label: '2^31 (180°)', angle: Math.PI, textPos: [-RING_RADIUS - 1.2, 0, 0] },
        { label: '2^32 - 1 (270°)', angle: (3 * Math.PI) / 2, textPos: [0, 0, -RING_RADIUS - 1.2] },
      ].map((mark, i) => (
        <Html key={i} position={mark.textPos as [number, number, number]} center distanceFactor={16}>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-950/80 border border-slate-700/60 text-slate-400 backdrop-blur-md whitespace-nowrap">
            {mark.label}
          </span>
        </Html>
      ))}

      {/* 2. Physical Server Nodes on the Ring */}
      {servers.map((server) => {
        // Physical node position based on hash of server ID
        const hash = ConsistentHashingEngine.hashKey(server.id);
        const fraction = hash / 4294967295;
        const angle = fraction * 2 * Math.PI;
        const x = RING_RADIUS * Math.cos(angle);
        const z = RING_RADIUS * Math.sin(angle);

        return (
          <group key={server.id} position={[x, 0, z]}>
            {/* Server Tower Mesh */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 1.2, 24]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.9}
                roughness={0.1}
                emissive={server.color}
                emissiveIntensity={0.6}
              />
            </mesh>

            {/* Glowing Laser Core Pillar */}
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
              <meshStandardMaterial
                color={server.color}
                emissive={server.color}
                emissiveIntensity={2.5}
              />
            </mesh>

            {/* Server Point Light */}
            <pointLight color={server.color} intensity={2.5} distance={5} />

            {/* Floating Server Label */}
            <Html position={[0, 2.2, 0]} center distanceFactor={14}>
              <div className="flex flex-col items-center gap-0.5 select-none pointer-events-none">
                <div
                  className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold border shadow-2xl backdrop-blur-xl whitespace-nowrap flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: server.color,
                    color: server.color,
                  }}
                >
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: server.color }} />
                  {server.label}
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-950/90 px-1.5 py-0.2 rounded border border-slate-800">
                  {server.ip}
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* 3. Virtual Node Satellites (V-Nodes) */}
      {showVNodes &&
        vnodes.map((vnode, i) => {
          const x = RING_RADIUS * Math.cos(vnode.angleRad);
          const z = RING_RADIUS * Math.sin(vnode.angleRad);
          const server = servers.find((s) => s.id === vnode.serverId);
          const color = server?.color || '#38bdf8';

          return (
            <group key={i} position={[x, 0, z]}>
              {/* Virtual Node Glowing Orb */}
              <mesh position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={1.8}
                />
              </mesh>

              {/* Orbital Ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.22, 0.26, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
              </mesh>

              {/* VNode Label */}
              <Html position={[0, 0.6, 0]} center distanceFactor={18}>
                <span
                  className="px-1.5 py-0.2 rounded text-[8px] font-mono font-semibold bg-slate-950/80 border whitespace-nowrap"
                  style={{ borderColor: color, color: color }}
                >
                  {server?.label.split(' ')[2]}#{vnode.vnodeIndex}
                </span>
              </Html>
            </group>
          );
        })}

      {/* 4. Active Key Injection Marker */}
      {activeKey && (
        <group
          position={[
            RING_RADIUS * Math.cos(activeKey.angleRad),
            0.2,
            RING_RADIUS * Math.sin(activeKey.angleRad),
          ]}
        >
          {/* Key Marker Beacon */}
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={3.0}
            />
          </mesh>
          <pointLight color="#f59e0b" intensity={4} distance={4} />

          {/* Floating Key Name Badge */}
          <Html position={[0, 0.8, 0]} center distanceFactor={14}>
            <div className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/80 shadow-2xl backdrop-blur-md whitespace-nowrap animate-bounce">
              🔑 {activeKey.key}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
