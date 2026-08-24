'use client';

import React from 'react';
import { Lightbulb, BookOpen, Code2, ChevronRight, Info } from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';
import { CodeDrawer } from './CodeDrawer';

export function NarrationPanel() {
  const currentStep = useSimulationStore((s) => s.getCurrentStep());
  const currentStepIndex = useSimulationStore((s) => s.currentStepIndex);
  const currentScenario = useSimulationStore((s) => s.currentScenario);
  const isCodeDrawerOpen = useSimulationStore((s) => s.isCodeDrawerOpen);
  const toggleCodeDrawer = useSimulationStore((s) => s.toggleCodeDrawer);

  if (!currentStep) return null;

  return (
    <div className="flex flex-col gap-3 pointer-events-auto max-w-md w-full">
      {/* Main Step Narration Card */}
      <div className="bg-slate-950/85 border border-slate-800/90 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl space-y-3">
        {/* Step Badge & Progress Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono font-bold uppercase">
              Step {currentStepIndex + 1} / {currentScenario.steps.length}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {currentScenario.name}
            </span>
          </div>

          {/* Toggle Code Button */}
          {currentStep.codeSnippet && (
            <button
              onClick={toggleCodeDrawer}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                isCodeDrawerOpen
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{isCodeDrawerOpen ? 'Hide Code' : 'View Code'}</span>
            </button>
          )}
        </div>

        {/* Step Title & Subtitle */}
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            {currentStep.title}
          </h2>
          <p className="text-xs text-sky-400 font-mono mt-0.5">{currentStep.subtitle}</p>
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
            <strong className="text-amber-300 font-semibold block mb-0.5">Why this matters:</strong>
            {currentStep.whyItMatters}
          </div>
        </div>
      </div>

      {/* Code Drawer (Conditional) */}
      {isCodeDrawerOpen && currentStep.codeSnippet && <CodeDrawer />}
    </div>
  );
}
