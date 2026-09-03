'use client';

import React from 'react';
import {
  Activity,
  Sparkles,
  Lightbulb,
  Clock,
  HardDrive,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { SearchRotatedArrayStep } from '@/lib/searchRotatedArraySimulation';

interface SearchRotatedArrayExplanationPanelProps {
  currentStep: SearchRotatedArrayStep;
  totalSteps: number;
}

export function SearchRotatedArrayExplanationPanel({
  currentStep,
  totalSteps,
}: SearchRotatedArrayExplanationPanelProps) {
  const {
    low,
    high,
    mid,
    array,
    target,
    sortedHalf,
    actionTitle,
    hinglishNarration,
    whyRule,
    stepNumber,
    isMatch,
    isNotFound,
  } = currentStep;

  const currentMidVal = mid >= 0 && mid < array.length ? array[mid] : '-';
  const currentLowVal = low >= 0 && low < array.length ? array[low] : '-';
  const currentHighVal = high >= 0 && high < array.length ? array[high] : '-';

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl font-mono text-xs overflow-hidden flex flex-col gap-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Execution State Inspector & Invariant Proof
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                Step {stepNumber} / {totalSteps}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time binary search boundary tracking & range elimination logic
            </p>
          </div>
        </div>
      </div>

      {/* 2. Live Variables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {/* Low Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">LOW POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-emerald-400">{low}</span>
            <span className="text-[10px] text-slate-500">(val={currentLowVal})</span>
          </div>
        </div>

        {/* Mid Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">MID POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-sky-400">{mid >= 0 ? mid : '-'}</span>
            <span className="text-[10px] text-slate-500">(val={currentMidVal})</span>
          </div>
        </div>

        {/* High Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">HIGH POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-purple-400">{high}</span>
            <span className="text-[10px] text-slate-500">(val={currentHighVal})</span>
          </div>
        </div>

        {/* Target */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
          <span className="text-[10px] text-amber-300 font-bold">SEARCH TARGET</span>
          <span className="text-lg font-black text-amber-200 mt-1">{target}</span>
        </div>

        {/* Sorted Half */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">DETECTED SORTED HALF</span>
          <span
            className={`text-sm font-black mt-1 uppercase ${
              sortedHalf === 'left'
                ? 'text-emerald-300'
                : sortedHalf === 'right'
                ? 'text-purple-300'
                : 'text-slate-500'
            }`}
          >
            {sortedHalf ? `${sortedHalf} Half` : 'None'}
          </span>
        </div>

        {/* Status */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold">MATCH STATUS</span>
          <span
            className={`text-sm font-black mt-1 uppercase ${
              isMatch
                ? 'text-emerald-300'
                : isNotFound
                ? 'text-rose-400'
                : 'text-sky-300'
            }`}
          >
            {isMatch ? 'Match Found' : isNotFound ? 'Not Found' : 'Iterating'}
          </span>
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
            <span>Why this elimination is mathematically guaranteed:</span>
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
            <span>Time: <strong className="text-slate-200">O(log N)</strong></span>
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Space: <strong className="text-slate-200">O(1)</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sky-300 font-mono text-[10px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Invariant: At least one half [low...mid] or [mid...high] is ALWAYS sorted</span>
        </div>
      </div>
    </div>
  );
}
