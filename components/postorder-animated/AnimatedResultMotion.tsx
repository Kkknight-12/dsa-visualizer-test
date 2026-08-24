'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListOrdered, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface AnimatedResultMotionProps {
  result: number[];
  isComplete: boolean;
  totalNodes?: number;
}

export function AnimatedResultMotion({ result, isComplete, totalNodes = 6 }: AnimatedResultMotionProps) {
  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Expanding Result Array: <code>const result: number[]</code>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Appends <code className="text-emerald-300">current.val</code> only when node reaches its <span className="text-purple-300 font-semibold">&apos;visit&apos;</span> phase
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            Length: <strong className="text-emerald-400">{result.length}</strong>
          </span>
          {isComplete && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/50 shadow-lg shadow-emerald-500/10"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Traversal Finished!
            </motion.span>
          )}
        </div>
      </div>

      {/* Expanding Memory Cells Display */}
      <div className="flex items-center gap-3 min-h-[75px] overflow-x-auto py-2 px-1">
        {/* Array Opening Bracket */}
        <span className="text-2xl font-bold text-slate-600 select-none">[</span>

        {result.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic py-2">
            <span className="animate-pulse">Waiting for first &apos;visit&apos; marker to pop...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <AnimatePresence mode="popLayout">
              {result.map((val, idx) => {
                const isLatest = idx === result.length - 1;

                return (
                  <motion.div
                    key={`${val}-${idx}`}
                    layout
                    initial={{ scale: 0, y: 35, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 22,
                    }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    {/* Index Indicator */}
                    <span className="text-[10px] text-slate-500 font-mono">
                      index [{idx}]
                    </span>

                    {/* Animated Memory Box */}
                    <motion.div
                      animate={
                        isLatest
                          ? {
                              scale: [1, 1.15, 1],
                              borderColor: ['#34d399', '#10b981', '#059669'],
                              boxShadow: [
                                '0 0 0 rgba(16, 185, 129, 0)',
                                '0 0 25px rgba(16, 185, 129, 0.4)',
                                '0 0 10px rgba(16, 185, 129, 0.2)',
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 0.6 }}
                      className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-extrabold text-lg border-2 shadow-xl backdrop-blur-md transition-colors ${
                        isLatest
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40'
                          : 'bg-slate-900/90 border-slate-700 text-slate-100'
                      }`}
                    >
                      {val}

                      {/* Sparkle tag for latest appended element */}
                      {isLatest && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md"
                        >
                          +
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Array Closing Bracket */}
        <span className="text-2xl font-bold text-slate-600 select-none">]</span>
      </div>
    </div>
  );
}
