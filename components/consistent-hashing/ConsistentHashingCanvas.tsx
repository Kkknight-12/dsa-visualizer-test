'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { HashRingScene } from './HashRingScene';
import { Loader2 } from 'lucide-react';
import { ConsistentHashingEngine } from '@/ConsistentHashing';

interface ConsistentHashingCanvasProps {
  ring: ConsistentHashingEngine.ConsistentHashRing;
  activeKey: {
    key: string;
    hash: number;
    serverId: string;
    serverColor: string;
    serverAngle: number;
    angleRad: number;
  } | null;
  migratingKeys: {
    key: string;
    fromServerId: string;
    toServerId: string;
    fromAngle: number;
    toAngle: number;
  }[];
  showVNodes: boolean;
  onKeyArrival: () => void;
}

export function ConsistentHashingCanvas(props: ConsistentHashingCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#05070e] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        <p className="text-xs font-mono tracking-widest uppercase">Initializing 3D Hash Ring...</p>
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
          <HashRingScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
