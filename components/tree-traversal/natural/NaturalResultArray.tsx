'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListOrdered, CheckCircle2 } from 'lucide-react';

interface NaturalResultArrayProps {
  result: number[];
  isComplete: boolean;
}

export function NaturalResultArray({ result, isComplete }: NaturalResultArrayProps) {
  return (
    <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Output Array: result: number[]
          </h3>
        </div>

        {isComplete && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Traversal Completed!
          </motion.span>
        )}
      </div>

      {/* Array Elements Container with Spring Entrances */}
      <div className="flex items-center gap-2.5 min-h-[58px] overflow-x-auto py-1 px-1">
        {result.length === 0 ? (
          <div className="text-xs font-mono text-slate-500 italic py-2">
            [ ] (Waiting for first visit marker to pop from stack)
          </div>
        ) : (
          <AnimatePresence>
            {result.map((val, idx) => {
              const isLast = idx === result.length - 1;
              return (
                <motion.div
                  key={`${val}-${idx}`}
                  initial={{ opacity: 0, scale: 0.5, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex flex-col items-center gap-1"
                >
                  {/* Index Tag */}
                  <span className="text-[9px] font-mono text-slate-500">[{idx}]</span>
                  {/* Array Box */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border shadow-lg transition-all duration-300 ${
                      isLast
                        ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400 shadow-emerald-500/25 ring-2 ring-emerald-500/30'
                        : 'bg-slate-900/90 border-slate-700 text-slate-200'
                    }`}
                  >
                    {val}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
