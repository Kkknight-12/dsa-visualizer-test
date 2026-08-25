'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Sparkles,
  TrendingUp,
  RotateCcw,
  ShieldAlert,
  Lightbulb,
  Compass,
  CheckCircle2,
  Flag,
} from 'lucide-react';

export function SortColorsProblemInfo() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'problem' | 'intuition' | 'algorithm' | 'proof' | 'complexity'>('problem');
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const visualFlowSteps = [
    {
      title: 'Step 1: Initial Array & 3 Pointers Setup',
      array: [2, 0, 2, 1, 1, 0],
      low: 0,
      mid: 0,
      high: 5,
      swappedIndices: null as [number, number] | null,
      description: 'Pointers initialized: low=0, mid=0, high=5. Entire array is currently in the UNKNOWN region [mid...high].',
      badge: 'Initialization',
    },
    {
      title: 'Step 2: Process nums[mid] = 2 → Swap with High (j=5)',
      array: [0, 0, 2, 1, 1, 2],
      low: 0,
      mid: 0,
      high: 4,
      swappedIndices: [0, 5] as [number, number],
      description: 'nums[mid] is 2! Swap nums[0] with nums[5]. Decrement high to 4. Mid stays at 0 to inspect newly arrived element.',
      badge: 'Move 2 Right',
    },
    {
      title: 'Step 3: Process nums[mid] = 0 → Swap with Low (i=0)',
      array: [0, 0, 2, 1, 1, 2],
      low: 1,
      mid: 1,
      high: 4,
      swappedIndices: [0, 0] as [number, number],
      description: 'nums[mid] is 0! Swap nums[mid] with nums[low] (self-swap at index 0). Increment both low=1 and mid=1.',
      badge: 'Move 0 Left',
    },
    {
      title: 'Step 4: Process nums[mid] = 0 → Swap with Low (i=1)',
      array: [0, 0, 2, 1, 1, 2],
      low: 2,
      mid: 2,
      high: 4,
      swappedIndices: [1, 1] as [number, number],
      description: 'nums[mid] is 0! Swap with nums[low=1]. Increment low=2 and mid=2. Subarray of 0s is now [0...1].',
      badge: 'Expand 0s Region',
    },
    {
      title: 'Step 5: Process nums[mid] = 2 → Swap with High (j=4)',
      array: [0, 0, 1, 1, 2, 2],
      low: 2,
      mid: 2,
      high: 3,
      swappedIndices: [2, 4] as [number, number],
      description: 'nums[mid] is 2! Swap index 2 with index 4. Decrement high to 3. Mid stays at 2.',
      badge: 'Move 2 Right',
    },
    {
      title: 'Step 6: All Colors Sorted In-Place!',
      array: [0, 0, 1, 1, 2, 2],
      low: 2,
      mid: 4,
      high: 3,
      swappedIndices: null as [number, number] | null,
      description: 'Termination condition met (mid > high)! Array is partitioned into 0s (Red), 1s (White), and 2s (Blue) in O(N) single pass.',
      badge: 'Final Result!',
    },
  ];

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl font-sans overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-[#070a14] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
              LeetCode 75: Sort Colors (Dutch National Flag) — Master Visual Guide
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                In-Place O(N) 3-Pointer
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Interactive 3-way partition region diagram, floating pointer badges & single-pass swap proofs
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-all shadow-sm"
        >
          <span>{isOpen ? 'Collapse Guide' : 'Expand Full Guide'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Main Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 flex flex-col gap-5 border-t border-slate-800/60"
          >
            {/* Interactive Tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
              <button
                onClick={() => setActiveTab('problem')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'problem'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Overview & Examples</span>
              </button>

              <button
                onClick={() => setActiveTab('intuition')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'intuition'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Flag className="w-4 h-4 text-sky-400" />
                <span>2. 3-Way Partition Region Diagram</span>
              </button>

              <button
                onClick={() => setActiveTab('algorithm')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'algorithm'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>3. Interactive Array Morphing Canvas</span>
              </button>

              <button
                onClick={() => setActiveTab('proof')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'proof'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>4. Single Pass Swap Proof</span>
              </button>

              <button
                onClick={() => setActiveTab('complexity')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'complexity'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>5. Complexity & Edge Cases</span>
              </button>
            </div>

            {/* TAB 1: Problem Overview */}
            {activeTab === 'problem' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 text-sm text-slate-300">
                <div className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                  <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Target className="w-4 h-4 text-amber-400" />
                    Problem Definition
                  </h3>
                  <p>
                    Given an array <code className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">nums</code> with <code className="font-mono text-white">n</code> objects colored red (0), white (1), or blue (2), sort them <strong>in-place</strong> so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2).
                  </p>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-100 font-sans leading-relaxed mt-1">
                    💡 <strong>Constraint:</strong> You must solve this problem without using the library's sort function, in a <strong>single pass O(N)</strong> algorithm using <strong>O(1) extra space</strong>.
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a14]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Input `nums`</th>
                        <th className="py-3 px-4">Sorted Result</th>
                        <th className="py-3 px-4 font-sans">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[2, 0, 2, 1, 1, 0]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[0, 0, 1, 1, 2, 2]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Grouped 0s (Red), 1s (White), and 2s (Blue) in order.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[2, 0, 1]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[0, 1, 2]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">In-place 3-pointer partition swap.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Dutch National Flag 3-Way Partition Region Diagram */}
            {activeTab === 'intuition' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                {/* Visual Region Rail Diagram */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flag className="w-5 h-5 text-sky-400 shrink-0" />
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        Dutch National Flag 4-Region Array Invariant Diagram
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      Single-Pass Array Invariant
                    </span>
                  </div>

                  {/* Visual 4-Region Bar Canvas */}
                  <div className="w-full bg-[#050811] p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full font-mono">
                      {/* Region 1: 0s (Red) */}
                      <div className="p-4 rounded-xl bg-rose-500/15 border-2 border-rose-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-rose-400 uppercase tracking-widest">
                          Region 1: 0s (Red)
                        </span>
                        <div className="text-lg font-black text-white bg-rose-500/30 px-3 py-1 rounded-lg border border-rose-400">
                          [0 ... low-1]
                        </div>
                        <span className="text-[11px] text-rose-200 text-center font-sans">
                          All elements are strictly <strong>0</strong>
                        </span>
                      </div>

                      {/* Region 2: 1s (White) */}
                      <div className="p-4 rounded-xl bg-slate-800/80 border-2 border-slate-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-slate-200 uppercase tracking-widest">
                          Region 2: 1s (White)
                        </span>
                        <div className="text-lg font-black text-white bg-slate-700/60 px-3 py-1 rounded-lg border border-slate-400">
                          [low ... mid-1]
                        </div>
                        <span className="text-[11px] text-slate-300 text-center font-sans">
                          All elements are strictly <strong>1</strong>
                        </span>
                      </div>

                      {/* Region 3: UNKNOWN */}
                      <div className="p-4 rounded-xl bg-amber-500/15 border-2 border-dashed border-amber-500/60 flex flex-col items-center gap-2 shadow-lg animate-pulse">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                          Region 3: UNKNOWN (?)
                        </span>
                        <div className="text-lg font-black text-amber-200 bg-amber-500/30 px-3 py-1 rounded-lg border border-amber-400">
                          [mid ... high]
                        </div>
                        <span className="text-[11px] text-amber-100 text-center font-sans">
                          Unprocessed elements being scanned
                        </span>
                      </div>

                      {/* Region 4: 2s (Blue) */}
                      <div className="p-4 rounded-xl bg-sky-500/15 border-2 border-sky-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-sky-400 uppercase tracking-widest">
                          Region 4: 2s (Blue)
                        </span>
                        <div className="text-lg font-black text-white bg-sky-500/30 px-3 py-1 rounded-lg border border-sky-400">
                          [high+1 ... n-1]
                        </div>
                        <span className="text-[11px] text-sky-200 text-center font-sans">
                          All elements are strictly <strong>2</strong>
                        </span>
                      </div>
                    </div>

                    {/* Pointer Role Callout Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-xs font-mono pt-2 border-t border-slate-800">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                        📍 <strong>`low` Pointer:</strong> Points to the boundary where the next 0 should be swapped.
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
                        🔍 <strong>`mid` Pointer:</strong> Active scanner inspecting current element in the Unknown region.
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200">
                        🛡️ <strong>`high` Pointer:</strong> Points to the boundary where the next 2 should be swapped.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive Array Morphing Canvas & Frame Flow */}
            {activeTab === 'algorithm' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                {/* Frame Selector Buttons */}
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 px-2">Interactive Array Flow:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {visualFlowSteps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInteractiveStep(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          interactiveStep === idx
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        Frame {idx + 1}: {s.badge}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Frame Display with Floating Pointers */}
                {(() => {
                  const step = visualFlowSteps[interactiveStep];
                  return (
                    <motion.div
                      key={interactiveStep}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-2xl bg-gradient-to-b from-[#0b101d] to-[#070a14] border border-slate-800 flex flex-col gap-6 shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <h4 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">low={step.low}</span>
                          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">mid={step.mid}</span>
                          <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">high={step.high}</span>
                        </div>
                      </div>

                      {/* Array Block Canvas */}
                      <div className="flex items-center justify-center gap-3 sm:gap-4 py-8 bg-[#050811] rounded-xl border border-slate-800">
                        {step.array.map((val, idx) => {
                          const isLow = step.low === idx;
                          const isMid = step.mid === idx;
                          const isHigh = step.high === idx;
                          const isSwapped = step.swappedIndices && (step.swappedIndices[0] === idx || step.swappedIndices[1] === idx);

                          // Color by value: 0=Rose, 1=Slate, 2=Sky
                          const valBg =
                            val === 0
                              ? 'bg-rose-500/25 border-rose-400 text-rose-300'
                              : val === 1
                              ? 'bg-slate-700/40 border-slate-400 text-slate-200'
                              : 'bg-sky-500/25 border-sky-400 text-sky-300';

                          return (
                            <motion.div
                              key={idx}
                              layout
                              className={`relative w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl ${valBg} ${
                                isSwapped ? 'ring-4 ring-amber-400 animate-pulse' : ''
                              }`}
                            >
                              <span className="text-xs font-mono text-slate-400 absolute top-1">[{idx}]</span>
                              <span className="text-2xl sm:text-3xl font-black font-mono mt-2">{val}</span>

                              {/* Pointer Badges */}
                              <div className="absolute -bottom-8 flex flex-col gap-0.5 items-center">
                                {isLow && (
                                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                                    LOW
                                  </span>
                                )}
                                {isMid && (
                                  <span className="bg-amber-400 text-slate-950 text-[10px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                                    MID
                                  </span>
                                )}
                                {isHigh && (
                                  <span className="bg-purple-500 text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                                    HIGH
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Explanation Callout */}
                      <p className="text-sm text-slate-200 font-sans leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                        💬 <strong className="text-amber-300 font-bold">Stage Explanation:</strong> {step.description}
                      </p>
                    </motion.div>
                  );
                })()}

                {/* Complete Written Stage Breakdown List */}
                <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Full Stage-by-Stage Text Breakdown & WHY Logic:
                  </h4>

                  {/* Case 0 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      0
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Case 0: `nums[mid] == 0` → Move to Left (Low Region)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                          Swap & Increment Both
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Swap <code className="font-mono text-amber-300">nums[mid]</code> with <code className="font-mono text-emerald-300">nums[low]</code>. Then increment both <code className="font-mono text-emerald-300">low++</code> and <code className="font-mono text-amber-300">mid++</code>.
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        💡 <strong>WHY?</strong> Index <code className="text-emerald-300">low</code> marks the start of 1s region. Swapping 0 with <code className="text-emerald-300">nums[low]</code> shifts the 1s region right and extends the 0s region!
                      </div>
                    </div>
                  </div>

                  {/* Case 1 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/40 border border-slate-500/40 text-slate-200 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Case 1: `nums[mid] == 1` → Already in Middle Region
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700/60 text-slate-200 border border-slate-500/40 font-mono">
                          Increment Mid Only
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Element 1 is already in its correct middle region <code className="font-mono text-slate-200">[low ... mid-1]</code>. Simply increment <code className="font-mono text-amber-300">mid++</code>.
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        💡 <strong>WHY?</strong> No swap required! Moving <code className="text-amber-300">mid</code> forward automatically absorbs this 1 into the 1s region.
                      </div>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Case 2: `nums[mid] == 2` → Move to Right (High Region)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                          Swap & Decrement High Only
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Swap <code className="font-mono text-amber-300">nums[mid]</code> with <code className="font-mono text-purple-300">nums[high]</code>. Then decrement <code className="font-mono text-purple-300">high--</code>. <strong>DO NOT increment mid!</strong>
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        ⚠️ <strong>CRITICAL WHY:</strong> Swapping with <code className="text-purple-300">high</code> brings an uninspected element from the right into index <code className="text-amber-300">mid</code>. We MUST keep <code className="text-amber-300">mid</code> at the same position so the next loop iteration inspects it!
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: Proof */}
            {activeTab === 'proof' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3 text-sm text-slate-300">
                <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  Why Dutch National Flag Solves Sort Colors in a Single Pass O(N)
                </h3>
                <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    By maintaining 4 strict sub-array invariants at all times during the loop:
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-rose-300 font-bold">1. Range [0 ... low-1] contains ONLY 0s.</div>
                    <div className="text-slate-100 font-bold">2. Range [low ... mid-1] contains ONLY 1s.</div>
                    <div className="text-amber-300 font-bold">3. Range [mid ... high] contains UNKNOWN elements.</div>
                    <div className="text-sky-300 font-bold">4. Range [high+1 ... n-1] contains ONLY 2s.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 font-mono text-xs text-emerald-100">
                    🔥 <strong>Termination Invariant:</strong> When <code className="text-white">mid &gt; high</code>, the UNKNOWN region becomes empty! The entire array is naturally partitioned into [0s, 1s, 2s] in a single pass without extra memory!
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: Complexity & Edge Cases */}
            {activeTab === 'complexity' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">Complexity Benchmarks</h4>
                  <div className="text-xs font-mono space-y-2">
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Time Complexity:</span>
                      <strong className="text-emerald-400">O(N)</strong>
                    </div>
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Space Complexity:</span>
                      <strong className="text-emerald-400">O(1)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">Edge Cases</h4>
                  <ul className="text-xs space-y-2 list-disc pl-4 font-sans text-slate-300">
                    <li><strong>Already Sorted (`[0, 1, 2]`)</strong>: Runs single pass without unnecessary swaps.</li>
                    <li><strong>All Same Element (`[2, 2, 2]`)</strong>: Decrements high until <code className="font-mono text-purple-300">mid &gt; high</code> terminates cleanly.</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
