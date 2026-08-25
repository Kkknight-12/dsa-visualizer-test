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
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  Compass,
  Layers,
  ArrowDownUp,
  CheckCircle2,
} from 'lucide-react';

export function NextPermutationProblemInfo() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'problem' | 'intuition' | 'algorithm' | 'reverse_trick' | 'complexity'>('problem');
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const visualFlowSteps = [
    {
      title: 'Step 1: Initial Array & Peak Detection',
      array: [1, 3, 5, 4, 2],
      highlightPivot: null,
      highlightSwap: null,
      highlightRange: null,
      description: 'Right-to-left scan shows [5, 4, 2] is a descending peak. Breakpoint pivot is at index 1 (val 3).',
      badge: 'Identify Peak',
    },
    {
      title: 'Step 2: Pivot (i=1, val=3) & Swapper (j=3, val=4) Found',
      array: [1, 3, 5, 4, 2],
      highlightPivot: 1,
      highlightSwap: 3,
      highlightRange: null,
      description: 'Pivot i=1 (val 3) needs to be replaced by the smallest element in suffix greater than 3, which is j=3 (val 4).',
      badge: 'Locate Swapper',
    },
    {
      title: 'Step 3: In-Place Swap (val 3 ↔ val 4)',
      array: [1, 4, 5, 3, 2],
      highlightPivot: 1,
      highlightSwap: 3,
      highlightRange: null,
      description: 'Swapping values at index 1 and 3 updates prefix from 13,xxx to 14,xxx! Array is now [1, 4, 5, 3, 2].',
      badge: 'Prefix Upgraded',
    },
    {
      title: 'Step 4: Reverse Descending Suffix [5, 3, 2] → [2, 3, 5]',
      array: [1, 4, 2, 3, 5],
      highlightPivot: null,
      highlightSwap: null,
      highlightRange: [2, 4],
      description: 'Reversing suffix [5, 3, 2] turns it into the smallest ascending order [2, 3, 5] in O(N) time!',
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
              LeetCode 31: Next Permutation — Master Visual DSA Guide
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                Visual Intuition & Graphs
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Interactive mountain peak graphs, 4-frame morphing flow, and mathematical reversal proof
            </p>
          </div>
        </div>

        {/* Expand / Collapse Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-all shadow-sm"
        >
          <span>{isOpen ? 'Collapse Guide' : 'Expand Full Guide'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Main Expandable Body */}
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
                <Lightbulb className="w-4 h-4" />
                <span>2. Peak & Mountain Graph</span>
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
                <span>3. Interactive Step-by-Step Flow</span>
              </button>

              <button
                onClick={() => setActiveTab('reverse_trick')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'reverse_trick'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>4. Reversal Trick (Why O(N))</span>
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

            {/* TAB 1: Problem Overview & Examples */}
            {activeTab === 'problem' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 text-sm text-slate-300 leading-relaxed"
              >
                <div className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col gap-2.5 shadow-inner">
                  <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    Problem Definition
                  </h3>
                  <p className="text-sm sm:text-base">
                    Given an array of integers <code className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">nums</code>, compute its <strong>Next Lexicographically Greater Permutation</strong> in-place with <strong>O(1) extra space</strong>.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-100 font-sans leading-relaxed mt-1">
                    💡 <strong>Lexicographical Order Meaning:</strong> Think of numbers in a dictionary! Array <code className="font-mono text-white">[1, 2, 3]</code> is like the number <code className="font-mono text-white">123</code>. The very next larger number using the exact same digits is <code className="font-mono text-white">132</code> (i.e. <code className="font-mono text-white">[1, 3, 2]</code>).
                  </div>
                </div>

                {/* Examples Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a14]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Input Array `nums`</th>
                        <th className="py-3 px-4">Next Permutation</th>
                        <th className="py-3 px-4 font-sans">Visual & Logical Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[1, 2, 3]</td>
                        <td className="py-3 px-4 text-sky-300 font-bold">[1, 3, 2]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">
                          123 → 132. Smallest possible increment by swapping last 2 digits.
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[3, 2, 1]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[1, 2, 3]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">
                          Peak descending sequence! No next greater exists, so it wraps back to the smallest ascending order.
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[1, 3, 5, 4, 2]</td>
                        <td className="py-3 px-4 text-purple-300 font-bold">[1, 4, 2, 3, 5]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">
                          13,542 → 14,235. Breakpoint at <code className="text-amber-300">val 3</code>, swapped with <code className="text-sky-300">val 4</code>, suffix <code className="text-purple-300">[5, 3, 2]</code> reversed to <code className="text-purple-300">[2, 3, 5]</code>.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Peak & Mountain Graph Visual Intuition */}
            {activeTab === 'intuition' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5 text-sm text-slate-300 leading-relaxed"
              >
                {/* 1. VISUAL MOUNTAIN PEAK DIAGRAM CARD */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        Visual Mountain Peak Graph Analysis: [1, 3, 5, 4, 2]
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      Right-to-Left Trend Curve
                    </span>
                  </div>

                  {/* SVG Trend Graph Canvas */}
                  <div className="w-full bg-[#050811] p-6 rounded-xl border border-slate-800/90 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-end justify-center gap-4 sm:gap-6 h-48 w-full max-w-lg px-4">
                      {/* Bar 0: Val 1 */}
                      <div className="flex flex-col items-center gap-2 group">
                        <span className="text-xs font-mono font-bold text-slate-400">i=0</span>
                        <div className="w-12 sm:w-14 bg-slate-800 border border-slate-700 rounded-t-xl h-16 flex items-center justify-center text-sm font-black font-mono text-slate-300 shadow-md">
                          1
                        </div>
                      </div>

                      {/* Bar 1: Val 3 (PIVOT BREAKPOINT) */}
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className="absolute -top-10 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-mono font-extrabold shadow-lg animate-bounce flex items-center gap-1">
                          <span>PIVOT (i=1)</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-400">i=1</span>
                        <div className="w-12 sm:w-14 bg-amber-500/25 border-2 border-amber-400 rounded-t-xl h-28 flex items-center justify-center text-base font-black font-mono text-amber-300 shadow-xl shadow-amber-500/20">
                          3
                        </div>
                      </div>

                      {/* Bar 2: Val 5 (MOUNTAIN PEAK) */}
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className="absolute -top-10 bg-rose-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shadow-lg">
                          ▲ PEAK
                        </div>
                        <span className="text-xs font-mono font-bold text-rose-400">i=2</span>
                        <div className="w-12 sm:w-14 bg-rose-500/25 border-2 border-rose-400 rounded-t-xl h-44 flex items-center justify-center text-lg font-black font-mono text-rose-300 shadow-xl shadow-rose-500/20">
                          5
                        </div>
                      </div>

                      {/* Bar 3: Val 4 (SWAPPER J) */}
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className="absolute -top-10 bg-sky-500 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shadow-lg">
                          SWAPPER (j=3)
                        </div>
                        <span className="text-xs font-mono font-bold text-sky-400">i=3</span>
                        <div className="w-12 sm:w-14 bg-sky-500/25 border-2 border-sky-400 rounded-t-xl h-36 flex items-center justify-center text-base font-black font-mono text-sky-300 shadow-xl shadow-sky-500/20">
                          4
                        </div>
                      </div>

                      {/* Bar 4: Val 2 (Valley) */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">i=4</span>
                        <div className="w-12 sm:w-14 bg-slate-800 border border-slate-700 rounded-t-xl h-20 flex items-center justify-center text-sm font-black font-mono text-slate-300 shadow-md">
                          2
                        </div>
                      </div>
                    </div>

                    {/* Mountain Graph Annotation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-xs font-mono pt-2 border-t border-slate-800">
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200">
                        ⛰️ <strong>Descending Peak [5, 4, 2]:</strong> Right side se digits climbing kar rahi hain. <code className="text-white">5-4-2</code> already maximum peak structure hai.
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
                        🎯 <strong>Breakpoint Pivot (val 3):</strong> Index 1 par climb stop hua (<code className="text-white">3 &lt; 5</code>). Yeh point change karke hi bigger number banega!
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. NUMBER ANALOGY CARD */}
                <div className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Sparkles className="w-4.5 h-4.5 text-sky-400" />
                    Intuition: Number Place Value Analogy (13,542 → 14,235)
                  </h3>
                  <p className="text-slate-200 text-xs sm:text-sm">
                    Imagine array <code className="font-mono text-amber-300">[1, 3, 5, 4, 2]</code> as number <strong>13,542</strong>.
                    Humein same digits se **just next larger number** banana hai.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200">
                      ❌ <strong>Wrong Approach:</strong> Leftmost digit <code className="text-white">1</code> ko change karke <code className="text-white">2</code> banana → <strong>21,345</strong> (Too big jump!).
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                      ✅ <strong>Correct Approach:</strong> Left digits ko utna same rakho jitna ho sake, aur Rightmost digits par minimal change karo → <strong>14,235</strong>!
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive 4-Frame State Morphing Flow */}
            {activeTab === 'algorithm' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5 text-sm text-slate-300"
              >
                {/* Frame Selector Buttons */}
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 px-2">
                    Interactive Visual Flow:
                  </span>
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

                {/* Active Frame State Display */}
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
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          Stage {interactiveStep + 1} / 4
                        </span>
                      </div>

                      {/* Interactive Array Block Canvas */}
                      <div className="flex items-center justify-center gap-3 sm:gap-4 py-6 bg-[#050811] rounded-xl border border-slate-800">
                        {step.array.map((val, idx) => {
                          const isPivot = step.highlightPivot === idx;
                          const isSwap = step.highlightSwap === idx;
                          const isReversedRange =
                            step.highlightRange &&
                            idx >= step.highlightRange[0] &&
                            idx <= step.highlightRange[1];

                          return (
                            <motion.div
                              key={idx}
                              layout
                              className={`relative w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl ${
                                isPivot
                                  ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-4 ring-amber-500/30'
                                  : isSwap
                                  ? 'bg-sky-500/30 border-sky-400 text-sky-200 ring-4 ring-sky-500/30'
                                  : isReversedRange
                                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                  : 'bg-slate-900 border-slate-700 text-slate-200'
                              }`}
                            >
                              <span className="text-xs font-mono text-slate-400 absolute top-1">
                                [{idx}]
                              </span>
                              <span className="text-2xl sm:text-3xl font-black font-mono mt-2">
                                {val}
                              </span>

                              {/* Pointer Badges */}
                              {isPivot && (
                                <span className="absolute -bottom-7 bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded shadow">
                                  PIVOT
                                </span>
                              )}
                              {isSwap && (
                                <span className="absolute -bottom-7 bg-sky-500 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded shadow">
                                  SWAPPER
                                </span>
                              )}
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

                {/* Complete Written Stage-by-Stage Breakdown List */}
                <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Full Stage-by-Stage Text Breakdown & WHY Logic:
                  </h4>

                  {/* Stage 1 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 1: Find Pivot Breakpoint Index `i`
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                          Right-to-Left Sweep
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Right side se left sweep karo (`n-2` down to `0`) aur sabse pehla index <code className="font-mono text-amber-300">i</code> dhoondo jahan <code className="font-mono text-amber-300">nums[i] &lt; nums[i + 1]</code>.
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        💡 <strong>WHY?</strong> Index <code className="text-amber-300">i</code> par ascending break hota hai. Iska matlab index <code className="text-amber-300">i</code> ke right side ke saare elements descending peak par hain.
                      </div>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 2: Find Smallest Greater Swapper Index `j`
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                          Just Greater Element
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Right suffix me dubara right-to-left scan karo (`n-1` down to `i+1`) aur sabse pehla element <code className="font-mono text-sky-300">j</code> dhoondo jo <code className="font-mono text-amber-300">nums[i]</code> se STRICTLY BADA ho (<code className="font-mono text-sky-300">nums[j] &gt; nums[i]</code>).
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        💡 <strong>WHY?</strong> Lexicographical jump minimal rakhne ke liye hum pivot element ko suffix ke sabse chhote greater element se replace karte hain.
                      </div>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 3: Swap Pivot `nums[i]` and Swapper `nums[j]`
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                          In-Place Swap
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        <code className="font-mono text-amber-300">nums[i]</code> aur <code className="font-mono text-sky-300">nums[j]</code> ke values ko swap kar do.
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        Example: <code className="text-slate-200">[1, 3, 5, 4, 2]</code> → Swap 3 & 4 → <code className="text-purple-300">[1, 4, 5, 3, 2]</code>. Now prefix is updated to 14!
                      </div>
                    </div>
                  </div>

                  {/* Stage 4 */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 4: Reverse Right Suffix `[i + 1 ... n - 1]`
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                          Flipping Peak to Smallest Sequence
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Index <code className="font-mono text-emerald-300">i + 1</code> se leke <code className="font-mono text-emerald-300">n - 1</code> tak ke subarray ko **reverse** kar do.
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        Example: Suffix <code className="text-slate-300">[5, 3, 2]</code> reverse hokar <code className="text-emerald-300">[2, 3, 5]</code> ban gaya. Final array: <code className="text-emerald-300 font-bold">[1, 4, 2, 3, 5]</code>!
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: The Reversal Trick (Why O(N) Reversal Works) */}
            {activeTab === 'reverse_trick' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col gap-4 text-sm text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="text-base font-extrabold text-white font-mono">
                    Why does Reversing the Suffix give the Smallest Sequence in O(N)?
                  </h3>
                </div>

                <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    Sawaal yeh hai: <strong>Swap karne ke baad right suffix ko sort kyun nahi karte? Reversal hi kyun karte hain?</strong>
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-emerald-300 font-bold">Mathematical Fact:</div>
                    <p className="text-slate-300">
                      1. Step 1 ke mutabiq, original suffix strictly <strong>descending order</strong> (like <code className="text-amber-300">[5, 4, 2]</code>) me tha.
                    </p>
                    <p className="text-slate-300">
                      2. Step 3 me humne pivot <code className="text-amber-300">3</code> ko just-greater element <code className="text-sky-300">4</code> se swap kiya.
                    </p>
                    <p className="text-slate-300">
                      3. Swap karne ke BAAD bhi remaining suffix <code className="text-purple-300">[5, 3, 2]</code> strictly <strong>descending order</strong> me hi rehta hai!
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 font-mono text-xs text-emerald-100">
                    🔥 <strong>The Magic Property:</strong> Any descending array ko agar aap reverse kar dete ho, toh woh automatically <strong>smallest ascending array</strong> ban jata hai!
                    <br />
                    Iske liye <code className="text-white">O(N log N)</code> sorting algorithm run karne ki koi zaroorat nahi hai. Pure reversal single pass me <code className="text-white">O(N) time</code> aur <code className="text-white">O(1) memory</code> me kaam kar deta hai!
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: Complexity & Edge Cases */}
            {activeTab === 'complexity' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Complexity Benchmarks
                  </h4>
                  <div className="flex flex-col gap-2.5 text-xs font-mono text-slate-300">
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span>Time Complexity:</span>
                      <strong className="text-emerald-400 font-extrabold text-sm">O(N)</strong>
                    </div>
                    <p className="text-slate-400 font-sans text-xs leading-relaxed">
                      At most 3 linear passes: Pass 1 for Pivot <code className="text-slate-200">i</code>, Pass 2 for Swapper <code className="text-slate-200">j</code>, Pass 3 for Suffix Reversal.
                    </p>

                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2">
                      <span>Space Complexity:</span>
                      <strong className="text-emerald-400 font-extrabold text-sm">O(1)</strong>
                    </div>
                    <p className="text-slate-400 font-sans text-xs leading-relaxed">
                      Purely in-place array mutation using two-pointer swaps without allocating extra array data structures.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Edge Cases Handling
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-4 font-sans leading-relaxed">
                    <li>
                      <strong>Entirely Descending Array (`[3, 2, 1]`)</strong>:
                      Breakpoint index <code className="font-mono text-rose-300">i &lt; 0</code> hota hai. Algorithm Stage 2 & 3 skip karke direct pure array ko reverse kar deta hai → <code className="font-mono text-emerald-300">[1, 2, 3]</code>.
                    </li>
                    <li>
                      <strong>Duplicates in Array (`[1, 1, 5]`)</strong>:
                      Condition <code className="font-mono text-amber-300">nums[i] &gt;= nums[i+1]</code> non-strict duplicates ko correctly skip kar deti hai → <code className="font-mono text-emerald-300">[1, 5, 1]</code>.
                    </li>
                    <li>
                      <strong>Single Element Array (`[1]`)</strong>:
                      Size check <code className="font-mono text-slate-200">n &lt;= 1</code> instantly return kar deta hai without any operations.
                    </li>
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
