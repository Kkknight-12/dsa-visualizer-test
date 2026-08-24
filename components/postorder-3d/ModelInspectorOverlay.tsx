'use client';

import React from 'react';
import { Eye, Layers, Sparkles, Box, Check, RefreshCw } from 'lucide-react';

export type InspectionTarget = 'scene' | 'node' | 'cartridge' | 'silo';

interface ModelInspectorOverlayProps {
  target: InspectionTarget;
  onSelectTarget: (t: InspectionTarget) => void;
  mockState: 'idle' | 'expand' | 'visit' | 'active' | 'visited';
  onSelectMockState: (s: 'idle' | 'expand' | 'visit' | 'active' | 'visited') => void;
}

export function ModelInspectorOverlay({
  target,
  onSelectTarget,
  mockState,
  onSelectMockState,
}: ModelInspectorOverlayProps) {
  const targets: { id: InspectionTarget; label: string; icon: string }[] = [
    { id: 'scene', label: 'Full 3D Stage', icon: '🌌' },
    { id: 'node', label: 'Tree Node Capsule', icon: '💎' },
    { id: 'cartridge', label: 'Memory Cartridge', icon: '🔋' },
    { id: 'silo', label: 'LIFO Storage Silo', icon: '🏢' },
  ];

  const states: ('idle' | 'expand' | 'visit' | 'active' | 'visited')[] = [
    'idle',
    'expand',
    'visit',
    'active',
    'visited',
  ];

  return (
    <div className="absolute top-20 right-6 z-30 flex flex-col gap-2.5 pointer-events-auto max-w-xs">
      {/* Model Selector Card */}
      <div className="bg-slate-950/90 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-2xl shadow-2xl space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-400" /> Layer 1: Model Studio
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
            R3F Studio
          </span>
        </div>

        {/* Model Tabs */}
        <div className="grid grid-cols-2 gap-1.5">
          {targets.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTarget(t.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all text-left ${
                target === t.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/60 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{t.icon}</span>
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* State Previewer (When inspecting individual models) */}
        {target !== 'scene' && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Preview Shader State:
            </p>
            <div className="flex flex-wrap gap-1">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectMockState(s)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                    mockState === s
                      ? 'bg-purple-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
