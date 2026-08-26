'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  Droplets,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  HardDrive,
} from 'lucide-react';
import { TrappingWaterStep } from '@/lib/trappingWaterSimulation';

interface TrappingWaterExplanationPanelProps {
  currentStep: TrappingWaterStep;
  totalSteps: number;
}

export function TrappingWaterExplanationPanel({
  currentStep,
  totalSteps,
}: TrappingWaterExplanationPanelProps) {
  const {
    left,
    right,
    leftMax,
    rightMax,
    totalWater,
    heights,
    activePointer,
    actionType,
    actionTitle,
    hinglishNarration,
    whyRule,
    stepNumber,
  } = currentStep;

  const currentLeftHeight = left < heights.length ? heights[left] : '-';
  const currentRightHeight = right >= 0 ? heights[right] : '-';

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl font-mono text-xs overflow-hidden flex flex-col gap-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Execution State Inspector & Core DSA Proof
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                Step {stepNumber} / {totalSteps}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time variable tracking, dynamic invariants & mathematical rationale
            </p>
          </div>
        </div>
      </div>

      {/* 2. Live Variables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {/* Left Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">LEFT INDEX (left)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-emerald-400 font-mono">{left}</span>
            <span className="text-[10px] text-slate-500 font-mono">(h={currentLeftHeight})</span>
          </div>
        </div>

        {/* Right Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">RIGHT INDEX (right)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-purple-400 font-mono">{right}</span>
            <span className="text-[10px] text-slate-500 font-mono">(h={currentRightHeight})</span>
          </div>
        </div>

        {/* Left Max */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">LEFT MAX (leftMax)</span>
          <span className="text-lg font-black text-emerald-300 font-mono mt-1">{leftMax}</span>
        </div>

        {/* Right Max */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">RIGHT MAX (rightMax)</span>
          <span className="text-lg font-black text-purple-300 font-mono mt-1">{rightMax}</span>
        </div>

        {/* Active Side */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">ACTIVE SIDE</span>
          <span className="text-sm font-black font-mono mt-1 text-cyan-300 uppercase">
            {activePointer ? `${activePointer} Side` : 'Complete'}
          </span>
        </div>

        {/* Total Trapped Water */}
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1">
            <Droplets className="w-3 h-3 text-cyan-400" /> TOTAL WATER
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-cyan-200 font-mono">{totalWater}</span>
            <span className="text-[10px] text-cyan-400 font-mono">units</span>
          </div>
        </div>
      </div>

      {/* 3. Deep Hinglish Explanation & Mathematical Rationale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        {/* Step Action Description */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{actionTitle}</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {hinglishNarration}
          </p>
        </div>

        {/* Why Rule */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Why this step is mathematically optimal:</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {whyRule}
          </p>
        </div>
      </div>

      {/* 4. Complexity & Invariant Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans">
        <div className="flex items-center gap-4 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Time: <strong className="text-slate-200">O(N)</strong></span>
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Space: <strong className="text-slate-200">O(1)</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[10px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Formula: Water = min(leftMax, rightMax) - height[i]</span>
        </div>
      </div>
    </div>
  );
}
