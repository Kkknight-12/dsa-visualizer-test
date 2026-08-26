'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplets, Waves, ArrowDown, ArrowUp, ShieldAlert } from 'lucide-react';
import { TrappingWaterStep } from '@/lib/trappingWaterSimulation';

interface TrappingWaterCanvasProps {
  currentStep: TrappingWaterStep;
}

export function TrappingWaterCanvas({ currentStep }: TrappingWaterCanvasProps) {
  const {
    heights,
    left,
    right,
    leftMax,
    rightMax,
    totalWater,
    waterGrid,
    activePointer,
    trappingAtIdx,
    actionType,
  } = currentStep;

  const maxHeight = Math.max(...heights, 4);
  const UNIT_HEIGHT_PX = 38;

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs overflow-hidden select-none">
      {/* 1. Canvas Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Droplets className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              2D Elevation Map & Water Basin Studio
              <span className="text-[9px] px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono flex items-center gap-1">
                <Waves className="w-3 h-3 animate-pulse" />
                Two Pointers Invariant
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Rule: Water[i] = min(leftMax, rightMax) - height[i]. Move shorter wall pointer inward.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-slate-700 border border-slate-500" /> Terrain Bar
          </span>
          <span className="flex items-center gap-1 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500/50 border border-cyan-400" /> Trapped Water
          </span>
        </div>
      </div>

      {/* 2. Top Metrics Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2">
        {/* Metric 1: Total Water */}
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold">
            <span>TOTAL WATER</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black font-mono tracking-tight text-cyan-300">
              {totalWater}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">units</span>
          </div>
        </div>

        {/* Metric 2: Left Max Wall */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col justify-between shadow-lg transition-all ${
            activePointer === 'left'
              ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] text-emerald-400 font-bold">LEFT MAX (leftMax)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-300">{leftMax}</span>
            <span className="text-[10px] text-slate-400 font-mono">@ left={left}</span>
          </div>
        </div>

        {/* Metric 3: Right Max Wall */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col justify-between shadow-lg transition-all ${
            activePointer === 'right'
              ? 'bg-purple-950/40 border-purple-500/80 ring-1 ring-purple-500/50'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] text-purple-400 font-bold">RIGHT MAX (rightMax)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black font-mono text-purple-300">{rightMax}</span>
            <span className="text-[10px] text-slate-400 font-mono">@ right={right}</span>
          </div>
        </div>

        {/* Metric 4: Bottleneck Side */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] text-slate-400 font-bold">ACTIVE BOTTLENECK</span>
          <div className="flex items-center gap-1 mt-1 font-bold font-mono text-xs text-amber-300 truncate">
            {left <= right ? (
              heights[left] <= heights[right] ? (
                <span className="text-emerald-300">LEFT (h[{left}] &le; h[{right}])</span>
              ) : (
                <span className="text-purple-300">RIGHT (h[{right}] &lt; h[{left}])</span>
              )
            ) : (
              <span className="text-slate-400">Pointers Met</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. 2D Elevation & Trapped Water Canvas */}
      <div className="relative w-full flex-1 min-h-[260px] max-h-[300px] flex items-end justify-center px-4 py-2 border border-slate-800/80 rounded-xl bg-[#0b0e14]">
        {/* Horizontal Elevation Guidelines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
          {Array.from({ length: maxHeight + 1 }).map((_, idx) => (
            <div key={idx} className="border-b border-slate-700 w-full flex items-center justify-between text-[9px]">
              <span>H={maxHeight - idx}</span>
            </div>
          ))}
        </div>

        {/* Elevation Columns Container */}
        <div className="relative flex items-end justify-center gap-2 sm:gap-3 md:gap-4 w-full max-w-4xl z-10">
          {heights.map((h, idx) => {
            const trappedUnits = waterGrid[idx] || 0;
            const isLeft = idx === left && left <= right;
            const isRight = idx === right && left <= right;
            const isJustTrapped = idx === trappingAtIdx;

            const barHeightPx = Math.max(12, h * UNIT_HEIGHT_PX);
            const waterHeightPx = trappedUnits * UNIT_HEIGHT_PX;

            return (
              <div
                key={`col-${idx}`}
                className="relative flex flex-col items-center flex-1 max-w-[58px] min-w-[32px] justify-end"
              >
                {/* TOP POINTER BADGES */}
                <div className="h-12 flex items-end justify-center w-full mb-1">
                  {isLeft && (
                    <motion.div
                      layoutId="ptr-left"
                      className="flex flex-col items-center gap-0.5"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-extrabold shadow-lg whitespace-nowrap tracking-wide bg-emerald-500 text-slate-950">
                        L={idx}
                      </span>
                      <ArrowDown className="w-4 h-4 text-emerald-400 animate-bounce" />
                    </motion.div>
                  )}
                  {isRight && (
                    <motion.div
                      layoutId="ptr-right"
                      className="flex flex-col items-center gap-0.5"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-extrabold shadow-lg whitespace-nowrap tracking-wide bg-purple-500 text-white">
                        R={idx}
                      </span>
                      <ArrowDown className="w-4 h-4 text-purple-400 animate-bounce" />
                    </motion.div>
                  )}
                </div>

                {/* COMBINED COLUMN (WATER STACKED OVER SOLID TERRAIN BAR) */}
                <div className="relative w-full flex flex-col justify-end items-center">
                  {/* Trapped Water Block */}
                  {trappedUnits > 0 && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      style={{ height: `${waterHeightPx}px` }}
                      className={`w-full rounded-t-lg bg-gradient-to-t from-cyan-600/70 to-sky-400/80 border border-cyan-300/80 flex items-center justify-center shadow-lg shadow-cyan-500/30 backdrop-blur-sm ${
                        isJustTrapped ? 'ring-2 ring-cyan-300 animate-pulse' : ''
                      }`}
                    >
                      <span className="text-[10px] font-black font-mono text-cyan-950 bg-cyan-200/90 px-1 rounded shadow">
                        +{trappedUnits}
                      </span>
                    </motion.div>
                  )}

                  {/* Solid Terrain Bar */}
                  <motion.div
                    style={{ height: `${barHeightPx}px` }}
                    className={`w-full rounded-b-xl border flex flex-col items-center justify-between p-1 transition-all ${
                      h === 0
                        ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                        : isLeft
                        ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/40 text-emerald-200'
                        : isRight
                        ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/40 text-purple-200'
                        : 'bg-slate-800/90 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black font-mono">{h}</span>
                  </motion.div>
                </div>

                {/* Index Indicator at bottom */}
                <div className="h-6 flex items-center justify-center w-full mt-1">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    [{idx}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Action Step Banner & Hinglish Rule Footer */}
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
