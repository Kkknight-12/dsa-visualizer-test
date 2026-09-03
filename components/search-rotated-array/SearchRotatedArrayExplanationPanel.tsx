'use client';

import React from 'react';
import {
  Activity,
  Sparkles,
  Lightbulb,
  Clock,
  HardDrive,
  CheckCircle2,
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
    <div className="w-full bg-[#0a0d16] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl font-mono text-xs sm:text-sm overflow-hidden flex flex-col gap-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Execution State & Invariant Tracker
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-mono font-bold">
                Step {stepNumber} / {totalSteps}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
              Dynamic range elimination & boundary invariants
            </p>
          </div>
        </div>
      </div>

      {/* 2. Live Variables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Low Pointer */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 font-mono">LOW POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-black text-emerald-300">{low}</span>
            <span className="text-xs text-slate-400">(val={currentLowVal})</span>
          </div>
        </div>

        {/* Mid Pointer */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 font-mono">MID POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-black text-sky-300">{mid >= 0 ? mid : '-'}</span>
            <span className="text-xs text-slate-400">(val={currentMidVal})</span>
          </div>
        </div>

        {/* High Pointer */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 font-mono">HIGH POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-black text-purple-300">{high}</span>
            <span className="text-xs text-slate-400">(val={currentHighVal})</span>
          </div>
        </div>

        {/* Target */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 font-mono">TARGET</span>
          <span className="text-lg sm:text-xl font-black text-slate-100 mt-1">{target}</span>
        </div>

        {/* Sorted Half */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 font-mono">SORTED HALF</span>
          <span
            className={`text-sm font-bold mt-1 uppercase ${
              sortedHalf === 'left'
                ? 'text-emerald-300'
                : sortedHalf === 'right'
                ? 'text-purple-300'
                : 'text-slate-400'
            }`}
          >
            {sortedHalf ? `${sortedHalf} Half` : 'None'}
          </span>
        </div>

        {/* Status */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 font-mono">STATUS</span>
          <span
            className={`text-sm font-bold mt-1 uppercase ${
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

      {/* 3. Explanation & Why Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-slate-800/60">
        {/* Step Action Description */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sky-300 font-bold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{actionTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
            {hinglishNarration}
          </p>
        </div>

        {/* Why Rule */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
            <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Invariant Rationale:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
            {whyRule}
          </p>
        </div>
      </div>

      {/* 4. Complexity & Invariant Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 font-sans">
        <div className="flex items-center gap-4 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Time: <strong className="text-slate-100 font-bold">O(log N)</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <span>Space: <strong className="text-slate-100 font-bold">O(1)</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>At least one half is strictly sorted on every step</span>
        </div>
      </div>
    </div>
  );
}
