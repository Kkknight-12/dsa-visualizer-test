'use client';

import React from 'react';
import { Sparkles, Layers, RefreshCw } from 'lucide-react';
import { SortColorsStep } from '@/lib/sortColorsSimulation';
import { ReorderableArrayRail, PointerInfo } from '@/components/common/ReorderableArrayRail';

interface DualPointerRailProps {
  currentStep: SortColorsStep;
}

export function DualPointerRail({ currentStep }: DualPointerRailProps) {
  const { arraySnapshot, low, mid, high, swappingIndices, actionType } = currentStep;

  // Build pointers configuration
  const pointers: PointerInfo[] = [
    {
      label: 'high',
      index: high,
      color: 'bg-purple-500 text-white',
      direction: 'down',
    },
    {
      label: 'low',
      index: low,
      color: 'bg-emerald-500 text-slate-950',
      direction: 'up',
    },
    {
      label: 'mid',
      index: mid,
      color: 'bg-amber-400 text-slate-950',
      direction: 'up',
    },
  ];

  const isSwapAction = actionType === 'swap_low' || actionType === 'swap_high';

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs overflow-hidden">
      {/* 1. Component Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 via-amber-500 to-sky-500 flex items-center justify-center shadow-lg">
            <Layers className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Dutch National Flag 3-Pointer Rail
              <span className="text-[9px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono flex items-center gap-1">
                <RefreshCw className={`w-3 h-3 ${isSwapAction ? 'animate-spin' : ''}`} />
                True Physical Sliding Motion
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              4 Virtual Boundaries: 0s [0...low-1] • 1s [low...mid-1] • Unknown [mid...high] • 2s [high+1...n-1]
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-rose-300">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" /> 0 (Red)
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded bg-slate-200" /> 1 (White)
          </span>
          <span className="flex items-center gap-1 text-sky-300">
            <span className="w-2.5 h-2.5 rounded bg-sky-500" /> 2 (Blue)
          </span>
        </div>
      </div>

      {/* 2. Reusable Physical FLIP Rail Component */}
      <ReorderableArrayRail
        elements={arraySnapshot}
        pointers={pointers}
        swappingIndices={swappingIndices}
      />

      {/* 3. Action Step Banner & Hinglish Rule Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <strong className="text-sky-300 font-bold">{currentStep.actionTitle}</strong>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Step {currentStep.stepNumber}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-sans italic">
          💡 {currentStep.hinglishNarration}
        </p>
      </div>
    </div>
  );
}
