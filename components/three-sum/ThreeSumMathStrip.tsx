'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeSumStep } from '@/lib/threeSumSimulation';
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Sparkles,
  Equal,
  Plus,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';

interface ThreeSumMathStripProps {
  currentStep: ThreeSumStep;
}

export function ThreeSumMathStrip({ currentStep }: ThreeSumMathStripProps) {
  if (!currentStep || currentStep.actionType === 'init' || currentStep.actionType === 'sort') {
    return null;
  }

  const {
    arraySnapshot,
    i,
    left,
    right,
    currentSum,
    targetSum,
    requiredPairSum,
    currentPairSum,
    sumStatus,
    pointerMovement,
  } = currentStep;

  const anchorVal = arraySnapshot[i]?.val ?? 0;
  const leftVal = arraySnapshot[left]?.val ?? 0;
  const rightVal = arraySnapshot[right]?.val ?? 0;

  return (
    <div className="w-full bg-[#070b14] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 font-mono">
      {/* 1. Top Bar: Pointer Movement Indicator & Directional Motion Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
            Pointer Movement &amp; Decision Engine
          </span>
        </div>

        {/* Dynamic Pointer Motion Pill */}
        <div className="flex items-center gap-2">
          {pointerMovement.direction === 'right' && (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
            >
              <span>{pointerMovement.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          )}

          {pointerMovement.direction === 'left' && (
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{pointerMovement.label}</span>
            </motion.span>
          )}

          {pointerMovement.direction === 'none' && (
            <span
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border ${
                pointerMovement.type === 'both_contract'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : pointerMovement.type === 'early_exit'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              {pointerMovement.label}
            </span>
          )}
        </div>
      </div>

      {/* 2. Interactive 3-Term Math Formula Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Left 7 cols: 3-Term Sum Calculation */}
        <div className="md:col-span-7 bg-[#0d121f] border border-slate-800 p-3.5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span>LIVE 3-POINTER SUM EQUATION:</span>
            <span className="text-slate-500">nums[i] + nums[left] + nums[right]</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm sm:text-base font-extrabold">
            {/* Term 1: Anchor i */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-amber-400 font-bold">Anchor i[{i}]</span>
              <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono shadow-sm">
                {anchorVal}
              </span>
            </div>

            <Plus className="w-4 h-4 text-slate-500 shrink-0" />

            {/* Term 2: Left Pointer */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-sky-400 font-bold">Left[{left}]</span>
              <span className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono shadow-sm">
                {leftVal}
              </span>
            </div>

            <Plus className="w-4 h-4 text-slate-500 shrink-0" />

            {/* Term 3: Right Pointer */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-purple-400 font-bold">Right[{right}]</span>
              <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono shadow-sm">
                {rightVal}
              </span>
            </div>

            <Equal className="w-4 h-4 text-slate-500 shrink-0" />

            {/* Result: Current Sum */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold">Sum</span>
              <span
                className={`px-3.5 py-1.5 rounded-lg font-mono font-black shadow-md border ${
                  sumStatus === 'MATCH'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-400/50'
                    : sumStatus === 'TOO_LOW'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : sumStatus === 'TOO_HIGH'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                {currentSum}
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Target Comparison & Action Recommendation */}
        <div className="md:col-span-5 bg-[#0d121f] border border-slate-800 p-3.5 rounded-xl flex flex-col gap-2 justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Target className="w-3.5 h-3.5" /> Target Sum:
            </span>
            <span className="text-white font-black text-xs px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
              {targetSum} (Zero)
            </span>
          </div>

          {/* Action Comparison Verdict */}
          <div className="flex flex-col gap-1">
            {sumStatus === 'MATCH' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>MATCH FOUND! ({currentSum} === 0) → Record Triplet</span>
              </div>
            )}

            {sumStatus === 'TOO_LOW' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold">
                <TrendingUp className="w-4 h-4 shrink-0 text-sky-400" />
                <span>SUM TOO LOW ({currentSum} &lt; 0) → Move LEFT++</span>
              </div>
            )}

            {sumStatus === 'TOO_HIGH' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                <TrendingDown className="w-4 h-4 shrink-0 text-purple-400" />
                <span>SUM TOO HIGH ({currentSum} &gt; 0) → Move RIGHT--</span>
              </div>
            )}

            {sumStatus === 'NONE' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pointerMovement.reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. 2Sum Target Pair Sub-Calculation Gauge */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>2Sum Pair Requirement:</span>
          <span className="text-slate-200">nums[left] + nums[right]</span>
          <span className="text-slate-500">=</span>
          <span className="text-amber-300 font-bold">-nums[i] ({requiredPairSum})</span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400">Current Pair:</span>
          <span className="text-sky-300 font-bold">
            ({leftVal}) + ({rightVal}) = {currentPairSum}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              currentPairSum === requiredPairSum
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : currentPairSum < requiredPairSum
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
            }`}
          >
            {currentPairSum === requiredPairSum
              ? 'Pair Match! ✅'
              : currentPairSum < requiredPairSum
              ? `Gap: ${requiredPairSum - currentPairSum} too small`
              : `Gap: ${currentPairSum - requiredPairSum} too large`}
          </span>
        </div>
      </div>
    </div>
  );
}
