'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { RealisticTree3D } from './RealisticTree3D';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { Loader2 } from 'lucide-react';

interface RealisticTreeCanvasProps {
  root: TreeNode;
  currentStep: TreeStepState;
}

export function RealisticTreeCanvas({ root, currentStep }: RealisticTreeCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
        <span className="text-xs font-mono">Loading 3D Binary Tree...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[420px] relative bg-gradient-to-b from-[#080d1a] to-[#04060b] rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl">
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0.5, 7.2]} fov={50} />

        {/* Natural Studio 3-Point Lighting (No harsh lasers/glow) */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 8]} intensity={1.2} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#38bdf8" />
        <directionalLight position={[0, -5, -3]} intensity={0.3} color="#a855f7" />

        {/* Soft Natural Contact Shadows */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.6}
          scale={12}
          blur={1.8}
          far={5}
        />

        <Suspense fallback={null}>
          <RealisticTree3D root={root} currentStep={currentStep} />
        </Suspense>
      </Canvas>
    </div>
  );
}
