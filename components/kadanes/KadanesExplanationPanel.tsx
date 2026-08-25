'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Code2, Trophy, ArrowRight, Lightbulb } from 'lucide-react';
import { KadanesStep } from '@/lib/kadanesSimulation';

interface KadanesExplanationPanelProps {
  currentStep: KadanesStep;
  totalSteps: number;
}

export function KadanesExplanationPanel({ currentStep, totalSteps }: KadanesExplanationPanelProps) {
  const {
    stepNumber,
    activeLine,
    actionTitle,
    hinglishNarration,
    whyRule,
    actionType,
    maxSum,
    bestStart,
    bestEnd,
    arraySnapshot,
  } = currentStep;

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3 font-sans">
      {/* Header: Action Title & Step Counter */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-md">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider flex items-center gap-2.5">
              Step Explanation & Core DSA Logic
              <span className="text-xs font-mono px-3 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                Line {activeLine}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Detailed breakdown of code execution and algorithmic intuition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-mono font-bold text-sky-300 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl shadow-inner">
            Step <strong className="text-amber-400 font-black">{stepNumber}</strong> / {totalSteps}
          </span>
        </div>
      </div>

      {actionType === 'complete' ? (
        /* Completion Final Result Banner */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-amber-500/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-lg">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-base font-black text-amber-300">
                  FINAL RESULT: Max Subarray Sum = {maxSum}
                </span>
                <span className="text-xs sm:text-sm font-mono px-3 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold">
                  Range [{bestStart} ... {bestEnd}]
                </span>
              </div>
              <p className="text-sm text-slate-200 font-sans mt-1">
                Optimal contiguous elements: <span className="font-mono font-bold text-amber-200">[{arraySnapshot.slice(bestStart, bestEnd + 1).map((e) => e.val).join(', ')}]</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-emerald-400 bg-emerald-500/15 px-3.5 py-2 rounded-xl border border-emerald-500/30 font-bold shrink-0">
            <span>Time: O(N)</span>
            <span>•</span>
            <span>Space: O(1)</span>
          </div>
        </motion.div>
      ) : (
        /* Standard Step Action Breakdown & Logic Intuition */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Code Action Title & Hinglish Narration (6 cols) */}
          <div className="md:col-span-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-col gap-2.5 shadow-inner">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-sky-400 shrink-0" />
              <span className="text-xs sm:text-sm font-mono font-black text-sky-300 uppercase tracking-wider">
                Code Action (Line {activeLine})
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono leading-snug">
              {actionTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed pt-2 border-t border-slate-800/80">
              💬 <strong className="text-sky-300 font-bold">Narration:</strong> {hinglishNarration}
            </p>
          </div>

          {/* Right: Dedicated Core DSA Logic & Intuition ("WHY Rule") (6 cols) */}
          <div className="md:col-span-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2.5 shadow-lg shadow-amber-500/5">
            <div className="flex items-center gap-2">
              <Brain className="w-4.5 h-4.5 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-mono font-black text-amber-300 uppercase tracking-wider">
                Core DSA Logic & Intuition ("WHY Rule")
              </span>
            </div>
            <p className="text-sm sm:text-base text-amber-100 font-sans leading-relaxed font-medium">
              {whyRule}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
