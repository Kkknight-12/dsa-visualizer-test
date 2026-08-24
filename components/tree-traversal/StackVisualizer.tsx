'use client';

import React from 'react';
import { Layers, ArrowDown, LogOut, CornerDownRight } from 'lucide-react';
import { TraversalFrame, TreeStepState } from '@/types/treeTraversal';

interface StackVisualizerProps {
  currentStep: TreeStepState;
}

export function StackVisualizer({ currentStep }: StackVisualizerProps) {
  const stack = currentStep.stackSnapshot;
  // Stack top is the last element in array
  const reversedStack = [...stack].reverse();

  return (
    <div className="flex flex-col w-full h-[320px] bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Call Stack (LIFO)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
          Depth: {stack.length}
        </span>
      </div>

      {/* Stack Frames Container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 flex flex-col justify-start">
        {/* Popped Frame Callout (if active action is pop/visit) */}
        {currentStep.poppedFrame && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 animate-pulse text-sky-300 text-xs font-mono">
            <LogOut className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <span>Popped Node {currentStep.poppedFrame.node.val}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                currentStep.poppedFrame.phase === 'visit'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {currentStep.poppedFrame.phase}
              </span>
            </div>
          </div>
        )}

        {reversedStack.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-xs font-mono gap-1">
            <Layers className="w-8 h-8 stroke-1 text-slate-700" />
            <span>[ Empty Stack ]</span>
          </div>
        ) : (
          reversedStack.map((frame, idx) => {
            const isTop = idx === 0;
            const isVisit = frame.phase === 'visit';

            return (
              <div
                key={`${frame.node.id}-${frame.phase}-${idx}`}
                className={`relative flex items-center justify-between p-2.5 rounded-xl border font-mono text-xs transition-all duration-300 ${
                  isTop
                    ? 'bg-slate-900/90 border-sky-500/50 shadow-lg shadow-sky-500/10 scale-[1.02]'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                }`}
              >
                {/* Left: Node Info & Top Badge */}
                <div className="flex items-center gap-2">
                  {isTop && (
                    <span className="text-[9px] font-bold text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded border border-sky-500/40 animate-pulse">
                      TOP
                    </span>
                  )}
                  <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
                    {frame.node.val}
                  </div>
                  <span className="text-slate-300 text-[11px]">
                    Node({frame.node.val})
                  </span>
                </div>

                {/* Right: Phase Pill */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
                      isVisit
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {frame.phase}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Stack Indicator */}
      <div className="pt-2 border-t border-slate-800/80 text-center text-[10px] font-mono text-slate-500">
        ━━━ Stack Bottom ━━━
      </div>
    </div>
  );
}
