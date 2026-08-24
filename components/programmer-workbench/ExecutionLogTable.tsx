'use client';

import React from 'react';
import { Table, Check, ArrowRight } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface ExecutionLogTableProps {
  steps: TreeStepState[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export function ExecutionLogTable({
  steps,
  currentStepIndex,
  onSelectStep,
}: ExecutionLogTableProps) {
  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Step-by-Step Dry-Run Execution Trace (Memory Log)
          </h3>
        </div>
        <span className="text-[10px] text-slate-500">
          Click any row to jump state
        </span>
      </div>

      {/* Table Container */}
      <div className="h-[180px] overflow-y-auto overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60 sticky top-0">
              <th className="py-1.5 px-2 font-semibold">Step</th>
              <th className="py-1.5 px-2 font-semibold">Action</th>
              <th className="py-1.5 px-2 font-semibold">Current Frame</th>
              <th className="py-1.5 px-2 font-semibold">Stack Snapshot</th>
              <th className="py-1.5 px-2 font-semibold">Result Array</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;

              const stackSummary = step.stackSnapshot
                .map((f) => `${f.node.val}(${f.phase[0]})`)
                .join(', ');

              const resultSummary = `[${step.resultSnapshot.join(', ')}]`;

              return (
                <tr
                  key={idx}
                  onClick={() => onSelectStep(idx)}
                  className={`cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-sky-500/20 text-white font-bold'
                      : isPassed
                      ? 'hover:bg-slate-900/60 text-slate-300'
                      : 'hover:bg-slate-900/40 text-slate-500'
                  }`}
                >
                  <td className="py-1.5 px-2">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                      isCurrent ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}>
                      #{step.stepNumber}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 truncate max-w-[140px]">
                    {step.actionTitle.split('->')[0]}
                  </td>
                  <td className="py-1.5 px-2">
                    {step.poppedFrame ? (
                      <span className="text-amber-300">
                        Node {step.poppedFrame.node.val} ({step.poppedFrame.phase})
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2 text-purple-300">
                    [{stackSummary}]
                  </td>
                  <td className="py-1.5 px-2 text-emerald-400 font-bold">
                    {resultSummary}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
