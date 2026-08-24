'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, Cpu, Sparkles, CornerDownRight } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface DataFlowPipelineProps {
  currentStep: TreeStepState;
}

export function DataFlowPipeline({ currentStep }: DataFlowPipelineProps) {
  const frame = currentStep.poppedFrame;
  const current = frame ? frame.node : null;
  const isVisit = frame?.phase === 'visit';

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Live Data-Flow & Variable Transfer
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Variable lifecycle: <code>stack.pop()</code> → <code>frame.node</code> → <code>result.push()</code>
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold shrink-0">
          Line {currentStep.activeLine}
        </span>
      </div>

      {/* 3-Stage Pipeline Cards (Stack-Safe Flex/Grid Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto py-1">
        {/* ── STAGE 1: const frame = stack.pop()! ── */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-col justify-between min-w-0 overflow-hidden space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-[8px]">1</span>
              Extract Frame
            </span>
            <span className="text-[9px] text-sky-400/90 font-mono">stack.pop()</span>
          </div>

          <div className="py-2 flex flex-col justify-center min-h-[60px]">
            <AnimatePresence mode="wait">
              {frame ? (
                <motion.div
                  key={`frame-${frame.node.val}-${currentStep.stepNumber}`}
                  initial={{ y: 15, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -15, opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="p-2 rounded-lg bg-slate-950 border border-sky-500/40 text-center space-y-1"
                >
                  <div className="text-[10px] text-slate-400">let frame =</div>
                  <div className="text-[11px] font-bold text-white truncate">
                    &#123; node: <strong className="text-sky-300">{frame.node.val}</strong>, phase: <strong className={isVisit ? 'text-purple-300' : 'text-amber-300'}>&apos;{frame.phase}&apos;</strong> &#125;
                  </div>
                </motion.div>
              ) : (
                <span className="text-slate-600 text-[10px] italic text-center">No active frame</span>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between">
            <span>From stack top</span>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:block" />
          </div>
        </div>

        {/* ── STAGE 2: const current = frame.node ── */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-col justify-between min-w-0 overflow-hidden space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[8px]">2</span>
              Access Node
            </span>
            <span className="text-[9px] text-purple-400 font-mono">frame.node</span>
          </div>

          <div className="py-2 flex flex-col justify-center min-h-[60px]">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={`curr-${current.val}-${currentStep.stepNumber}`}
                  initial={{ x: -15, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="p-2 rounded-lg bg-slate-950 border border-purple-500/40 text-center space-y-1"
                >
                  <div className="text-[10px] text-slate-400">current = Node({current.val})</div>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-0.5">
                    <span>L: <strong className={current.left ? 'text-sky-300' : 'text-slate-600'}>{current.left ? current.left.val : '∅'}</strong></span>
                    <span>•</span>
                    <span>R: <strong className={current.right ? 'text-sky-300' : 'text-slate-600'}>{current.right ? current.right.val : '∅'}</strong></span>
                  </div>
                </motion.div>
              ) : (
                <span className="text-slate-600 text-[10px] italic text-center">Waiting...</span>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between">
            <span>Pointer unpacked</span>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:block" />
          </div>
        </div>

        {/* ── STAGE 3: Action: result.push OR schedule ── */}
        <div className={`p-3 rounded-xl flex flex-col justify-between min-w-0 overflow-hidden space-y-1.5 transition-all duration-300 ${
          isVisit
            ? 'bg-emerald-950/40 border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
            : 'bg-slate-900/90 border border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1 truncate">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] shrink-0 ${
                isVisit ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
              }`}>3</span>
              {isVisit ? 'Push Result' : 'Schedule'}
            </span>
            <span className={`text-[9px] font-mono font-bold shrink-0 ${isVisit ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isVisit ? 'result.push' : 'stack.push'}
            </span>
          </div>

          <div className="py-2 flex flex-col justify-center min-h-[60px]">
            <AnimatePresence mode="wait">
              {current && isVisit ? (
                <motion.div
                  key={`push-result-${current.val}-${currentStep.stepNumber}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="p-1.5 rounded-lg bg-emerald-950/90 border border-emerald-400 text-emerald-200 flex items-center justify-between px-2.5 shadow-lg"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>Pushing:</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-6 h-6 rounded-md bg-emerald-500 text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center shadow"
                  >
                    {current.val}
                  </motion.div>
                </motion.div>
              ) : current && !isVisit ? (
                <motion.div
                  key={`expand-${current.val}-${currentStep.stepNumber}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-1.5 rounded-md bg-slate-950 border border-amber-500/40 text-[10px] space-y-0.5 text-slate-300"
                >
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <CornerDownRight className="w-3 h-3" /> Pushing to Stack:
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    1. &#123; node: {current.val}, &apos;visit&apos; &#125;
                  </div>
                  {current.right && (
                    <div className="text-[9px] text-slate-400 truncate">
                      2. &#123; node: {current.right.val}, &apos;expand&apos; &#125;
                    </div>
                  )}
                  {current.left && (
                    <div className="text-[9px] text-sky-300 truncate font-semibold">
                      3. &#123; node: {current.left.val}, &apos;expand&apos; &#125; [TOP]
                    </div>
                  )}
                </motion.div>
              ) : (
                <span className="text-slate-600 text-[10px] italic text-center">Awaiting decision</span>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between">
            <span className="truncate">{isVisit ? 'Value → output buffer' : 'Reverse LIFO order'}</span>
            {isVisit && <ArrowDown className="w-3 h-3 text-emerald-400 animate-bounce" />}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Active Node: <strong className="text-white">{current ? `Node(${current.val})` : 'None'}</strong></span>
        <span>Output Length: <strong className="text-emerald-300">{currentStep.resultSnapshot.length}</strong></span>
      </div>
    </div>
  );
}
