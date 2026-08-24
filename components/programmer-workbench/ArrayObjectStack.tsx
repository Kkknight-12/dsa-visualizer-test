'use client';

import React, { useState } from 'react';
import { Layers, Code2, Database, ArrowUp, ArrowDown, LogOut } from 'lucide-react';
import { TraversalFrame, TreeStepState } from '@/types/treeTraversal';

interface ArrayObjectStackProps {
  currentStep: TreeStepState;
}

export function ArrayObjectStack({ currentStep }: ArrayObjectStackProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'json'>('cards');
  const stack = currentStep.stackSnapshot; // 0 is bottom, last is top

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col justify-between font-mono text-xs">
      {/* Header with View Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            stack: TraversalFrame[]
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2 py-0.5 rounded text-[10px] transition-all ${
              viewMode === 'cards'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Array of Objects
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-2 py-0.5 rounded text-[10px] transition-all ${
              viewMode === 'json'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON Raw
          </button>
        </div>
      </div>

      {/* Main Stack Content */}
      <div className="h-[220px] overflow-y-auto space-y-1.5 pr-1">
        {/* Popped Banner */}
        {currentStep.poppedFrame && (
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[11px] flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-1.5 font-semibold">
              <LogOut className="w-3.5 h-3.5" /> Popped from Top:
            </span>
            <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              &#123; node: Node({currentStep.poppedFrame.node.val}), phase: &apos;{currentStep.poppedFrame.phase}&apos; &#125;
            </span>
          </div>
        )}

        {viewMode === 'json' ? (
          /* JSON Raw View */
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            <pre>
              {JSON.stringify(
                stack.map((f, i) => ({
                  index: i,
                  node: `Node(${f.node.val})`,
                  phase: f.phase,
                })),
                null,
                2
              )}
            </pre>
          </div>
        ) : (
          /* Structured Array of Objects View (Top to Bottom) */
          stack.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs italic py-8">
              stack = [] (Empty Array)
            </div>
          ) : (
            <div className="space-y-1.5">
              {/* Render in reverse order so top is physically on top */}
              {[...stack].reverse().map((frame, reverseIdx) => {
                const actualIndex = stack.length - 1 - reverseIdx;
                const isTop = reverseIdx === 0;
                const isVisit = frame.phase === 'visit';

                return (
                  <div
                    key={`${frame.node.id}-${frame.phase}-${actualIndex}`}
                    className={`flex items-center justify-between p-2 rounded-xl border text-[11px] transition-colors ${
                      isTop
                        ? 'bg-slate-900 border-sky-500/60 shadow-md shadow-sky-500/5'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    {/* Index & Top Indicator */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold w-6">
                        [{actualIndex}]
                      </span>
                      {isTop && (
                        <span className="text-[9px] font-bold text-sky-400 bg-sky-500/20 px-1 py-0.2 rounded border border-sky-500/40">
                          TOP
                        </span>
                      )}
                      <span className="text-slate-200 font-semibold">
                        &#123; node: <span className="text-sky-300">Node({frame.node.val})</span>,
                      </span>
                    </div>

                    {/* Phase object property */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">phase:</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                          isVisit
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        &apos;{frame.phase}&apos;
                      </span>
                      <span className="text-slate-400">&#125;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Array Footer */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span>stack[0] is Array Bottom</span>
        <span>stack[stack.length - 1] is Array Top</span>
      </div>
    </div>
  );
}
