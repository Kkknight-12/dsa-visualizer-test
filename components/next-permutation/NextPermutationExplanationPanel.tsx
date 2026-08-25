'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Trophy, Lightbulb } from 'lucide-react';
import { NextPermutationStep } from '@/lib/nextPermutationSimulation';

interface NextPermutationExplanationPanelProps {
  currentStep: NextPermutationStep;
  totalSteps: number;
}

export function NextPermutationExplanationPanel({ currentStep, totalSteps }: NextPermutationExplanationPanelProps) {
  const {
    stepNumber,
    activeLine,
    actionTitle,
    hinglishNarration,
    whyRule,
    actionType,
    nums,
  } = currentStep;

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 font-sans">
      {/* Header: Clear 2-Column Layout (Content Left, Badges Right) */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        {/* Column 1: Main Title & Subtitle */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-md shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider">
              Step Explanation & Core DSA Logic
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1 leading-relaxed">
              Detailed breakdown of Lexicographical Swap & Suffix Reversal (O(N) Time • O(1) Space)
            </p>
          </div>
        </div>

        {/* Column 2: Metadata Badges (Line & Step Counter) */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-bold text-sky-300 bg-sky-500/20 border border-sky-500/40 px-3 py-1 rounded-lg shadow-sm">
            LINE {activeLine}
          </span>
          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg shadow-inner">
            Step <strong className="text-amber-400 font-black">{stepNumber}</strong> / {totalSteps}
          </span>
        </div>
      </div>

      {actionType === 'complete' ? (
        /* Completion Final Result Banner */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-amber-500/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-lg">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-base font-black text-amber-300">
                  FINAL RESULT: Next Permutation = [{nums.join(', ')}]
                </span>
                <span className="text-xs sm:text-sm font-mono px-3 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold">
                  In-Place Modified
                </span>
              </div>
              <p className="text-sm text-slate-200 font-sans mt-1">
                Sequence: <span className="font-mono font-bold text-amber-200">[{nums.join(' → ')}]</span>
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
        /* Standard Step Action Breakdown & Logic Intuition (Clean Full-Width Stack) */
        <div className="flex flex-col gap-3.5">
          {/* Card 1: Code Action Title & Hinglish Narration */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-col gap-2.5 shadow-inner">
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

          {/* Card 2: Dedicated Core DSA Logic & Intuition ("WHY Rule") */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2.5 shadow-lg shadow-amber-500/5">
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
