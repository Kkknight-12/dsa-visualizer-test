'use client';

import React from 'react';
import { ListOrdered, CheckCircle2 } from 'lucide-react';

interface ResultMemoryArrayProps {
  result: number[];
  isComplete: boolean;
}

export function ResultMemoryArray({ result, isComplete }: ResultMemoryArrayProps) {
  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col gap-2 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Memory Buffer: const result: number[] = [{result.join(', ')}]
          </h3>
        </div>

        {isComplete && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-3 h-3" /> Traversal Completed!
          </span>
        )}
      </div>

      {/* Memory Cells Container */}
      <div className="flex items-center gap-2 min-h-[50px] overflow-x-auto py-1">
        {result.length === 0 ? (
          <div className="text-xs text-slate-500 italic">
            [ ] (Empty — no nodes visited yet)
          </div>
        ) : (
          result.map((val, idx) => {
            const isLast = idx === result.length - 1;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-slate-500">[{idx}]</span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shadow-md transition-all ${
                    isLast
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/80 shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  {val}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
