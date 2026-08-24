'use client';

import React from 'react';
import { Lightbulb, Sparkles, BookOpen, GitCommit } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface TreeNarrationProps {
  currentStep: TreeStepState;
  totalSteps: number;
}

export function TreeNarration({ currentStep, totalSteps }: TreeNarrationProps) {
  const getActionBadge = (type: TreeStepState['actionType']) => {
    switch (type) {
      case 'init':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'pop':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'visit':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse';
      case 'push_visit':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'push_right':
      case 'push_left':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'complete':
        return 'bg-emerald-500/30 text-emerald-200 border-emerald-400 font-bold';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full bg-slate-950/85 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-2xl shadow-2xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono font-bold uppercase">
            Step {currentStep.stepNumber} / {totalSteps}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${getActionBadge(
              currentStep.actionType
            )}`}
          >
            {currentStep.actionType.replace('_', ' ')}
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <GitCommit className="w-3.5 h-3.5 text-sky-400" /> Line {currentStep.activeLine}
        </span>
      </div>

      {/* Step Title */}
      <div>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          {currentStep.actionTitle}
        </h3>
      </div>

      {/* Hinglish Explanation */}
      <div className="bg-slate-900/60 border border-slate-800/70 p-3 rounded-xl">
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {currentStep.hinglishNarration}
        </p>
      </div>

      {/* Why It Matters Callout */}
      <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/25 p-2.5 rounded-xl">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-amber-200/90 leading-snug">
          <strong className="text-amber-300 font-semibold block mb-0.5">The LIFO Scheduling Principle:</strong>
          {currentStep.whyRule}
        </div>
      </div>
    </div>
  );
}
