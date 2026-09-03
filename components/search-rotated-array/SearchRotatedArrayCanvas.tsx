'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Sliders,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SearchRotatedArrayStep } from '@/lib/searchRotatedArraySimulation';
import {
  ReorderableArrayRail,
  ArrayBlockElement,
  PointerInfo,
} from '@/components/common/ReorderableArrayRail';

interface SearchRotatedArrayCanvasProps {
  currentStep: SearchRotatedArrayStep;
}

export function SearchRotatedArrayCanvas({
  currentStep,
}: SearchRotatedArrayCanvasProps) {
  const {
    array,
    target,
    low,
    high,
    mid,
    sortedHalf,
    eliminatedRange,
    isMatch,
    isNotFound,
    actionTitle,
    hinglishNarration,
    whyRule,
  } = currentStep;

  // Convert array numbers to persistent elements for ReorderableArrayRail
  const elements: ArrayBlockElement[] = array.map((val, idx) => ({
    id: `cell-${idx}-${val}`,
    val,
  }));

  // Configure binary search pointers
  const pointers: PointerInfo[] = [];

  if (low >= 0 && low < array.length && low <= high) {
    pointers.push({
      id: 'low',
      label: `L=${low}`,
      index: low,
      color: 'emerald',
      direction: 'down',
    });
  }

  if (mid >= 0 && mid < array.length && low <= high) {
    pointers.push({
      id: 'mid',
      label: `M=${mid}`,
      index: mid,
      color: 'sky',
      direction: 'down',
    });
  }

  if (high >= 0 && high < array.length && low <= high) {
    pointers.push({
      id: 'high',
      label: `H=${high}`,
      index: high,
      color: 'purple',
      direction: 'down',
    });
  }

  // Color config function for cells
  const getColorConfig = (val: number, idx: number) => {
    // 1. Exact Match found!
    if (idx === mid && isMatch) {
      return {
        bg: 'bg-emerald-500/30 ring-4 ring-emerald-400',
        border: 'border-emerald-400',
        text: 'text-emerald-100 font-black',
        label: 'MATCH',
      };
    }

    // 2. Active Mid pointer
    if (idx === mid) {
      return {
        bg: 'bg-sky-500/25',
        border: 'border-sky-400',
        text: 'text-sky-200 font-bold',
        label: 'MID',
      };
    }

    // 3. Out of current active search space [low ... high]
    if (idx < low || idx > high) {
      return {
        bg: 'bg-slate-950/40 opacity-30',
        border: 'border-slate-800/40',
        text: 'text-slate-600 line-through',
        label: 'DISCARDED',
      };
    }

    // 4. In Left Sorted Half
    if (sortedHalf === 'left' && idx >= low && idx <= mid) {
      return {
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-500/60',
        text: 'text-emerald-300 font-bold',
        label: 'SORTED',
      };
    }

    // 5. In Right Sorted Half
    if (sortedHalf === 'right' && idx >= mid && idx <= high) {
      return {
        bg: 'bg-purple-950/40',
        border: 'border-purple-500/60',
        text: 'text-purple-300 font-bold',
        label: 'SORTED',
      };
    }

    // 6. Default active range element
    return {
      bg: 'bg-slate-900/90',
      border: 'border-slate-700/80',
      text: 'text-slate-200',
      label: '',
    };
  };

  const activeElementsCount = Math.max(0, high - low + 1);
  const searchSpacePercent = Math.round((activeElementsCount / array.length) * 100);

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-mono">
      {/* 1. Header Bar */}
      <div className="px-5 py-3 border-b border-slate-800 bg-[#070a14] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="font-bold text-slate-200">
            BINARY SEARCH RANGE ELIMINATOR CANVAS
          </span>
          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">
            O(log N) FLIP RAIL
          </span>
        </div>

        {/* Target Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span>TARGET = {target}</span>
        </div>
      </div>

      {/* 2. Range Eliminator Slider & Scoreboard Deck */}
      <div className="p-4 border-b border-slate-800/80 bg-[#090d16] flex flex-col gap-3">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Active Search Space */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold">ACTIVE RANGE</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-sky-300">
                {low <= high ? `[${low} ... ${high}]` : 'Empty'}
              </span>
              <span className="text-[10px] text-slate-500">
                ({activeElementsCount} items)
              </span>
            </div>
          </div>

          {/* Current Mid Element */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold">CURRENT MID</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-sky-400">
                {mid >= 0 && mid < array.length ? `nums[${mid}] = ${array[mid]}` : '-'}
              </span>
            </div>
          </div>

          {/* Sorted Half Detected */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold">SORTED HALF</span>
            <span
              className={`text-sm font-black mt-1 uppercase ${
                sortedHalf === 'left'
                  ? 'text-emerald-400'
                  : sortedHalf === 'right'
                  ? 'text-purple-400'
                  : 'text-slate-500'
              }`}
            >
              {sortedHalf ? `${sortedHalf} Half Sorted` : 'Inspecting...'}
            </span>
          </div>

          {/* Search Status */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold">STATUS</span>
            <div className="flex items-center gap-1.5 mt-1">
              {isMatch ? (
                <span className="text-sm font-black text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  FOUND!
                </span>
              ) : isNotFound ? (
                <span className="text-sm font-black text-rose-400 flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  NOT FOUND
                </span>
              ) : (
                <span className="text-sm font-black text-amber-300 flex items-center gap-1">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  SEARCHING...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search Space Shrinkage Progress Bar */}
        <div className="flex flex-col gap-1 text-[10px] text-slate-400">
          <div className="flex justify-between font-mono">
            <span>Search Space Remaining:</span>
            <span className="text-sky-300 font-bold">{searchSpacePercent}% of array</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              animate={{ width: `${searchSpacePercent}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 3. Reusable Array Rail (Framer Motion FLIP) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#05070e] min-h-[300px]">
        <ReorderableArrayRail
          elements={elements}
          pointers={pointers}
          highlightedRange={low <= high ? [low, high] : undefined}
          getColorConfig={getColorConfig}
        />
      </div>

      {/* 4. Action Banner */}
      <div className="p-4 border-t border-slate-800 bg-[#070a14] flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{actionTitle}</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {hinglishNarration}
        </p>
      </div>
    </div>
  );
}
