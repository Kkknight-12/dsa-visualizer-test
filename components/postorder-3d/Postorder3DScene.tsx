'use client';

import React, { useMemo } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GridFloor } from '@/components/canvas/GridFloor';
import { PostEffects } from '@/components/canvas/PostEffects';
import { Tree3D } from './Tree3D';
import { StackChamberModel } from './models/StackChamberModel';
import { TreeNodeModel } from './models/TreeNodeModel';
import { StackCartridgeModel } from './models/StackCartridgeModel';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { InspectionTarget } from './ModelInspectorOverlay';

interface Postorder3DSceneProps {
  root: TreeNode;
  currentStep: TreeStepState;
  inspectionTarget: InspectionTarget;
  mockState: 'idle' | 'expand' | 'visit' | 'active' | 'visited';
}

export function Postorder3DScene({
  root,
  currentStep,
  inspectionTarget,
  mockState,
}: Postorder3DSceneProps) {
  // Compute connecting 3D spline beam from active tree node to stack chamber during push/pop
  const { bridgeCurve } = useMemo(() => {
    if (!currentStep.activeNodeId) return { bridgeCurve: null };

    const pStart = new THREE.Vector3(-3.4, 1.8, 0);
    const pEnd = new THREE.Vector3(4.2, 3.4, 0);
    const pMid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
    pMid.y += 2.8;
    pMid.z += 1.2;

    const curve = new THREE.CatmullRomCurve3([pStart, pMid, pEnd]);
    return { bridgeCurve: curve };
  }, [currentStep.activeNodeId]);

  return (
    <>
      {/* 1. Cinematic Perspective Camera */}
      <PerspectiveCamera
        makeDefault
        position={
          inspectionTarget === 'node'
            ? [0, 1.5, 4.5]
            : inspectionTarget === 'cartridge'
            ? [0, 1.2, 4.5]
            : inspectionTarget === 'silo'
            ? [0, 2.5, 9.0]
            : [0, 8, 14]
        }
        fov={46}
        near={0.1}
        far={100}
      />

      {/* 2. Orbit Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={2}
        maxDistance={25}
        target={
          inspectionTarget === 'node' || inspectionTarget === 'cartridge'
            ? [0, 0, 0]
            : inspectionTarget === 'silo'
            ? [0, 1.0, 0]
            : [0, 1.0, 0]
        }
      />

      {/* 3. Studio 3-Point & Neon Accent Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 22, 16]} intensity={1.5} castShadow />
      <pointLight position={[-10, 8, 6]} color="#38bdf8" intensity={2.8} distance={22} />
      <pointLight position={[10, 8, -6]} color="#a855f7" intensity={2.8} distance={22} />
      <pointLight position={[0, -1, 5]} color="#0284c7" intensity={1.5} distance={15} />

      {/* 4. Reflective Tech Floor */}
      <GridFloor />

      {/* --- SCENE MODE 1: FULL 3D STAGE --- */}
      {inspectionTarget === 'scene' && (
        <>
          {/* Studio-Grade 3D Binary Tree (Left Stage) */}
          <Tree3D root={root} currentStep={currentStep} />

          {/* Studio-Grade 3D Quantum Stack Silo (Right Stage) */}
          <StackChamberModel
            stack={currentStep.stackSnapshot}
            poppedFrame={currentStep.poppedFrame}
            position={[4.2, 0, 0]}
          />

          {/* 3D Scheduling Laser Conduit */}
          {bridgeCurve && currentStep.actionType.startsWith('push') && (
            <mesh>
              <tubeGeometry args={[bridgeCurve, 36, 0.04, 8, false]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={3.0}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </>
      )}

      {/* --- SCENE MODE 2: CLOSE-UP NODE MODEL INSPECTION --- */}
      {inspectionTarget === 'node' && (
        <group position={[0, 0, 0]}>
          <TreeNodeModel
            id="sample-node"
            val={1}
            position={[0, 0, 0]}
            isActive={mockState === 'active'}
            isVisited={mockState === 'visited'}
            stackPhase={
              mockState === 'expand' ? 'expand' : mockState === 'visit' ? 'visit' : undefined
            }
          />
        </group>
      )}

      {/* --- SCENE MODE 3: CLOSE-UP STACK CARTRIDGE INSPECTION --- */}
      {inspectionTarget === 'cartridge' && (
        <group position={[0, 0, 0]}>
          <StackCartridgeModel
            val={1}
            phase={mockState === 'visit' ? 'visit' : 'expand'}
            isTop={mockState === 'active'}
            position={[0, 0, 0]}
          />
        </group>
      )}

      {/* --- SCENE MODE 4: CLOSE-UP LIFO SILO INSPECTION --- */}
      {inspectionTarget === 'silo' && (
        <group position={[0, 0, 0]}>
          <StackChamberModel
            stack={currentStep.stackSnapshot.length > 0 ? currentStep.stackSnapshot : [
              { node: { id: 'n1', val: 1, left: null, right: null, x: 0, y: 0 }, phase: 'visit' },
              { node: { id: 'n3', val: 3, left: null, right: null, x: 0, y: 0 }, phase: 'expand' },
              { node: { id: 'n2', val: 2, left: null, right: null, x: 0, y: 0 }, phase: 'expand' },
            ]}
            poppedFrame={mockState === 'active' ? currentStep.poppedFrame : null}
            position={[0, 0, 0]}
          />
        </group>
      )}

      {/* 5. Post-Processing Neon Bloom & Vignette */}
      <PostEffects />
    </>
  );
}
