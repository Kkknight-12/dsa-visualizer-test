'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Trophy, Layers, Brain } from 'lucide-react';
import { KadanesStep } from '@/lib/kadanesSimulation';
import { ReorderableArrayRail, PointerInfo } from '@/components/common/ReorderableArrayRail';

interface KadanesVisualizerCanvasProps {
  currentStep: KadanesStep;
}

export function KadanesVisualizerCanvas({ currentStep }: KadanesVisualizerCanvasProps) {
  const {
    arraySnapshot,
    currentIndex,
    currentSum,
    maxSum,
    tempStart,
    bestStart,
    bestEnd,
    actionType,
  } = currentStep;

  // Build pointers configuration for ReorderableArrayRail
  const pointers: PointerInfo[] = [
    {
      label: 'i',
      index: currentIndex,
      color: 'bg-purple-500 text-white',
      direction: 'down',
    },
    {
      label: 'start',
      index: tempStart,
      color: 'bg-amber-400 text-slate-950',
      direction: 'up',
    },
  ];

  const isReset = actionType === 'reset_sum';
  const isNewMax = actionType === 'update_max';

  // Custom Color Config for Kadane's Array Elements
  const getKadanesColorConfig = (val: number) => {
    if (val < 0) {
      return {
        bg: 'bg-rose-500/20',
        border: 'border-rose-500/80',
        text: 'text-rose-200',
        label: 'Negative',
      };
    }
    return {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/80',
      text: 'text-emerald-200',
      label: 'Positive',
    };
  };

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs overflow-hidden">
      {/* 1. Canvas Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 via-amber-500 to-sky-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Kadane's Running Sum & Max Subarray Canvas
              <span className="text-[9px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Reusable Array Rail
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Rule: Discard negative prefix sums (&lt; 0) to maximize future contiguous subarray totals.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Positive (+)
          </span>
          <span className="flex items-center gap-1 text-rose-300">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Negative (-)
          </span>
        </div>
      </div>

      {/* 2. Top Metrics Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
        {/* Metric 1: Running Sum */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between shadow-lg backdrop-blur-md transition-all ${
            isReset
              ? 'bg-rose-950/40 border-rose-500/80 ring-2 ring-rose-500/50'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>RUNNING SUM (sum)</span>
            {isReset && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                currentSum < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {currentSum}
            </span>
            {isReset && <span className="text-[10px] text-rose-300 font-mono">RESET → 0</span>}
          </div>
        </div>

        {/* Metric 2: Global Maximum Sum */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between shadow-lg backdrop-blur-md transition-all ${
            isNewMax
              ? 'bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/50'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>RECORD MAX (maxSum)</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tracking-tight text-amber-400">
              {maxSum === -Infinity ? '-∞' : maxSum}
            </span>
            {isNewMax && <span className="text-[10px] text-amber-300 font-mono animate-pulse">RECORD!</span>}
          </div>
        </div>

        {/* Metric 3: Best Subarray Range */}
        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] text-slate-400 font-bold">BEST SUBARRAY RANGE</span>
          <div className="flex items-center gap-1.5 mt-1 text-sky-300 font-bold font-mono text-sm">
            <span>[{bestStart} ... {bestEnd}]</span>
          </div>
        </div>
      </div>

      {/* 3. Reusable ReorderableArrayRail Component */}
      <ReorderableArrayRail
        elements={arraySnapshot}
        pointers={pointers}
        highlightedRange={actionType === 'complete' ? [bestStart, bestEnd] : undefined}
        getColorConfig={getKadanesColorConfig}
      />

      {/* 4. Action Step Banner & Hinglish Rule Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[11px]">
        {actionType === 'complete' ? (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between shadow-lg shadow-amber-500/5">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-300">
                    FINAL RESULT: Max Subarray Sum = {maxSum}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Subarray [{bestStart} ... {bestEnd}]
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                  Optimal contiguous elements: [{arraySnapshot.slice(bestStart, bestEnd + 1).map((e) => e.val).join(', ')}]
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <span>Time: O(N)</span>
              <span>•</span>
              <span>Space: O(1)</span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-1.5 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <strong className="text-sky-300 font-bold">{currentStep.actionTitle}</strong>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Step {currentStep.stepNumber}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans">
              💬 {currentStep.hinglishNarration}
            </p>

            <div className="flex items-start gap-1.5 text-[11px] font-sans text-amber-200/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg leading-relaxed">
              <Brain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold text-amber-300 font-mono text-[10px] uppercase tracking-wide">Logic & Intuition: </strong>
                {currentStep.whyRule}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
