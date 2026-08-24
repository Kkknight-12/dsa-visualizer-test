'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface PhaseTransformationEngineProps {
  currentStep: TreeStepState;
}

export function PhaseTransformationEngine({ currentStep }: PhaseTransformationEngineProps) {
  const frame = currentStep.poppedFrame;
  const current = frame ? frame.node : null;
  const isVisitPhase = frame?.phase === 'visit';
  const action = currentStep.actionType;

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-3 font-mono text-xs overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Phase Morphing & Reverse LIFO Scheduling
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Watch <code>&#123; node, &apos;expand&apos; &#125;</code> mutate to <code>&#123; node, &apos;visit&apos; &#125;</code> and schedule children
            </p>
          </div>
        </div>

        {/* Current State Phase Pill */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Active:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${
              isVisitPhase
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/10'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/10'
            }`}
          >
            {frame ? frame.phase : 'idle'}
          </span>
        </div>
      </div>

      {/* 2. Visual Morphing Stage (4 Responsive Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* ── STEP 1: POP FROM STACK ── */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between min-w-0 overflow-hidden transition-all duration-300 ${
          action === 'pop' || action === 'init'
            ? 'bg-sky-500/10 border-sky-400/80 shadow-lg shadow-sky-500/10'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] font-bold text-slate-300 uppercase">1. Pop Frame</span>
            <span className="text-[9px] text-sky-400">stack.pop()</span>
          </div>

          <div className="py-2 flex flex-col items-center justify-center min-h-[60px]">
            <AnimatePresence mode="wait">
              {frame ? (
                <motion.div
                  key={`step1-${frame.node.val}-${currentStep.stepNumber}`}
                  initial={{ scale: 0.8, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-sky-400/60 text-center space-y-0.5 overflow-hidden"
                >
                  <span className="text-[9px] text-slate-400 block">Popped Work Unit:</span>
                  <div className="font-bold text-sky-300 text-xs truncate">
                    &#123; node: <span className="text-white">Node({frame.node.val})</span> &#125;
                  </div>
                </motion.div>
              ) : (
                <span className="text-slate-600 text-[10px] italic">Waiting...</span>
              )}
            </AnimatePresence>
          </div>
          <div className="text-[9px] text-slate-500 text-center">Unpacked from stack</div>
        </div>

        {/* ── STEP 2: MUTATE TO 'VISIT' MARKER & PUSH ── */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between min-w-0 overflow-hidden transition-all duration-300 ${
          action === 'push_visit'
            ? 'bg-purple-500/15 border-purple-400/80 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] font-bold text-purple-300 uppercase truncate">2. Push Visit Marker</span>
            <span className="text-[9px] text-purple-400 shrink-0">&apos;visit&apos;</span>
          </div>

          <div className="py-2 flex flex-col items-center justify-center min-h-[60px]">
            <AnimatePresence mode="wait">
              {current && !isVisitPhase ? (
                <motion.div
                  key={`morph-${current.val}-${currentStep.stepNumber}`}
                  initial={{ rotateY: 90, scale: 0.8, opacity: 0 }}
                  animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-full p-1.5 rounded-lg bg-purple-950/80 border border-purple-400/60 text-center space-y-0.5 overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-1 text-[9px] text-purple-200 font-bold">
                    <Sparkles className="w-2.5 h-2.5 text-purple-300 animate-spin" /> Morphed Token:
                  </div>
                  <div className="text-[10px] font-bold text-white bg-slate-950 p-1 rounded border border-purple-500/40 truncate">
                    &#123; node: {current.val}, &apos;visit&apos; &#125;
                  </div>
                </motion.div>
              ) : (
                <span className="text-slate-600 text-[10px] italic">Root Marker</span>
              )}
            </AnimatePresence>
          </div>
          <div className="text-[9px] text-purple-400/90 text-center font-bold">Pushed 1st (Runs LAST)</div>
        </div>

        {/* ── STEP 3: SCHEDULE RIGHT CHILD ── */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between min-w-0 overflow-hidden transition-all duration-300 ${
          action === 'push_right'
            ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] font-bold text-amber-300 uppercase truncate">3. Push Right Child</span>
            <span className="text-[9px] text-amber-400 shrink-0">.right</span>
          </div>

          <div className="py-2 flex flex-col items-center justify-center min-h-[60px]">
            {current && current.right ? (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full p-1.5 rounded-lg bg-amber-950/80 border border-amber-400/60 text-center space-y-0.5 overflow-hidden"
              >
                <span className="text-[9px] text-amber-300 block font-semibold">Right Subtree Frame:</span>
                <div className="text-[10px] font-bold text-white bg-slate-950 p-1 rounded border border-amber-500/40 truncate">
                  &#123; node: {current.right.val}, &apos;expand&apos; &#125;
                </div>
              </motion.div>
            ) : (
              <span className="text-slate-600 text-[10px] italic">{current ? 'current.right = ∅ (Skip)' : 'Waiting...'}</span>
            )}
          </div>
          <div className="text-[9px] text-amber-400/90 text-center font-bold">Pushed 2nd</div>
        </div>

        {/* ── STEP 4: SCHEDULE LEFT CHILD (STACK TOP) ── */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between min-w-0 overflow-hidden transition-all duration-300 ${
          action === 'push_left'
            ? 'bg-sky-500/15 border-sky-400/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] font-bold text-sky-300 uppercase truncate">4. Push Left Child</span>
            <span className="text-[9px] text-sky-400 font-extrabold shrink-0">[TOP]</span>
          </div>

          <div className="py-2 flex flex-col items-center justify-center min-h-[60px]">
            {current && current.left ? (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full p-1.5 rounded-lg bg-sky-950/80 border border-sky-400/80 text-center space-y-0.5 shadow-md overflow-hidden"
              >
                <div className="flex items-center justify-center gap-1 text-[9px] text-sky-200 font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" /> TOP OF STACK:
                </div>
                <div className="text-[10px] font-bold text-white bg-slate-950 p-1 rounded border border-sky-500/50 truncate">
                  &#123; node: {current.left.val}, &apos;expand&apos; &#125;
                </div>
              </motion.div>
            ) : (
              <span className="text-slate-600 text-[10px] italic">{current ? 'current.left = ∅ (Skip)' : 'Waiting...'}</span>
            )}
          </div>
          <div className="text-[9px] text-sky-400 text-center font-extrabold">Pushed LAST → Runs FIRST!</div>
        </div>
      </div>

      {/* 3. The Golden LIFO Principle Banner */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-amber-950/40 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] text-slate-300 font-sans">
            <strong className="text-amber-300 font-mono">LIFO Inversion:</strong> Postorder execution order is <strong className="text-sky-300">LEFT</strong> → <strong className="text-amber-300">RIGHT</strong> → <strong className="text-purple-300">ROOT</strong>. Stack mein <strong className="text-purple-300">ROOT (visit)</strong> bottom push hota hai, fir <strong className="text-amber-300">RIGHT</strong>, aur <strong className="text-sky-300">LEFT</strong> top par push hota hai taaki next iteration mein Left pehle execute ho!
          </span>
        </div>
      </div>
    </div>
  );
}
