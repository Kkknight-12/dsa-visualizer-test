'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDown, LogOut, PlusCircle } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface AnimatedStackMotionProps {
  currentStep: TreeStepState;
}

export function AnimatedStackMotion({ currentStep }: AnimatedStackMotionProps) {
  const stack = currentStep.stackSnapshot; // 0 is bottom, last is top
  const reversedStack = [...stack].reverse(); // Render top at visual top

  const isPop = currentStep.actionType === 'pop';

  // Compute what frame is being pushed in this step (if push action)
  const getPushedFrameInfo = (): { val: number; phase: 'expand' | 'visit'; target: string } | null => {
    if (!currentStep.poppedFrame) return null;
    const curr = currentStep.poppedFrame.node;

    if (currentStep.actionType === 'push_visit') {
      return { val: curr.val, phase: 'visit', target: `Node(${curr.val}) Visit Marker` };
    }
    if (currentStep.actionType === 'push_right' && curr.right) {
      return { val: curr.right.val, phase: 'expand', target: `Right Child Node(${curr.right.val})` };
    }
    if (currentStep.actionType === 'push_left' && curr.left) {
      return { val: curr.left.val, phase: 'expand', target: `Left Child Node(${curr.left.val})` };
    }
    return null;
  };

  const pushedFrame = getPushedFrameInfo();

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs overflow-hidden">
      {/* 1. Header */}
      <div className="border-b border-slate-800 pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                LIFO Array Stack
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                <code>const stack: TraversalFrame[] = [&#123; node, phase &#125;]</code>
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold shrink-0">
            Length: {stack.length}
          </span>
        </div>
      </div>

      {/* 2. TraversalFrame Animation Area (Push vs Pop Active Banners) */}
      <div className="py-2 space-y-1.5">
        {/* CASE A: PUSH ACTION */}
        <AnimatePresence mode="wait">
          {pushedFrame && (
            <motion.div
              key={`push-${pushedFrame.val}-${currentStep.stepNumber}`}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 shadow-md shadow-amber-500/5 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <PlusCircle className="w-3.5 h-3.5" /> Pushing TraversalFrame:
                </span>
                <span className="text-[9px] text-amber-400/80 font-mono">
                  stack.push(frame) ↓
                </span>
              </div>
              <div className="bg-slate-950/90 p-1.5 rounded-lg border border-amber-500/30 font-mono text-[11px] font-bold text-white flex items-center justify-between">
                <span className="truncate">
                  &#123; node: <span className="text-sky-300">Node({pushedFrame.val})</span>, phase: <span className="text-amber-300">&apos;{pushedFrame.phase}&apos;</span> &#125;
                </span>
                <span className="text-emerald-400 text-[10px] animate-bounce shrink-0 pl-1">↓ Pushing</span>
              </div>
            </motion.div>
          )}

          {/* CASE B: POP ACTION */}
          {isPop && currentStep.poppedFrame && (
            <motion.div
              key={`pop-${currentStep.poppedFrame.node.val}-${currentStep.stepNumber}`}
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/70 text-sky-200 shadow-md shadow-sky-500/10 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-bold text-white">
                  <LogOut className="w-3.5 h-3.5 text-sky-400 animate-bounce" /> Popped from Stack Top:
                </span>
                <span className="text-[9px] text-sky-300 font-mono">
                  const frame = stack.pop()! ↑
                </span>
              </div>
              <div className="bg-slate-950/90 p-1.5 rounded-lg border border-sky-400/50 font-mono text-[11px] font-bold text-sky-300 flex items-center justify-between">
                <span className="truncate">
                  frame = &#123; node: <strong className="text-white">Node({currentStep.poppedFrame.node.val})</strong>, phase: <strong className="text-amber-300">&apos;{currentStep.poppedFrame.phase}&apos;</strong> &#125;
                </span>
                <span className="text-sky-400 text-[9px] shrink-0 pl-1">CPU Active</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Intake Boundary */}
        <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 border-b border-dashed border-slate-800 pb-1">
          <span className="flex items-center gap-1 text-sky-400 font-bold">
            <ArrowDown className="w-3 h-3 animate-bounce" /> TOP OF STACK (Index: [{stack.length > 0 ? stack.length - 1 : 0}])
          </span>
          <span>LIFO Work-Queue</span>
        </div>
      </div>

      {/* 3. Physical Animated Stack Cards (Scrollable & Responsive) */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-1 pr-1 max-h-[260px] min-h-[180px]">
        {reversedStack.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs italic gap-2 py-6">
            <Layers className="w-8 h-8 text-slate-700 stroke-1" />
            <span>stack = [] (Empty Array)</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {reversedStack.map((frame, reverseIdx) => {
              const actualIndex = stack.length - 1 - reverseIdx;
              const isTop = reverseIdx === 0;
              const isVisit = frame.phase === 'visit';

              return (
                <motion.div
                  key={`${frame.node.id}-${frame.phase}-${actualIndex}`}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 24,
                  }}
                  className={`p-2 rounded-xl border transition-all duration-200 shadow-md ${
                    isTop
                      ? 'bg-slate-900 border-sky-400/80 shadow-sky-500/10 ring-1 ring-sky-500/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Left: Index + TOP Pill + Node Avatar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 select-none">
                        [{actualIndex}]
                      </span>
                      {isTop && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-sky-500 text-slate-950 shadow-sm select-none">
                          TOP
                        </span>
                      )}
                      <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-white text-xs">
                        {frame.node.val}
                      </div>
                      <span className="text-slate-200 font-semibold text-[11px]">
                        &#123; node: <strong className="text-sky-300">Node({frame.node.val})</strong>,
                      </span>
                    </div>

                    {/* Right: Phase Property Tag */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[10px]">phase:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-sm ${
                          isVisit
                            ? 'bg-purple-950 border-purple-400 text-purple-200'
                            : 'bg-amber-950 border-amber-400 text-amber-200'
                        }`}
                      >
                        &apos;{frame.phase}&apos;
                      </span>
                      <span className="text-slate-200 font-semibold text-[11px]">&#125;</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* 4. Bottom Boundary */}
      <div className="pt-2 border-t border-slate-800 text-center text-[10px] text-slate-500 flex items-center justify-between">
        <span>━━━ STACK BOTTOM (Index [0]) ━━━</span>
        <span>LIFO Order</span>
      </div>
    </div>
  );
}
