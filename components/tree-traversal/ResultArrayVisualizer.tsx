'use client';

import React from 'react';
import { ListOrdered, CheckCircle2 } from 'lucide-react';

interface ResultArrayVisualizerProps {
  result: number[];
  isComplete: boolean;
}

export function ResultArrayVisualizer({ result, isComplete }: ResultArrayVisualizerProps) {
  return (
    <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Output Array: result: number[]
          </h3>
        </div>

        {isComplete && (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-3 h-3" /> Traversal Completed!
          </span>
        )}
      </div>

      {/* Array Elements Container */}
      <div className="flex items-center gap-2 min-h-[52px] overflow-x-auto py-1 px-1">
        {result.length === 0 ? (
          <div className="text-xs font-mono text-slate-600 italic">
            [ ] (Empty — waiting for first visit marker to pop)
          </div>
        ) : (
          result.map((val, idx) => {
            const isLast = idx === result.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isLast ? 'scale-105' : ''
                }`}
              >
                {/* Index tag */}
                <span className="text-[9px] font-mono text-slate-500">[{idx}]</span>
                {/* Array Box */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border shadow-lg ${
                    isLast
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-emerald-500/20 animate-pulse'
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
