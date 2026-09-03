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
    <div className="w-full bg-[#0a0d16] border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl font-mono text-xs overflow-hidden flex flex-col gap-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              Execution State & Invariant Tracker
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                Step {stepNumber} / {totalSteps}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Dynamic range elimination & boundary invariants
            </p>
          </div>
        </div>
      </div>

      {/* 2. Live Variables Grid - Cohesive, Subdued */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {/* Low Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400">LOW POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-semibold text-emerald-300">{low}</span>
            <span className="text-[10px] text-slate-400">(val={currentLowVal})</span>
          </div>
        </div>

        {/* Mid Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400">MID POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-semibold text-sky-300">{mid >= 0 ? mid : '-'}</span>
            <span className="text-[10px] text-slate-400">(val={currentMidVal})</span>
          </div>
        </div>

        {/* High Pointer */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400">HIGH POINTER</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-semibold text-purple-300">{high}</span>
            <span className="text-[10px] text-slate-400">(val={currentHighVal})</span>
          </div>
        </div>

        {/* Target */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400">TARGET</span>
          <span className="text-base font-semibold text-slate-200 mt-1">{target}</span>
        </div>

        {/* Sorted Half */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400">SORTED HALF</span>
          <span
            className={`text-xs font-semibold mt-1 uppercase ${
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
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400">STATUS</span>
          <span
            className={`text-xs font-semibold mt-1 uppercase ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/60">
        {/* Step Action Description */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{actionTitle}</span>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            {hinglishNarration}
          </p>
        </div>

        {/* Why Rule */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Invariant Rationale:</span>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            {whyRule}
          </p>
        </div>
      </div>

      {/* 4. Complexity & Invariant Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400 font-sans">
        <div className="flex items-center gap-4 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Time: <strong className="text-slate-200 font-semibold">O(log N)</strong></span>
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Space: <strong className="text-slate-200 font-semibold">O(1)</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          <span>At least one half is strictly sorted on every step</span>
        </div>
      </div>
    </div>
  );
}
