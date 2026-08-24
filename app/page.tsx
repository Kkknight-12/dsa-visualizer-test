'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HeaderNav } from '@/components/ui/HeaderNav';
import { ScenarioSelector } from '@/components/ui/ScenarioSelector';
import { NarrationPanel } from '@/components/ui/NarrationPanel';
import { MetricsPanel } from '@/components/ui/MetricsPanel';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { NodeInspectorModal } from '@/components/ui/NodeInspectorModal';

// Dynamically import 3D Canvas with ssr disabled
const IsometricCanvas = dynamic(
  () => import('@/components/canvas/IsometricCanvas').then((mod) => mod.IsometricCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05070e] text-slate-100 select-none">
      {/* 1. Fullscreen 3D Isometric WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <IsometricCanvas />
      </div>

      {/* 2. Top Header Navigation */}
      <HeaderNav />

      {/* 3. Left Side Panel: Scenario Selector & Narration Panel */}
      <aside className="absolute top-20 left-6 z-20 flex flex-col gap-3 pointer-events-none max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
        <ScenarioSelector />
        <NarrationPanel />
      </aside>

      {/* 4. Right Side Panel: Telemetry & Node Inspector */}
      <aside className="absolute top-20 right-6 z-20 flex flex-col gap-3 pointer-events-none">
        <MetricsPanel />
        <NodeInspectorModal />
      </aside>

      {/* 5. Bottom Center Playback Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <PlaybackControls />
      </div>

      {/* 6. Subtle Cyberpunk Scanline / Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/60" />
    </main>
  );
}
