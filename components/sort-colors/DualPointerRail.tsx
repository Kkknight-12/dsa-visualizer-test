'use client';

import React from 'react';
import { Layers, RefreshCw } from 'lucide-react';
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
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-sm overflow-hidden">
      {/* 1. Component Header & Legends */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 via-amber-500 to-sky-500 flex items-center justify-center shadow-lg">
            <Layers className="w-4 h-4 text-slate-950 font-black" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Dutch National Flag 3-Pointer Canvas
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono flex items-center gap-1">
                <RefreshCw className={`w-3 h-3 ${isSwapAction ? 'animate-spin' : ''}`} />
                FLIP Motion
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Partition: 0s [0...low-1] • 1s [low...mid-1] • Unknown [mid...high] • 2s [high+1...n-1]
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1.5 text-rose-300">
            <span className="w-3 h-3 rounded-md bg-rose-500 shadow-sm" /> 0 (Red)
          </span>
          <span className="flex items-center gap-1.5 text-slate-100">
            <span className="w-3 h-3 rounded-md bg-slate-200 shadow-sm" /> 1 (White)
          </span>
          <span className="flex items-center gap-1.5 text-sky-300">
            <span className="w-3 h-3 rounded-md bg-sky-500 shadow-sm" /> 2 (Blue)
          </span>
        </div>
      </div>

      {/* 2. Reusable Physical FLIP Rail Component (Code Visual Block) */}
      <div className="flex-1 flex items-center justify-center py-4">
        <ReorderableArrayRail
          elements={arraySnapshot}
          pointers={pointers}
          swappingIndices={swappingIndices}
        />
      </div>
    </div>
  );
}
