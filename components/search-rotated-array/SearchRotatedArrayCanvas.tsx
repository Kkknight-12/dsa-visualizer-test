'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Sliders,
  CheckCircle2,
  XCircle,
  Sparkles,
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
    isMatch,
    isNotFound,
    actionTitle,
    hinglishNarration,
  } = currentStep;

  // Convert array numbers to persistent elements for ReorderableArrayRail
  const elements: ArrayBlockElement[] = array.map((val, idx) => ({
    id: `cell-${idx}-${val}`,
    val,
  }));

  // Configure binary search pointers with restrained, clean styling
  const pointers: PointerInfo[] = [];

  if (low >= 0 && low < array.length && low <= high) {
    pointers.push({
      id: 'low',
      label: `L=${low}`,
      index: low,
      color: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      direction: 'down',
    });
  }

  if (mid >= 0 && mid < array.length && low <= high) {
    pointers.push({
      id: 'mid',
      label: `M=${mid}`,
      index: mid,
      color: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
      direction: 'down',
    });
  }

  if (high >= 0 && high < array.length && low <= high) {
    pointers.push({
      id: 'high',
      label: `H=${high}`,
      index: high,
      color: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
      direction: 'down',
    });
  }

  // Refined Color Config: Subdued, elegant, low visual fatigue
  const getColorConfig = (val: number, idx: number) => {
    // 1. Exact Match found
    if (idx === mid && isMatch) {
      return {
        bg: 'bg-emerald-500/15 ring-2 ring-emerald-500/40',
        border: 'border-emerald-500/60',
        text: 'text-emerald-200 font-bold',
        label: 'MATCH',
      };
    }

    // 2. Active Mid pointer
    if (idx === mid && low <= high) {
      return {
        bg: 'bg-sky-500/15',
        border: 'border-sky-500/50',
        text: 'text-sky-200 font-bold',
        label: 'MID',
      };
    }

    // 3. Out of current active search space [low ... high]
    if (idx < low || idx > high) {
      return {
        bg: 'bg-[#080b12]/60 opacity-25',
        border: 'border-slate-800/30',
        text: 'text-slate-600 line-through',
        label: '',
      };
    }

    // 4. In Left Sorted Half
    if (sortedHalf === 'left' && idx >= low && idx <= mid) {
      return {
        bg: 'bg-emerald-500/5',
        border: 'border-emerald-500/30',
        text: 'text-slate-100',
        label: 'SORTED',
      };
    }

    // 5. In Right Sorted Half
    if (sortedHalf === 'right' && idx >= mid && idx <= high) {
      return {
        bg: 'bg-purple-500/5',
        border: 'border-purple-500/30',
        text: 'text-slate-100',
        label: 'SORTED',
      };
    }

    // 6. Default active range element
    return {
      bg: 'bg-[#0d121f]',
      border: 'border-slate-800',
      text: 'text-slate-200',
      label: '',
    };
  };

  const activeElementsCount = Math.max(0, high - low + 1);
  const searchSpacePercent = Math.round((activeElementsCount / array.length) * 100);

  return (
    <div className="w-full h-full bg-[#0a0d16] border border-slate-800/80 rounded-2xl flex flex-col shadow-xl overflow-hidden font-mono">
      {/* 1. Header Bar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-[#080b14] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="font-semibold text-slate-300">
            BINARY SEARCH RANGE ELIMINATOR
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px] font-mono">
            O(log N)
          </span>
        </div>

        {/* Target Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
          <span className="text-slate-500">TARGET:</span>
          <span className="font-bold text-sky-400">{target}</span>
        </div>
      </div>

      {/* 2. Range Eliminator Slider & Scoreboard Deck */}
      <div className="p-4 border-b border-slate-800/60 bg-[#070a12] flex flex-col gap-3">
        {/* Metric Cards - Subdued, cohesive tone */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Active Search Space */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-mono">ACTIVE RANGE</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-slate-200">
                {low <= high ? `[${low} ... ${high}]` : 'Empty'}
              </span>
              <span className="text-[10px] text-slate-400">
                ({activeElementsCount} items)
              </span>
            </div>
          </div>

          {/* Current Mid Element */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-mono">CURRENT MID</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-sky-300">
                {mid >= 0 && mid < array.length ? `nums[${mid}] = ${array[mid]}` : '-'}
              </span>
            </div>
          </div>

          {/* Sorted Half Detected */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-mono">SORTED HALF</span>
            <span
              className={`text-xs font-semibold mt-1 uppercase ${
                sortedHalf === 'left'
                  ? 'text-emerald-300'
                  : sortedHalf === 'right'
                  ? 'text-purple-300'
                  : 'text-slate-400'
              }`}
            >
              {sortedHalf ? `${sortedHalf} Half Sorted` : 'Inspecting...'}
            </span>
          </div>

          {/* Search Status */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-mono">STATUS</span>
            <div className="flex items-center gap-1.5 mt-1">
              {isMatch ? (
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  FOUND!
                </span>
              ) : isNotFound ? (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  NOT FOUND
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
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
            <span className="text-slate-300 font-semibold">{searchSpacePercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
            <motion.div
              animate={{ width: `${searchSpacePercent}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="h-full bg-sky-500/70 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 3. Reusable Array Rail (Framer Motion FLIP) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#060810] min-h-[280px]">
        <ReorderableArrayRail
          elements={elements}
          pointers={pointers}
          getColorConfig={getColorConfig}
        />
      </div>

      {/* 4. Action Banner */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#080b14] flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{actionTitle}</span>
        </div>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          {hinglishNarration}
        </p>
      </div>
    </div>
  );
}
