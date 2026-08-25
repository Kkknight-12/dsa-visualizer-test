'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Sparkles, Binary, Globe2, ExternalLink } from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

export function HeaderNav() {
  const currentScenario = useSimulationStore((s) => s.currentScenario);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Brand Title */}
      <div className="flex items-center gap-3 pointer-events-auto bg-slate-950/80 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-xl shadow-2xl">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              3D Architecture Visualizer
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-sky-500/20 border border-sky-500/40 text-sky-300 rounded font-normal">
                v2.0 PRO
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {currentScenario.category} • <span className="text-sky-400">{currentScenario.tag}</span>
          </p>
        </div>
      </div>

      {/* Center Reference / Concept Tag */}
      <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-slate-950/70 border border-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-xl text-xs text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Scenario: <strong className="text-white font-medium">{currentScenario.name}</strong></span>
        <span className="text-slate-600">•</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
          {currentScenario.difficulty}
        </span>
      </div>

      {/* Right Action Navigation Links */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link
          href="/tracker"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 border border-sky-400 text-xs font-mono font-bold text-slate-950 hover:scale-105 backdrop-blur-xl transition-all shadow-lg shadow-sky-500/20"
        >
          <Layers className="w-3.5 h-3.5 text-slate-950" />
          <span>Task Tracker 📋</span>
        </Link>

        <Link
          href="/postorder-3d"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-xs font-mono text-purple-300 hover:bg-purple-500/30 backdrop-blur-xl transition-all shadow-lg shadow-purple-500/10"
        >
          <Binary className="w-3.5 h-3.5 text-purple-400" />
          <span>Postorder Traversal ⚡</span>
        </Link>

      </div>
    </header>
  );
}
