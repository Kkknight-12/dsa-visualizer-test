'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';

interface RealisticTree3DProps {
  root: TreeNode;
  currentStep: TreeStepState;
}

interface Node3DItem {
  id: string;
  val: number;
  position: [number, number, number];
}

interface Link3DItem {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  targetId: string;
  type: 'left' | 'right';
  curve: THREE.CatmullRomCurve3;
}

export function RealisticTree3D({ root, currentStep }: RealisticTree3DProps) {
  // Compute balanced, natural 3D tree coordinates
  const { nodes3D, links3D } = useMemo(() => {
    const nodes: Node3DItem[] = [];
    const links: Link3DItem[] = [];

    const mapNode = (node: TreeNode, x: number, y: number, spread: number) => {
      const pos: [number, number, number] = [x, y, 0];
      nodes.push({ id: node.id, val: node.val, position: pos });

      if (node.left) {
        const leftX = x - spread;
        const leftY = y - 1.5;
        const leftPos: [number, number, number] = [leftX, leftY, 0];

        // Smooth S-curve from bottom of parent to top of child
        const pStart = new THREE.Vector3(x, y - 0.55, 0);
        const pEnd = new THREE.Vector3(leftX, leftY + 0.55, 0);
        const midY = (y - 0.55 + leftY + 0.55) / 2;
        const pMid = new THREE.Vector3((x + leftX) / 2, midY, 0.15);
        const curve = new THREE.CatmullRomCurve3([pStart, pMid, pEnd]);

        links.push({ fromPos: pos, toPos: leftPos, targetId: node.left.id, type: 'left', curve });
        mapNode(node.left, leftX, leftY, spread * 0.55);
      }

      if (node.right) {
        const rightX = x + spread;
        const rightY = y - 1.5;
        const rightPos: [number, number, number] = [rightX, rightY, 0];

        const pStart = new THREE.Vector3(x, y - 0.55, 0);
        const pEnd = new THREE.Vector3(rightX, rightY + 0.55, 0);
        const midY = (y - 0.55 + rightY + 0.55) / 2;
        const pMid = new THREE.Vector3((x + rightX) / 2, midY, 0.15);
        const curve = new THREE.CatmullRomCurve3([pStart, pMid, pEnd]);

        links.push({ fromPos: pos, toPos: rightPos, targetId: node.right.id, type: 'right', curve });
        mapNode(node.right, rightX, rightY, spread * 0.55);
      }
    };

    if (root) {
      mapNode(root, 0, 2.0, 2.2);
    }

    return { nodes3D: nodes, links3D: links };
  }, [root]);

  return (
    <group>
      {/* 1. Natural Physical Curved Branches */}
      {links3D.map((link, idx) => {
        const isTargetActive = link.targetId === currentStep.activeNodeId;
        const isTargetVisited = currentStep.visitedNodeIds.includes(link.targetId);

        let branchColor = '#334155';
        if (isTargetActive) branchColor = '#0284c7';
        else if (isTargetVisited) branchColor = '#059669';

        return (
          <group key={idx}>
            <mesh>
              <tubeGeometry args={[link.curve, 32, 0.04, 8, false]} />
              <meshStandardMaterial
                color={branchColor}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
            {/* L / R Indicator in 3D */}
            <Html
              position={[
                (link.fromPos[0] + link.toPos[0]) / 2 + (link.type === 'left' ? -0.3 : 0.3),
                (link.fromPos[1] + link.toPos[1]) / 2,
                0,
              ]}
              center
              distanceFactor={14}
              className="pointer-events-none select-none"
            >
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900/80 px-1 rounded border border-slate-800">
                .{link.type}
              </span>
            </Html>
          </group>
        );
      })}

      {/* 2. Realistic Tactile Ceramic Tree Nodes */}
      {nodes3D.map((node) => {
        const isVisited = currentStep.visitedNodeIds.includes(node.id);
        const isActive = currentStep.activeNodeId === node.id;
        const stackPhase = currentStep.inStackMap[node.id];

        let nodeColor = '#0f172a';
        let rimColor = '#475569';
        let badgeText = '';
        let badgeStyle = 'bg-slate-900 text-slate-300 border-slate-700';

        if (isVisited) {
          nodeColor = '#064e3b';
          rimColor = '#10b981';
          badgeText = 'VISITED ✓';
          badgeStyle = 'bg-emerald-950 text-emerald-300 border-emerald-500';
        } else if (isActive) {
          nodeColor = '#0369a1';
          rimColor = '#38bdf8';
          badgeText = 'POPPED / ACTIVE';
          badgeStyle = 'bg-sky-950 text-sky-200 border-sky-400';
        } else if (stackPhase === 'visit') {
          nodeColor = '#3b0764';
          rimColor = '#a855f7';
          badgeText = 'VISIT MARKER';
          badgeStyle = 'bg-purple-950 text-purple-300 border-purple-500';
        } else if (stackPhase === 'expand') {
          nodeColor = '#451a03';
          rimColor = '#f59e0b';
          badgeText = 'EXPAND';
          badgeStyle = 'bg-amber-950 text-amber-300 border-amber-500';
        }

        return (
          <group key={node.id} position={node.position}>
            {/* Outer Matte Ceramic Sphere */}
            <mesh>
              <sphereGeometry args={[0.52, 32, 32]} />
              <meshStandardMaterial
                color={nodeColor}
                roughness={0.25}
                metalness={0.15}
              />
            </mesh>

            {/* Subtle Metallic Outer Rim */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.54, 0.02, 16, 32]} />
              <meshStandardMaterial color={rimColor} roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Center Etched Number */}
            <Html position={[0, 0, 0]} center distanceFactor={13} className="pointer-events-none select-none">
              <span className="text-base font-mono font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {node.val}
              </span>
            </Html>

            {/* Natural State Badge Below Node */}
            {badgeText && (
              <Html position={[0, -0.75, 0]} center distanceFactor={14} className="pointer-events-none select-none">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border shadow-lg whitespace-nowrap ${badgeStyle}`}>
                  {badgeText}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
