'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Sparkles } from 'lucide-react';
import { TREE_PRESETS } from '@/lib/treeSimulation';
import { TreePreset } from '@/types/treeTraversal';

interface TreeControlsProps {
  currentPreset: TreePreset;
  onSelectPreset: (preset: TreePreset) => void;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onGoToStep: (idx: number) => void;
  speed: number;
  onSetSpeed: (s: number) => void;
}

export function TreeControls({
  currentPreset,
  onSelectPreset,
  currentStepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  onGoToStep,
  speed,
  onSetSpeed,
}: TreeControlsProps) {
  const speeds = [0.5, 1.0, 2.0];

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-3.5 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
      {/* Preset Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
          Tree Preset:
        </span>
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {TREE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                currentPreset.id === preset.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Playback Controls */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset Traversal"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Previous Step */}
        <button
          onClick={onPrevStep}
          disabled={currentStepIndex === 0}
          title="Previous Step"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-xs shadow-lg transition-all ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Step-by-Step Play</span>
            </>
          )}
        </button>

        {/* Next Step */}
        <button
          onClick={onNextStep}
          disabled={currentStepIndex === totalSteps - 1}
          title="Next Step"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400">Speed:</span>
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                speed === s
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
