'use client';

import React from 'react';
import { ThreeSumStep } from '@/lib/threeSumSimulation';
import {
  CheckCircle2,
  Sparkles,
  Sliders,
  Target,
  Layers,
  Compass,
  ArrowRight,
  ArrowLeft,
  Equal,
} from 'lucide-react';

interface ThreeSumExplanationPanelProps {
  currentStep: ThreeSumStep;
  totalSteps: number;
}

export function ThreeSumExplanationPanel({
  currentStep,
  totalSteps,
}: ThreeSumExplanationPanelProps) {
  const pointerMovement = currentStep?.pointerMovement || {
    label: 'INITIALIZING',
    direction: 'none',
    reason: 'Setting up algorithm',
  };

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl font-sans flex flex-col gap-4">
      {/* 1. Header Bar: Title on Top Line, Subtitle explicitly on Next Line below it */}
      <div className="border-b border-slate-800/80 pb-3 flex items-start justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400 shrink-0" />
            3Sum Dual Scanning Telemetry
          </h3>
          <span className="text-xs text-slate-400 font-mono mt-1 block">
            Real-time step narration &amp; core two-pointer DSA logic
          </span>
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-2 shrink-0 font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            LINE {currentStep?.activeLine ?? 1}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold">
            Step {currentStep?.stepNumber ?? 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* 2. Pointer Movement & Live Sum Telemetry Pill Bar */}
      {currentStep && currentStep.actionType !== 'init' && currentStep.actionType !== 'sort' && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-400">Pointer Action:</span>
            <span className="text-white font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {pointerMovement.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sum vs Target:</span>
            <span
              className={`font-black px-2.5 py-0.5 rounded ${
                currentStep.sumStatus === 'MATCH'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : currentStep.sumStatus === 'TOO_LOW'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : currentStep.sumStatus === 'TOO_HIGH'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              {currentStep.currentSum} vs Target 0{' '}
              {currentStep.sumStatus === 'MATCH'
                ? '(Match! ✅)'
                : currentStep.sumStatus === 'TOO_LOW'
                ? '(< 0 Too Low ⬆️)'
                : '(> 0 Too High ⬇️)'}
            </span>
          </div>
        </div>
      )}

      {/* 3. Full-Width Vertical Card Stack */}
      <div className="flex flex-col gap-3.5">
        {/* Card 1: Action Title & Hinglish Narration */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 flex flex-col gap-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Code Execution Action
            </span>
            <span className="text-[11px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {currentStep?.actionType?.toUpperCase() ?? 'EXEC'}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-white font-mono">
            {currentStep?.actionTitle}
          </h4>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
            💬 {currentStep?.hinglishNarration}
          </p>
        </div>

        {/* Card 2: Core DSA Logic & Intuition ("WHY Rule") */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2 shadow-lg">
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-400" /> Core DSA Logic ("WHY Rule")
          </span>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-sans">
            💡 {currentStep?.whyRule}
          </p>
        </div>

        {/* Card 3: Found Triplets Container */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Found Unique Triplets ({currentStep?.foundTriplets?.length ?? 0})
            </span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px] items-center p-2.5 rounded-lg bg-[#050811] border border-slate-800/80">
            {!currentStep?.foundTriplets || currentStep.foundTriplets.length === 0 ? (
              <span className="text-xs font-mono text-slate-500 italic">No zero triplets found yet...</span>
            ) : (
              currentStep.foundTriplets.map((triplet, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-mono font-bold text-xs shadow-md"
                >
                  [{triplet.join(', ')}]
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
