'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDown, LogOut } from 'lucide-react';
import { TraversalFrame, TreeStepState } from '@/types/treeTraversal';

interface NaturalStackVisualizerProps {
  currentStep: TreeStepState;
}

export function NaturalStackVisualizer({ currentStep }: NaturalStackVisualizerProps) {
  const stack = currentStep.stackSnapshot;
  // Stack top is the last element in array -> render top first
  const reversedStack = [...stack].reverse();

  return (
    <div className="flex flex-col w-full h-[360px] bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Call Stack (LIFO)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
          Depth: {stack.length}
        </span>
      </div>

      {/* Stack Container with Smooth Spring Animations */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 flex flex-col justify-start">
        {/* Popped Frame Banner */}
        <AnimatePresence mode="wait">
          {currentStep.poppedFrame && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-mono shadow-lg shadow-sky-500/5"
            >
              <LogOut className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span className="font-semibold">Popped Node {currentStep.poppedFrame.node.val}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                    currentStep.poppedFrame.phase === 'visit'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {currentStep.poppedFrame.phase}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {reversedStack.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-xs font-mono gap-1.5 py-8">
            <Layers className="w-7 h-7 stroke-1 text-slate-700" />
            <span>[ Empty Stack ]</span>
          </div>
        ) : (
          /* Animated Stack Cards */
          <AnimatePresence initial={false}>
            {reversedStack.map((frame, idx) => {
              const isTop = idx === 0;
              const isVisit = frame.phase === 'visit';

              return (
                <motion.div
                  key={`${frame.node.id}-${frame.phase}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  className={`relative flex items-center justify-between p-2.5 rounded-xl border font-mono text-xs shadow-md transition-colors duration-200 ${
                    isTop
                      ? 'bg-slate-900/90 border-sky-500/50 text-white shadow-sky-500/10'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  {/* Left: Node Info & Top Badge */}
                  <div className="flex items-center gap-2.5">
                    {isTop && (
                      <span className="text-[9px] font-extrabold text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded border border-sky-500/40 animate-pulse">
                        TOP
                      </span>
                    )}
                    <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs">
                      {frame.node.val}
                    </div>
                    <span className="text-slate-200 text-xs font-semibold">
                      Node({frame.node.val})
                    </span>
                  </div>

                  {/* Right: Phase Pill */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
                      isVisit
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {frame.phase}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Stack Indicator */}
      <div className="pt-2 border-t border-slate-800/80 text-center text-[10px] font-mono text-slate-500">
        ━━━ Stack Bottom ━━━
      </div>
    </div>
  );
}
