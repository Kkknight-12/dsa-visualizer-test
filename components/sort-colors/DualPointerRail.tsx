'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { SortColorsStep } from '@/lib/sortColorsSimulation';

interface DualPointerRailProps {
  currentStep: SortColorsStep;
}

export function DualPointerRail({ currentStep }: DualPointerRailProps) {
  const { arraySnapshot, low, mid, high, swappingIndices, actionType } = currentStep;

  const getColorConfig = (val: number) => {
    switch (val) {
      case 0:
        return {
          bg: 'bg-rose-500/25 border-rose-500/70 text-rose-200 shadow-rose-500/20',
          badgeBg: 'bg-rose-500 text-slate-950',
          label: '0 (Red)',
        };
      case 1:
        return {
          bg: 'bg-slate-200 border-white text-slate-950 font-extrabold shadow-slate-200/30',
          badgeBg: 'bg-slate-300 text-slate-950',
          label: '1 (White)',
        };
      case 2:
        return {
          bg: 'bg-sky-500/25 border-sky-500/70 text-sky-200 shadow-sky-500/20',
          badgeBg: 'bg-sky-500 text-slate-950',
          label: '2 (Blue)',
        };
      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          badgeBg: 'bg-slate-700 text-slate-300',
          label: String(val),
        };
    }
  };

  const isSwapAction = actionType === 'swap_low' || actionType === 'swap_high';

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs overflow-hidden">
      {/* 1. Component Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 via-amber-500 to-sky-500 flex items-center justify-center shadow-lg">
            <Layers className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Dutch National Flag 3-Pointer Rail
              <span className="text-[9px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono flex items-center gap-1">
                <RefreshCw className={`w-3 h-3 ${isSwapAction ? 'animate-spin' : ''}`} />
                Dynamic Physical Arc Swaps
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              4 Virtual Boundaries: 0s [0...low-1] • 1s [low...mid-1] • Unknown [mid...high] • 2s [high+1...n-1]
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-rose-300">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" /> 0 (Red)
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded bg-slate-200" /> 1 (White)
          </span>
          <span className="flex items-center gap-1 text-sky-300">
            <span className="w-2.5 h-2.5 rounded bg-sky-500" /> 2 (Blue)
          </span>
        </div>
      </div>

      {/* 2. Main 2D Array Rail Canvas with Physical Framer Motion Arc Swaps */}
      <div className="relative flex-1 flex items-center justify-center gap-2 sm:gap-4 px-2 py-6">
        {arraySnapshot.map((element, idx) => {
          const val = element.val;
          const config = getColorConfig(val);
          const isSwapping = swappingIndices?.includes(idx);
          const swapPosIdx = swappingIndices ? swappingIndices.indexOf(idx) : -1;
          
          // Arc Y-offset calculation: 1st swapped element arcs UP (-26px), 2nd swapped element arcs DOWN (+26px)
          const arcYOffset = isSwapping ? (swapPosIdx === 0 ? -26 : 26) : 0;
          const arcRotate = isSwapping ? (swapPosIdx === 0 ? -6 : 6) : 0;

          const isLowHere = idx === low;
          const isMidHere = idx === mid;
          const isHighHere = idx === high;

          return (
            <div
              key={`col-slot-${idx}`}
              className="flex-1 max-w-[76px] flex flex-col items-center justify-center gap-2"
            >
              {/* TOP SLOT: High Pointer Badge (Points Down) */}
              <div className="h-10 flex items-end justify-center w-full">
                {isHighHere ? (
                  <motion.div
                    layoutId="high-pointer-badge"
                    className="flex flex-col items-center"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  >
                    <span className="px-2 py-0.5 rounded bg-purple-500 text-white text-[9px] font-bold shadow-md shadow-purple-500/30 whitespace-nowrap">
                      high={high}
                    </span>
                    <ArrowDown className="w-4 h-4 text-purple-400 animate-bounce" />
                  </motion.div>
                ) : null}
              </div>

              {/* CENTER SLOT: 2D Array Cell with Persistent Element ID Key for Real Physical Layout Motion */}
              <motion.div
                key={element.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  y: arcYOffset,
                  rotate: arcRotate,
                  scale: isSwapping ? 1.18 : isMidHere ? 1.05 : 1,
                  opacity: 1,
                }}
                transition={{
                  layout: { type: 'spring', stiffness: 220, damping: 22 },
                  y: { type: 'spring', stiffness: 300, damping: 20 },
                  scale: { duration: 0.2 },
                }}
                className={`relative w-full h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-colors ${
                  config.bg
                } ${
                  isSwapping
                    ? 'ring-4 ring-amber-400 shadow-2xl shadow-amber-500/50 z-30 border-amber-300'
                    : ''
                }`}
              >
                {/* Cell Index Badge */}
                <span className="absolute top-1.5 left-2 text-[9px] font-mono text-slate-400 font-semibold">
                  [{idx}]
                </span>

                {/* Swap Indicator Laser Effect */}
                {isSwapping && (
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 right-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shadow-lg"
                  >
                    SWAP ↔
                  </motion.span>
                )}

                {/* Value Display */}
                <span className="text-xl font-extrabold font-mono tracking-wider">
                  {val}
                </span>

                {/* Region Label */}
                <span className="text-[9px] font-mono opacity-80 mt-0.5">
                  {config.label.split(' ')[1]}
                </span>
              </motion.div>

              {/* BOTTOM SLOT: Low & Mid Pointer Badges (Points Up) */}
              <div className="h-14 flex flex-col items-center justify-start gap-1 w-full pt-1">
                {isLowHere && (
                  <motion.div
                    layoutId="low-pointer-badge"
                    className="flex flex-col items-center"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-bold shadow-md shadow-emerald-500/30 whitespace-nowrap">
                      low={low}
                    </span>
                  </motion.div>
                )}

                {isMidHere && (
                  <motion.div
                    layoutId="mid-pointer-badge"
                    className="flex flex-col items-center"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-bold shadow-md shadow-amber-500/30 whitespace-nowrap">
                      mid={mid}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Action Step Banner & Hinglish Rule Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <strong className="text-sky-300 font-bold">{currentStep.actionTitle}</strong>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Step {currentStep.stepNumber}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-sans italic">
          💡 {currentStep.hinglishNarration}
        </p>
      </div>
    </div>
  );
}
