'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Postorder3DScene } from './Postorder3DScene';
import { Loader2 } from 'lucide-react';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { InspectionTarget } from './ModelInspectorOverlay';

interface Postorder3DCanvasProps {
  root: TreeNode;
  currentStep: TreeStepState;
  inspectionTarget: InspectionTarget;
  mockState: 'idle' | 'expand' | 'visit' | 'active' | 'visited';
}

export function Postorder3DCanvas(props: Postorder3DCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#05070e] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <p className="text-xs font-mono tracking-widest uppercase">Initializing Studio 3D Models...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-[#05070e]">
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Postorder3DScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
