'use client';

import React from 'react';
import { Plus, Trash2, Key, Video, Layers, RotateCcw, Sparkles } from 'lucide-react';

interface HashControlsProps {
  onInjectKey: () => void;
  onAddServerD: () => void;
  onCrashServer: () => void;
  onToggleVNodes: () => void;
  onToggleReelMode: () => void;
  onReset: () => void;
  hasServerD: boolean;
  showVNodes: boolean;
  isReelMode: boolean;
}

export function HashControls({
  onInjectKey,
  onAddServerD,
  onCrashServer,
  onToggleVNodes,
  onToggleReelMode,
  onReset,
  hasServerD,
  showVNodes,
  isReelMode,
}: HashControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 p-3 rounded-2xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl pointer-events-auto">
      {/* 1. Inject Key */}
      <button
        onClick={onInjectKey}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
      >
        <Key className="w-3.5 h-3.5 fill-current" />
        <span>Inject Key (3D Spline)</span>
      </button>

      {/* 2. Scale-Out: Add Server D */}
      <button
        onClick={onAddServerD}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95 ${
          hasServerD
            ? 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/20'
        }`}
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{hasServerD ? 'Server D Active' : 'Add Server D (Scale-Out)'}</span>
      </button>

      {/* 3. Failover: Crash Server */}
      <button
        onClick={onCrashServer}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all active:scale-95"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Simulate Node Failover</span>
      </button>

      <div className="w-[1px] h-6 bg-slate-800 hidden sm:block mx-1" />

      {/* 4. Toggle V-Nodes */}
      <button
        onClick={onToggleVNodes}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
          showVNodes
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/10'
            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>{showVNodes ? 'V-Nodes: ON (3x)' : 'V-Nodes: OFF'}</span>
      </button>

      {/* 5. Cinematic Reel Mode */}
      <button
        onClick={onToggleReelMode}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
          isReelMode
            ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/30 animate-pulse'
            : 'bg-slate-900 text-sky-400 border-sky-500/40 hover:bg-sky-500/10'
        }`}
      >
        <Video className="w-3.5 h-3.5" />
        <span>{isReelMode ? 'Exit Reel Mode' : '🎬 Reel Mode (9:16)'}</span>
      </button>

      {/* 6. Reset */}
      <button
        onClick={onReset}
        title="Reset Hash Ring"
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
