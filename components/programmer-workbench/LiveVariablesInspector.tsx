'use client';

import React from 'react';
import { Cpu, Variable, CheckCircle, XCircle, ArrowRight, CornerDownRight } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface LiveVariablesInspectorProps {
  currentStep: TreeStepState;
}

export function LiveVariablesInspector({ currentStep }: LiveVariablesInspectorProps) {
  const frame = currentStep.poppedFrame;
  const current = frame ? frame.node : null;

  const isVisitPhase = frame?.phase === 'visit';
  const hasRight = current ? current.right !== null : false;
  const hasLeft = current ? current.left !== null : false;

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl space-y-3 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Variable className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Scope Variables (Dry-Run State)
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
          Line {currentStep.activeLine}
        </span>
      </div>

      {/* 1. Variable: frame & current */}
      <div className="grid grid-cols-2 gap-2">
        {/* Frame Object */}
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block font-semibold">
            let frame = stack.pop()
          </span>
          {frame ? (
            <div className="space-y-0.5 text-slate-200">
              <div>
                <span className="text-slate-500">.node: </span>
                <span className="text-sky-300 font-bold">Node({frame.node.val})</span>
              </div>
              <div>
                <span className="text-slate-500">.phase: </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isVisitPhase
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  &apos;{frame.phase}&apos;
                </span>
              </div>
            </div>
          ) : (
            <span className="text-slate-500 italic">undefined / waiting</span>
          )}
        </div>

        {/* Current Node Pointer */}
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 block font-semibold">
            let current = frame.node
          </span>
          {current ? (
            <div className="space-y-0.5 text-slate-200">
              <div>
                <span className="text-slate-500">.val: </span>
                <span className="text-white font-bold">{current.val}</span>
              </div>
              <div className="text-[11px]">
                <span className="text-slate-500">.left: </span>
                <span className={current.left ? 'text-sky-300 font-semibold' : 'text-slate-500'}>
                  {current.left ? `Node(${current.left.val})` : 'null'}
                </span>
              </div>
              <div className="text-[11px]">
                <span className="text-slate-500">.right: </span>
                <span className={current.right ? 'text-sky-300 font-semibold' : 'text-slate-500'}>
                  {current.right ? `Node(${current.right.val})` : 'null'}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-slate-500 italic">null</span>
          )}
        </div>
      </div>

      {/* 2. Runtime Condition Checks */}
      <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl space-y-1.5">
        <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
          Runtime Branching Evaluator:
        </span>

        {/* Cond 1: frame.phase === 'visit' */}
        <div className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-300">
            <code>frame.phase === &apos;visit&apos;</code>
          </span>
          <span
            className={`flex items-center gap-1 font-bold ${
              isVisitPhase ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {isVisitPhase ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
            {isVisitPhase ? 'true -> visit & continue' : 'false -> expand children'}
          </span>
        </div>

        {/* Cond 2: current.right !== null */}
        {!isVisitPhase && current && (
          <div className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-300">
              <code>current.right !== null</code>
            </span>
            <span
              className={`flex items-center gap-1 font-bold ${
                hasRight ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {hasRight ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {hasRight ? `true (push Node ${current.right?.val})` : 'false (skip)'}
            </span>
          </div>
        )}

        {/* Cond 3: current.left !== null */}
        {!isVisitPhase && current && (
          <div className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-300">
              <code>current.left !== null</code>
            </span>
            <span
              className={`flex items-center gap-1 font-bold ${
                hasLeft ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {hasLeft ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {hasLeft ? `true (push Node ${current.left?.val})` : 'false (skip)'}
            </span>
          </div>
        )}
      </div>

      {/* 3. Memory Array Counters */}
      <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
        <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-xl">
          <span className="text-slate-400 block text-[10px]">stack.length</span>
          <span className="text-purple-300 font-bold text-sm">
            {currentStep.stackSnapshot.length} frames
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-xl">
          <span className="text-slate-400 block text-[10px]">result.length</span>
          <span className="text-emerald-300 font-bold text-sm">
            {currentStep.resultSnapshot.length} items
          </span>
        </div>
      </div>
    </div>
  );
}
